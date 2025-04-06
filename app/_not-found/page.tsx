'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Custom404() {
  useEffect(() => {
    console.log('404 page visited');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <div className="text-7xl mb-8">🚫</div>
        <p className="text-lg mb-6">
          Looks like this page doesn’t exist. Let’s get you back home.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
