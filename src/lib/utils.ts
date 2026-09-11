import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a date relative to now (e.g., "2 hours ago")
export function timeAgo(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Format SLA countdown (e.g., "2h 30m remaining" or "3h overdue")
export function formatSLA(deadline: string | null): {
  text: string
  isOverdue: boolean
  urgency: 'safe' | 'warning' | 'critical' | 'overdue'
} {
  if (!deadline) return { text: 'No deadline', isOverdue: false, urgency: 'safe' }

  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffMs = deadlineDate.getTime() - now.getTime()

  if (diffMs <= 0) {
    const overdueMins = Math.floor(Math.abs(diffMs) / 60000)
    const overdueHours = Math.floor(overdueMins / 60)
    const overdueDays = Math.floor(overdueHours / 24)
    const text = overdueDays > 0
      ? `${overdueDays}d overdue`
      : overdueHours > 0
      ? `${overdueHours}h overdue`
      : `${overdueMins}m overdue`
    return { text, isOverdue: true, urgency: 'overdue' }
  }

  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(hours / 24)

  const text = days > 1
    ? `${days}d remaining`
    : hours > 0
    ? `${hours}h remaining`
    : `${Math.floor(diffMs / 60000)}m remaining`

  const urgency = hours < 2 ? 'critical' : hours < 12 ? 'warning' : 'safe'
  return { text, isOverdue: false, urgency }
}

// Format distance in meters
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

// Compute distance between two GPS coordinates (Haversine)
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000 // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Status color mappings
export const STATUS_COLORS: Record<string, string> = {
  reported: 'bg-gray-100 text-gray-700',
  validated: 'bg-blue-100 text-blue-700',
  routed: 'bg-purple-100 text-purple-700',
  acknowledged: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-orange-100 text-orange-700',
  resolution_claimed: 'bg-cyan-100 text-cyan-700',
  verified: 'bg-green-100 text-green-700',
  disputed: 'bg-red-100 text-red-700',
  closed: 'bg-green-100 text-green-800',
  auto_closed: 'bg-gray-100 text-gray-500',
}

// Map marker colors
export const STATUS_MARKER_COLORS: Record<string, string> = {
  reported: '#6B7280',
  validated: '#3B82F6',
  routed: '#8B5CF6',
  acknowledged: '#F59E0B',
  in_progress: '#F97316',
  resolution_claimed: '#06B6D4',
  verified: '#10B981',
  disputed: '#EF4444',
  closed: '#059669',
  auto_closed: '#9CA3AF',
}

// Severity colors
export const SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}

// Escalation colors
export const ESCALATION_COLORS: Record<string, string> = {
  none: '',
  level_1: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  level_2: 'bg-orange-50 border-orange-400 text-orange-800',
  level_3: 'bg-red-50 border-red-500 text-red-900',
}

// Category icons (using Lucide icon names)
export const CATEGORY_ICONS: Record<string, string> = {
  pothole: 'construction',
  garbage: 'trash-2',
  streetlight: 'lightbulb',
  drainage: 'droplets',
  'water-leak': 'droplet',
  manhole: 'triangle-alert',
  waterlogging: 'waves',
  footpath: 'footprints',
  'fallen-tree': 'tree-pine',
  toilet: 'bath',
  traffic: 'traffic-cone',
  other: 'circle-help',
}

// Issue number formatter (JD-00001)
export function formatIssueNumber(n: number): string {
  return `JD-${String(n).padStart(5, '0')}`
}
