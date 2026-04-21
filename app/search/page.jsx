'use client';

import React from 'react';
import SearchResults from '../../src/site-pages/SearchResults.jsx';

export default function SearchRoute({ searchParams }) {
  return <SearchResults query={searchParams?.query || ''} />;
}

