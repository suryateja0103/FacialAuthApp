'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

// Prevents this page from being statically generated
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function NotFound() {
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log('404 page visited with query:', searchParams?.toString());
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <div className="text-7xl mb-8">🔍</div>
        <p className="text-lg mb-6">
          We couldn't find the page you're looking for. It might have been moved or never existed.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
