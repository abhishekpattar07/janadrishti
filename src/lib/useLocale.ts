'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export type Locale = 'en' | 'kn' | 'hi'

export const SUPPORTED_LOCALES: { code: Locale; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'हिंदी' },
]

export const LOCALE_CHANGE_EVENT = 'janadrishti-locale-change'

export function useLocale() {
  const router = useRouter()
  const [locale, setLocaleState] = useState<Locale>('en')

  // Sync on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const readLocale = (): Locale => {
      const saved = localStorage.getItem('janadrishti_lang') as Locale | null
      if (saved && ['en', 'kn', 'hi'].includes(saved)) {
        return saved
      }
      const match = document.cookie.match(/locale=([a-z]{2})/)
      if (match && ['en', 'kn', 'hi'].includes(match[1])) {
        return match[1] as Locale
      }
      return 'en'
    }

    setLocaleState(readLocale())

    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent<Locale>
      if (customEvent.detail && ['en', 'kn', 'hi'].includes(customEvent.detail)) {
        setLocaleState(customEvent.detail)
      }
    }

    window.addEventListener(LOCALE_CHANGE_EVENT, handleLocaleChange)
    window.addEventListener('storage', () => {
      setLocaleState(readLocale())
    })

    return () => {
      window.removeEventListener(LOCALE_CHANGE_EVENT, handleLocaleChange)
    }
  }, [])

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (!['en', 'kn', 'hi'].includes(newLocale)) return

      setLocaleState(newLocale)

      if (typeof window !== 'undefined') {
        localStorage.setItem('janadrishti_lang', newLocale)
        document.cookie = `locale=${newLocale};path=/;max-age=31536000`
        window.dispatchEvent(
          new CustomEvent<Locale>(LOCALE_CHANGE_EVENT, { detail: newLocale })
        )
      }

      router.refresh()
    },
    [router]
  )

  return { locale, setLocale, supportedLocales: SUPPORTED_LOCALES }
}
