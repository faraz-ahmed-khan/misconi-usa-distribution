'use client';

import React from 'react';
import CategoryDetail from '../../../src/site-pages/CategoryDetail.jsx';

export default function CategoryDetailRoute({ params }) {
  return <CategoryDetail id={params.id} />;
}

