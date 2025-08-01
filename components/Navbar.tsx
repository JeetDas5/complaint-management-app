"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Menu, X, User, Settings } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  userRole?: 'admin' | 'user'
  userName?: string
}

const Navbar = ({ userRole, userName }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = () => {
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })
    
    toast.success('Signed out successfully')
    router.push('/login')
  }

  if (!mounted) {
    return (
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CMS
                </h1>
              </div>
            </div>
            <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Complaint Management System
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {userRole === 'admin' ? (
                <Button
                  variant="ghost"
                  onClick={() => router.push('/admin')}
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => router.push('/submit')}
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Submit Complaint
                </Button>
              )}
            </div>
          </div>

          {/* User Info & Sign Out */}
          <div className="hidden md:flex items-center space-x-4">
            {userName && (
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <User className="w-4 h-4" />
                <span>{userName}</span>
                {userRole && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    {userRole}
                  </span>
                )}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-200 dark:border-slate-700">
              {userRole === 'admin' ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push('/admin')
                    setIsMenuOpen(false)
                  }}
                  className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push('/submit')
                    setIsMenuOpen(false)
                  }}
                  className="w-full justify-start text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Submit Complaint
                </Button>
              )}
              
              {userName && (
                <div className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
                  <User className="w-4 h-4" />
                  <span>{userName}</span>
                  {userRole && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                      {userRole}
                    </span>
                  )}
                </div>
              )}
              
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar