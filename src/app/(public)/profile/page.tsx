'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLocale } from '@/lib/useLocale'
import { GrievanceReceiptModal } from '@/components/issues/GrievanceReceiptModal'
import { formatIssueNumber } from '@/lib/utils'
import {
  User,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  LogOut,
  MapPin,
  Camera,
  Award,
  Sparkles
} from 'lucide-react'

const PROFILE_DICTIONARY = {
  en: {
    backHome: '← Back to Home',
    title: 'My Civic Dashboard & Profile',
    subtitle: 'Track your reported civic grievances, verified resolutions, and Vijayapura citizen credibility.',
    credibilityTitle: 'Civic Credibility Score',
    credibilityBadge: 'Active Citizen Contributor',
    credibilityHelp: 'Earns +10 points for every genuine defect reported and confirmed fixed under the Karnataka Sakaala Act.',
    kpiReported: 'Complaints Reported',
    kpiResolved: 'Issues Resolved',
    kpiActive: 'Active in Field',
    actionRequiredTitle: 'Action Required: Verification Awaiting Your Approval!',
    actionRequiredDesc: 'The responsible municipal department claims work is completed on your reported issue. Please inspect and confirm resolution.',
    verifyFixBtn: 'Inspect & Verify Fix →',
    myComplaintsTitle: 'My Grievances & Service Requests',
    noComplaintsMsg: 'You have not reported any civic defects yet.',
    reportFirstBtn: '+ Report Your First Issue',
    downloadReceipt: 'Download Sakaala Receipt',
    viewDetails: 'View Issue Details →',
    logoutBtn: 'Sign Out',
    wardLabel: 'Jurisdiction Ward',
  },
  kn: {
    backHome: '← ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    title: 'ನನ್ನ ನಾಗರಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು ಪ್ರೊಫೈಲ್',
    subtitle: 'ನೀವು ಸಲ್ಲಿಸಿದ ದೂರುಗಳು, ಸರಿಪಡಿಸಲಾದ ಕಾಮಗಾರಿಗಳು ಮತ್ತು ನಿಮ್ಮ ನಾಗರಿಕ ಕ್ರೆಡಿಬಿಲಿಟಿ ಸ್ಕೋರ್ ವೀಕ್ಷಿಸಿ.',
    credibilityTitle: 'ನಾಗರಿಕ ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್',
    credibilityBadge: 'ಸಕ್ರಿಯ ನಾಗರಿಕ ಕೊಡುಗೆದಾರ',
    credibilityHelp: 'ಪ್ರತಿಯೊಂದು ನೈಜ ದೂರು ಪರಿಹಾರವಾದಾಗ ಸಕಾಲ ಕಾಯಿದೆಯಡಿ +10 ಅಂಕಗಳು ಸೇರ್ಪಡೆಯಾಗುತ್ತವೆ.',
    kpiReported: 'ದಾಖಲಾದ ದೂರುಗಳು',
    kpiResolved: 'ಪರಿಹರಿಸಲಾದ ದೂರುಗಳು',
    kpiActive: 'ಪ್ರಗತಿಯಲ್ಲಿರುವ ಕಾಮಗಾರಿ',
    actionRequiredTitle: 'ಗಮನಿಸಿ: ನಿಮ್ಮ ಪರಿಶೀಲನೆಗಾಗಿ ಕಾಯುತ್ತಿದೆ!',
    actionRequiredDesc: 'ನೀವು ವರದಿ ಮಾಡಿದ ಸಮಸ್ಯೆಯನ್ನು ಪಾಲಿಕೆ ಅಧಿಕಾರಿಗಳು ಸರಿಪಡಿಸಿದ್ದೇವೆ ಎಂದು ತಿಳಿಸಿದ್ದಾರೆ. ದಯವಿಟ್ಟು ಫೋಟೋ ಪರಿಶೀಲಿಸಿ ದೃಢೀಕರಿಸಿ.',
    verifyFixBtn: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ದೃಢೀಕರಿಸಿ →',
    myComplaintsTitle: 'ನನ್ನ ದೂರುಗಳು ಮತ್ತು ಸೇವಾ ವಿನಂತಿಗಳು',
    noComplaintsMsg: 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ನಾಗರಿಕ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿಲ್ಲ.',
    reportFirstBtn: '+ ಮೊದಲ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ',
    downloadReceipt: 'ಸಕಾಲ ರಶೀದಿ ಡೌನ್‌ಲೋಡ್',
    viewDetails: 'ಪೂರ್ಣ ವಿವರ ನೋಡಿ →',
    logoutBtn: 'ಲಾಗ್ ಔಟ್',
    wardLabel: 'ವ್ಯಾಪ್ತಿ ವಾರ್ಡ್',
  },
  hi: {
    backHome: '← मुख्य पृष्ठ पर वापस जाएं',
    title: 'मेरा नागरिक डैशबोर्ड एवं प्रोफ़ाइल',
    subtitle: 'अपनी दर्ज की गई शिकायतें, समाधान की गई समस्याएं और नागरिक विश्वसनीयता स्कोर देखें।',
    credibilityTitle: 'नागरिक विश्वसनीयता स्कोर',
    credibilityBadge: 'सक्रिय नागरिक योगदानकर्ता',
    credibilityHelp: 'सकाला अधिनियम के तहत प्रत्येक वास्तविक शिकायत के समाधान पर +10 अंक मिलते हैं।',
    kpiReported: 'दर्ज शिकायतें',
    kpiResolved: 'हल की गई समस्याएं',
    kpiActive: 'प्रगति पर कार्य',
    actionRequiredTitle: 'ध्यान दें: आपके सत्यापन की प्रतीक्षा है!',
    actionRequiredDesc: 'नगर निगम विभाग ने आपकी शिकायत का काम पूरा होने का दावा किया है। कृपया फ़ोटो की जांच करें और पुष्टि करें।',
    verifyFixBtn: 'जांचें एवं सत्यापित करें →',
    myComplaintsTitle: 'मेरी शिकायतें एवं सेवा अनुरोध',
    noComplaintsMsg: 'आपने अभी तक कोई नागरिक समस्या दर्ज नहीं की है।',
    reportFirstBtn: '+ पहली समस्या दर्ज करें',
    downloadReceipt: 'सकाला रसीद डाउनलोड करें',
    viewDetails: 'विवरण देखें →',
    logoutBtn: 'लॉग आउट',
    wardLabel: 'वार्ड क्षेत्र',
  },
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const { locale } = useLocale()
  const t = PROFILE_DICTIONARY[locale] || PROFILE_DICTIONARY.en

  const [userName, setUserName] = useState('Citizen of Vijayapura')
  const [userPhone, setUserPhone] = useState('+91 98450 12345')
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('citizen')
  const [credibility, setCredibility] = useState(110)
  const [loading, setLoading] = useState(true)

  // User's Grievances List
  const [userIssues, setUserIssues] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('janadrishti_user_name')
      const storedPhone = localStorage.getItem('janadrishti_user_phone')
      const storedEmail = localStorage.getItem('janadrishti_user_email')
      const storedRole = localStorage.getItem('janadrishti_user_role')

      if (storedName) setUserName(storedName)
      if (storedPhone) setUserPhone(storedPhone)
      if (storedEmail) setUserEmail(storedEmail)
      if (storedRole) setUserRole(storedRole)

      // Fallback sample grievances filed by this user for presentation
      const mockIssues = [
        {
          id: 'sample-1',
          issue_number: 145,
          title: 'Deep crater on Station Road disrupting vehicle traffic',
          status: 'resolution_claimed',
          severity: 'high',
          reported_at: new Date(Date.now() - 3600000 * 36).toISOString(),
          address: 'Station Road, Ward 12 (Gol Gumbaz Area), Vijayapura',
          category: { name: 'Potholes & Bad Roads', name_kn: 'ಗುಂಡಿಗಳು ಮತ್ತು ಕೆಟ್ಟ ರಸ್ತೆ' },
          ward: { ward_number: 12, name: 'Gol Gumbaz Area' },
          department: { name: 'Roads & Infrastructure' },
          sla_complete_by: new Date(Date.now() + 3600000 * 60).toISOString(),
        },
        {
          id: 'sample-2',
          issue_number: 142,
          title: 'Overflowing garbage dump near Gandhi Chowk market',
          status: 'verified',
          severity: 'medium',
          reported_at: new Date(Date.now() - 3600000 * 96).toISOString(),
          address: 'Gandhi Chowk, Ward 11, Vijayapura',
          category: { name: 'Garbage & Waste', name_kn: 'ಕಸ ಮತ್ತು ತ್ಯಾಜ್ಯ' },
          ward: { ward_number: 11, name: 'Gandhi Chowk' },
          department: { name: 'Sanitation & Waste Management' },
          sla_complete_by: new Date(Date.now() - 3600000 * 24).toISOString(),
        }
      ]
      setUserIssues(mockIssues)
      setLoading(false)
    }
  }, [])

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('janadrishti_user_role')
      localStorage.removeItem('janadrishti_user_name')
      localStorage.removeItem('janadrishti_user_phone')
      localStorage.removeItem('janadrishti_user_email')
      localStorage.removeItem('janadrishti_guest_id')
    }
    supabase.auth.signOut().catch(() => {})
    router.push('/')
    router.refresh()
  }

  const reportedCount = userIssues.length
  const resolvedCount = userIssues.filter((i) => ['verified', 'closed'].includes(i.status)).length
  const activeCount = Math.max(0, reportedCount - resolvedCount)

  // Check if any issue requires citizen verification
  const verificationNeededIssue = userIssues.find((i) => i.status === 'resolution_claimed')

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:underline mb-3"
          >
            {t.backHome}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-950 tracking-tight">
                {t.title}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {t.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/report"
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-500 transition-all"
              >
                <Camera className="h-4 w-4" />
                <span>+ Report Issue</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-500" />
                <span>{t.logoutBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Citizen Identity & Credibility Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-900 text-white text-2xl font-black shadow-md">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-950">
                  {userName}
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified Citizen</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                {userEmail || userPhone}
              </p>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-blue-700" />
                <span>Ward 12: Gol Gumbaz Area · Vijayapura</span>
              </p>
            </div>
          </div>

          {/* Gamified Civic Credibility Gauge */}
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 sm:p-5 max-w-sm w-full space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950">
                <Award className="h-4 w-4 text-amber-600" />
                <span>{t.credibilityTitle}</span>
              </div>
              <span className="text-lg font-black text-amber-900">
                ⭐ {credibility} <span className="text-xs font-bold text-amber-700">/ 200 pts</span>
              </span>
            </div>
            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-amber-200/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500"
                style={{ width: `${(credibility / 200) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-900 leading-tight">
              {t.credibilityHelp}
            </p>
          </div>
        </div>

        {/* 3 Personal Civic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.kpiReported}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black text-slate-950">
              {reportedCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Logged in Sakaala Portal
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.kpiResolved}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black text-emerald-600">
              {resolvedCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Confirmed fixed by citizen & VCC
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.kpiActive}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black text-amber-800">
              {activeCount}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Assigned to field engineers
            </p>
          </div>
        </div>

        {/* Action Required: Verification Banner */}
        {verificationNeededIssue && (
          <div className="rounded-3xl border-2 border-dashed border-orange-300 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-600 text-white text-xl shrink-0 shadow-xs">
                  🔍
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-orange-950">
                    {t.actionRequiredTitle}
                  </h3>
                  <p className="text-xs text-slate-700 mt-1 max-w-2xl leading-relaxed">
                    The {verificationNeededIssue.department?.name} has uploaded asphalt repair evidence for your complaint{' '}
                    <strong>{formatIssueNumber(verificationNeededIssue.issue_number)}</strong> on{' '}
                    {verificationNeededIssue.address}.
                  </p>
                </div>
              </div>
              <Link
                href={`/issues/${verificationNeededIssue.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-xs font-extrabold text-white shadow-md hover:bg-orange-500 transition-all shrink-0 active:scale-98"
              >
                <span>{t.verifyFixBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* My Grievances List */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-950">
              {t.myComplaintsTitle}
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              {reportedCount} Total
            </span>
          </div>

          {userIssues.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-sm text-slate-500">{t.noComplaintsMsg}</p>
              <Link
                href="/report"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-500"
              >
                {t.reportFirstBtn}
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 space-y-4">
              {userIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="pt-4 first:pt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-slate-500">
                        {formatIssueNumber(issue.issue_number)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          issue.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : issue.status === 'resolution_claimed'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {issue.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(issue.reported_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{issue.address}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Printable Sakaala Grievance Receipt */}
                    <GrievanceReceiptModal issue={issue} />

                    <Link
                      href={`/issues/${issue.id}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                    >
                      <span>{t.viewDetails}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
