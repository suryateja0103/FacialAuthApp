import FacialAuthApp from "@/components/facial-auth-app"
import ProtectedRoute from "@/components/protected-route"
import { Suspense } from "react"
export const dynamic = "force-dynamic";
export default function FacialAuthPage() {
  return (
    
      <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <FacialAuthApp />
        </Suspense>
      </main>
    
  )
}

