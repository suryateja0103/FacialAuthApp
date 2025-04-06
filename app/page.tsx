'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import ProtectedRoute from '@/components/protected-route'
import TokenHandler from '@/components/token-handler'
import { Suspense } from 'react'

// Ensure this forces dynamic rendering (avoids static optimization issues)
export const dynamic = 'force-dynamic'

export default function Home() {
  const router = useRouter()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent router={router} />
    </Suspense>
  )
}

function PageContent({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <>
      {/* These must be Client Components and should not cause static rendering issues */}
      <TokenHandler />
      <ProtectedRoute>
        <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
          <h1 className="text-3xl font-bold">Welcome to Facial Recognition</h1>
          <div className="flex gap-4">
            <Button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
              onClick={() => router.push('/facial-upload')}
            >
              Upload Image
            </Button>
            <Button
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
              onClick={() => router.push('/facial-auth')}
            >
              Authenticate Image
            </Button>
          </div>
        </main>
      </ProtectedRoute>
    </>
  )
}
