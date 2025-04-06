"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "./ui/button"

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <nav className="bg-green-700 text-white px-4 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">🏢 Worksite Auth</h1>
      <div className="space-x-4">
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
    </nav>
  )
}

