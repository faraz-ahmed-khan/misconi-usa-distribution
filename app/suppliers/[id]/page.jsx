'use client';

import React from 'react';
import SupplierDetail from '../../../src/site-pages/SupplierDetail.jsx';

export default function SupplierDetailRoute({ params }) {
  return <SupplierDetail id={params.id} />;
}

