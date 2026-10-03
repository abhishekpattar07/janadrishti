'use client'

import { useEffect, useRef, useState } from 'react'
import { formatIssueNumber, timeAgo, STATUS_MARKER_COLORS } from '@/lib/utils'
import Link from 'next/link'
import { Flame, MapPin, Layers, Filter, AlertTriangle, ExternalLink } from 'lucide-react'

const VIJAYAPURA = { lat: 16.8302, lng: 75.7100 }

interface MapClientProps {
  issues: any[]
}

const HEAT_CATEGORIES = [
  { slug: 'all', label: 'All Hotspots', icon: '🌟' },
  { slug: 'pothole', label: 'Potholes & Roads', icon: '🕳️' },
  { slug: 'garbage', label: 'Garbage Dumps', icon: '🗑️' },
  { slug: 'drainage', label: 'Drainage', icon: '💧' },
  { slug: 'streetlight', label: 'Streetlights', icon: '💡' },
]

export default function MapClient({ issues }: MapClientProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersGroupRef = useRef<any>(null)
  const heatGroupRef = useRef<any>(null)

  const [selected, setSelected] = useState<any>(null)
  const [mapMode, setMapMode] = useState<'pins' | 'heatmap'>('pins')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [isReady, setIsReady] = useState(false)

  // Filter issues based on active category
  const filteredIssues = activeCategory === 'all'
    ? issues
    : issues.filter((i) => i.category?.slug === activeCategory)

  // Initialize Map
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

    import('leaflet').then((L) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return

      const map = L.map(mapContainerRef.current, {
        center: [VIJAYAPURA.lat, VIJAYAPURA.lng],
        zoom: 13,
        zoomControl: false,
      })

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // OpenStreetMap Base Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      markersGroupRef.current = L.layerGroup().addTo(map)
      heatGroupRef.current = L.layerGroup()

      mapInstanceRef.current = map
      setIsReady(true)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update Layers when mode, filter, or issues change
  useEffect(() => {
    if (!isReady || !mapInstanceRef.current) return

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current
      const markersGroup = markersGroupRef.current
      const heatGroup = heatGroupRef.current

      if (!map || !markersGroup || !heatGroup) return

      markersGroup.clearLayers()
      heatGroup.clearLayers()

      // 1. Build Pin Markers Layer
      filteredIssues.forEach((issue) => {
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
        })

        marker.on('click', () => setSelected(issue))
        marker.addTo(markersGroup)
      })

      // 2. Build Multi-Tier Glowing Civic Density Heatmap Layer
      filteredIssues.forEach((issue) => {
        const severity = issue.severity || 'medium'
        const upvotes = issue.upvote_count || 1

        // Color intensity based on severity & escalation
        const heatColor = issue.escalation !== 'none' || severity === 'critical'
          ? '#DC2626' // Intense Red
          : severity === 'high'
          ? '#EA580C' // Flame Orange
          : '#2563EB' // Deep Blue

        // Outer thermal diffusion halo (simulates Gaussian blur)
        const outerHalo = L.circle([issue.lat, issue.lng], {
          radius: 260 + upvotes * 12,
          fillColor: heatColor,
          fillOpacity: 0.18,
          color: 'transparent',
          weight: 0,
        })
        outerHalo.on('click', () => setSelected(issue))
        outerHalo.addTo(heatGroup)

        // Middle core thermal zone
        const midCore = L.circle([issue.lat, issue.lng], {
          radius: 130 + upvotes * 6,
          fillColor: heatColor,
          fillOpacity: 0.38,
          color: 'transparent',
          weight: 0,
        })
        midCore.on('click', () => setSelected(issue))
        midCore.addTo(heatGroup)

        // Intense center focal point
        const epicenter = L.circleMarker([issue.lat, issue.lng], {
          radius: 7,
          fillColor: '#FEF08A',
          color: heatColor,
          weight: 2.5,
          opacity: 1,
          fillOpacity: 0.95,
        })
        epicenter.on('click', () => setSelected(issue))
        epicenter.addTo(heatGroup)
      })

      // 3. Toggle Visibility based on Map Mode
      if (mapMode === 'heatmap') {
        if (map.hasLayer(markersGroup)) map.removeLayer(markersGroup)
        if (!map.hasLayer(heatGroup)) map.addLayer(heatGroup)
      } else {
        if (map.hasLayer(heatGroup)) map.removeLayer(heatGroup)
        if (!map.hasLayer(markersGroup)) map.addLayer(markersGroup)
      }
    })
  }, [isReady, mapMode, activeCategory, filteredIssues])

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* TOP CONTROLS BAR: Mode Toggle & Category Filters */}
      <div className="absolute top-4 inset-x-4 z-10 mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-2.5 pointer-events-none">
        
        {/* View Mode Toggle Pill (Pins vs Heatmap) */}
        <div className="pointer-events-auto flex items-center rounded-2xl border border-slate-200/90 bg-white/95 p-1 shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMapMode('pins')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              mapMode === 'pins'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Pin Markers</span>
          </button>

          <button
            type="button"
            onClick={() => setMapMode('heatmap')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              mapMode === 'heatmap'
                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Flame className="h-3.5 w-3.5 text-yellow-300" />
            <span>Civic Density Heatmap</span>
          </button>
        </div>

        {/* Category Hotspot Filter Tabs */}
        <div className="pointer-events-auto flex items-center gap-1 overflow-x-auto rounded-2xl border border-slate-200/90 bg-white/95 p-1 shadow-lg backdrop-blur-md max-w-full">
          {HEAT_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={`flex items-center gap-1 whitespace-nowrap rounded-xl px-2.5 py-1 text-xs font-semibold transition-all ${
                activeCategory === cat.slug
                  ? 'bg-blue-100 text-blue-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Legend Card (Left Bottom/Top) */}
      <div className="absolute left-4 top-24 z-10 rounded-2xl border border-gray-100 bg-white/95 p-3.5 shadow-lg backdrop-blur text-xs hidden sm:block max-w-xs">
        {mapMode === 'pins' ? (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin className="h-4 w-4 text-blue-700" />
              <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">Pin Status Legend</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-white shadow-xs bg-blue-600" />
                <span className="text-slate-600">Assigned / Routed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-white shadow-xs bg-orange-500" />
                <span className="text-slate-600">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-white shadow-xs bg-emerald-500" />
                <span className="text-slate-600">Resolution Claimed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-white shadow-xs bg-red-500 animate-pulse" />
                <span className="text-red-700 font-bold">⚠️ Overdue / Escalated</span>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">Marker radius scales with &ldquo;Me Too&rdquo; supporters</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Flame className="h-4 w-4 text-orange-600" />
              <p className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">Defect Density Heatmap</p>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Visualizes civic grievance clusters and infrastructure strain across Vijayapura.
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-600">Low Density</span>
                <span className="font-bold text-red-600">Critical Cluster</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 via-orange-500 to-red-600 shadow-2xs" />
            </div>
            <p className="mt-2 text-[10px] text-slate-400">Overlapping halos highlight priority repair zones</p>
          </div>
        )}
      </div>

      {/* Ward & Active Count Badge (Right Top) */}
      <div className="absolute right-4 top-24 z-10 rounded-2xl bg-blue-950/90 px-3.5 py-2 text-white shadow-lg backdrop-blur hidden sm:block">
        <p className="text-xs font-bold">{filteredIssues.length} Active Hotspots</p>
        <p className="text-[10px] text-blue-200">Vijayapura · 35 Wards</p>
      </div>

      {/* Selected Complaint Detail Drawer */}
      {selected && (
        <div className="absolute bottom-6 left-4 right-4 z-20 mx-auto max-w-md rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl transition-all sm:left-6 sm:right-auto sm:w-96 animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setSelected(null)}
            className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-200 transition-colors"
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
            className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-blue-800 py-2.5 text-center text-sm font-bold text-white shadow-sm hover:bg-blue-900 transition-colors"
          >
            <span>View Full Issue & Verification</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  )
}
