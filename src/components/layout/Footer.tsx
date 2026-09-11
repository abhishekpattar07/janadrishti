'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/useLocale'

const FOOTER_DICTIONARY = {
  en: {
    tagline: 'Your city. Your eyes. Your proof. · Govt of Karnataka',
    citizenPortal: 'Citizen Portal',
    wardRankings: '35-Ward Rankings',
    cityMap: 'City Map',
    slaStats: 'SLA Statistics',
    officialLogin: 'Official Sign-In',
    copyrightSub: 'Civic Technology & Accountability Platform for Vijayapura, Karnataka.',
    sakaalaNotice: 'Built in compliance with the Karnataka Guarantee of Services to Citizens (Sakaala) Act.',
  },
  kn: {
    tagline: 'ನಿಮ್ಮ ನಗರ. ನಿಮ್ಮ ಕಣ್ಣು. ನಿಮ್ಮ ಪುರಾವೆ. · ಕರ್ನಾಟಕ ಸರ್ಕಾರ',
    citizenPortal: 'ಸಾರ್ವಜನಿಕ ನಾಗರಿಕ ಪೋರ್ಟಲ್',
    wardRankings: '35-ವಾರ್ಡ್ ಶ್ರೇಯಾಂಕಗಳು',
    cityMap: 'ನಗರ ನಕ್ಷೆ',
    slaStats: 'ಸಕಾಲ ಅಂಕಿಅಂಶಗಳು',
    officialLogin: 'ಅಧಿಕಾರಿಗಳ ಲಾಗಿನ್',
    copyrightSub: 'ವಿಜಯಪುರ ಮಹಾನಗರ ಪಾಲಿಕೆ ನಾಗರಿಕ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಉತ್ತರದಾಯಿತ್ವ ವೇದಿಕೆ.',
    sakaalaNotice: 'ಕರ್ನಾಟಕ ನಾಗರಿಕ ಸೇವೆಗಳ ಖಾತರಿ (ಸಕಾಲ) ಕಾಯಿದೆಯ ಅನುಸರಣೆಯಲ್ಲಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆ.',
  },
  hi: {
    tagline: 'आपका शहर। आपकी नज़र। आपका प्रमाण। · कर्नाटक सरकार',
    citizenPortal: 'नागरिक पोर्टल',
    wardRankings: '35-वार्ड रैंकिंग',
    cityMap: 'शहर का नक्शा',
    slaStats: 'सकाला सांख्यिकी',
    officialLogin: 'अधिकारी लॉगिन',
    copyrightSub: 'विजयपुरा नगर निगम नागरिक प्रौद्योगिकी एवं जवाबदेही मंच।',
    sakaalaNotice: 'कर्नाटक नागरिक सेवा गारंटी (सकाला) अधिनियम के अनुपालन में विकसित।',
  },
}

export function Footer() {
  const { locale } = useLocale()
  const t = FOOTER_DICTIONARY[locale] || FOOTER_DICTIONARY.en

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-10 mt-auto">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="JanaDrishti Official Logo"
              className="h-10 w-10 rounded-xl object-contain shadow-xs border border-slate-200 bg-white p-0.5"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base">JanaDrishti</span>
                <span className="font-bold text-orange-600 text-xs">ಜನದೃಷ್ಟಿ</span>
              </div>
              <p className="text-xs text-slate-500">{t.tagline}</p>
            </div>
          </div>

          {/* Clean Single-Language Navigation Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
            <Link href="/auth/login" className="hover:text-blue-900 transition-colors">
              {t.citizenPortal}
            </Link>
            <Link href="/wards" className="hover:text-blue-900 transition-colors">
              {t.wardRankings}
            </Link>
            <Link href="/map" className="hover:text-blue-900 transition-colors">
              {t.cityMap}
            </Link>
            <Link href="/stats" className="hover:text-blue-900 transition-colors">
              {t.slaStats}
            </Link>
            <Link href="/auth/login?portal=official" className="text-slate-400 hover:text-slate-700 transition-colors font-normal">
              {t.officialLogin}
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/80 pt-5 text-center text-xs text-slate-400 leading-relaxed">
          © {new Date().getFullYear()} JanaDrishti — {t.copyrightSub}
          <br />
          {t.sakaalaNotice}
        </div>
      </div>
    </footer>
  )
}
