import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userRole = 'official'
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role) userRole = profile.role
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans">
      {/* Official Government Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B1528] text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          {/* Logo & Department Crest */}
          <div className="flex items-center gap-3.5">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="JanaDrishti Logo"
                className="h-9 w-9 rounded-xl object-contain bg-white p-0.5"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-base tracking-tight">JanaDrishti</span>
                  <span className="rounded-md bg-orange-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    Officer Portal
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Vijayapura City Corporation (VCC) · ಕರ್ನಾಟಕ ಸರ್ಕಾರ
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Officer Persona Switcher & Public Switch */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="hidden md:flex items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-1.5 border border-slate-700">
              <span className="text-slate-400 font-normal">Active Role:</span>
              <span className="text-emerald-400 font-bold">● Section Officer (Roads & Infra)</span>
            </div>

            <Link
              href="/admin"
              className="rounded-lg bg-blue-800 px-3 py-1.5 text-white hover:bg-blue-700 transition-colors"
            >
              Issue Queue
            </Link>

            <Link
              href="/stats"
              className="hidden sm:block text-slate-300 hover:text-white transition-colors"
            >
              City Analytics
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              🌐 Public Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Official Content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
