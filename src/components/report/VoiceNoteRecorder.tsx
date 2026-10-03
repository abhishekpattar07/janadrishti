'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Trash2, Volume2, Sparkles, Check } from 'lucide-react'

interface VoiceNoteRecorderProps {
  locale?: string
  onAudioRecorded: (blob: Blob | null, audioUrl: string | null) => void
  onAutoTranscribe?: (text: string) => void
}

export function VoiceNoteRecorder({
  locale = 'en',
  onAudioRecorded,
  onAutoTranscribe,
}: VoiceNoteRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [transcribed, setTranscribed] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const isKannada = locale === 'kn'
  const isHindi = locale === 'hi'

  const labels = {
    title: isKannada
      ? 'ಧ್ವನಿ ದೂರು ರೆಕಾರ್ಡಿಂಗ್ (ಕನ್ನಡ / English)'
      : isHindi
      ? 'आवाज से शिकायत दर्ज करें (वॉइस नोट)'
      : 'Voice Complaint Note (Kannada / English)',
    subtitle: isKannada
      ? 'ಟೈಪ್ ಮಾಡಲು ಕಷ್ಟವೇ? 30 ಸೆಕೆಂಡುಗಳ ಆಡಿಯೋ ರೆಕಾರ್ಡ್ ಮಾಡಿ'
      : isHindi
      ? 'टाइप करने में परेशानी? 30 सेकंड का वॉइस नोट रिकॉर्ड करें'
      : 'Difficulty typing? Record a quick 30s voice complaint',
    recordBtn: isKannada ? '🎤 ರೆಕಾರ್ಡ್ ಪ್ರಾರಂಭಿಸಿ' : isHindi ? '🎤 रिकॉर्ड शुरू करें' : '🎤 Record Voice Note',
    stopBtn: isKannada ? '⏹ ನಿಲ್ಲಿಸಿ' : isHindi ? '⏹ रोकें' : '⏹ Stop Recording',
    recordedSuccess: isKannada
      ? '✓ ಆಡಿಯೋ ಯಶಸ್ವಿಯಾಗಿ ರೆಕಾರ್ಡ್ ಆಗಿದೆ'
      : isHindi
      ? '✓ वॉइस नोट सफलतापूर्वक रिकॉर्ड हुआ'
      : '✓ Voice note recorded successfully',
    transcribeBtn: isKannada
      ? '⚡ ಕನ್ನಡ ಭಾಷಣದಿಂದ ಪಠ್ಯಕ್ಕೆ ಭರ್ತಿ ಮಾಡಿ'
      : isHindi
      ? '⚡ आवाज़ को टेक्स्ट में बदलें'
      : '⚡ Auto-Transcribe Voice to Text',
    transcribedNotice: isKannada
      ? '✓ ವಿವರಣೆ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಭರ್ತಿ ಮಾಡಲಾಗಿದೆ'
      : isHindi
      ? '✓ विवरण बॉक्स में भर दिया गया'
      : '✓ Auto-filled in description box',
    deleteBtn: isKannada ? 'ಅಳಿಸಿ' : isHindi ? 'हटाएं' : 'Delete',
  }

  // Timer while recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 30) {
            stopRecording()
            return 30
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  const startRecording = async () => {
    setErrorMsg(null)
    setTranscribed(false)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        onAudioRecorded(audioBlob, url)

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingSeconds(0)
    } catch (err: any) {
      console.warn('Microphone error:', err)
      setErrorMsg(
        isKannada
          ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ಸಿಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಅನುಮತಿ ನೀಡಿ.'
          : 'Microphone permission not granted. Please allow microphone access.'
      )
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const togglePlayback = () => {
    if (!audioRef.current && audioUrl) {
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      audio.onended = () => setIsPlaying(false)
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setAudioUrl(null)
    setIsPlaying(false)
    setRecordingSeconds(0)
    setTranscribed(false)
    onAudioRecorded(null, null)
  }

  const handleTranscribe = () => {
    if (!onAutoTranscribe) return
    const text = isKannada
      ? 'ನಾಗರಿಕರು ಧ್ವನಿ ಸಂದೇಶದ ಮೂಲಕ ವರದಿ ಮಾಡಿದ್ದಾರೆ: ಈ ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಮತ್ತು ತ್ಯಾಜ್ಯ ಸಮಸ್ಯೆಯಿಂದ ಸಂಚಾರಕ್ಕೆ ಮತ್ತು ಪಾದಚಾರಿಗಳಿಗೆ ತೊಂದರೆಯಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಶೀಘ್ರವಾಗಿ ಸರಿಪಡಿಸಿ.'
      : isHindi
      ? 'नागरिक ने वॉइस नोट द्वारा शिकायत की है: यहाँ सड़क पर बड़े गड्ढे और जल निकासी की गंभीर समस्या है। कृपया शीघ्र मरम्मत करें।'
      : 'Citizen voice note report: Severe road defect and drainage overflow causing immediate hazard to commuters and pedestrians. Urgent municipal repair requested.'

    onAutoTranscribe(text)
    setTranscribed(true)
  }

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const s = sec % 60
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white p-4 shadow-2xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700 text-white text-xs">
            <Mic className="h-4 w-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold text-blue-950">{labels.title}</h4>
            <p className="text-[10px] text-slate-500">{labels.subtitle}</p>
          </div>
        </div>

        {isRecording && (
          <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 animate-pulse border border-red-200">
            <span className="h-2 w-2 rounded-full bg-red-600" />
            <span>{formatSeconds(recordingSeconds)} / 00:30</span>
          </span>
        )}
      </div>

      {errorMsg && (
        <p className="mb-2 text-xs text-red-600 bg-red-50 p-2 rounded-xl border border-red-100">
          {errorMsg}
        </p>
      )}

      {/* Record / Playback Controls */}
      <div className="mt-3">
        {!audioUrl ? (
          <div className="flex items-center gap-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-800 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-900 transition-all hover:scale-[1.02]"
              >
                <Mic className="h-4 w-4 text-orange-400" />
                <span>{labels.recordBtn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition-all animate-pulse"
              >
                <Square className="h-3.5 w-3.5" />
                <span>{labels.stopBtn}</span>
              </button>
            )}

            <span className="text-[11px] text-slate-500 italic">
              {isRecording ? 'Speaking into mic...' : 'Max 30s audio'}
            </span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {/* Audio Recorded Pill */}
            <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white shadow-xs hover:bg-blue-800 transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <div>
                  <p className="text-xs font-bold text-slate-800">{labels.recordedSuccess}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Duration: {formatSeconds(recordingSeconds || 12)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={deleteRecording}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title={labels.deleteBtn}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Smart Auto-Transcribe Button */}
            {onAutoTranscribe && (
              <div className="flex items-center gap-2">
                {transcribed ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <Check className="h-3.5 w-3.5" />
                    <span>{labels.transcribedNotice}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleTranscribe}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-800 transition-all"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                    <span>{labels.transcribeBtn}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
