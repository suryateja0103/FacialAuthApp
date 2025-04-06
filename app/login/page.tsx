"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { COGNITO_LOGIN_URL } from "@/lib/auth"
import { useAuth } from "@/components/auth-provider"
import { Suspense } from "react"
export const dynamic = "force-dynamic"; // 👈 Add this!

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, loading, router])

  const handleLogin = () => {
    window.location.href = COGNITO_LOGIN_URL
  }

  if (loading) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
      </Suspense>
    )
  }

  return (
       <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Worksite Authentication</CardTitle>
          <CardDescription className="text-center">Login to access the facial authentication system</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button onClick={handleLogin} className="w-full max-w-xs bg-green-700 hover:bg-green-800">
            Login with AWS Cognito
          </Button>
        </CardContent>
      </Card>
    </div>
    </Suspense>
  )
}
