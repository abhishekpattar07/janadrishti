import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/security'

// Next.js 16: renamed from "middleware" export to "proxy"
export async function proxy(request: NextRequest) {
  const ip = getClientIp(request)
  const pathname = request.nextUrl.pathname

  // Rate limit public API requests (Max 120 per minute per IP to block scraper bots and DDoS)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/rate-limit')) {
    const apiRate = checkRateLimit(`global_api:${ip}`, 120, 60000)
    if (!apiRate.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. API rate limit exceeded to prevent bot abuse.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(apiRate.resetSeconds),
            'X-RateLimit-Limit': '120',
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }
  }

  const response = await updateSession(request)

  // Inject High-Grade Security HTTP Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(self), geolocation=(self), microphone=()')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

