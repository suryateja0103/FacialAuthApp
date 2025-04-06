import FacialAuthApp from "@/components/facial-auth-app"
import ProtectedRoute from "@/components/protected-route"
import { Suspense } from "react"
export default function FacialAuthPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <FacialAuthApp />
        </Suspense>
      </main>
    </ProtectedRoute>
  )
}

