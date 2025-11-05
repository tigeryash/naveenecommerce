import { auth } from '@/lib/auth/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Sign out from Better Auth
    await auth.api.signOut({
      headers: request.headers,
    })

    // Create response
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })

    // Clear all authentication cookies
    const cookiesToClear = [
      'payload-token',
      'better-auth.session_token',
      'session-token',
      'auth-token',
      // Add any other cookies your setup might use
    ]

    cookiesToClear.forEach((cookieName) => {
      response.cookies.set({
        name: cookieName,
        value: '',
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
