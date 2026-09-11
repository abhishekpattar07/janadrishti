'use client'

import { useState, useTransition } from 'react'

const LOCALES = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ', full: 'Kannada' },
  { code: 'hi', label: 'हिं', full: 'Hindi' },
]

export function LanguageSwitcher() {
  const [current, setCurrent] = useState('en')
  const [, startTransition] = useTransition()

  const handleChange = (code: string) => {
    startTransition(() => {
      document.cookie = `locale=${code};path=/;max-age=31536000`
      setCurrent(code)
      window.location.reload()
    })
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
      {LOCALES.map((locale) => (
        <button
          key={locale.code}
          onClick={() => handleChange(locale.code)}
          title={locale.full}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            current === locale.code
              ? 'bg-white text-blue-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {locale.label}
        </button>
      ))}
    </div>
  )
}
