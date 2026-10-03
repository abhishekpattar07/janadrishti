'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ThumbsUp, X, MapPin, ExternalLink, CheckCircle } from 'lucide-react'
import { formatIssueNumber } from '@/lib/utils'

interface DuplicateAlertCardProps {
  match: {
    id: string
    issue_number: number
    title: string
    category_name: string
    category_name_kn?: string
    ward_name?: string
    distanceMeters?: number
    upvote_count?: number
    photo_url?: string
    address?: string
  }
  locale?: string
  onDismiss: () => void
}

export function DuplicateAlertCard({ match, locale = 'en', onDismiss }: DuplicateAlertCardProps) {
  const router = useRouter()
  const [upvoting, setUpvoting] = useState(false)
  const [supported, setSupported] = useState(false)

  const isKannada = locale === 'kn'
  const isHindi = locale === 'hi'

  const labels = {
    badge: isKannada
      ? '⚡ ಹತ್ತಿರದಲ್ಲಿ ಇದೇ ಸಮಸ್ಯೆ ಕಂಡುಬಂದಿದೆ'
      : isHindi
      ? '⚡ पास में समान समस्या मिली'
      : '⚡ Similar Issue Reported Nearby!',
    question: isKannada
      ? 'ಇದೇ ಸ್ಥಳದಲ್ಲಿ ಈಗಾಗಲೇ ದೂರು ದಾಖಲಾಗಿದೆ. ನಿಮ್ಮ ಬೆಂಬಲ ಸೇರಿಸಿ ಆದ್ಯತೆ ಹೆಚ್ಚಿಸುವುದೇ?'
      : isHindi
      ? 'क्या यह वही समस्या है? नया टिकट बनाने के बजाय अपना समर्थन जोड़ें!'
      : 'Is this the same defect? Add your support instead of filing a duplicate ticket!',
    supportBtn: isKannada
      ? '👍 ಹೌದು, ನನ್ನ ಬೆಂಬಲ ಸೇರಿಸಿ (+1)'
      : isHindi
      ? '👍 हाँ, मेरा समर्थन जोड़ें (+1)'
      : '👍 Yes, Add My Support (+1 Me Too)',
    differentBtn: isKannada
      ? 'ಇಲ್ಲ, ಇದು ಬೇರೆ ಸಮಸ್ಯೆ'
      : isHindi
      ? 'नहीं, यह अलग समस्या है'
      : 'No, this is a different problem',
    supportersText: isKannada
      ? 'ನಾಗರಿಕರು ಬೆಂಬಲಿಸಿದ್ದಾರೆ'
      : isHindi
      ? 'नागरिकों ने समर्थन दिया'
      : 'citizens already supported',
    viewIssueText: isKannada ? 'ದೂರು ವೀಕ್ಷಿಸಿ' : isHindi ? 'शिकायत देखें' : 'View Issue',
  }

  const handleSupport = async () => {
    setUpvoting(true)
    try {
      // Optimistic support call
      await fetch(`/api/issues/${match.id}/upvote`, { method: 'POST' }).catch(() => {})
      setSupported(true)
      setTimeout(() => {
        router.push(`/issues/${match.id}`)
      }, 1200)
    } catch {
      router.push(`/issues/${match.id}`)
    } finally {
      setUpvoting(false)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/50 p-4 sm:p-5 shadow-md animate-in fade-in slide-in-from-top-2">
      {/* Close/Dismiss Button */}
      <button
        type="button"
        onClick={onDismiss}
        className="absolute top-3 right-3 rounded-full p-1 text-slate-400 hover:bg-amber-200/50 hover:text-slate-700 transition-colors"
        title="Dismiss / ಮುಚ್ಚಿ"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header Badge */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold shadow-xs">
          !
        </span>
        <span className="text-xs font-extrabold tracking-wide uppercase text-amber-900">
          {labels.badge}
        </span>
        {match.distanceMeters && (
          <span className="ml-auto mr-6 rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[11px] font-bold text-amber-900 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {match.distanceMeters}m away
          </span>
        )}
      </div>

      {/* Issue Summary Card */}
      <div className="flex flex-col sm:flex-row gap-3 rounded-xl border border-amber-200/80 bg-white/90 p-3 shadow-2xs backdrop-blur-xs">
        {match.photo_url && (
          <img
            src={match.photo_url}
            alt={match.title}
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg object-cover border border-amber-100 shrink-0"
          />
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                {formatIssueNumber(match.issue_number)}
              </span>
              <span className="text-[11px] font-bold text-slate-600 truncate">
                {match.category_name}
              </span>
            </div>
            <h4 className="mt-1 text-sm font-bold text-slate-900 line-clamp-2">
              {match.title}
            </h4>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-1.5 border-t border-slate-100">
            <span className="flex items-center gap-1 font-semibold text-emerald-700">
              <ThumbsUp className="h-3 w-3" />
              {match.upvote_count || 1} {labels.supportersText}
            </span>
            <Link
              href={`/issues/${match.id}`}
              target="_blank"
              className="inline-flex items-center gap-0.5 font-bold text-blue-700 hover:text-blue-900 text-xs"
            >
              <span>{labels.viewIssueText}</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Action Prompt */}
      <p className="mt-3 text-xs font-semibold text-slate-700">
        {labels.question}
      </p>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSupport}
          disabled={upvoting || supported}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:from-blue-800 hover:to-indigo-900 transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {supported ? (
            <>
              <CheckCircle className="h-3.5 w-3.5 text-emerald-300" />
              <span>✓ Supported! Redirecting...</span>
            </>
          ) : (
            <>
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{labels.supportBtn}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-white hover:text-slate-900 transition-colors"
        >
          {labels.differentBtn}
        </button>
      </div>
    </div>
  )
}
