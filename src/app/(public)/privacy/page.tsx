import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm font-semibold text-blue-800 hover:underline">← Home</Link>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
      <p className="mt-1 text-sm text-slate-500">Compliance with Digital Personal Data Protection Act (DPDPA 2023)</p>
      
      <div className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-slate-900">1. Citizen Identity Protection</h2>
          <p className="mt-1">
            We collect only your mobile number for SMS OTP verification. You may choose to report any complaint <strong>anonymously</strong>, ensuring your name and contact details are shielded from public view and official harassment.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">2. Geolocation & Media</h2>
          <p className="mt-1">
            Location data (GPS latitude/longitude) is captured solely to map the civic problem to Vijayapura&apos;s 35 municipal wards. Background tracking is never performed.
          </p>
        </section>
      </div>
    </div>
  )
}
