"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    // Close mobile menu when navigating
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <nav className="bg-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold flex items-center">🏢 Worksite Auth</h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/facial-upload" className="hover:underline">
                  Upload Photo
                </Link>
                <Link href="/facial-auth" className="hover:underline">
                  Authenticate
                </Link>
                <Button variant="outline" className="text-white bg-red-800 border-white" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-800 py-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/facial-upload"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
                >
                  Upload Photo
                </Link>
                <Link
                  href="/facial-auth"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
                >
                  Authenticate
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-red-800 hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
