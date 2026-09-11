import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp, clearRateLimit, sanitizeInput } from '@/lib/security'

// Rate Limits:
// Max 5 attempts per 15 minutes (900,000 ms) for login / OTP verification
const AUTH_RATE_LIMIT = 5
const AUTH_WINDOW_MS = 15 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const body = await request.json()
    const action = sanitizeInput(body.action) || 'login'
    const identifier = sanitizeInput(body.identifier) // e.g. phone number or account
    const isSuccess = Boolean(body.isSuccess)

    const rateKey = `auth:${action}:${ip}:${identifier || 'general'}`

    // If client is reporting a successful login, clear the rate limit counter
    if (isSuccess) {
      clearRateLimit(rateKey)
      return NextResponse.json({
        success: true,
        message: 'Security verified. Rate limit cleared.',
      })
    }

    // Check rate limit for this IP and identifier
    const rateResult = checkRateLimit(rateKey, AUTH_RATE_LIMIT, AUTH_WINDOW_MS)

    if (!rateResult.allowed) {
      const minutesRemaining = Math.ceil(rateResult.resetSeconds / 60)
      return NextResponse.json(
        {
          error: `Too many login attempts. For security reasons against bot brute-force attacks, this action is locked. Please try again in ${minutesRemaining} minutes.`,
          resetSeconds: rateResult.resetSeconds,
          locked: true,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateResult.resetSeconds),
            'X-RateLimit-Limit': String(rateResult.totalLimit),
            'X-RateLimit-Remaining': '0',
          },
        }
      )
    }

    return NextResponse.json({
      allowed: true,
      remainingAttempts: rateResult.remaining,
      totalLimit: rateResult.totalLimit,
      resetSeconds: rateResult.resetSeconds,
    })
  } catch {
    return NextResponse.json(
      { error: 'Security evaluation failed' },
      { status: 400 }
    )
  }
}
