import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: string
  className?: string
  accent?: 'blue' | 'green' | 'orange' | 'red'
}

const ACCENTS = {
  blue: 'border-l-4 border-blue-500',
  green: 'border-l-4 border-green-500',
  orange: 'border-l-4 border-orange-500',
  red: 'border-l-4 border-red-500',
}

export function StatCard({ label, value, icon, trend, className, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-5 shadow-sm',
        accent && ACCENTS[accent],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="mt-1 text-xs text-gray-400">{trend}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  )
}
