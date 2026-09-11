'use client'

import { useState, useRef, useCallback } from 'react'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before • ಮೊದಲು (Defect)',
  afterLabel = 'After • ನಂತರ (Resolved)',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percent)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }, [handleMove])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }, [isDragging, handleMove])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm">
            ✨
          </span>
          <h3 className="font-bold text-slate-900 text-sm">
            Before &amp; After Resolution Proof • ದುರಸ್ತಿ ಪರಿಶೀಲನೆ
          </h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
          Verified Fix
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Drag the center slider left and right to verify the official repair against the original citizen report.
      </p>

      {/* Slider Viewport */}
      <div
        ref={containerRef}
        className="relative h-72 sm:h-96 w-full select-none overflow-hidden rounded-xl border border-slate-200 cursor-ew-resize"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER Image (Full background) */}
        <img
          src={afterImage}
          alt="After resolution"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute top-3 right-3 rounded-lg bg-emerald-600/90 px-3 py-1 text-xs font-bold text-white shadow-xs backdrop-blur">
          {afterLabel}
        </div>

        {/* BEFORE Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before defect"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              maxWidth: 'none'
            }}
          />
          <div className="absolute top-3 left-3 rounded-lg bg-red-600/90 px-3 py-1 text-xs font-bold text-white shadow-xs backdrop-blur">
            {beforeLabel}
          </div>
        </div>

        {/* Divider Bar & Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-xl border-2 border-slate-800 text-slate-800 font-bold text-xs">
            ⇄
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>⬅️ Original Complaint Photo</span>
        <span>Official Repair Evidence ➡️</span>
      </div>
    </div>
  )
}
