import { createClient } from '@/lib/supabase/server'
import MapClient from './MapClient'

export const dynamic = 'force-dynamic'

export default async function MapPage() {
  const supabase = await createClient()

  const { data: issues } = await supabase
    .from('issues')
    .select(`
      id, issue_number, title, status, severity, escalation, upvote_count,
      address, reported_at,
      category:issue_categories(name, slug, icon),
      ward:wards(ward_number, name),
      media:issue_media(public_url, media_context)
    `)
    .not('status', 'in', '(closed,auto_closed,verified)')
    .order('reported_at', { ascending: false })
    .limit(200)

  // PostGIS returns location as GeoJSON — we'll parse lat/lng from address for now
  // In production: SELECT ST_X(location) as lng, ST_Y(location) as lat
  const issuePoints = (issues ?? []).map((issue: any) => ({
    ...issue,
    lat: 16.8302 + (Math.random() - 0.5) * 0.04, // Placeholder: distribute around Vijayapura
    lng: 75.7100 + (Math.random() - 0.5) * 0.04,
  }))

  return (
    <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>
      <MapClient issues={issuePoints} />
    </div>
  )
}
