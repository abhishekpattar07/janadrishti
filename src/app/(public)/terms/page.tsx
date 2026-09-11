import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm font-semibold text-blue-800 hover:underline">← Home</Link>
      <h1 className="mt-4 text-3xl font-extrabold text-slate-900">Terms of Service</h1>
      <p className="mt-1 text-sm text-slate-500">Last updated: September 2026 · JanaDrishti Vijayapura</p>
      
      <div className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-slate-900">1. Purpose of the Platform</h2>
          <p className="mt-1">
            JanaDrishti is a public civic accountability platform designed to allow citizens of Vijayapura, Karnataka to document and track municipal infrastructure problems with verifiable photo and GPS evidence.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">2. Tamper-Proof Evidence & Integrity</h2>
          <p className="mt-1">
            Users agree to capture photos only in real-time at the physical location of the civic defect. Fabricated, misattributed, or doctored media submissions are prohibited and may result in phone account suspension.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">3. Public Transparency</h2>
          <p className="mt-1">
            All submitted reports, locations, photos, and official responses are public records viewable by municipal officials, elected representatives, civil society, and fellow citizens.
          </p>
        </section>
      </div>
    </div>
  )
}
