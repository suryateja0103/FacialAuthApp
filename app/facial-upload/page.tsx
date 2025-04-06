import FacialAuthApp from "@/components/FacialUpload"
import ProtectedRoute from "@/components/protected-route"

export default function FacialUploadPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <FacialAuthApp />
      </main>
    </ProtectedRoute>
  )
}

