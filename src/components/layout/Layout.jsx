import React from 'react';
import Footer from './Footer.jsx';
import Header from './Header.jsx';

export default function Layout({ children, categories }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--off-white)]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
    </div>
  );
}

