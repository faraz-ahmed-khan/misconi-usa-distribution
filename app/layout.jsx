'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import SiteLayout from '../src/components/layout/Layout.jsx';
import '../src/styles/globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {isAdmin ? children : <SiteLayout>{children}</SiteLayout>}
      </body>
    </html>
  );
}
