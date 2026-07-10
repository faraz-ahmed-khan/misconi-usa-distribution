'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function VaultAdminPage() {
  const [token, setToken] = useState('');
  const [tokenVerified, setTokenVerified] = useState(false);
  const [status, setStatus] = useState(null);
  const [pending, setPending] = useState([]);
  const [message, setMessage] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useSeed, setUseSeed] = useState(false);
  const debounceRef = useRef(null);

  const authHeaders = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setTokenError('');
    setTokenVerified(false);

    try {
      const statusRes = await fetch('/api/vault/status');
      const statusJson = await statusRes.json();
      setStatus(statusJson);

      if (token) {
        const approvalsRes = await fetch('/api/vault/approvals?history=true', {
          headers: authHeaders(),
        });
        if (approvalsRes.ok) {
          const approvalsJson = await approvalsRes.json();
          setPending(approvalsJson.pending || []);
          setTokenVerified(true);
        } else {
          const err = await approvalsRes.json();
          setPending([]);
          setTokenError(err.error || 'Invalid admin token');
        }
      } else {
        setPending([]);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }, [authHeaders, token]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/vault/status')
      .then((res) => res.json())
      .then((statusJson) => {
        if (!cancelled) setStatus(statusJson);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!token) {
      setTokenVerified(false);
      setPending([]);
      setTokenError('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      refresh();
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [token, refresh]);

  async function submitForApproval() {
    setLoading(true);
    setMessage('');
    try {
      const url = useSeed ? '/api/vault/submit?seed=true' : '/api/vault/submit';
      const res = await fetch(url, { method: 'POST', headers: authHeaders() });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || 'Submit failed');
      } else {
        setMessage(`Submitted ${json.approval.id} (${json.approval.productCount} products)`);
        await refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Submit failed');
    } finally {
      setLoading(false);
    }
  }

  async function approve(id) {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/vault/approvals/${id}/approve`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedBy: 'vault-admin-ui' }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || 'Approve failed');
      } else {
        setMessage(`Promoted vault v${json.manifest.vaultVersion} (${json.productCount} products)`);
        await refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Approve failed');
    } finally {
      setLoading(false);
    }
  }

  async function reject(id) {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/vault/approvals/${id}/reject`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectedBy: 'vault-admin-ui', reason: 'Rejected in admin UI' }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || 'Reject failed');
      } else {
        setMessage(`Rejected ${id}`);
        await refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Reject failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h2 className="font-display text-3xl font-semibold text-white">MPI Vault — Staging Admin</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
        Manual approval gate before data enters the MPI Vault. Distribution reads from the vault API
        only — never raw Excel.
      </p>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
        <label className="block text-sm font-medium text-slate-200">
          Admin token
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          placeholder="Paste your staging admin token"
        />
        <button
          type="button"
          onClick={refresh}
          disabled={loading || !token}
          className="mt-4 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? 'Verifying…' : 'Refresh status'}
        </button>
        {token && tokenVerified && !loading && (
          <p className="mt-2 text-xs text-emerald-400">Token verified — actions enabled.</p>
        )}
        {token && !tokenVerified && !loading && tokenError && (
          <p className="mt-2 text-xs text-red-400">{tokenError}</p>
        )}
      </div>

      {status && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat label="Vault ready" value={status.vaultReady ? 'Yes' : 'No'} highlight={status.vaultReady} />
          <Stat label="Products" value={status.manifest?.productCount ?? 0} />
          <Stat label="Pending approvals" value={status.pendingApprovals ?? 0} alert={status.pendingApprovals > 0} />
        </div>
      )}

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
        <h3 className="font-display text-xl font-semibold text-white">Submit intake for approval</h3>
        <p className="mt-2 text-sm text-slate-400">
          Runs MSI/MPI validation first. If it passes, the snapshot is queued for your review.
        </p>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={useSeed}
            onChange={(e) => setUseSeed(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-emerald-600"
          />
          Use Regalia seed dataset (--seed) instead of Excel handoff
        </label>
        <button
          type="button"
          onClick={submitForApproval}
          disabled={loading || !tokenVerified}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Run validation &amp; queue approval
        </button>
        {!token && (
          <p className="mt-2 text-xs text-amber-400">Enter your admin token above to enable submit.</p>
        )}
        {token && !tokenVerified && !loading && (
          <p className="mt-2 text-xs text-amber-400">Waiting for token verification…</p>
        )}
        {token && loading && (
          <p className="mt-2 text-xs text-slate-400">Verifying token…</p>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
        <h3 className="font-display text-xl font-semibold text-white">Pending approvals</h3>
        {!token && (
          <p className="mt-2 text-sm text-slate-400">Enter admin token to load and manage approvals.</p>
        )}
        {token && !tokenVerified && !loading && (
          <p className="mt-2 text-sm text-slate-400">Verify token to load pending approvals.</p>
        )}
        {tokenVerified && pending.length === 0 && (
          <p className="mt-4 text-sm text-slate-400">No pending approvals.</p>
        )}
        {pending.length > 0 && (
          <ul className="mt-4 space-y-4">
            {pending.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-medium text-emerald-300">{item.id}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.source}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.supplierCount} suppliers · {item.productCount} products
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => approve(item.id)}
                      disabled={loading || !tokenVerified}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      Approve &amp; promote
                    </button>
                    <button
                      type="button"
                      onClick={() => reject(item.id)}
                      disabled={loading || !tokenVerified}
                      className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {message && (
        <p className="mt-6 rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-slate-100">
          {message}
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, highlight, alert }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p
        className={`mt-1 font-sans text-2xl font-bold tabular-nums ${
          highlight ? 'text-emerald-400' : alert ? 'text-amber-400' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
