import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { timeAgo } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let notifications: any[] = []

  if (user) {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)
    notifications = data ?? []
  }

  // Sample alerts if empty (for demo / first-time users)
  const sampleNotifications = [
    {
      id: 'demo-1',
      title: '🚨 SLA Escalation Alert',
      body: 'Issue #JD-00042 (Open Drainage on Station Road) has been auto-escalated to Level 2 (Municipal Commissioner).',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      type: 'escalation',
      issue_id: 'sample',
    },
    {
      id: 'demo-2',
      title: '✅ Resolution Claimed — Verification Required',
      body: 'Sanitation Department claims Pothole #JD-00038 is resolved. Please verify the fix with photo proof.',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      type: 'verification',
      issue_id: 'sample',
    },
    {
      id: 'demo-3',
      title: '🔨 Work Started on Your Report',
      body: 'Roads & Infrastructure Department has commenced repair work on Ward 12 Adil Shahi Colony road.',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      type: 'status_update',
      issue_id: 'sample',
    }
  ]

  const displayList = notifications.length > 0 ? notifications : sampleNotifications

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications & Alerts</h1>
          <p className="text-sm text-gray-500">ಅಧಿಸೂಚನೆಗಳು · Real-time civic tracking updates</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
          {displayList.length} updates
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {displayList.map((notif: any) => (
          <div
            key={notif.id}
            className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-blue-300 transition-colors"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-lg">
              {notif.type === 'escalation' ? '⚠️' : notif.type === 'verification' ? '📸' : '🔔'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">{notif.title}</p>
                <span className="text-xs text-gray-400">{timeAgo(notif.created_at)}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{notif.body}</p>
              {notif.issue_id && (
                <div className="mt-3">
                  <Link
                    href="/issues"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
                  >
                    View Complaint Timeline →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
