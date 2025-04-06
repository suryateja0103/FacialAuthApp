"use client"

export const dynamic = "force-dynamic"; // 👈 Add this to prevent prerendering

import { useSearchParams } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"

export default function WelcomePage() {
  const searchParams = useSearchParams()
  const firstName = searchParams.get("firstName")
  const lastName = searchParams.get("lastName")

  return (
    <ProtectedRoute>
      <main className="flex items-center justify-center h-[calc(100vh-64px)]">
        <h2 className="text-4xl font-bold text-black-700">
          Welcome {firstName} {lastName} 🎉
        </h2>
      </main>
    </ProtectedRoute>
  )
}
