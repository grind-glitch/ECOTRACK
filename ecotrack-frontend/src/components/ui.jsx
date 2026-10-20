// Small shared UI pieces used by both front ends.
import {
  ArrowRight, Bike, Bus, Car, CarFront, CarTaxiFront, ChartNoAxesColumn, ChevronLeft, Circle, CirclePlus, Download, FileText, Footprints, Gift, House, LayoutDashboard, Leaf, Lightbulb, Lock, MapPin, Monitor, Plus, ShieldCheck, Smartphone, TrainFront, Trophy, Users,
} from 'lucide-react'

// Only the icons we use (keeps the bundle small). Add new ones here.
const Icons = { ArrowRight, Bike, Bus, Car, CarFront, CarTaxiFront, ChartNoAxesColumn, ChevronLeft, Circle, CirclePlus, Download, FileText, Footprints, Gift, House, LayoutDashboard, Leaf, Lightbulb, Lock, MapPin, Monitor, Plus, ShieldCheck, Smartphone, TrainFront, Trophy, Users }

export function Icon({ name, size = 18, className = '', ...rest }) {
  const C = Icons[name] || Icons.Circle
  return <C size={size} className={className} strokeWidth={1.8} {...rest} />
}

export function Logo({ light = false }) {
  return (
    <div className={`flex items-center gap-2 font-semibold ${light ? 'text-white' : 'text-ink'}`}>
      <Icon name="Leaf" size={18} className={light ? 'text-leaf-400' : 'text-leaf'} />
      <span>EcoTrack</span>
    </div>
  )
}

export function Card({ className = '', children, ...rest }) {
  return (
    <div className={`rounded-2xl border border-line bg-white ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function Button({ variant = 'primary', className = '', children, ...rest }) {
  const styles = {
    primary: 'bg-leaf text-white hover:bg-leaf-500 disabled:opacity-50',
    dark: 'bg-forest text-white hover:bg-forest-700',
    outline: 'border border-leaf text-leaf bg-white hover:bg-leaf-50',
    ghost: 'border border-line bg-white text-ink hover:bg-canvas',
    sun: 'bg-sun text-forest hover:brightness-95',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Chip({ active, className = '', children, ...rest }) {
  return (
    <button
      type="button"
      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
        active ? 'border-leaf bg-leaf-100 text-leaf' : 'border-line bg-white text-ink-600 hover:border-leaf-400'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Avatar({ initials, active = false }) {
  return (
    <div
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
        active ? 'bg-leaf text-white' : 'bg-leaf-100 text-leaf'
      }`}
    >
      {initials}
    </div>
  )
}

export function Badge({ children, tone = 'leaf' }) {
  const tones = {
    leaf: 'bg-leaf-100 text-leaf',
    dark: 'bg-leaf-500/25 text-leaf-200',
    sun: 'bg-sun-100 text-[#8a6212]',
  }
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>
}

export function Bar({ pct, className = 'bg-forest' }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-canvas">
      <div className={`h-1.5 rounded-full ${className}`} style={{ width: `${Math.min(100, Math.max(2, pct))}%` }} />
    </div>
  )
}

export const fmtPct = (n) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)}%`
