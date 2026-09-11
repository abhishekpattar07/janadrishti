'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLocale, Locale } from '@/lib/useLocale'
import { Globe, ChevronDown, User, LogOut, FileText, ShieldCheck } from 'lucide-react'

const NAV_DICTIONARY = {
  en: {
    map: 'Map',
    issues: 'Issues',
    stats: 'Stats',
    wards: 'Wards',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    myProfile: 'My Profile & Reports',
    adminDashboard: 'Officer Portal',
    citizenBadge: 'Citizen of Vijayapura',
    officerBadge: 'Municipal Officer',
    reportIssue: '+ Report Issue',
  },
  kn: {
    map: 'ನಕ್ಷೆ',
    issues: 'ದೂರುಗಳು',
    stats: 'ಅಂಕಿಅಂಶಗಳು',
    wards: 'ವಾರ್ಡ್‌ಗಳು',
    signIn: 'ಲಾಗಿನ್',
    signOut: 'ಲಾಗ್ ಔಟ್',
    myProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್ ಮತ್ತು ದೂರುಗಳು',
    adminDashboard: 'ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್',
    citizenBadge: 'ವಿಜಯಪುರ ನಾಗರಿಕ',
    officerBadge: 'ಪಾಲಿಕೆ ಅಧಿಕಾರಿ',
    reportIssue: '+ ದೂರು ದಾಖಲಿಸಿ',
  },
  hi: {
    map: 'मानचित्र',
    issues: 'शिकायतें',
    stats: 'सांख्यिकी',
    wards: 'वार्ड',
    signIn: 'लॉगिन',
    signOut: 'लॉग आउट',
    myProfile: 'मेरी प्रोफाइल और शिकायतें',
    adminDashboard: 'अधिकारी पोर्टल',
    citizenBadge: 'विजयपुरा नागरिक',
    officerBadge: 'नगर निगम अधिकारी',
    reportIssue: '+ शिकायत दर्ज करें',
  },
}

export function Navbar() {
  const pathname = usePathname()
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState<{
    name: string
    role: string
    initials: string
  } | null>(null)

  const { locale, setLocale, supportedLocales } = useLocale()

  const currentNav = NAV_DICTIONARY[locale] || NAV_DICTIONARY.en
  const currentLangObj = supportedLocales.find((l) => l.code === locale) || supportedLocales[0]

  useEffect(() => {
    const checkAuth = () => {
      try {
        const citizenName = localStorage.getItem('janadrishti_user_name')
        const officerName = localStorage.getItem('janadrishti_officer_name')
        const role = localStorage.getItem('janadrishti_user_role') || 'citizen'
        const name = citizenName || officerName
        if (name) {
          const initials = name
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
          setUser({ name, role, initials: initials || 'JD' })
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }

    checkAuth()
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [pathname])

  const handleSelectLang = (code: Locale) => {
    setLocale(code)
    setLangOpen(false)
  }

  const handleSignOut = () => {
    try {
      localStorage.removeItem('janadrishti_user_name')
      localStorage.removeItem('janadrishti_user_phone')
      localStorage.removeItem('janadrishti_user_email')
      localStorage.removeItem('janadrishti_user_role')
      localStorage.removeItem('janadrishti_guest_id')
      localStorage.removeItem('janadrishti_officer_dept')
      localStorage.removeItem('janadrishti_officer_name')
    } catch {}
    setUser(null)
    setUserMenuOpen(false)
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/map', label: currentNav.map },
    { href: '/issues', label: currentNav.issues },
    { href: '/stats', label: currentNav.stats },
    { href: '/wards', label: currentNav.wards },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Brand Logo with Official Dual Lockup */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="JanaDrishti Logo"
            className="h-10 w-10 rounded-xl object-contain shadow-xs border border-gray-100"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-extrabold tracking-tight text-blue-950 font-sans">
              JanaDrishti
            </span>
            <span className="text-xs font-bold text-orange-600 -mt-0.5">
              ಜನದೃಷ್ಟಿ
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-semibold transition-colors',
                pathname === link.href
                  ? 'text-blue-900 font-bold'
                  : 'text-gray-600 hover:text-blue-900'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Language Dropdown, User Profile / Sign In, & Quick Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setLangOpen(!langOpen)
                setUserMenuOpen(false)
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-blue-700" />
              <span>{currentLangObj.name}</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-1">
                {supportedLocales.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLang(lang.code)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex items-center justify-between font-medium',
                      locale === lang.code
                        ? 'bg-blue-50 text-blue-900 font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span>{lang.name}</span>
                    {locale === lang.code && <span className="text-xs text-blue-900 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Dropdown (Logged in) OR Sign In Button (Logged out) */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen)
                  setLangOpen(false)
                }}
                className="flex items-center gap-2 rounded-xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-100/60 px-2.5 py-1.5 transition-all text-left group"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user.initials}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-blue-950 max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="h-3 w-3 text-blue-600 group-hover:translate-y-0.5 transition-transform" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-1">
                  {/* User Information Header */}
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {user.role === 'official' || user.role === 'commissioner'
                        ? currentNav.officerBadge
                        : currentNav.citizenBadge}
                    </span>
                  </div>

                  {/* Menu Links */}
                  <div className="py-1 space-y-0.5">
                    {user.role === 'official' || user.role === 'commissioner' ? (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-900 rounded-xl transition-colors"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                        <span>{currentNav.adminDashboard}</span>
                      </Link>
                    ) : (
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-900 rounded-xl transition-colors"
                      >
                        <User className="h-3.5 w-3.5 text-blue-600" />
                        <span>{currentNav.myProfile}</span>
                      </Link>
                    )}

                    <Link
                      href="/issues"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <FileText className="h-3.5 w-3.5 text-gray-500" />
                      <span>{currentNav.issues}</span>
                    </Link>
                  </div>

                  {/* Sign Out Button */}
                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                    >
                      <LogOut className="h-3.5 w-3.5 text-rose-500" />
                      <span>{currentNav.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs"
            >
              <User className="h-3.5 w-3.5 text-slate-500" />
              <span>{currentNav.signIn}</span>
            </Link>
          )}

          {/* Saffron Report Issue Pill Button */}
          <Link
            href="/report"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-orange-600 hover:to-orange-700 transition-all hover:shadow hover:-translate-y-0.5"
          >
            <span>{currentNav.reportIssue}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

