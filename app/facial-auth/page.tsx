import FacialAuthApp from "@/components/facial-auth-app"
import ProtectedRoute from "@/components/protected-route"

export default function FacialAuthPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <FacialAuthApp />
      </main>
    </ProtectedRoute>
  )
}

