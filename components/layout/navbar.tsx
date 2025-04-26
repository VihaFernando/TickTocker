"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { signOut } from "@/utils/auth"
import { Button } from "@/components/ui/button"
import { Clock, Home, User, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  username?: string
}

export function Navbar({ username }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Clock className="h-6 w-6 text-indigo-600" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            TikTocker
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="/" isActive={isActive("/")}>
            <Home className="h-4 w-4" />
            <span>Home</span>
          </NavLink>

          {username ? (
            <>
              <NavLink href="/dashboard" isActive={isActive("/dashboard")}>
                <Clock className="h-4 w-4" />
                <span>My Timers</span>
              </NavLink>

              <div className="flex items-center space-x-1 text-gray-600">
                <User className="h-4 w-4" />
                <span>{username}</span>
              </div>

              <form action={signOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <NavLink href="/login" isActive={isActive("/login")}>
                <User className="h-4 w-4" />
                <span>Login</span>
              </NavLink>

              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>

        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
            <span className="sr-only">Open menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link
              href="/"
              className={`flex items-center space-x-2 p-2 rounded-md ${
                isActive("/") ? "bg-indigo-50 text-indigo-600" : "text-gray-600"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            {username ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center space-x-2 p-2 rounded-md ${
                    isActive("/dashboard") ? "bg-indigo-50 text-indigo-600" : "text-gray-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Clock className="h-5 w-5" />
                  <span>My Timers</span>
                </Link>

                <div className="flex items-center space-x-2 p-2 text-gray-600">
                  <User className="h-5 w-5" />
                  <span>{username}</span>
                </div>

                <form action={signOut}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="flex items-center space-x-2 w-full justify-start p-2 text-gray-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`flex items-center space-x-2 p-2 rounded-md ${
                    isActive("/login") ? "bg-indigo-50 text-indigo-600" : "text-gray-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/signup"
                  className="flex items-center space-x-2 p-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

interface NavLinkProps {
  href: string
  isActive: boolean
  children: React.ReactNode
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-1 relative ${
        isActive ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute -bottom-3 left-0 right-0 h-0.5 bg-indigo-600"
          layoutId="navbar-indicator"
          transition={{ type: "spring", duration: 0.3 }}
        />
      )}
    </Link>
  )
}
