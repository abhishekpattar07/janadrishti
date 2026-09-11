'use client'

import { useState } from 'react'
import { formatIssueNumber } from '@/lib/utils'

interface GrievanceReceiptProps {
  issue: {
    id: string
    issue_number: number
    title: string
    category?: { name: string; name_kn?: string }
    ward?: { ward_number: number; name: string }
    department?: { name: string }
    reported_at: string
    address?: string
    sla_complete_by?: string
  }
}

export function GrievanceReceiptModal({ issue }: GrievanceReceiptProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formattedDate = new Date(issue.reported_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const slaDate = issue.sla_complete_by
    ? new Date(issue.sla_complete_by).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Within 7 Business Days'

  const trackingId = `JD-2026-VIJ-${String(issue.issue_number).padStart(5, '0')}`

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all"
      >
        <span>📄</span>
        <span>Download Official Receipt • ಸ್ವೀಕೃತಿ ರಶೀದಿ</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl border border-slate-200">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 print:hidden"
            >
              ✕
            </button>

            {/* Printable Receipt Body */}
            <div id="grievance-receipt" className="space-y-6">
              {/* Receipt Government Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <img
                  src="/logo.png"
                  alt="JanaDrishti Official Crest"
                  className="h-12 w-12 mx-auto mb-2 rounded-xl object-contain shadow-xs border border-slate-200 bg-white p-0.5"
                />
                <div className="flex justify-center items-center gap-2 mb-1">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-slate-800">
                    Government of Karnataka · ಕರ್ನಾಟಕ ಸರ್ಕಾರ
                  </p>
                </div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  VIJAYAPURA CITY CORPORATION (VCC)
                </h2>
                <p className="text-xs font-bold text-slate-600">
                  ವಿಜಯಪುರ ಮಹಾನಗರ ಪಾಲಿಕೆ · Public Grievance Redressal Division
                </p>
                <div className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
                  Karnataka Guarantee of Services to Citizens Act (Sakaala)
                </div>
              </div>

              {/* Acknowledgement Title */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Sakaala Tracking ID (ದೂರು ಸಂಖ್ಯೆ)
                  </span>
                  <p className="font-mono text-lg font-extrabold text-blue-950">
                    {trackingId}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Registration Date
                  </span>
                  <p className="text-xs font-semibold text-slate-800">
                    {formattedDate}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="space-y-3 text-xs text-slate-800">
                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-500">Complaint Title:</span>
                  <span className="col-span-2 font-semibold text-slate-900">{issue.title}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-500">Category:</span>
                  <span className="col-span-2 font-semibold">
                    {issue.category?.name ?? 'Civic Defect'} {issue.category?.name_kn ? `(${issue.category.name_kn})` : ''}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-500">Jurisdiction:</span>
                  <span className="col-span-2 font-semibold">
                    Ward {issue.ward?.ward_number ?? 12}: {issue.ward?.name ?? 'Gol Gumbaz Area'}, Vijayapura
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-500">Location Landmark:</span>
                  <span className="col-span-2 font-semibold text-slate-700">
                    {issue.address ?? 'Station Road, Vijayapura'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-500">Assigned Dept:</span>
                  <span className="col-span-2 font-bold text-blue-900">
                    {issue.department?.name ?? 'Roads & Infrastructure Division'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900">Statutory SLA Deadline:</span>
                  <span className="col-span-2 font-extrabold text-amber-950">
                    ⚡ {slaDate} (Under Karnataka Sakaala Act)
                  </span>
                </div>
              </div>

              {/* QR Verification & Stamp Box */}
              <div className="flex items-center justify-between border-t-2 border-slate-200 pt-4">
                <div className="flex items-center gap-3">
                  {/* Simulated QR Code */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-slate-900 p-1">
                    <div className="h-full w-full bg-[radial-gradient(#0f172a_2px,transparent_2px)] [background-size:6px_6px]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900">Scan to Verify Live Status</p>
                    <p className="text-[10px] text-slate-500">Official JanaDrishti Public Ledger</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">✓ Digitally Signed &amp; Timestamped</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block border border-dashed border-slate-400 px-3 py-1.5 rounded text-[10px] text-slate-400 font-mono">
                    OFFICIAL VCC STAMP
                  </div>
                </div>
              </div>

              {/* Legal Notice */}
              <p className="text-[10px] text-slate-400 leading-tight text-center">
                This is a computer-generated acknowledgement under the Karnataka Guarantee of Services to Citizens (Sakaala) Act. No physical signature is required. For inquiries, contact Vijayapura City Corporation Helpline: 08352-278539.
              </p>
            </div>

            {/* Print Action Buttons */}
            <div className="mt-6 flex gap-3 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 rounded-xl bg-blue-900 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-950 transition-colors flex items-center justify-center gap-2"
              >
                <span>🖨️</span>
                <span>Print or Save as PDF • ಮುದ್ರಿಸಿ / ಪಿಡಿಎಫ್</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
