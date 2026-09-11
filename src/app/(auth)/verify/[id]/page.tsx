'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const supabase = createClient()

  // We'll get the ID from URL
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : ''

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [verdict, setVerdict] = useState<boolean | null>(null)
  const [comment, setComment] = useState('')
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const startCamera = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
      setCameraActive(true)
    }
  }, [])

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')!.drawImage(videoRef.current, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob) return
      setPhotoBlob(blob)
      setPhotoDataUrl(canvas.toDataURL('image/jpeg', 0.85))
      const stream = videoRef.current?.srcObject as MediaStream
      stream?.getTracks().forEach((t) => t.stop())
      setCameraActive(false)
    }, 'image/jpeg', 0.85)
  }, [])

  async function handleSubmit() {
    if (verdict === null) { setError('Please select whether the issue is fixed or not'); return }
    if (verdict === false && !comment) { setError('Please describe what is still wrong'); return }

    setLoading(true)
    setError('')

    try {
      let gps: any = null
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => { gps = { lat: pos.coords.latitude, lng: pos.coords.longitude }; resolve() },
          () => resolve(),
          { timeout: 5000 }
        )
      })

      const res = await fetch(`/api/issues/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_verified: verdict,
          comment: comment || null,
          verification_lat: gps?.lat ?? null,
          verification_lng: gps?.lng ?? null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Verification failed')
      }

      setDone(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mb-4 text-6xl">{verdict ? '✅' : '❌'}</div>
        <h2 className="text-2xl font-bold text-gray-900">
          {verdict ? 'Resolution Confirmed!' : 'Dispute Filed!'}
        </h2>
        <p className="mt-2 text-gray-600">
          {verdict
            ? 'Thank you for verifying. The issue has been marked as resolved.'
            : 'Your dispute has been recorded. The issue will be reopened and escalated.'}
        </p>
        <Button className="mt-6" onClick={() => router.push(`/issues/${id}`)}>
          View Issue →
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Verify Resolution</h1>
      <p className="mb-6 text-sm text-gray-500">
        The department claims this issue is fixed. Please inspect and confirm.
      </p>

      {/* Verdict */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => setVerdict(true)}
          className={`rounded-xl border-2 p-4 text-center transition-all ${
            verdict === true
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white hover:border-green-300'
          }`}
        >
          <span className="block text-3xl mb-1">✅</span>
          <span className="font-semibold text-green-800">Yes, it's fixed</span>
          <span className="block text-xs text-green-600 mt-0.5">ಸರಿಪಡಿಸಲಾಗಿದೆ</span>
        </button>
        <button
          onClick={() => setVerdict(false)}
          className={`rounded-xl border-2 p-4 text-center transition-all ${
            verdict === false
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 bg-white hover:border-red-300'
          }`}
        >
          <span className="block text-3xl mb-1">❌</span>
          <span className="font-semibold text-red-800">No, NOT fixed</span>
          <span className="block text-xs text-red-600 mt-0.5">ಸರಿಪಡಿಸಿಲ್ಲ</span>
        </button>
      </div>

      {verdict === false && (
        <textarea
          placeholder="What's still wrong? ಇನ್ನೂ ಏನು ತಪ್ಪಾಗಿದೆ?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="mb-4 w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
        />
      )}

      {/* Optional dispute photo */}
      {verdict === false && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Attach new photo as evidence (optional)</p>
          {!cameraActive && !photoDataUrl && (
            <Button variant="outline" onClick={startCamera} className="w-full">
              📸 Take Photo Evidence
            </Button>
          )}
          {cameraActive && (
            <div className="space-y-2">
              <video ref={videoRef} autoPlay playsInline muted className="w-full rounded-xl" />
              <canvas ref={canvasRef} className="hidden" />
              <Button onClick={capture} className="w-full bg-red-600 hover:bg-red-700">Capture</Button>
            </div>
          )}
          {photoDataUrl && (
            <img src={photoDataUrl} alt="Evidence" className="w-full rounded-xl border border-gray-200" />
          )}
        </div>
      )}

      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <Button
        onClick={handleSubmit}
        loading={loading}
        size="lg"
        className={`w-full ${verdict === false ? 'bg-red-600 hover:bg-red-700' : ''}`}
      >
        Submit Verification
      </Button>
    </div>
  )
}
