'use client'

import { useEffect, useRef, useState } from 'react'
import { formatIssueNumber, timeAgo, STATUS_MARKER_COLORS } from '@/lib/utils'
import Link from 'next/link'

const VIJAYAPURA = { lat: 16.8302, lng: 75.7100 }

export default function MapClient({ issues }: { issues: any[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [selected, setSelected] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Dynamic import to support Next.js SSR
    import('leaflet').then((L) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return

      const map = L.map(mapContainerRef.current, {
        center: [VIJAYAPURA.lat, VIJAYAPURA.lng],
        zoom: 13,
        zoomControl: false,
      })

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // OpenStreetMap Tiles (100% Free Forever)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Add markers for civic issues
      issues.forEach((issue) => {
        const color = issue.escalation !== 'none'
          ? '#EF4444'
          : (STATUS_MARKER_COLORS[issue.status] ?? '#2563EB')

        const radius = Math.min(18, 9 + (issue.upvote_count || 0))

        const marker = L.circleMarker([issue.lat, issue.lng], {
          radius: radius,
          fillColor: color,
          color: '#ffffff',
          weight: 2.5,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map)

        marker.on('click', () => {
          setSelected(issue)
        })
      })

      mapInstanceRef.current = map
      setIsReady(true)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [issues])

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Top Legend */}
      <div className="absolute left-4 top-4 z-10 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-base">📍</span>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Issues Map</p>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-white shadow-xs bg-blue-600" />
            <span className="text-slate-600 font-medium">Assigned</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-white shadow-xs bg-orange-500" />
            <span className="text-slate-600 font-medium">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-white shadow-xs bg-emerald-500" />
            <span className="text-slate-600 font-medium">Resolution Claimed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-white shadow-xs bg-red-500 animate-pulse" />
            <span className="text-red-700 font-semibold">⚠️ Escalated</span>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">Marker size = citizen support count</p>
      </div>

      {/* Vijayapura Ward Counter */}
      <div className="absolute right-4 top-4 z-10 rounded-2xl bg-blue-900 px-4 py-2.5 text-white shadow-lg">
        <p className="text-xs font-bold">{issues.length} Active Complaints</p>
        <p className="text-[11px] text-blue-200">Vijayapura · 35 Wards</p>
      </div>

      {/* Selected Complaint Detail Drawer */}
      {selected && (
        <div className="absolute bottom-6 left-4 right-4 z-20 mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl transition-all sm:left-6 sm:right-auto sm:w-96">
          <button
            onClick={() => setSelected(null)}
            className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-200"
          >
            ✕
          </button>
          
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-gray-400">
              {formatIssueNumber(selected.issue_number)}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
              selected.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
              selected.status === 'routed' ? 'bg-blue-100 text-blue-700' :
              selected.status === 'resolution_claimed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {selected.status.replace(/_/g, ' ')}
            </span>
            {selected.escalation !== 'none' && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                🚨 Overdue
              </span>
            )}
          </div>

          <h3 className="font-bold text-slate-900 line-clamp-2">
            {selected.title ?? selected.category?.name}
          </h3>
          
          {selected.address && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-1">
              📍 {selected.address}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>⏱ {timeAgo(selected.reported_at)}</span>
            <span className="font-semibold text-blue-900">👍 {selected.upvote_count} supporters</span>
          </div>

          <Link
            href={`/issues/${selected.id}`}
            className="mt-4 block rounded-xl bg-blue-800 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-blue-900 transition-colors"
          >
            View Full Issue & Verification →
          </Link>
        </div>
      )}
    </div>
  )
}
