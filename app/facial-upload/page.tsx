import FacialAuthApp from "@/components/FacialUpload"
import ProtectedRoute from "@/components/protected-route"
import { Suspense } from "react"


export default function FacialUploadPage() {
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



