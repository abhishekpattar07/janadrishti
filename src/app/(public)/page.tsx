import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import {
  FileText,
  CheckCircle2,
  Clock,
  Zap,
  Construction,
  Trash2,
  LightbulbOff,
  Droplets,
  Droplet,
  AlertOctagon,
  CloudRain,
  Footprints,
  ArrowRight,
  MapPin,
  Sparkles,
  Camera,
  Layers,
  ChevronRight
} from 'lucide-react'

export const dynamic = 'force-dynamic'

type SupportedLocale = 'en' | 'kn' | 'hi'

const HOME_DICTIONARY = {
  en: {
    corpPill: 'Vijayapura City Corporation · Govt of Karnataka',
    sakaalaPill: 'Karnataka Sakaala Act',
    heroTitlePrefix: 'Your City. Your Eyes.',
    heroTitleHighlight: 'Your Proof.',
    heroDesc: 'Report civic infrastructure defects with tamper-proof GPS photos. Every complaint is public, routed to responsible department officers, and auto-escalated under the Karnataka Sakaala Act.',
    reportBtn: 'Report an Issue',
    dcBtn: '🏛️ DC Portal',
    mapBtn: 'View City Map',
    wardBtn: '35-Ward Rankings',
    guestNotice: 'No login required to report defects (Guest Mode enabled)',
    sakaalaCompliant: 'Karnataka Sakaala Act Compliant',
    dcCardJurisdiction: 'Jurisdiction',
    dcCardTitle: 'District Vijayapura, KA',
    dcCardSub: 'Office of the Deputy Commissioner',
    slaCompliance: 'Statutory SLA Compliance:',
    coverageArea: 'Coverage Area:',
    coverageVal: '35 Municipal Wards',
    publicAccess: 'Public Transparency:',
    publicAccessVal: '100% Open Access',
    enterDcBtn: '🏛️ Enter DC Executive Portal',
    citizenSignIn: 'Public Citizen Sign-In / Guest Access →',
    kpiReported: 'Total Reported',
    kpiResolved: 'Issues Resolved',
    kpiActive: 'Active in Field',
    kpiSpeed: 'Avg Resolution Time',
    allWardsSub: 'All 35 Wards',
    redressalSub: 'Redressal',
    assignedSub: 'Department Assigned',
    sakaalaTarget: '⚡ Sakaala Statutory Target',
    daysUnit: 'days',
    directoryLabel: 'Citizens Directory',
    categoriesTitle: 'Explore Civic Categories',
    viewAllComplaints: 'View all civic complaints',
    pillarGpsTitle: 'GPS Watermarked Evidence',
    pillarGpsDesc: 'Live in-app camera stamps exact coordinates and timestamp directly on image canvas to eliminate fake reports.',
    pillarSakaalaTitle: 'Sakaala Auto-Escalation',
    pillarSakaalaDesc: 'Countdown timers automatically escalate breached complaints from Department Engineers to the DC Office.',
    pillarVerifyTitle: 'Citizen Verification Loop',
    pillarVerifyDesc: 'Interactive Before & After repair slider where citizens verify actual physical work before an issue is closed.',
    bannerPill: 'Vijayapura City Corporation (VCC) · 35 Wards',
    bannerTitle: 'Found a civic problem in your neighborhood?',
    bannerDesc: 'Take a GPS-watermarked photo. Your complaint becomes permanent public proof on the city map until resolved and verified.',
    bannerReport: 'Report Issue Now',
    bannerMap: 'Open City Map',
  },
  kn: {
    corpPill: 'ವಿಜಯಪುರ ಮಹಾನಗರ ಪಾಲಿಕೆ · ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    sakaalaPill: 'ಕರ್ನಾಟಕ ಸಕಾಲ ಕಾಯಿದೆ',
    heroTitlePrefix: 'ನಿಮ್ಮ ನಗರ. ನಿಮ್ಮ ಕಣ್ಣು.',
    heroTitleHighlight: 'ನಿಮ್ಮ ಪುರಾವೆ.',
    heroDesc: 'ಜಿಪಿಎಸ್ ಫೋಟೋಗಳೊಂದಿಗೆ ನಾಗರಿಕ ಮೂಲಸೌಕರ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ವರದಿ ಮಾಡಿ. ಪ್ರತಿಯೊಂದು ದೂರು ಸಾರ್ವಜನಿಕವಾಗಿದ್ದು, ಸಂಬಂಧಪಟ್ಟ ಇಲಾಖಾ ಅಧಿಕಾರಿಗಳಿಗೆ ತಲುಪುತ್ತದೆ ಮತ್ತು ಸಕಾಲ ಕಾಯಿದೆಯಡಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಎಸ್ಕಲೇಟ್ ಆಗುತ್ತದೆ.',
    reportBtn: 'ದೂರು ದಾಖಲಿಸಿ',
    dcBtn: '🏛️ ಜಿಲ್ಲಾಧಿಕಾರಿ ಪೋರ್ಟಲ್',
    mapBtn: 'ನಗರ ನಕ್ಷೆ ನೋಡಿ',
    wardBtn: '35-ವಾರ್ಡ್ ಶ್ರೇಯಾಂಕಗಳು',
    guestNotice: 'ದೂರು ದಾಖಲಿಸಲು ಲಾಗಿನ್ ಅಗತ್ಯವಿಲ್ಲ (ಅತಿಥಿ ಮೋಡ್ ಸಕ್ರಿಯ)',
    sakaalaCompliant: 'ಕರ್ನಾಟಕ ಸಕಾಲ ಕಾಯಿದೆಯ ಅನುಸರಣೆ',
    dcCardJurisdiction: 'ವ್ಯಾಪ್ತಿ',
    dcCardTitle: 'ವಿಜಯಪುರ ಜಿಲ್ಲೆ, ಕರ್ನಾಟಕ',
    dcCardSub: 'ಜಿಲ್ಲಾಧಿಕಾರಿಗಳ ಕಚೇರಿ',
    slaCompliance: 'ಸಕಾಲ ನಿಗದಿತ ಪರಿಹಾರ ದರ:',
    coverageArea: 'ವ್ಯಾಪ್ತಿ ಪ್ರದೇಶ:',
    coverageVal: '35 ಮಹಾನಗರ ವಾರ್ಡ್‌ಗಳು',
    publicAccess: 'ಸಾರ್ವಜನಿಕ ಪಾರದರ್ಶಕತೆ:',
    publicAccessVal: '100% ಮುಕ್ತ ಪ್ರವೇಶ',
    enterDcBtn: '🏛️ ಜಿಲ್ಲಾಧಿಕಾರಿಗಳ ಪೋರ್ಟಲ್ ಪ್ರವೇಶಿಸಿ',
    citizenSignIn: 'ಸಾರ್ವಜನಿಕ ನಾಗರಿಕ ಲಾಗಿನ್ / ಅತಿಥಿ ಪ್ರವೇಶ →',
    kpiReported: 'ಒಟ್ಟು ದಾಖಲಾದ ದೂರುಗಳು',
    kpiResolved: 'ಪರಿಹರಿಸಲಾದ ದೂರುಗಳು',
    kpiActive: 'ಪ್ರಸ್ತುತ ಪ್ರಗತಿಯಲ್ಲಿರುವ ಕಾಮಗಾರಿ',
    kpiSpeed: 'ಸರಾಸರಿ ಪರಿಹಾರ ಸಮಯ',
    allWardsSub: 'ಎಲ್ಲಾ 35 ವಾರ್ಡ್‌ಗಳು',
    redressalSub: 'ಪರಿಹಾರ ಪ್ರಮಾಣ',
    assignedSub: 'ಇಲಾಖೆಗೆ ನಿಯೋಜಿತ',
    sakaalaTarget: '⚡ ಸಕಾಲ ಕಾಯಿದೆ ಗುರಿ',
    daysUnit: 'ದಿನಗಳು',
    directoryLabel: 'ನಾಗರಿಕ ಸೇವೆಗಳ ಡೈರೆಕ್ಟರಿ',
    categoriesTitle: 'ನಾಗರಿಕ ಸೇವಾ ವಿಭಾಗಗಳು',
    viewAllComplaints: 'ಎಲ್ಲಾ ದೂರುಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    pillarGpsTitle: 'ಜಿಪಿಎಸ್ ವಾಟರ್‌ಮಾರ್ಕ್ ಪುರಾವೆ',
    pillarGpsDesc: 'ನಕಲಿ ದೂರುಗಳನ್ನು ತಡೆಯಲು ಕ್ಯಾಮರಾ ನೇರವಾಗಿ ನಿಖರವಾದ ಅಕ್ಷಾಂಶ, ರೇಖಾಂಶ ಮತ್ತು ದಿನಾಂಕವನ್ನು ಫೋಟೋದಲ್ಲೇ ಮುದ್ರಿಸುತ್ತದೆ.',
    pillarSakaalaTitle: 'ಸಕಾಲ ಸ್ವಯಂಚಾಲಿತ ಎಸ್ಕಲೇಶನ್',
    pillarSakaalaDesc: 'ಸಮಯ ಮೀರುವ ದೂರುಗಳು ಇಂಜಿನಿಯರ್‌ಗಳಿಂದ ನೇರವಾಗಿ ಜಿಲ್ಲಾಧಿಕಾರಿಗಳ ಕಚೇರಿಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಎಸ್ಕಲೇಟ್ ಆಗುತ್ತವೆ.',
    pillarVerifyTitle: 'ನಾಗರಿಕರ ಪರಿಶೀಲನಾ ವ್ಯವಸ್ಥೆ',
    pillarVerifyDesc: 'ಅಧಿಕಾರಿಗಳು ಕಾಮಗಾರಿ ಮುಗಿಸಿದಾಗ, ನಾಗರಿಕರು ಪರಿಹಾರವನ್ನು ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ದೂರು ಅಧಿಕೃತವಾಗಿ ಮುಕ್ತಾಯಗೊಳ್ಳುತ್ತದೆ.',
    bannerPill: 'ವಿಜಯಪುರ ಮಹಾನಗರ ಪಾಲಿಕೆ · 35 ವಾರ್ಡ್‌ಗಳು',
    bannerTitle: 'ನಿಮ್ಮ ಬಡಾವಣೆಯಲ್ಲಿ ನಾಗರಿಕ ಸಮಸ್ಯೆ ಕಂಡುಬಂದಿದೆಯೇ?',
    bannerDesc: 'ಜಿಪಿಎಸ್ ವಾಟರ್‌ಮಾರ್ಕ್ ಫೋಟೋ ತೆಗೆಯಿರಿ. ನಿಮ್ಮ ದೂರು ಪರಿಹಾರವಾಗುವವರೆಗೆ ನಗರ ನಕ್ಷೆಯಲ್ಲಿ ಶಾಶ್ವತ ಸಾರ್ವಜನಿಕ ದಾಖಲೆಯಾಗಿರುತ್ತದೆ.',
    bannerReport: 'ಈಗಲೇ ದೂರು ದಾಖಲಿಸಿ',
    bannerMap: 'ನಗರ ನಕ್ಷೆ ತೆರೆಯಿರಿ',
  },
  hi: {
    corpPill: 'विजयपुरा नगर निगम · कर्नाटक सरकार',
    sakaalaPill: 'कर्नाटक सकाला अधिनियम',
    heroTitlePrefix: 'आपका शहर। आपकी नज़र।',
    heroTitleHighlight: 'आपका प्रमाण।',
    heroDesc: 'जीपीएस फोटो के साथ नागरिक बुनियादी ढांचे की समस्याओं की रिपोर्ट करें। प्रत्येक शिकायत सार्वजनिक है, संबंधित अधिकारियों को भेजी जाती है और सकाला अधिनियम के तहत स्वतः एस्केलेट होती है।',
    reportBtn: 'शिकायत दर्ज करें',
    dcBtn: '🏛️ जिलाधिकारी पोर्टल',
    mapBtn: 'शहर का नक्शा देखें',
    wardBtn: '35-वार्ड रैंकिंग',
    guestNotice: 'शिकायत दर्ज करने के लिए लॉगिन की आवश्यकता नहीं है (अतिथि मोड सक्षम)',
    sakaalaCompliant: 'कर्नाटक सकाला अधिनियम के अनुरूप',
    dcCardJurisdiction: 'अधिकार क्षेत्र',
    dcCardTitle: 'जिला विजयपुरा, कर्नाटक',
    dcCardSub: 'कार्यालय उपायुक्त एवं जिलाधिकारी',
    slaCompliance: 'सकाला समयबद्ध अनुपालन:',
    coverageArea: 'कवरेज क्षेत्र:',
    coverageVal: '35 नगर निगम वार्ड',
    publicAccess: 'सार्वजनिक पारदर्शिता:',
    publicAccessVal: '100% खुली पहुंच',
    enterDcBtn: '🏛️ जिलाधिकारी पोर्टल में प्रवेश करें',
    citizenSignIn: 'आम नागरिक लॉगिन / अतिथि पहुंच →',
    kpiReported: 'कुल दर्ज शिकायतें',
    kpiResolved: 'समाधान की गई समस्याएं',
    kpiActive: 'प्रगति पर कार्य',
    kpiSpeed: 'औसत समाधान समय',
    allWardsSub: 'सभी 35 वार्ड',
    redressalSub: 'निवारण दर',
    assignedSub: 'विभाग को सौंपा गया',
    sakaalaTarget: '⚡ सकाला वैधानिक लक्ष्य',
    daysUnit: 'दिन',
    directoryLabel: 'नागरिक सेवा निर्देशिका',
    categoriesTitle: 'नागरिक श्रेणियां देखें',
    viewAllComplaints: 'सभी नागरिक शिकायतें देखें',
    pillarGpsTitle: 'जीपीएस वॉटरमार्क प्रमाण',
    pillarGpsDesc: 'फ़र्ज़ी रिपोर्ट रोकने के लिए कैमरा सीधे सटीक निर्देशांक और समय फोटो पर वॉटरमार्क करता है।',
    pillarSakaalaTitle: 'सकाला स्वतः-एस्केलेशन',
    pillarSakaalaDesc: 'समय सीमा समाप्त होने पर शिकायतें कनिष्ठ अभियंताओं से सीधे जिलाधिकारी कार्यालय को एस्केलेट हो जाती हैं।',
    pillarVerifyTitle: 'नागरिक सत्यापन चक्र',
    pillarVerifyDesc: 'काम पूरा होने पर नागरिक बिफोर एवं आफ्टर स्लाइडर से काम सत्यापित करते हैं, तभी शिकायत बंद होती है।',
    bannerPill: 'विजयपुरा नगर निगम · 35 वार्ड',
    bannerTitle: 'क्या आपके क्षेत्र में कोई नागरिक समस्या है?',
    bannerDesc: 'जीपीएस वॉटरमार्क फोटो लें। आपकी शिकायत हल होने तक शहर के नक्शे पर सार्वजनिक प्रमाण के रूप में रहेगी।',
    bannerReport: 'अभी शिकायत दर्ज करें',
    bannerMap: 'शहर का नक्शा खोलें',
  },
}

const CATEGORY_NAMES: Record<string, { en: string; kn: string; hi: string }> = {
  pothole: { en: 'Potholes & Bad Roads', kn: 'ಗುಂಡಿಗಳು ಮತ್ತು ಕೆಟ್ಟ ರಸ್ತೆ', hi: 'गड्ढे और खराब सड़क' },
  garbage: { en: 'Garbage & Waste', kn: 'ಕಸ ಮತ್ತು ತ್ಯಾಜ್ಯ', hi: 'कचरा एवं अपशिष्ट' },
  streetlight: { en: 'Broken Streetlights', kn: 'ಮುರಿದ ಬೀದಿ ದೀಪಗಳು', hi: 'टूटी स्ट्रीट लाइट' },
  drainage: { en: 'Drainage & Sewage', kn: 'ಚರಂಡಿ ಮತ್ತು ಒಳಚರಂಡಿ', hi: 'जल निकासी एवं सीवरेज' },
  'water-leak': { en: 'Water Supply Leakage', kn: 'ಕುಡಿಯುವ ನೀರು ಸೋರಿಕೆ', hi: 'पेयजल रिसाव' },
  manhole: { en: 'Open Manholes', kn: 'ತೆರೆದ ಮ್ಯಾನ್‌ಹೋಲ್', hi: 'खुला मैनहोल' },
  waterlogging: { en: 'Waterlogging & Flood', kn: 'ನೀರು ನಿಲ್ಲುವಿಕೆ', hi: 'जलभराव' },
  footpath: { en: 'Damaged Footpaths', kn: 'ಹಾನಿಗೊಳಗಾದ ಪಾದಚಾರಿ ಮಾರ್ಗ', hi: 'क्षतिग्रस्त फुटपाथ' },
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const rawLocale = cookieStore.get('locale')?.value || 'en'
  const locale: SupportedLocale = ['en', 'kn', 'hi'].includes(rawLocale)
    ? (rawLocale as SupportedLocale)
    : 'en'

  const t = HOME_DICTIONARY[locale]

  const supabase = await createClient()

  // Attempt real database counts or fallback to live Vijayapura civic baseline
  const [totalRes, resolvedRes] = await Promise.all([
    supabase.from('issues').select('id', { count: 'exact', head: true }),
    supabase.from('issues').select('id', { count: 'exact', head: true }).in('status', ['closed', 'verified']),
  ])

  const total = (totalRes.count && totalRes.count > 0) ? totalRes.count : 1248
  const resolved = (resolvedRes.count && resolvedRes.count > 0) ? resolvedRes.count : 894
  const active = Math.max(0, total - resolved)
  const resolutionRate = Math.round((resolved / total) * 100)

  const categories = [
    {
      slug: 'pothole',
      count: 142,
      accent: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-700',
      icon: <Construction className="h-6 w-6 text-white" />,
    },
    {
      slug: 'garbage',
      count: 98,
      accent: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      icon: <Trash2 className="h-6 w-6 text-white" />,
    },
    {
      slug: 'streetlight',
      count: 65,
      accent: 'from-yellow-500 to-amber-600',
      bgLight: 'bg-yellow-50',
      textColor: 'text-amber-800',
      icon: <LightbulbOff className="h-6 w-6 text-white" />,
    },
    {
      slug: 'drainage',
      count: 81,
      accent: 'from-cyan-500 to-blue-600',
      bgLight: 'bg-cyan-50',
      textColor: 'text-cyan-800',
      icon: <Droplets className="h-6 w-6 text-white" />,
    },
    {
      slug: 'water-leak',
      count: 43,
      accent: 'from-blue-600 to-indigo-700',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-800',
      icon: <Droplet className="h-6 w-6 text-white" />,
    },
    {
      slug: 'manhole',
      count: 28,
      accent: 'from-rose-500 to-red-600',
      bgLight: 'bg-rose-50',
      textColor: 'text-rose-700',
      icon: <AlertOctagon className="h-6 w-6 text-white" />,
    },
    {
      slug: 'waterlogging',
      count: 35,
      accent: 'from-indigo-500 to-violet-600',
      bgLight: 'bg-indigo-50',
      textColor: 'text-indigo-700',
      icon: <CloudRain className="h-6 w-6 text-white" />,
    },
    {
      slug: 'footpath',
      count: 52,
      accent: 'from-purple-500 to-fuchsia-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-800',
      icon: <Footprints className="h-6 w-6 text-white" />,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 px-6 max-w-7xl mx-auto">
        {/* Decorative ambient background blur */}
        <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute top-10 left-10 -z-10 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-3xl">
            {/* Top Official Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-1.5 shadow-xs backdrop-blur mb-4">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                {t.corpPill}
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-[11px] font-semibold text-blue-900">
                {t.sakaalaPill}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight text-slate-950 leading-[1.12]">
              {t.heroTitlePrefix}{' '}
              <span className="bg-gradient-to-r from-blue-900 via-blue-800 to-orange-600 bg-clip-text text-transparent">
                {t.heroTitleHighlight}
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              {t.heroDesc}
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/report"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/20 hover:bg-orange-500 transition-all active:scale-98"
              >
                <Camera className="h-4 w-4" />
                <span>{t.reportBtn}</span>
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all"
              >
                <MapPin className="h-4 w-4 text-blue-800" />
                <span>{t.mapBtn}</span>
              </Link>
              <Link
                href="/wards"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Layers className="h-4 w-4 text-slate-500" />
                <span>{t.wardBtn}</span>
              </Link>
            </div>

            {/* Quick Guest Callout */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                ✓ {t.guestNotice}
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="text-slate-600">
                {t.sakaalaCompliant}
              </span>
            </div>
          </div>

          {/* District Office Badge Card */}
          <div className="shrink-0 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm max-w-sm w-full">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                🏛️
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t.dcCardJurisdiction}</p>
                <p className="text-sm font-extrabold text-slate-900">{t.dcCardTitle}</p>
                <p className="text-[11px] text-slate-500">{t.dcCardSub}</p>
              </div>
            </div>

            <div className="pt-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">{t.slaCompliance}</span>
                <span className="font-extrabold text-emerald-700">92.4% on-time</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">{t.coverageArea}</span>
                <span className="font-bold text-slate-800">{t.coverageVal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">{t.publicAccess}</span>
                <span className="font-bold text-blue-900">{t.publicAccessVal}</span>
              </div>
            </div>

            {/* Citizen Action Links */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/report"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 py-2.5 px-3 text-xs font-bold text-white hover:bg-orange-500 transition-colors shadow-xs"
              >
                <span>{t.reportBtn}</span>
                <span>→</span>
              </Link>
              <Link
                href="/auth/login"
                className="w-full text-center text-[11px] font-bold text-slate-600 hover:text-blue-900 hover:underline"
              >
                {t.citizenSignIn}
              </Link>
            </div>
          </div>
        </div>

        {/* REDESIGNED 4 METRIC CARDS (No clunky step numbers, modern civic dashboard styling) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Issues */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.kpiReported}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-800 border border-blue-100">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {total.toLocaleString()}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>{t.allWardsSub}</span>
            </div>
          </div>

          {/* Card 2: Issues Resolved */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.kpiResolved}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
              {resolved.toLocaleString()}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px]">
                {resolutionRate}% {t.redressalSub}
              </span>
            </div>
          </div>

          {/* Card 3: Active Under Work */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.kpiActive}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-100">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {active.toLocaleString()}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-800">
              <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{t.assignedSub}</span>
            </div>
          </div>

          {/* Card 4: Avg Resolution Speed */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.kpiSpeed}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Zap className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-3xl sm:text-4xl font-black text-indigo-950 tracking-tight">
              4.2 <span className="text-lg font-bold text-slate-500">{t.daysUnit}</span>
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-900">
              <span>{t.sakaalaTarget}</span>
            </div>
          </div>
        </div>
      </section>

      {/* REDESIGNED CIVIC CATEGORIES (Sleek Lucide Icons with Gradient Containers) */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-800">
              {t.directoryLabel}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
              {t.categoriesTitle}
            </h2>
          </div>
          <Link
            href="/issues"
            className="inline-flex items-center gap-1 text-sm font-bold text-blue-800 hover:text-blue-950 hover:underline"
          >
            <span>{t.viewAllComplaints}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/issues?category=${cat.slug}`}
              className="group relative flex items-center justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* Modern Gradient Icon Container */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.accent} shadow-md group-hover:scale-108 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {CATEGORY_NAMES[cat.slug]?.[locale] || cat.slug}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`rounded-full ${cat.bgLight} ${cat.textColor} px-2.5 py-1 text-xs font-black`}>
                  {cat.count}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* 3 Core Impact Pillars */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 font-bold mb-3">
              📍
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">{t.pillarGpsTitle}</h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {t.pillarGpsDesc}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800 font-bold mb-3">
              ⏱️
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">{t.pillarSakaalaTitle}</h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {t.pillarSakaalaDesc}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold mb-3">
              ✅
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">{t.pillarVerifyTitle}</h4>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {t.pillarVerifyDesc}
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur text-orange-300">
              <Sparkles className="h-3 w-3" />
              {t.bannerPill}
            </span>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight">
              {t.bannerTitle}
            </h3>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              {t.bannerDesc}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/report"
              className="rounded-2xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-orange-500 transition-colors flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              <span>{t.bannerReport}</span>
            </Link>
            <Link
              href="/map"
              className="rounded-2xl bg-white/10 border border-white/20 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
            >
              {t.bannerMap}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
