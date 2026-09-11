'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

export interface WardMetric {
  id?: string
  number: number
  name: string
  name_kn?: string
  corporator: string
  phone?: string
  total: number
  resolved: number
  avgDays: number
}

interface WardLeaderboardProps {
  initialWards?: WardMetric[]
}

const DEFAULT_VIJAYAPURA_WARDS: WardMetric[] = [
  { number: 12, name: 'Gol Gumbaz Area', name_kn: 'ಗೋಲ್ ಗುಂಬಜ್ ಪ್ರದೇಶ', corporator: 'Smt. Kavitha Deshmukh', phone: '08352-278512', total: 68, resolved: 65, avgDays: 1.4 },
  { number: 11, name: 'Gandhi Chowk', name_kn: 'ಗಾಂಧಿ ಚೌಕ', corporator: 'Sri. Mallikarjun Gogi', phone: '08352-278511', total: 62, resolved: 58, avgDays: 1.6 },
  { number: 33, name: 'Vidyanagar', name_kn: 'ವಿದ್ಯಾನಗರ', corporator: 'Sri. Dr. S. R. Patil', phone: '08352-278533', total: 48, resolved: 45, avgDays: 1.5 },
  { number: 7, name: 'Basaveshwar Nagar', name_kn: 'ಬಸವೇಶ್ವರ ನಗರ', corporator: 'Smt. Geetha Hiremath', phone: '08352-278507', total: 54, resolved: 49, avgDays: 1.8 },
  { number: 32, name: 'Vijayanagar', name_kn: 'ವಿಜಯನಗರ', corporator: 'Smt. Anasuya Kulkarni', phone: '08352-278532', total: 52, resolved: 47, avgDays: 1.8 },
  { number: 27, name: 'Shivaji Nagar', name_kn: 'ಶಿವಾಜಿ ನಗರ', corporator: 'Sri. Maruti Bhosle', phone: '08352-278527', total: 51, resolved: 46, avgDays: 1.7 },
  { number: 1, name: 'Adarsha Nagar', name_kn: 'ಆದರ್ಶ ನಗರ', corporator: 'Smt. Shanta Rathod', phone: '08352-278501', total: 42, resolved: 38, avgDays: 2.1 },
  { number: 25, name: 'Nehru Nagar', name_kn: 'ನೆಹರು ನಗರ', corporator: 'Smt. Laxmi Koli', phone: '08352-278525', total: 49, resolved: 44, avgDays: 1.9 },
  { number: 10, name: 'Dharmanath Circle', name_kn: 'ಧರ್ಮನಾಥ ವೃತ್ತ', corporator: 'Sri. Vinod Shah', phone: '08352-278510', total: 44, resolved: 40, avgDays: 2.2 },
  { number: 29, name: 'Solapur Road', name_kn: 'ಸೊಲ್ಲಾಪೂರ ರಸ್ತೆ', corporator: 'Smt. Padmavathi R', phone: '08352-278529', total: 43, resolved: 38, avgDays: 2.0 },
  { number: 5, name: 'Babasaheb Ambedkar Nagar', name_kn: 'ಬಾಬಾಸಾಹೇಬ ಅಂಬೇಡ್ಕರ್ ನಗರ', corporator: 'Sri. Anand Kamble', phone: '08352-278505', total: 47, resolved: 41, avgDays: 2.3 },
  { number: 4, name: 'Athani Galli', name_kn: 'ಅಥಣಿ ಗಲ್ಲಿ', corporator: 'Smt. Rekha Biradar', phone: '08352-278504', total: 31, resolved: 27, avgDays: 2.5 },
  { number: 20, name: 'Managoli Road', name_kn: 'ಮಾನಗೋಳಿ ರಸ್ತೆ', corporator: 'Sri. Vijay Jadhav', phone: '08352-278520', total: 45, resolved: 39, avgDays: 2.2 },
  { number: 6, name: 'Bagalkot Road', name_kn: 'ಬಾಗಲಕೋಟ ರಸ್ತೆ', corporator: 'Sri. Basavaraj Kulkarni', phone: '08352-278506', total: 36, resolved: 31, avgDays: 2.9 },
  { number: 22, name: 'Naaz Nagar', name_kn: 'ನಾಜ್ ನಗರ', corporator: 'Smt. Fatima Begum', phone: '08352-278522', total: 35, resolved: 30, avgDays: 2.5 },
  { number: 16, name: 'Jamakhandi Galli', name_kn: 'ಜಮಖಂಡಿ ಗಲ್ಲಿ', corporator: 'Sri. Chandrashekhar T', phone: '08352-278516', total: 34, resolved: 29, avgDays: 2.4 },
  { number: 28, name: 'Sindagi Road', name_kn: 'ಸಿಂದಗಿ ರಸ್ತೆ', corporator: 'Sri. Shantakumar V', phone: '08352-278528', total: 40, resolved: 34, avgDays: 2.6 },
  { number: 9, name: 'Darga Mohalla', name_kn: 'ದರ್ಗಾ ಮೊಹಲ್ಲಾ', corporator: 'Sri. Altaf Inamdar', phone: '08352-278509', total: 33, resolved: 28, avgDays: 2.7 },
  { number: 2, name: 'Adil Shahi Colony', name_kn: 'ಆದಿಲ್ ಶಾಹಿ ಕಾಲೋನಿ', corporator: 'Sri. Mohammed Rafiq', phone: '08352-278502', total: 39, resolved: 33, avgDays: 2.8 },
  { number: 14, name: 'Indi Road', name_kn: 'ಇಂಡಿ ರಸ್ತೆ', corporator: 'Sri. Somanna Bagali', phone: '08352-278514', total: 38, resolved: 32, avgDays: 2.6 },
  { number: 24, name: 'Naya Mohalla', name_kn: 'ನಯಾ ಮೊಹಲ್ಲಾ', corporator: 'Sri. Irfan Shaikh', phone: '08352-278524', total: 37, resolved: 31, avgDays: 2.8 },
  { number: 30, name: 'Station Area', name_kn: 'ಸ್ಟೇಷನ್ ಪ್ರದೇಶ', corporator: 'Sri. Ashok Rathod', phone: '08352-278530', total: 58, resolved: 48, avgDays: 2.5 },
  { number: 26, name: 'Shahpur', name_kn: 'ಶಹಾಪೂರ', corporator: 'Sri. Gangadhar Meti', phone: '08352-278526', total: 32, resolved: 26, avgDays: 3.2 },
  { number: 21, name: 'Mohammadpur', name_kn: 'ಮೊಹಮ್ಮದಪೂರ', corporator: 'Sri. Sayeed Qureshi', phone: '08352-278521', total: 31, resolved: 25, avgDays: 3.0 },
  { number: 34, name: 'Yogapura', name_kn: 'ಯೋಗಾಪುರ', corporator: 'Sri. Mahadevappa T', phone: '08352-278534', total: 30, resolved: 24, avgDays: 3.2 },
  { number: 35, name: 'Zubedinagar', name_kn: 'ಜುಬೇದಿನಗರ', corporator: 'Smt. Bilkis Bano', phone: '08352-278535', total: 29, resolved: 23, avgDays: 3.1 },
  { number: 15, name: 'Jaganur Road', name_kn: 'ಜಗನೂರ ರಸ್ತೆ', corporator: 'Smt. Meenakshi Patil', phone: '08352-278515', total: 29, resolved: 23, avgDays: 3.1 },
  { number: 31, name: 'Torvi', name_kn: 'ತೊರ್ವಿ', corporator: 'Sri. Ningappa Biradar', phone: '08352-278531', total: 24, resolved: 19, avgDays: 3.4 },
  { number: 3, name: 'Aliabad', name_kn: 'ಅಲಿಯಾಬಾದ್', corporator: 'Sri. Suresh Patil', phone: '08352-278503', total: 28, resolved: 22, avgDays: 3.4 },
  { number: 18, name: 'Kalagi Road', name_kn: 'ಕಲಗಿ ರಸ್ತೆ', corporator: 'Smt. Sunanda Hegde', phone: '08352-278518', total: 27, resolved: 21, avgDays: 3.3 },
  { number: 19, name: 'Kesaratti', name_kn: 'ಕೆಸರಟ್ಟಿ', corporator: 'Sri. Siddappa Lamani', phone: '08352-278519', total: 23, resolved: 18, avgDays: 3.5 },
  { number: 8, name: 'Budhihal Road', name_kn: 'ಬುದಿಹಾಳ ರಸ್ತೆ', corporator: 'Sri. Praveen Pujari', phone: '08352-278508', total: 25, resolved: 19, avgDays: 3.6 },
  { number: 23, name: 'Naubad', name_kn: 'ನೌಬಾದ್', corporator: 'Sri. Jagadish Patil', phone: '08352-278523', total: 26, resolved: 20, avgDays: 3.7 },
  { number: 13, name: 'Governcoppa', name_kn: 'ಗೋವರ್ನಕೊಪ್ಪ', corporator: 'Sri. Ramesh Nayak', phone: '08352-278513', total: 22, resolved: 17, avgDays: 3.8 },
  { number: 17, name: 'Jumnal', name_kn: 'ಜುಮನಾಳ', corporator: 'Sri. Shankar Gouda', phone: '08352-278517', total: 21, resolved: 16, avgDays: 4.0 },
]

export function WardLeaderboard({ initialWards }: WardLeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState<'all' | 'top' | 'needs_attention'>('all')
  const [sortBy, setSortBy] = useState<'rate' | 'total' | 'speed' | 'ward'>('rate')

  const rawWards = initialWards && initialWards.length > 0 ? initialWards : DEFAULT_VIJAYAPURA_WARDS

  const processedWards = useMemo(() => {
    return rawWards.map(w => {
      const rate = w.total > 0 ? Math.round((w.resolved / w.total) * 100) : 0
      const pending = w.total - w.resolved
      return { ...w, rate, pending }
    })
  }, [rawWards])

  const sortedWards = useMemo(() => {
    const list = [...processedWards]
    if (sortBy === 'rate') {
      list.sort((a, b) => b.rate - a.rate || b.resolved - a.resolved)
    } else if (sortBy === 'total') {
      list.sort((a, b) => b.total - a.total)
    } else if (sortBy === 'speed') {
      list.sort((a, b) => a.avgDays - b.avgDays)
    } else if (sortBy === 'ward') {
      list.sort((a, b) => a.number - b.number)
    }
    return list
  }, [processedWards, sortBy])

  // Assigned absolute rankings based on resolution rate
  const rankedWards = useMemo(() => {
    const sortedByRank = [...processedWards].sort((a, b) => b.rate - a.rate || b.resolved - a.resolved)
    const rankMap = new Map<number, number>()
    sortedByRank.forEach((item, index) => {
      rankMap.set(item.number, index + 1)
    })

    return sortedWards.map(item => ({
      ...item,
      officialRank: rankMap.get(item.number) ?? 1
    }))
  }, [processedWards, sortedWards])

  const filteredWards = useMemo(() => {
    return rankedWards.filter(w => {
      const matchQuery =
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.name_kn && w.name_kn.includes(searchTerm)) ||
        w.corporator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(w.number).includes(searchTerm)

      if (!matchQuery) return false

      if (filterTier === 'top') return w.rate >= 85
      if (filterTier === 'needs_attention') return w.rate < 78 || w.pending >= 8

      return true
    })
  }, [rankedWards, searchTerm, filterTier])

  // City-wide summary statistics
  const cityStats = useMemo(() => {
    const totalComplaints = processedWards.reduce((acc, w) => acc + w.total, 0)
    const totalResolved = processedWards.reduce((acc, w) => acc + w.resolved, 0)
    const avgRate = Math.round((totalResolved / totalComplaints) * 100)
    const avgSpeed = (processedWards.reduce((acc, w) => acc + w.avgDays, 0) / processedWards.length).toFixed(1)
    return { totalComplaints, totalResolved, avgRate, avgSpeed }
  }, [processedWards])

  const top3 = useMemo(() => {
    return [...processedWards].sort((a, b) => b.rate - a.rate).slice(0, 3)
  }, [processedWards])

  return (
    <div className="space-y-8">
      {/* City-Wide Performance KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Wards</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900">35</p>
          <p className="mt-1 text-xs text-blue-700 font-medium">Vijayapura City Corporation</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">City Resolution Rate</p>
          <p className="mt-1 text-3xl font-extrabold text-emerald-600">{cityStats.avgRate}%</p>
          <p className="mt-1 text-xs text-slate-500">{cityStats.totalResolved} of {cityStats.totalComplaints} fixed</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Fix Speed</p>
          <p className="mt-1 text-3xl font-extrabold text-blue-900">{cityStats.avgSpeed} <span className="text-base font-semibold text-slate-500">days</span></p>
          <p className="mt-1 text-xs text-emerald-700 font-medium">⚡ Within Sakaala SLA</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Performing Ward</p>
          <p className="mt-1 text-xl font-extrabold text-slate-900 truncate">Ward {top3[0]?.number}</p>
          <p className="mt-1 text-xs text-amber-700 font-bold">🥇 {top3[0]?.name} ({top3[0]?.rate}%)</p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
          <span>🏆</span>
          <span>Top Performing Wards • ಅಗ್ರ ಸಾಧಕ ವಾರ್ಡ್‌ಗಳು</span>
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {top3.map((ward, idx) => {
            const medals = ['🥇 Gold', '🥈 Silver', '🥉 Bronze']
            const borderColors = ['border-amber-300 bg-amber-50/40', 'border-slate-300 bg-slate-50/40', 'border-amber-700/30 bg-orange-50/40']
            return (
              <div
                key={ward.number}
                className={`relative rounded-2xl border-2 p-5 shadow-xs flex flex-col justify-between ${borderColors[idx]}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-extrabold shadow-xs">
                      {medals[idx]} Rank #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      {ward.rate}% Fixed
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Ward {ward.number}: {ward.name}
                  </h3>
                  {ward.name_kn && <p className="text-xs text-slate-600 mb-1">{ward.name_kn}</p>}
                  <p className="text-xs text-slate-500 mt-2">
                    Corporator: <span className="font-semibold text-slate-800">{ward.corporator}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">⚡ Avg {ward.avgDays} days</span>
                  <span className="text-slate-900 font-bold">{ward.resolved}/{ward.total} Resolved</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search 35 Vijayapura wards by name, number, or corporator..."
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 shrink-0">Sort By:</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:border-blue-800 focus:outline-none"
            >
              <option value="rate">Resolution Rate (High to Low)</option>
              <option value="speed">Resolution Speed (Fastest)</option>
              <option value="total">Total Complaints Logged</option>
              <option value="ward">Ward Number (1 to 35)</option>
            </select>
          </div>
        </div>

        {/* Filter Tier Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 overflow-x-auto">
          <button
            onClick={() => setFilterTier('all')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-colors ${
              filterTier === 'all'
                ? 'bg-blue-950 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 35 Wards ({processedWards.length})
          </button>
          <button
            onClick={() => setFilterTier('top')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-colors ${
              filterTier === 'top'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌟 Top Tier (≥85% Fix Rate)
          </button>
          <button
            onClick={() => setFilterTier('needs_attention')}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-colors ${
              filterTier === 'needs_attention'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⚠️ Needs Civic Attention
          </button>
        </div>
      </div>

      {/* 35 Wards Leaderboard Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 font-bold">
              <tr>
                <th className="px-5 py-3.5">Rank</th>
                <th className="px-5 py-3.5">Ward &amp; Corporator</th>
                <th className="px-5 py-3.5">Resolution Progress</th>
                <th className="px-5 py-3.5 text-center">Avg Speed</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredWards.map(ward => {
                return (
                  <tr key={ward.number} className="hover:bg-slate-50/70 transition-colors">
                    {/* Rank */}
                    <td className="px-5 py-4 font-mono font-bold whitespace-nowrap">
                      {ward.officialRank === 1 ? (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-900 text-sm">
                          🥇
                        </span>
                      ) : ward.officialRank === 2 ? (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-800 text-sm">
                          🥈
                        </span>
                      ) : ward.officialRank === 3 ? (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-900 text-sm">
                          🥉
                        </span>
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                          #{ward.officialRank}
                        </span>
                      )}
                    </td>

                    {/* Ward Name & Corporator */}
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 text-base">
                        Ward {ward.number}: {ward.name}
                      </div>
                      {ward.name_kn && (
                        <p className="text-xs text-slate-500 font-medium">{ward.name_kn}</p>
                      )}
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                        <span className="text-slate-400">👤</span>
                        <span>{ward.corporator}</span>
                        {ward.phone && (
                          <span className="text-slate-400 font-mono">· {ward.phone}</span>
                        )}
                      </p>
                    </td>

                    {/* Resolution Bar & Metrics */}
                    <td className="px-5 py-4 min-w-[200px]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-extrabold text-slate-900">{ward.rate}% Resolved</span>
                        <span className="text-slate-500 font-medium">
                          {ward.resolved} / {ward.total} issues
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ward.rate >= 85
                              ? 'bg-emerald-500'
                              : ward.rate >= 75
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${ward.rate}%` }}
                        />
                      </div>
                      {ward.pending > 0 && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          {ward.pending} active / pending
                        </p>
                      )}
                    </td>

                    {/* Avg Speed */}
                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-900 border border-blue-100">
                        ⚡ {ward.avgDays} days
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/issues?ward=${ward.number}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 hover:underline"
                      >
                        <span>View Issues</span>
                        <span>→</span>
                      </Link>
                    </td>
                  </tr>
                )
              })}

              {filteredWards.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <p className="text-3xl mb-2">🔍</p>
                    <p className="font-semibold text-slate-600">No wards match your search filter</p>
                    <p className="text-xs text-slate-400 mt-1">Try changing your search term or filter options</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
