'use client'

import { useState } from 'react'
import { Share2, Check, Copy, MessageCircle } from 'lucide-react'
import { formatIssueNumber } from '@/lib/utils'

interface ShareIssueButtonProps {
  issue: {
    id: string
    issue_number: number
    title?: string
    address?: string
    status?: string
    upvote_count?: number
    category?: { name: string }
    ward?: { name: string; ward_number?: number }
    department?: { name: string }
  }
}

export function ShareIssueButton({ issue }: ShareIssueButtonProps) {
  const [copied, setCopied] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)

  const issueNum = formatIssueNumber(issue.issue_number)
  const title = issue.title || issue.category?.name || 'Civic Grievance'
  const location = issue.address || (issue.ward ? `Ward ${issue.ward.ward_number || ''}: ${issue.ward.name}` : 'Vijayapura')
  const status = (issue.status || 'reported').replace(/_/g, ' ').toUpperCase()
  const supporters = issue.upvote_count || 1

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/issues/${issue.id}`
    }
    return `https://janadrishti.vercel.app/issues/${issue.id}`
  }

  const shareText = `🚨 *Vijayapura Civic Issue Alert • ಜನದೃಷ್ಟಿ*
📌 *Ticket:* ${issueNum} - ${title}
📍 *Location:* ${location}
🏛 *Department:* ${issue.department?.name || 'Vijayapura City Corporation'}
⚙️ *Status:* ${status}
👥 *Supporters:* ${supporters} citizens

👉 *Track resolution countdown or add your support:*
${getShareUrl()}`

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
    setOpenMenu(false)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
    }
    setOpenMenu(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        {/* Direct WhatsApp Share Button */}
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all hover:scale-[1.02] shrink-0"
          title="Share to WhatsApp / ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ"
        >
          <span className="text-sm">💬</span>
          <span className="hidden sm:inline">WhatsApp Share</span>
          <span className="inline sm:hidden">Share</span>
        </button>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Copy Link to Clipboard / ಲಿಂಕ್ ನಕಲಿಸಿ"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
