import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const start = Date.now()
    const { count, error } = await supabase
      .from('wards')
      .select('*', { count: 'exact', head: true })

    const latencyMs = Date.now() - start

    if (error) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          database: 'error',
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        status: 'healthy',
        database: 'connected',
        wardCount: count,
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (err: any) {
    return NextResponse.json(
      {
        status: 'error',
        error: err?.message || 'Unknown health check error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
