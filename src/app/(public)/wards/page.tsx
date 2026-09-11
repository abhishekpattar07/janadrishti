import { createClient } from '@/lib/supabase/server'
import { WardLeaderboard } from '@/components/wards/WardLeaderboard'

export const dynamic = 'force-dynamic'

export default async function WardsPage() {
  const supabase = await createClient()
  const { data: wards } = await supabase
    .from('wards')
    .select('*')
    .order('ward_number')

  // Map supabase wards if available
  const mappedWards = wards && wards.length > 0 ? wards.map((w: any) => ({
    id: w.id,
    number: w.ward_number,
    name: w.name,
    name_kn: w.name_kn,
    corporator: w.corporator_name ?? 'Elected Ward Representative',
    phone: w.corporator_phone ?? '08352-278539',
    total: 35,
    resolved: 29,
    avgDays: 2.2,
  })) : undefined

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900">
            35 Municipal Wards
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            Karnataka Sakaala Public Accountability
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-950">
          Vijayapura Ward Performance Leaderboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          ವಿಜಯಪುರ ಮಹಾನಗರ ಪಾಲಿಕೆ · 35 Wards Civic Ranking &amp; Redressal Efficiency
        </p>
      </div>

      <WardLeaderboard initialWards={mappedWards} />
    </div>
  )
}

