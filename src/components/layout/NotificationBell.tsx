'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, AlertTriangle, Hammer, CheckCircle2, ChevronRight, X } from 'lucide-react'
import { useLocale } from '@/lib/useLocale'

interface NotificationItem {
  id: string
  title: string
  title_kn?: string
  body: string
  body_kn?: string
  timeAgo: string
  type: 'escalation' | 'work_started' | 'resolution'
  issueId: string
  read: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: '🚨 SLA Escalation: Level 2 Alert',
    title_kn: '🚨 SLA ಮಿತಿ ಮೀರಿದೆ: ಹಂತ 2 ಆಯುಕ್ತರ ಗಮನಕ್ಕೆ',
    body: 'Station Road Drainage Overflow (Issue #142) auto-escalated to Municipal Commissioner.',
    body_kn: 'ಸ್ಟೇಷನ್ ರಸ್ತೆ ಚರಂಡಿ ಸಮಸ್ಯೆ #142 ಪಾಲಿಕೆ ಆಯುಕ್ತರ ಹಂತಕ್ಕೆ ವರ್ಗಾಯಿಸಲಾಗಿದೆ.',
    timeAgo: '2h ago',
    type: 'escalation',
    issueId: 'sample-1',
    read: false,
  },
  {
    id: 'n2',
    title: '🔨 Asphalt Crew Deployed',
    title_kn: '🔨 ರಸ್ತೆ ದುರಸ್ತಿ ತಂಡ ನಿಯೋಜಿಸಲಾಗಿದೆ',
    body: 'Roads Department deployed bituminous patching crew to Gandhi Chowk (Issue #139).',
    body_kn: 'ಗಾಂಧಿ ಚೌಕ ರಸ್ತೆ ಗುಂಡಿ #139 ಸರಿಪಡಿಸಲು ಸಿಬ್ಬಂದಿ ನಿಯೋಜಿಸಲಾಗಿದೆ.',
    timeAgo: '5h ago',
    type: 'work_started',
    issueId: 'sample-2',
    read: false,
  },
  {
    id: 'n3',
    title: '✨ Resolution Claimed: Verification Needed',
    title_kn: '✨ ಕಾಮಗಾರಿ ಪೂರ್ಣ: ನಾಗರಿಕ ಪರಿಶೀಲನೆ ಅಗತ್ಯ',
    body: 'Sanitation Dept claimed Adil Shahi Colony cleanup. Inspect Before & After proof!',
    body_kn: 'ಆದಿಲ್ ಶಾಹಿ ಕಾಲೋನಿ ಕಸ ತೆರವುಗೊಳಿಸಲಾಗಿದೆ. ಮೊದಲು ಮತ್ತು ನಂತರದ ಫೋಟೋ ಪರಿಶೀಲಿಸಿ!',
    timeAgo: '1d ago',
    type: 'resolution',
    issueId: 'sample-3',
    read: false,
  },
]

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const { locale } = useLocale()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length
  const isKannada = locale === 'kn'

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markSingleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50/80 p-2 text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
        title="Civic Alerts & Notifications / ಅಧಿಸೂಚನೆಗಳು"
        aria-label="Civic Alerts"
      >
        <Bell className="h-4 w-4 text-blue-900" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Notifications Drawer */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🔔</span>
              <h3 className="text-xs font-extrabold text-blue-950 uppercase tracking-wide">
                {isKannada ? 'ನಾಗರಿಕ ಅಧಿಸೂಚನೆಗಳು' : 'Civic Tracking Alerts'}
              </h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>{isKannada ? 'ಎಲ್ಲ ಓದಿದೆ' : 'Mark all read'}</span>
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto py-1">
            {notifications.map((n) => {
              const titleText = isKannada && n.title_kn ? n.title_kn : n.title
              const bodyText = isKannada && n.body_kn ? n.body_kn : n.body

              const icon =
                n.type === 'escalation' ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-700 text-xs shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                ) : n.type === 'work_started' ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-700 text-xs shrink-0">
                    <Hammer className="h-4 w-4" />
                  </span>
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 text-xs shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                )

              return (
                <Link
                  key={n.id}
                  href={`/issues/${n.issueId}`}
                  onClick={() => markSingleRead(n.id)}
                  className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors hover:bg-blue-50/60 ${
                    !n.read ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {icon}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{titleText}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timeAgo}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{bodyText}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Footer Link */}
          <div className="border-t border-gray-100 pt-2 px-1 text-center">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 transition-colors"
            >
              <span>{isKannada ? 'ಎಲ್ಲಾ ಅಧಿಸೂಚನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View All Live Alerts'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
