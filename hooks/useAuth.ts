"use client"

import { useState, useEffect } from 'react'

interface UserInfo {
    userId: string
    role: 'admin' | 'user'
    name?: string
    email?: string
}

export const useAuth = () => {
    const [user, setUser] = useState<UserInfo | null>(null)
    const [loading, setLoading] = useState(true)

    const getTokenFromCookie = () => {
        if (typeof document === 'undefined') return null
        const cookies = document.cookie.split(';')
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
        return tokenCookie ? tokenCookie.split('=')[1] : null
    }

    const decodeToken = (token: string) => {
        try {
            const base64Url = token.split('.')[1]
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            )
            return JSON.parse(jsonPayload)
        } catch (error) {
            console.error('Error decoding token:', error)
            return null
        }
    }

    useEffect(() => {
        const token = getTokenFromCookie()
        if (token) {
            const decoded = decodeToken(token)
            if (decoded) {
                setUser({
                    userId: decoded.userId,
                    role: decoded.role || 'user',
                    name: decoded.name,
                    email: decoded.email
                })
            }
        }
        setLoading(false)
    }, [])

    return { user, loading }
}