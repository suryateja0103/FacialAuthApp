'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {
  useEffect(() => {
    // You can add analytics tracking here if needed
    console.log('Not found page visited');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <div className="text-7xl mb-8">🔍</div>
        <p className="text-lg mb-6">
          We couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.
        </p>
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}