import React, { useMemo, useState } from 'react';
import Button from '../ui/Button.jsx';
import InputField from './InputField.jsx';
import TextareaField from './TextareaField.jsx';

export default function ContactForm() {
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | success

  const validate = useMemo(() => {
    const next = {};
    if (!values.fullName.trim()) next.fullName = 'Full name is required.';
    if (!values.email.trim()) next.email = 'Email is required.';
    if (!values.message.trim()) next.message = 'Message is required.';
    return next;
  }, [values]);

  function update(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (Object.keys(validate).length) {
      setErrors(validate);
      return;
    }
    setErrors({});
    setStatus('success');
    window.setTimeout(() => setStatus('idle'), 4500);
  }

  if (status === 'success') {
    return (
      <div className="rounded-[var(--radius-md)] border border-[rgba(0,168,107,0.25)] bg-[rgba(0,168,107,0.08)] p-7">
        <div className="flex items-center gap-3">
          <div className="w-[44px] h-[44px] rounded-full bg-[rgba(0,168,107,0.12)] border border-[rgba(0,168,107,0.22)] flex items-center justify-center text-[var(--alert-green)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="font-heading text-[14px] tracking-[0.08em] uppercase text-[var(--alert-green)] font-[700]">
              Message Sent
            </div>
            <div className="mt-1 font-body text-[15px] text-[var(--text-secondary)]">Thank you. The representation team will reach out shortly.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <InputField
        label="Full Name"
        name="fullName"
        required
        value={values.fullName}
        onChange={update('fullName')}
        error={errors.fullName}
        placeholder="Your full name"
      />

      <InputField
        label="Email"
        name="email"
        required
        value={values.email}
        onChange={update('email')}
        error={errors.email}
        placeholder="name@company.com"
        type="email"
      />

      <InputField
        label="Phone"
        name="phone"
        value={values.phone}
        onChange={update('phone')}
        placeholder="Optional"
        type="tel"
      />

      <InputField
        label="Company Name"
        name="companyName"
        value={values.companyName}
        onChange={update('companyName')}
        placeholder="Optional"
      />

      <TextareaField
        label="Message"
        name="message"
        required
        value={values.message}
        onChange={update('message')}
        error={errors.message}
        placeholder="Tell us what you need..."
      />

      <div>
        <Button variant="primary" ariaLabel="Send message">
          Send Message
        </Button>
      </div>
    </form>
  );
}

