interface SectionProps {
  id?: string
  children: React.ReactNode
  className?: string
  bgClass?: string
}

export default function Section({ id, children, className = '', bgClass = '' }: SectionProps) {
  return (
    <section id={id} className={`py-24 px-6 ${bgClass} ${className}`}>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  )
}

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: 'green' | 'blue' | 'amber' | 'none'
}

export function Card({ children, className = '', hover = true, glow = 'none' }: CardProps) {
  const glowClass = {
    green: 'hover:border-green-500/50 hover:shadow-green-500/20',
    blue: 'hover:border-blue-500/50 hover:shadow-blue-500/20',
    amber: 'hover:border-amber-500/50 hover:shadow-amber-500/20',
    none: '',
  }[glow]

  return (
    <div className={`
      bg-white/5 border border-white/10 rounded-xl p-6
      ${hover ? `transition-all duration-300 cursor-pointer ${glowClass}` : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

interface StatProps {
  value: string | number
  label: string
  className?: string
}

export function Stat({ value, label, className = '' }: StatProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-4xl md:text-5xl font-bold text-green-500 mb-2">
        {value}
      </div>
      <div className="text-gray-500 text-sm">
        {label}
      </div>
    </div>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'blue' | 'amber'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-white/5 border-white/10 text-gray-300',
    green: 'bg-green-900/30 border-green-500/30 text-green-400',
    blue: 'bg-blue-900/30 border-blue-500/30 text-blue-400',
    amber: 'bg-amber-900/30 border-amber-500/30 text-amber-400',
  }

  return (
    <span className={`
      inline-block px-3 py-1 rounded-full text-xs font-medium border
      ${variants[variant]} ${className}
    `}>
      {children}
    </span>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'green' | 'blue' | 'amber'
  className?: string
}

export function ProgressBar({ value, max = 100, color = 'green', className = '' }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  }

  return (
    <div className={`w-full h-2 bg-white/10 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}