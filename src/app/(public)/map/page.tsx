import { createClient } from '@/lib/supabase/server'
import MapClient from './MapClient'

export const dynamic = 'force-dynamic'

const VIJAYAPURA_HOTSPOTS = [
  {
    id: 'sample-2',
    issue_number: 139,
    title: 'Deep Pothole on Gandhi Chowk Main Road',
    status: 'in_progress',
    severity: 'high',
    escalation: 'none',
    upvote_count: 58,
    address: 'Gandhi Chowk Main Circle, Ward 11, Vijayapura',
    reported_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    category: { name: 'Pothole / Bad Road', slug: 'pothole', icon: 'construction' },
    ward: { ward_number: 11, name: 'Gandhi Chowk' },
    lat: 16.8285,
    lng: 75.7105,
  },
  {
    id: 'sample-1',
    issue_number: 142,
    title: 'Open Drainage Overflowing near Station Road',
    status: 'in_progress',
    severity: 'critical',
    escalation: 'level_2',
    upvote_count: 34,
    address: 'Near Old Bus Stand, Station Road, Ward 30, Vijayapura',
    reported_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    category: { name: 'Drainage Problem', slug: 'drainage', icon: 'droplets' },
    ward: { ward_number: 30, name: 'Station Area' },
    lat: 16.8320,
    lng: 75.7145,
  },
  {
    id: 'sample-3',
    issue_number: 144,
    title: 'Commercial Garbage Dumping at Adil Shahi Colony',
    status: 'resolution_claimed',
    severity: 'medium',
    escalation: 'none',
    upvote_count: 28,
    address: 'Cross 4, Adil Shahi Colony, Ward 2, Vijayapura',
    reported_at: new Date(Date.now() - 3600000 * 52).toISOString(),
    category: { name: 'Garbage / Waste Dumping', slug: 'garbage', icon: 'trash' },
    ward: { ward_number: 2, name: 'Adil Shahi Colony' },
    lat: 16.8340,
    lng: 75.7190,
  },
  {
    id: 'sample-4',
    issue_number: 146,
    title: 'Tourist Pathway Garbage Accumulation near Gol Gumbaz',
    status: 'routed',
    severity: 'high',
    escalation: 'none',
    upvote_count: 42,
    address: 'Monument East Entrance, Gol Gumbaz Area, Ward 12, Vijayapura',
    reported_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    category: { name: 'Garbage / Waste Dumping', slug: 'garbage', icon: 'trash' },
    ward: { ward_number: 12, name: 'Gol Gumbaz Area' },
    lat: 16.8310,
    lng: 75.7350,
  },
  {
    id: 'sample-5',
    issue_number: 148,
    title: 'Water Supply Pipeline Burst & Road Flooding',
    status: 'acknowledged',
    severity: 'critical',
    escalation: 'level_1',
    upvote_count: 31,
    address: 'Torvi Waterworks Bypass, Ward 31, Vijayapura',
    reported_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    category: { name: 'Water Leakage', slug: 'water-leak', icon: 'droplet' },
    ward: { ward_number: 31, name: 'Torvi' },
    lat: 16.8210,
    lng: 75.6850,
  },
  {
    id: 'sample-6',
    issue_number: 150,
    title: 'Multiple Streetlight Failures along Solapur Highway Stretch',
    status: 'routed',
    severity: 'medium',
    escalation: 'none',
    upvote_count: 22,
    address: 'Solapur Road Junction, Ward 29, Vijayapura',
    reported_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    category: { name: 'Broken Streetlight', slug: 'streetlight', icon: 'lightbulb' },
    ward: { ward_number: 29, name: 'Solapur Road' },
    lat: 16.8450,
    lng: 75.7250,
  },
  {
    id: 'sample-7',
    issue_number: 152,
    title: 'Uncovered Stormwater Drain Manhole',
    status: 'routed',
    severity: 'critical',
    escalation: 'level_1',
    upvote_count: 52,
    address: 'Near Athani Galli Market, Ward 4, Vijayapura',
    reported_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    category: { name: 'Open Manhole', slug: 'manhole', icon: 'alert-triangle' },
    ward: { ward_number: 4, name: 'Athani Galli' },
    lat: 16.8290,
    lng: 75.7060,
  },
  {
    id: 'sample-8',
    issue_number: 154,
    title: 'Asphalt Deterioration & Potholes near School Cross',
    status: 'acknowledged',
    severity: 'high',
    escalation: 'none',
    upvote_count: 45,
    address: 'Managoli Road, Ward 20, Vijayapura',
    reported_at: new Date(Date.now() - 3600000 * 40).toISOString(),
    category: { name: 'Pothole / Bad Road', slug: 'pothole', icon: 'construction' },
    ward: { ward_number: 20, name: 'Managoli Road' },
    lat: 16.8190,
    lng: 75.7210,
  },
  {
    id: 'sample-9',
    issue_number: 156,
    title: 'Street Lamp Pole Short Circuit & Dark Stretch',
    status: 'in_progress',
    severity: 'medium',
    escalation: 'none',
    upvote_count: 17,
    address: 'Shivaji Circle, Ward 27, Vijayapura',
    reported_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    category: { name: 'Broken Streetlight', slug: 'streetlight', icon: 'lightbulb' },
    ward: { ward_number: 27, name: 'Shivaji Nagar' },
    lat: 16.8360,
    lng: 75.7080,
  },
  {
    id: 'sample-10',
    issue_number: 158,
    title: 'Clogged Sewage Culvert Causing Stagnant Pool',
    status: 'routed',
    severity: 'high',
    escalation: 'none',
    upvote_count: 24,
    address: 'Basaveshwar Nagar 2nd Main, Ward 7, Vijayapura',
    reported_at: new Date(Date.now() - 3600000 * 16).toISOString(),
    category: { name: 'Drainage Problem', slug: 'drainage', icon: 'droplets' },
    ward: { ward_number: 7, name: 'Basaveshwar Nagar' },
    lat: 16.8240,
    lng: 75.7150,
  },
]

export default async function MapPage() {
  const supabase = await createClient()

  const { data: dbIssues } = await supabase
    .from('issues')
    .select(`
      id, issue_number, title, status, severity, escalation, upvote_count,
      address, reported_at,
      category:issue_categories(name, slug, icon),
      ward:wards(ward_number, name),
      media:issue_media(public_url, capture_lat, capture_lng, media_context)
    `)
    .not('status', 'in', '(closed,auto_closed,verified)')
    .order('reported_at', { ascending: false })
    .limit(200)

  // Map database issues with coordinates or fall back to realistic Vijayapura hotspots
  const dbPoints = (dbIssues ?? []).map((issue: any, index: number) => {
    const reportMedia = issue.media?.find((m: any) => m.media_context === 'report')
    const lat = reportMedia?.capture_lat || (16.8302 + (Math.sin(index + 1) * 0.022))
    const lng = reportMedia?.capture_lng || (75.7100 + (Math.cos(index + 1) * 0.022))
    return {
      ...issue,
      lat,
      lng,
    }
  })

  // Combine real database issues with rich realistic Vijayapura points for viva demonstration
  const combinedIssues = dbPoints.length >= 8 ? dbPoints : [...dbPoints, ...VIJAYAPURA_HOTSPOTS]

  return (
    <div className="relative" style={{ height: 'calc(100vh - 64px)' }}>
      <MapClient issues={combinedIssues} />
    </div>
  )
}
