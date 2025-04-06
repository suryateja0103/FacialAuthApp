"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { clearAuthCookie, getTokenFromUrl, isAuthenticated, setAuthCookie } from "@/lib/auth"

interface AuthContextType {
  isAuthenticated: boolean
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  logout: () => {},
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if token exists in URL (after Cognito redirect)
    const token = getTokenFromUrl()

    if (token) {
      // Store token in cookie
      setAuthCookie(token)
      setIsAuth(true)

      // Remove token from URL to prevent leaking in browser history
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)

      // Redirect to home page if on login page
      if (pathname === "/login") {
        router.push("/")
      }
    } else {
      // Check if already authenticated via cookie
      setIsAuth(isAuthenticated())
    }

    setLoading(false)
  }, [pathname, router])

  const logout = () => {
    clearAuthCookie()
    setIsAuth(false)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: isAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
