"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ProtectedRoute from "@/components/protected-route"
import TokenHandler from "@/components/token-handler"
import { Suspense } from "react"
import { COGNITO_UPLOAD_URL } from "@/lib/auth"

// Ensure this forces dynamic rendering (avoids static optimization issues)
export const dynamic = "force-dynamic"

export default function Home() {
  const router = useRouter()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent router={router} />
    </Suspense>
  )
}

function PageContent({ router }: { router: ReturnType<typeof useRouter> }) {
  const handleUploadRedirect = () => {
    window.location.href = COGNITO_UPLOAD_URL
  }

  return (
    <>
      {/* These must be Client Components and should not cause static rendering issues */}
      <TokenHandler />
      <ProtectedRoute>
        <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100 p-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">Welcome to Facial Recognition</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105 w-full"
              onClick={handleUploadRedirect}
            >
              Upload Image
            </Button>
            <Button
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105 w-full"
              onClick={() => router.push("/facial-auth")}
            >
              Authenticate Image
            </Button>
          </div>
        </main>
      </ProtectedRoute>
    </>
  )
}
