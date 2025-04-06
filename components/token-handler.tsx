"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { setAuthCookie } from "@/lib/auth"

export default function TokenHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const code = searchParams.get("code")

    if (code) {
      // Store the token in a cookie
      setAuthCookie(code)

      // Clean the URL by removing the code parameter
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, document.title, cleanUrl)

      // Force a refresh to update auth state
      window.location.reload()
    }
  }, [searchParams, router])

  return null
}

