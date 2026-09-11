'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface AdminIssueActionsProps {
  issue: any
}

const ACTION_MAP: Record<string, { label: string; action: string; variant: 'primary' | 'secondary' | 'danger' | 'outline' }> = {
  routed: { label: '✅ Acknowledge Issue', action: 'acknowledge', variant: 'primary' },
  acknowledged: { label: '🔨 Start Work', action: 'start_work', variant: 'primary' },
  in_progress: { label: '📸 Claim Resolution', action: 'claim_resolution', variant: 'primary' },
}

export default function AdminIssueActions({ issue }: AdminIssueActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const actionConfig = ACTION_MAP[issue.status]

  if (!actionConfig || done) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-500">
        {done ? '✅ Action completed. Refreshing...' : `No actions available for status: ${issue.status}`}
      </div>
    )
  }

  async function handleAction() {
    setLoading(true)
    setError('')

    const res = await fetch(`/api/admin/issues/${issue.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionConfig.action, note: note || undefined }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Action failed')
      return
    }

    setDone(true)
    setTimeout(() => router.refresh(), 1000)
  }

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
      <h3 className="mb-3 font-bold text-blue-900">Official Action Required</h3>

      <textarea
        placeholder="Add a note (optional) — visible in public timeline"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        className="mb-3 w-full rounded-lg border border-blue-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />

      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

      <Button
        onClick={handleAction}
        loading={loading}
        size="lg"
        className="w-full"
      >
        {actionConfig.label}
      </Button>

      {issue.status === 'in_progress' && (
        <p className="mt-2 text-xs text-blue-700">
          ⚠️ After claiming resolution, the original reporter will be notified to verify.
          You must have photo proof uploaded before this step in production.
        </p>
      )}
    </div>
  )
}
