'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface UpvoteButtonProps {
  issueId: string
  initialCount: number
  hasUpvoted?: boolean
}

export function UpvoteButton({ issueId, initialCount, hasUpvoted = false }: UpvoteButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [upvoted, setUpvoted] = useState(hasUpvoted)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    // Optimistic update
    const nextUpvoted = !upvoted
    setUpvoted(nextUpvoted)
    setCount(prev => nextUpvoted ? prev + 1 : Math.max(0, prev - 1))
    setLoading(true)

    try {
      const res = await fetch(`/api/issues/${issueId}/upvote`, {
        method: 'POST',
      })

      if (!res.ok) {
        // Revert on error
        setUpvoted(!nextUpvoted)
        setCount(prev => !nextUpvoted ? prev + 1 : Math.max(0, prev - 1))
      }
    } catch {
      // Revert on error
      setUpvoted(!nextUpvoted)
      setCount(prev => !nextUpvoted ? prev + 1 : Math.max(0, prev - 1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
        upvoted
          ? 'bg-blue-800 text-white shadow-sm ring-2 ring-blue-600/30'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title={upvoted ? 'Remove support' : 'Support this issue'}
    >
      <span className={`text-base transition-transform ${upvoted ? 'scale-125' : ''}`}>👍</span>
      <span>{upvoted ? 'Supported' : 'Me Too • ನನಗೂ ಸಹ'}</span>
      <span className={`rounded-full px-2 py-0.5 text-xs ${upvoted ? 'bg-blue-900 text-blue-100' : 'bg-gray-200 text-gray-700'}`}>
        {count}
      </span>
    </button>
  )
}
