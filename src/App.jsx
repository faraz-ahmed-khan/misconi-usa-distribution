import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Suppliers from './pages/Suppliers.jsx';
import SupplierDetail from './pages/SupplierDetail.jsx';
import Categories from './pages/Categories.jsx';
import CategoryDetail from './pages/CategoryDetail.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import Representation from './pages/Representation.jsx';
import Readiness from './pages/Readiness.jsx';
import SearchResults from './pages/SearchResults.jsx';

function PageShell({ title, subtitle }) {
  return (
    <div className="bg-[var(--compliance-blue-xdark)] text-white">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12 py-20">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-heading">
          Misconi USA Distribution
        </div>
        <h1
          className="mt-4 text-[40px] leading-[1.05] tracking-[-0.02em] font-semibold font-display"
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-[720px] text-white/70 text-[18px] leading-[1.7]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Layout categories={[]}>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/suppliers/:id" element={<SupplierDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryDetail />} />
        <Route path="/representation" element={<Representation />} />
        <Route path="/readiness" element={<Readiness />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

