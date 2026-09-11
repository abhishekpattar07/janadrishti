import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { locale } = await request.json()
  const valid = ['en', 'kn', 'hi']
  if (!valid.includes(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }
  const response = NextResponse.json({ locale })
  response.cookies.set('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return response
}
