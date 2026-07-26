import { useState, useRef, useEffect, createContext, useContext } from 'react'
import {
  Home, TrendingUp, TrendingDown, ChevronRight, ArrowUpRight, ArrowDownLeft,
  Bell, Search, Plus, Settings, Shield, Globe, Moon, Sun, LogOut,
  Wallet, Target, Zap, Coffee, ShoppingBag, Car, Utensils,
  Plane, BookOpen, Dumbbell, Music, Film, Briefcase, Gift,
  ChevronLeft, Check, X, Send, Sparkles,
  BarChart3, ArrowRight, Download, Share2, Edit3, Trash2,
  RefreshCw, Eye, EyeOff, Lock, DollarSign, Activity, Award, AlertTriangle, CreditCard
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'
import logoWhite from '@/imports/Trackify_compressed_page-0004-removebg-preview.png'

// ─── Theme ───────────────────────────────────────────────────────────────────

type ThemeMode = 'dark' | 'light'

interface Theme {
  mode: ThemeMode
  bg: string
  surface: string
  surface2: string
  card: string
  border: string
  text: string
  textSec: string
  inputBg: string
  navBg: string
  divider: string
  chartGrid: string
  tooltipBg: string
  tagBg: string
}

const darkTheme: Theme = {
  mode: 'dark',
  bg: '#081A18',
  surface: '#102826',
  surface2: '#163633',
  card: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
  text: '#FFFFFF',
  textSec: '#B8C8C5',
  inputBg: '#102826',
  navBg: '#102826',
  divider: 'rgba(255,255,255,0.05)',
  chartGrid: 'rgba(255,255,255,0.06)',
  tooltipBg: '#163633',
  tagBg: 'rgba(44,199,167,0.12)',
}

const lightTheme: Theme = {
  mode: 'light',
  bg: '#F2F8F7',
  surface: '#FFFFFF',
  surface2: '#EAF5F3',
  card: 'rgba(0,0,0,0.03)',
  border: 'rgba(0,0,0,0.07)',
  text: '#081A18',
  textSec: '#5C7A76',
  inputBg: '#FFFFFF',
  navBg: '#FFFFFF',
  divider: 'rgba(0,0,0,0.05)',
  chartGrid: 'rgba(0,0,0,0.05)',
  tooltipBg: '#FFFFFF',
  tagBg: 'rgba(44,199,167,0.1)',
}

const ThemeCtx = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: darkTheme,
  toggleTheme: () => {},
})
const useTheme = () => useContext(ThemeCtx)

// ─── Constants ───────────────────────────────────────────────────────────────

type Screen = 'splash' | 'onboarding' | 'signin' | 'home' | 'budgets' | 'expenses' | 'ai' | 'analytics' | 'profile' | 'settings' | 'add-expense' | 'budget-detail' | 'notifications'

const EMERALD = '#2CC7A7'
const SUCCESS = '#39D98A'
const WARNING = '#F6C343'
const ERROR = '#FF5A5F'
const LOGO_GRADIENT = 'linear-gradient(180deg, #2CC7A7 0%, #0D5C52 100%)'

// ─── Data ────────────────────────────────────────────────────────────────────

const spendingData = [
  { month: 'Jan', amount: 2400 }, { month: 'Feb', amount: 1800 },
  { month: 'Mar', amount: 3200 }, { month: 'Apr', amount: 2100 },
  { month: 'May', amount: 2800 }, { month: 'Jun', amount: 3600 },
  { month: 'Jul', amount: 2200 },
]
const weeklyData = [
  { day: 'Mon', income: 0, expense: 340 }, { day: 'Tue', income: 0, expense: 180 },
  { day: 'Wed', income: 3200, expense: 520 }, { day: 'Thu', income: 0, expense: 290 },
  { day: 'Fri', income: 0, expense: 680 }, { day: 'Sat', income: 0, expense: 420 },
  { day: 'Sun', income: 0, expense: 150 },
]
const categoryData = [
  { name: 'Food & Dining', value: 28, color: EMERALD },
  { name: 'Shopping', value: 22, color: '#7C6FCD' },
  { name: 'Transport', value: 16, color: WARNING },
  { name: 'Entertainment', value: 14, color: '#60A5FA' },
  { name: 'Health', value: 12, color: SUCCESS },
  { name: 'Other', value: 8, color: '#6B7280' },
]

type Transaction = {
  id: number; name: string; category: string; amount: number;
  date: string; icon: React.FC<any>; color: string
}
type Budget = {
  id: number; name: string; icon: React.FC<any>; color: string;
  total: number; spent: number; period: string
}

const initTransactions: Transaction[] = [
  { id: 1, name: 'Starbucks', category: 'Food', amount: -8.50, date: 'Today, 9:30 AM', icon: Coffee, color: '#A0522D' },
  { id: 2, name: 'Salary', category: 'Income', amount: 5200, date: 'Today, 8:00 AM', icon: Briefcase, color: EMERALD },
  { id: 3, name: 'Amazon', category: 'Shopping', amount: -124.99, date: 'Yesterday', icon: ShoppingBag, color: '#F97316' },
  { id: 4, name: 'Uber', category: 'Transport', amount: -18.40, date: 'Yesterday', icon: Car, color: '#3B82F6' },
  { id: 5, name: 'Netflix', category: 'Entertainment', amount: -15.99, date: 'Dec 10', icon: Film, color: '#EF4444' },
  { id: 6, name: 'Gym', category: 'Health', amount: -49.00, date: 'Dec 10', icon: Dumbbell, color: SUCCESS },
  { id: 7, name: 'Spotify', category: 'Entertainment', amount: -9.99, date: 'Dec 9', icon: Music, color: '#1DB954' },
  { id: 8, name: 'Dinner', category: 'Food', amount: -67.20, date: 'Dec 9', icon: Utensils, color: '#EF4444' },
]
const initBudgets: Budget[] = [
  { id: 1, name: 'Personal', icon: Wallet, color: EMERALD, total: 3000, spent: 1840, period: 'Dec 2024' },
  { id: 2, name: 'Business', icon: Briefcase, color: '#7C6FCD', total: 5000, spent: 2100, period: 'Dec 2024' },
  { id: 3, name: 'Travel', icon: Plane, color: '#60A5FA', total: 1500, spent: 980, period: 'Dec 2024' },
  { id: 4, name: 'Education', icon: BookOpen, color: WARNING, total: 800, spent: 240, period: 'Dec 2024' },
  { id: 5, name: 'Family', icon: Gift, color: ERROR, total: 1200, spent: 560, period: 'Dec 2024' },
]

const aiMessages = [
  { role: 'ai', content: "Hi! I'm your AI financial advisor. I've analyzed your spending and have some insights for you." },
  { role: 'user', content: "What's my biggest spending category this month?" },
  { role: 'ai', content: "Your biggest spending category is Food & Dining at $840 (28% of your budget). You're spending about $28/day on food — 15% higher than last month. Consider meal prepping 2-3 days a week to save ~$200 monthly." },
]
const suggestions = [
  "Analyze my spending patterns",
  "Where can I cut costs?",
  "Set a savings goal",
  "Predict next month's expenses",
]
const notifications = [
  { id: 1, type: 'alert', title: 'Budget Alert', desc: "You've used 85% of your Food budget", time: '2m ago', read: false },
  { id: 2, type: 'success', title: 'Salary Received', desc: '$5,200 has been credited', time: '1h ago', read: false },
  { id: 3, type: 'info', title: 'AI Insight', desc: 'Your spending is 12% lower than last week', time: '3h ago', read: true },
  { id: 4, type: 'warning', title: 'Unusual Transaction', desc: 'Large transaction of $499 detected', time: 'Yesterday', read: true },
  { id: 5, type: 'info', title: 'Monthly Report Ready', desc: 'Your November report is available', time: '2 days ago', read: true },
]

// ─── Shared Components ────────────────────────────────────────────────────────

function StatusBar() {
  const { theme } = useTheme()
  const [time, setTime] = useState(() => {
    const now = new Date()
    return `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')}`
  })
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(`${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')}`)
    }, 10000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px 0', height: 54, position: 'relative', zIndex: 11 }}>
      <span style={{ color: theme.text, fontSize: 15, fontWeight: 600, letterSpacing: 0.2, minWidth: 42 }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Signal bars */}
        <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
          {[4, 6, 8, 10].map((h, i) => (
            <div key={i} style={{ height: h, width: 3, backgroundColor: i < 3 ? theme.text : `${theme.text}40`, borderRadius: 1 }} />
          ))}
        </div>
        {/* WiFi */}
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
          <path d="M0.5 3.5C3.5 0.5 6 0 7.5 0s4 0.5 7 3.5" stroke={theme.text} strokeWidth="1.3" strokeLinecap="round" opacity="0.35"/>
          <path d="M2.8 6C4.5 4 6 3.2 7.5 3.2s3 0.8 4.7 2.8" stroke={theme.text} strokeWidth="1.3" strokeLinecap="round" opacity="0.6"/>
          <path d="M5 8.5C6 7.5 6.8 7 7.5 7s1.5 0.5 2.5 1.5" stroke={theme.text} strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="7.5" cy="10.5" r="1" fill={theme.text}/>
        </svg>
        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <div style={{ width: 24, height: 12, border: `1.5px solid ${theme.text}70`, borderRadius: 3.5, padding: 1.5, position: 'relative' }}>
            <div style={{ width: '80%', height: '100%', backgroundColor: SUCCESS, borderRadius: 1.5 }} />
          </div>
          <div style={{ width: 1.5, height: 5, backgroundColor: `${theme.text}50`, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  )
}

function BottomNav({ active, onChange }: { active: string; onChange: (s: Screen) => void }) {
  const { theme } = useTheme()
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'budgets', icon: Wallet, label: 'Budget' },
    { id: 'add-expense', icon: Plus, label: 'Add', fab: true },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'ai', icon: Sparkles, label: 'AI' },
  ]
  return (
    <div style={{
      backgroundColor: theme.mode === 'dark' ? 'rgba(16,40,38,0.95)' : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${theme.border}`,
    }} className="flex items-center px-2 py-2">
      {items.map(item => {
        const isActive = item.id === active
        if (item.fab) return (
          <button key={item.id} onClick={() => onChange(item.id as Screen)}
            className="flex-1 flex flex-col items-center gap-1 py-1" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ width: 42, height: 42, borderRadius: 8, background: LOGO_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(44,199,167,0.35)' }}>
              <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 10, color: theme.textSec }}>Add</span>
          </button>
        )
        return (
          <button key={item.id} onClick={() => onChange(item.id as Screen)}
            className="flex-1 flex flex-col items-center gap-1 py-1" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ padding: '6px', borderRadius: 6, backgroundColor: isActive ? 'rgba(44,199,167,0.12)' : 'transparent', transition: 'background-color 0.2s' }}>
              <item.icon size={20} color={isActive ? EMERALD : theme.textSec} fill={isActive ? EMERALD : 'none'} strokeWidth={isActive ? 2 : 1.5} />
            </div>
            <span style={{ fontSize: 10, color: isActive ? EMERALD : theme.textSec, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function ProgressBar({ value, max, color = EMERALD, height = 4, theme }: { value: number; max: number; color?: string; height?: number; theme: Theme }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ height, backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, backgroundColor: pct > 85 ? ERROR : color, borderRadius: 99, transition: 'width 0.6s ease' }} />
    </div>
  )
}

function CircleProgress({ value, max, size = 80, stroke = 6, color = EMERALD, theme }: {
  value: number; max: number; size?: number; stroke?: number; color?: string; theme: Theme
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
    </svg>
  )
}

function Tag({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' }) {
  const colors = { default: { bg: 'rgba(44,199,167,0.12)', color: EMERALD }, success: { bg: 'rgba(57,217,138,0.12)', color: SUCCESS }, warning: { bg: 'rgba(246,195,67,0.12)', color: WARNING }, error: { bg: 'rgba(255,90,95,0.12)', color: ERROR } }
  const c = colors[variant]
  return <span style={{ backgroundColor: c.bg, color: c.color, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: 0.2 }}>{children}</span>
}

function DeleteConfirm({ label, onConfirm, onCancel, theme }: { label: string; onConfirm: () => void; onCancel: () => void; theme: Theme }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: theme.surface, borderRadius: '8px 8px 0 0', padding: '24px 20px 36px', width: '100%', maxWidth: 390, border: `1px solid ${theme.border}`, borderBottom: 'none' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, margin: '0 auto 20px' }} />
        <div style={{ width: 52, height: 52, borderRadius: 8, backgroundColor: 'rgba(255,90,95,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Trash2 size={22} color={ERROR} fill={ERROR} />
        </div>
        <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 17, color: theme.text }}>Delete {label}?</p>
        <p style={{ textAlign: 'center', fontSize: 13, color: theme.textSec, marginTop: 6, lineHeight: 1.5 }}>This action cannot be undone.</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} style={{ flex: 1, padding: '14px', borderRadius: 6, border: `1px solid ${theme.border}`, backgroundColor: 'transparent', color: theme.text, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '14px', borderRadius: 6, border: 'none', backgroundColor: ERROR, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function SplashScreen({ onNext }: { onNext: () => void }) {
  const { theme } = useTheme()
  useEffect(() => { const t = setTimeout(onNext, 2200); return () => clearTimeout(t) }, [onNext])
  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div style={{ width: 96, height: 96, backgroundColor: theme.surface, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}`, boxShadow: '0 0 30px rgba(44,199,167,0.15)' }}>
          <img src={logoWhite} alt="Trackify" style={{ width: 60, height: 60, objectFit: 'contain', filter: theme.mode === 'dark' ? 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(120deg)' : 'invert(55%) sepia(80%) saturate(400%) hue-rotate(130deg)' }} />
        </div>
        <div className="text-center">
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, color: theme.text }}>Trackify</h1>
          <p style={{ color: theme.textSec, fontSize: 13, marginTop: 6, letterSpacing: 0.4 }}>Plan Better. Spend Smarter. Live Better.</p>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: i === 0 ? 24 : 6, height: 6, borderRadius: 3, backgroundColor: i === 0 ? EMERALD : theme.border, transition: 'all 0.3s' }} />)}
        </div>
      </div>
    </div>
  )
}

function OnboardingScreen({ onNext }: { onNext: () => void }) {
  const { theme } = useTheme()
  const [step, setStep] = useState(0)
  const slides = [
    { icon: BarChart3, title: 'Track Every Penny', desc: 'Monitor your income and expenses with intelligent categorization and real-time insights.' },
    { icon: Target, title: 'Smart Budgets', desc: 'Set budget goals across multiple categories and get AI-powered recommendations.' },
    { icon: Sparkles, title: 'AI Financial Advisor', desc: 'Get personalized financial advice and predictions powered by advanced AI.' },
  ]
  const slide = slides[step]
  const isLast = step === slides.length - 1
  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }} className="animate-fade-in">
        <div style={{ width: 120, height: 120, backgroundColor: theme.surface, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 40, border: `1px solid ${theme.border}`, boxShadow: '0 0 30px rgba(44,199,167,0.12)' }}>
          <slide.icon size={52} color={EMERALD} fill={EMERALD} strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', letterSpacing: -0.5, marginBottom: 16, color: theme.text }}>{slide.title}</h2>
        <p style={{ color: theme.textSec, textAlign: 'center', lineHeight: 1.6, fontSize: 15 }}>{slide.desc}</p>
      </div>
      <div style={{ padding: '0 24px 40px' }} className="flex flex-col gap-5">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => <div key={i} style={{ width: i === step ? 24 : 6, height: 6, borderRadius: 3, backgroundColor: i === step ? EMERALD : theme.border, transition: 'all 0.3s' }} />)}
        </div>
        <button onClick={() => isLast ? onNext() : setStep(s => s + 1)} style={{ background: LOGO_GRADIENT, color: '#FFFFFF', fontWeight: 700, fontSize: 15, padding: '16px', borderRadius: 8, width: '100%', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(44,199,167,0.3)' }}>
          {isLast ? 'Get Started' : 'Continue'}
        </button>
        {!isLast && <button onClick={onNext} style={{ color: theme.textSec, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>Skip</button>}
      </div>
    </div>
  )
}

function SignInScreen({ onNext }: { onNext: () => void }) {
  const { theme } = useTheme()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 24px 32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <div style={{ width: 40, height: 40, backgroundColor: theme.surface, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}` }}>
          <img src={logoWhite} alt="Trackify" style={{ width: 24, height: 24, objectFit: 'contain', filter: theme.mode === 'dark' ? 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(120deg)' : 'invert(55%) sepia(80%) saturate(400%) hue-rotate(130deg)' }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: theme.text, letterSpacing: -0.3 }}>Trackify</span>
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5, marginBottom: 8, color: theme.text }}>Welcome back</h2>
      <p style={{ color: theme.textSec, fontSize: 14, marginBottom: 36 }}>Sign in to your account</p>
      <div className="flex flex-col gap-4">
        {[
          { label: 'EMAIL', value: email, set: setEmail, placeholder: 'alex@example.com', type: 'email' },
        ].map(f => (
          <div key={f.label}>
            <label style={{ fontSize: 11, color: theme.textSec, fontWeight: 600, letterSpacing: 0.5 }}>{f.label}</label>
            <div style={{ backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', marginTop: 8, gap: 10 }}>
              <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} type={f.type}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: theme.text, fontSize: 14, padding: '14px 0' }} />
            </div>
          </div>
        ))}
        <div>
          <label style={{ fontSize: 11, color: theme.textSec, fontWeight: 600, letterSpacing: 0.5 }}>PASSWORD</label>
          <div style={{ backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', marginTop: 8, gap: 10 }}>
            <input value={pass} onChange={e => setPass(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="••••••••"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: theme.text, fontSize: 14, padding: '14px 0' }} />
            <button onClick={() => setShowPass(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              {showPass ? <EyeOff size={16} color={theme.textSec} /> : <Eye size={16} color={theme.textSec} />}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ color: EMERALD, fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
        </div>
        <button onClick={onNext} style={{ background: LOGO_GRADIENT, color: '#FFFFFF', fontWeight: 700, fontSize: 15, padding: '16px', borderRadius: 8, width: '100%', border: 'none', cursor: 'pointer', marginTop: 4, boxShadow: '0 4px 14px rgba(44,199,167,0.3)' }}>Sign In</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
        <div style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
        <span style={{ color: theme.textSec, fontSize: 12 }}>or continue with</span>
        <div style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
      </div>
      <div className="flex gap-3">
        {['Google', 'Apple'].map(p => (
          <button key={p} style={{ flex: 1, padding: '14px', borderRadius: 8, background: 'none', border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>{p}</button>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: theme.textSec }}>
        {"Don't have an account? "}<span style={{ color: EMERALD, cursor: 'pointer', fontWeight: 600 }}>Sign Up</span>
      </p>
    </div>
  )
}

function HomeScreen({ onNav, transactions }: { onNav: (s: Screen) => void; transactions: Transaction[] }) {
  const { theme } = useTheme()
  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => onNav('profile')} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', border: `2px solid rgba(44,199,167,0.3)` }}>
            <div style={{ width: '100%', height: '100%', background: LOGO_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>AJ</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, color: theme.textSec }}>Good morning</p>
            <p style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: theme.text }}>Alex Johnson</p>
          </div>
        </button>
        <button onClick={() => onNav('notifications')} style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}`, position: 'relative', cursor: 'pointer' }}>
          <Bell size={16} color={theme.textSec} fill={theme.textSec} />
          <div style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: 3, backgroundColor: ERROR, border: `1.5px solid ${theme.bg}` }} />
        </button>
      </div>

      {/* Balance Card */}
      <div style={{ padding: '0 20px', marginTop: 16 }}>
        <div style={{ background: LOGO_GRADIENT, borderRadius: 10, padding: '20px', boxShadow: '0 8px 24px rgba(44,199,167,0.25)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>Total Balance</p>
              <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, marginTop: 4, color: '#FFFFFF' }}>$12,480<span style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }}>.50</span></p>
            </div>
            <Tag variant="success">+2.4%</Tag>
          </div>
          <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[
              { icon: ArrowDownLeft, label: 'Income', value: '$7,200', color: '#FFFFFF' },
              { icon: ArrowUpRight, label: 'Expenses', value: '$2,840', color: '#FFFFFF' },
              { icon: Target, label: 'Savings', value: '$4,360', color: '#FFFFFF' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <s.icon size={12} color={s.color} fill={s.color} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{s.label}</span>
                </div>
                <span style={{ fontWeight: 600, fontSize: 15, color: '#FFFFFF' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 20px', marginTop: 20 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { icon: Plus, label: 'Add', action: 'add-expense' as Screen },
            { icon: ArrowUpRight, label: 'Send', action: 'expenses' as Screen },
            { icon: ArrowDownLeft, label: 'Receive', action: 'expenses' as Screen },
            { icon: BarChart3, label: 'Analytics', action: 'analytics' as Screen },
          ].map(({ icon: Icon, label, action }) => (
            <button key={label} onClick={() => onNav(action)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ width: 52, height: 52, borderRadius: 8, backgroundColor: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}` }}>
                <Icon size={20} color={EMERALD} fill={EMERALD} strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: 11, color: theme.textSec, fontWeight: 500 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Progress */}
      <div style={{ padding: '0 20px', marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>Monthly Budget</span>
          <button onClick={() => onNav('budgets')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: EMERALD }}>See all</span>
            <ChevronRight size={14} color={EMERALD} />
          </button>
        </div>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}`, boxShadow: theme.mode === 'light' ? '0 2px 12px rgba(0,0,0,0.06)' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 12, color: theme.textSec }}>Personal Budget</p>
              <p style={{ fontWeight: 600, fontSize: 16, marginTop: 2, color: theme.text }}>$1,840 <span style={{ fontSize: 12, color: theme.textSec, fontWeight: 400 }}>/ $3,000</span></p>
            </div>
            <div style={{ position: 'relative' }}>
              <CircleProgress value={1840} max={3000} size={52} stroke={5} theme={theme} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.text }}>61%</span>
              </div>
            </div>
          </div>
          <ProgressBar value={1840} max={3000} theme={theme} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: theme.textSec }}>61% used</span>
            <span style={{ fontSize: 11, color: SUCCESS }}>$1,160 remaining</span>
          </div>
        </div>
      </div>

      {/* Spending Chart */}
      <div style={{ padding: '0 20px', marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>Spending Trend</span>
          <Tag>This Year</Tag>
        </div>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}`, boxShadow: theme.mode === 'light' ? '0 2px 12px rgba(0,0,0,0.06)' : 'none' }}>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={spendingData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={EMERALD} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={EMERALD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: theme.textSec }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: theme.tooltipBg, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12, color: theme.text }} formatter={(v: number) => [`$${v}`, 'Amount']} />
              <Area type="monotone" dataKey="amount" stroke={EMERALD} strokeWidth={2} fill="url(#spendGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insight */}
      <div style={{ padding: '0 20px', marginTop: 20 }}>
        <button onClick={() => onNav('ai')} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <div style={{ background: theme.mode === 'dark' ? 'linear-gradient(135deg,rgba(44,199,167,0.12),rgba(44,199,167,0.04))' : 'linear-gradient(135deg,rgba(44,199,167,0.08),rgba(44,199,167,0.02))', borderRadius: 8, padding: '16px', border: `1px solid rgba(44,199,167,0.2)` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(44,199,167,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={16} color={EMERALD} fill={EMERALD} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: EMERALD, letterSpacing: 0.5 }}>AI INSIGHT</span>
                  <ArrowRight size={14} color={EMERALD} />
                </div>
                <p style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5, color: theme.text }}>
                  {"You're on track to save "}<strong>$4,800</strong>{" this year. Reducing dining out could save an extra "}<strong>$200/month</strong>.
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Transactions */}
      <div style={{ padding: '0 20px', marginTop: 24, paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>Recent Transactions</span>
          <button onClick={() => onNav('expenses')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: EMERALD }}>See all</span>
            <ChevronRight size={14} color={EMERALD} />
          </button>
        </div>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, overflow: 'hidden', boxShadow: theme.mode === 'light' ? '0 2px 12px rgba(0,0,0,0.06)' : 'none' }}>
          {transactions.slice(0, 5).map((t, i) => (
            <div key={t.id}>
              {i > 0 && <div style={{ height: 1, backgroundColor: theme.divider, marginLeft: 64 }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: `${t.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <t.icon size={18} color={t.color} fill={t.color} strokeWidth={1.5} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, fontSize: 14, color: theme.text }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: theme.textSec, marginTop: 2 }}>{t.date}</p>
                </div>
                <span style={{ fontWeight: 600, fontSize: 14, color: t.amount > 0 ? SUCCESS : theme.text }}>
                  {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BudgetsScreen({ onNav, budgets, onDelete }: { onNav: (s: Screen) => void; budgets: Budget[]; onDelete: (id: number) => void }) {
  const { theme } = useTheme()
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const total = budgets.reduce((s, b) => s + b.total, 0)
  const spent = budgets.reduce((s, b) => s + b.spent, 0)

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      {confirmId !== null && (
        <DeleteConfirm
          label="Budget"
          theme={theme}
          onConfirm={() => { onDelete(confirmId); setConfirmId(null) }}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={22} color={theme.text} />
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: theme.text }}>Budgets</h1>
        </div>
        <button onClick={() => onNav('add-expense')} style={{ width: 36, height: 36, borderRadius: 8, background: LOGO_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
        </button>
      </div>

      {/* Summary */}
      <div style={{ padding: '0 20px', marginTop: 12 }}>
        <div style={{ background: LOGO_GRADIENT, borderRadius: 10, padding: '20px', boxShadow: '0 8px 24px rgba(44,199,167,0.25)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>Total Budget</p>
              <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.8, marginTop: 4, color: '#FFFFFF' }}>{total > 0 ? `$${total.toLocaleString()}` : '$0'}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Spent: ${spent.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>•</span>
                <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 600 }}>Left: ${(total - spent).toLocaleString()}</span>
              </div>
            </div>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <CircleProgress value={spent} max={total || 1} size={80} stroke={7} color="#FFFFFF" theme={{ ...theme, mode: 'dark' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{total > 0 ? Math.round(spent / total * 100) : 0}%</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <ProgressBar value={spent} max={total || 1} color="#FFFFFF" height={6} theme={{ ...theme, mode: 'dark' }} />
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div style={{ padding: '0 20px', marginTop: 20, paddingBottom: 24 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: theme.text, display: 'block', marginBottom: 12 }}>All Budgets</span>
        {budgets.length === 0 && (
          <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '32px 20px', textAlign: 'center', border: `1px solid ${theme.border}` }}>
            <Wallet size={32} color={theme.textSec} fill={theme.textSec} strokeWidth={1.5} style={{ margin: '0 auto 12px' }} />
            <p style={{ color: theme.textSec, fontSize: 14 }}>No budgets yet. Create one!</p>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {budgets.map(b => {
            const pct = b.total > 0 ? Math.round(b.spent / b.total * 100) : 0
            const isOver = pct > 85
            return (
              <div key={b.id} style={{ backgroundColor: theme.surface, borderRadius: 8, border: `1px solid ${isOver ? 'rgba(255,90,95,0.2)' : theme.border}`, overflow: 'hidden', boxShadow: theme.mode === 'light' ? '0 2px 12px rgba(0,0,0,0.06)' : 'none' }}>
                <button onClick={() => onNav('budget-detail')} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '16px', textAlign: 'left', display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: `${b.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <b.icon size={18} color={b.color} fill={b.color} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{b.name}</p>
                        <p style={{ fontSize: 11, color: theme.textSec, marginTop: 2 }}>{b.period}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>${b.spent.toLocaleString()}</p>
                      <p style={{ fontSize: 11, color: theme.textSec, marginTop: 2 }}>of ${b.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <ProgressBar value={b.spent} max={b.total} color={b.color} height={5} theme={theme} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: isOver ? ERROR : theme.textSec }}>{pct}% used</span>
                    <span style={{ fontSize: 11, color: isOver ? ERROR : SUCCESS }}>${(b.total - b.spent).toLocaleString()} left</span>
                  </div>
                </button>
                {/* Delete row */}
                <div style={{ borderTop: `1px solid ${theme.divider}`, display: 'flex', justifyContent: 'flex-end', padding: '8px 12px' }}>
                  <button onClick={() => setConfirmId(b.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, color: ERROR, fontSize: 12, fontWeight: 600 }}>
                    <Trash2 size={13} color={ERROR} fill={ERROR} />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BudgetDetailScreen({ onBack, theme }: { onBack: () => void; theme: Theme }) {
  const budget = { name: 'Personal', spent: 1840, total: 3000 }
  const pct = Math.round(budget.spent / budget.total * 100)
  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft size={22} color={theme.text} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>Personal Budget</h1>
      </div>
      <div style={{ padding: '0 20px', marginTop: 16 }}>
        <div style={{ background: LOGO_GRADIENT, borderRadius: 10, padding: '24px', boxShadow: '0 8px 24px rgba(44,199,167,0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Budget Remaining</p>
              <p style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1, marginTop: 4, color: '#FFFFFF' }}>${(budget.total - budget.spent).toLocaleString()}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>of ${budget.total.toLocaleString()} total</p>
            </div>
            <div style={{ position: 'relative', width: 90, height: 90 }}>
              <CircleProgress value={budget.spent} max={budget.total} size={90} stroke={8} color="#FFFFFF" theme={{ ...theme, mode: 'dark' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{pct}%</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <ProgressBar value={budget.spent} max={budget.total} color="#FFFFFF" height={8} theme={{ ...theme, mode: 'dark' }} />
          </div>
        </div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 20 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>Daily Spending</span>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}`, marginTop: 12 }}>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: theme.textSec }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: theme.tooltipBg, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12, color: theme.text }} formatter={(v: number) => [`$${v}`, 'Spent']} />
              <Bar dataKey="expense" fill={EMERALD} radius={[2, 2, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 20, paddingBottom: 24 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>Category Breakdown</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          {categoryData.slice(0, 4).map(c => (
            <div key={c.name} style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '12px 16px', border: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: c.color }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: theme.text }}>{c.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{c.value}%</span>
              </div>
              <ProgressBar value={c.value} max={100} color={c.color} height={4} theme={theme} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExpensesScreen({ onNav, transactions, onDelete }: { onNav: (s: Screen) => void; transactions: Transaction[]; onDelete: (id: number) => void }) {
  const { theme } = useTheme()
  const [filter, setFilter] = useState('All')
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const filters = ['All', 'Food', 'Shopping', 'Transport', 'Income']
  const filtered = filter === 'All' ? transactions : transactions.filter(t => t.category === filter)

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      {confirmId !== null && (
        <DeleteConfirm
          label="Transaction"
          theme={theme}
          onConfirm={() => { onDelete(confirmId); setConfirmId(null) }}
          onCancel={() => setConfirmId(null)}
        />
      )}
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={22} color={theme.text} />
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: theme.text }}>Expenses</h1>
        </div>
        <button onClick={() => onNav('add-expense')} style={{ width: 36, height: 36, borderRadius: 8, background: LOGO_GRADIENT, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
        </button>
      </div>
      <div style={{ padding: '0 20px', marginTop: 12 }}>
        <div style={{ backgroundColor: theme.inputBg, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, border: `1px solid ${theme.border}` }}>
          <Search size={16} color={theme.textSec} />
          <input placeholder="Search transactions..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: theme.text, fontSize: 14, padding: '12px 0' }} />
        </div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 12 }}>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 4, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', background: f === filter ? LOGO_GRADIENT : theme.surface, color: f === filter ? '#FFFFFF' : theme.textSec, transition: 'all 0.2s' }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 16, paddingBottom: 24 }}>
        {filtered.length === 0 ? (
          <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '32px 20px', textAlign: 'center', border: `1px solid ${theme.border}` }}>
            <CreditCard size={32} color={theme.textSec} fill={theme.textSec} strokeWidth={1.5} style={{ margin: '0 auto 12px' }} />
            <p style={{ color: theme.textSec, fontSize: 14 }}>No transactions found.</p>
          </div>
        ) : (
          <div style={{ backgroundColor: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, overflow: 'hidden', boxShadow: theme.mode === 'light' ? '0 2px 12px rgba(0,0,0,0.06)' : 'none' }}>
            {filtered.map((t, i) => (
              <div key={t.id}>
                {i > 0 && <div style={{ height: 1, backgroundColor: theme.divider, marginLeft: 64 }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 8, backgroundColor: `${t.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <t.icon size={18} color={t.color} fill={t.color} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, fontSize: 14, color: theme.text }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: theme.textSec, marginTop: 2 }}>{t.category} · {t.date}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: t.amount > 0 ? SUCCESS : theme.text }}>
                      {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                    </span>
                    <button onClick={() => setConfirmId(t.id)} style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(255,90,95,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                      <Trash2 size={13} color={ERROR} fill={ERROR} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AddExpenseScreen({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme()
  const [amount, setAmount] = useState('0')
  const [category, setCategory] = useState('Food')
  const [note, setNote] = useState('')
  const cats = [
    { label: 'Food', icon: Utensils, color: ERROR },
    { label: 'Shop', icon: ShoppingBag, color: '#F97316' },
    { label: 'Travel', icon: Car, color: '#3B82F6' },
    { label: 'Health', icon: Dumbbell, color: SUCCESS },
    { label: 'Fun', icon: Film, color: '#7C6FCD' },
    { label: 'Other', icon: DollarSign, color: '#6B7280' },
  ]
  const handleNum = (v: string) => {
    if (v === 'del') { setAmount(a => a.length > 1 ? a.slice(0, -1) : '0'); return }
    if (v === '.' && amount.includes('.')) return
    setAmount(a => a === '0' && v !== '.' ? v : a + v)
  }

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft size={22} color={theme.text} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>Add Expense</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0 16px' }}>
        <p style={{ fontSize: 11, color: theme.textSec, letterSpacing: 0.5, marginBottom: 8 }}>AMOUNT</p>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 24, color: EMERALD, fontWeight: 700, marginTop: 8 }}>$</span>
          <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: -2, color: theme.text }}>{amount}</span>
        </div>
      </div>
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: theme.textSec, letterSpacing: 0.5, marginBottom: 10 }}>CATEGORY</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          {cats.map(c => (
            <button key={c.label} onClick={() => setCategory(c.label)} style={{ flex: 1, padding: '10px 4px', borderRadius: 8, border: `1px solid ${category === c.label ? `${c.color}44` : theme.border}`, cursor: 'pointer', backgroundColor: category === c.label ? `${c.color}15` : theme.surface, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}>
              <c.icon size={18} color={category === c.label ? c.color : theme.textSec} fill={category === c.label ? c.color : 'none'} strokeWidth={1.5} />
              <span style={{ fontSize: 9, color: category === c.label ? c.color : theme.textSec, fontWeight: 600 }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 20px', marginBottom: 16 }}>
        <div style={{ backgroundColor: theme.inputBg, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', border: `1px solid ${theme.border}`, gap: 10 }}>
          <Edit3 size={15} color={theme.textSec} />
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: theme.text, fontSize: 13, padding: '12px 0' }} />
        </div>
      </div>
      <div style={{ padding: '0 20px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {['1','2','3','4','5','6','7','8','9','.','0','del'].map(k => (
            <button key={k} onClick={() => handleNum(k)} style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}`, cursor: 'pointer', color: k === 'del' ? theme.textSec : theme.text, fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' }}>
              {k === 'del' ? <ChevronLeft size={18} color={theme.textSec} /> : k}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 20px' }}>
        <button onClick={onBack} style={{ width: '100%', padding: '16px', borderRadius: 8, background: LOGO_GRADIENT, color: '#FFFFFF', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(44,199,167,0.3)' }}>Add Expense</button>
      </div>
    </div>
  )
}

function AIScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { theme } = useTheme()
  const [messages, setMessages] = useState(aiMessages)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const send = () => {
    if (!input.trim()) return
    setMessages(m => [...m, { role: 'user', content: input }, { role: 'ai', content: "Based on your spending data, I'd recommend reviewing your subscriptions — you're spending $89/month on services you might be underusing. Consider auditing them this week to save up to $45/month." }])
    setInput('')
    setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 100)
  }

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${theme.border}` }}>
        <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={22} color={theme.text} />
        </button>
        <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(44,199,167,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={20} color={EMERALD} fill={EMERALD} />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 16, color: theme.text }}>AI Assistant</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: SUCCESS }} />
            <p style={{ fontSize: 11, color: theme.textSec }}>Online</p>
          </div>
        </div>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: 8 }} className="animate-fade-in">
            {m.role === 'ai' && (
              <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(44,199,167,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Sparkles size={13} color={EMERALD} fill={EMERALD} />
              </div>
            )}
            <div style={{ maxWidth: '78%', background: m.role === 'user' ? LOGO_GRADIENT : theme.surface, color: m.role === 'user' ? '#FFFFFF' : theme.text, borderRadius: 8, padding: '10px 14px', fontSize: 13, lineHeight: 1.6, border: m.role === 'ai' ? `1px solid ${theme.border}` : 'none' }}>
              {m.content}
            </div>
          </div>
        ))}
        {messages.length <= 5 && (
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 11, color: theme.textSec, marginBottom: 8 }}>Suggested questions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => setInput(s)} style={{ padding: '10px 14px', borderRadius: 8, textAlign: 'left', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, color: theme.textSec, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={13} color={EMERALD} fill={EMERALD} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${theme.border}` }}>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px 4px 14px', border: `1px solid ${theme.border}` }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask anything about your finances..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: theme.text, fontSize: 13, padding: '10px 0' }} />
          <button onClick={send} style={{ width: 36, height: 36, borderRadius: 6, background: input ? LOGO_GRADIENT : theme.card, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            <Send size={15} color={input ? '#FFFFFF' : theme.textSec} fill={input ? '#FFFFFF' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  )
}

function AnalyticsScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { theme } = useTheme()
  const [period, setPeriod] = useState('Month')

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={22} color={theme.text} />
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: theme.text }}>Analytics</h1>
        </div>
        <div style={{ display: 'flex', backgroundColor: theme.surface, borderRadius: 6, padding: 3, border: `1px solid ${theme.border}` }}>
          {['Week', 'Month', 'Year'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: '5px 12px', borderRadius: 4, fontSize: 12, fontWeight: 500, background: p === period ? LOGO_GRADIENT : 'transparent', color: p === period ? '#FFFFFF' : theme.textSec, border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>{p}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { label: 'Total Spent', value: '$2,840', change: '-8.2%', up: false },
          { label: 'Total Income', value: '$7,200', change: '+3.5%', up: true },
          { label: 'Net Savings', value: '$4,360', change: '+12.1%', up: true },
          { label: 'Avg Daily', value: '$91.6', change: '-5.3%', up: false },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '14px', border: `1px solid ${theme.border}`, boxShadow: theme.mode === 'light' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            <p style={{ fontSize: 11, color: theme.textSec }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5, marginTop: 4, color: theme.text }}>{s.value}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {s.up ? <TrendingUp size={11} color={SUCCESS} /> : <TrendingDown size={11} color={ERROR} />}
              <span style={{ fontSize: 11, color: s.up ? SUCCESS : ERROR }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 20px', marginTop: 20 }}>
        <p style={{ fontWeight: 600, fontSize: 15, color: theme.text, marginBottom: 12 }}>Weekly Overview</p>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}` }}>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: theme.textSec }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: theme.tooltipBg, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12, color: theme.text }} />
              <Bar dataKey="income" fill={SUCCESS} radius={[2, 2, 0, 0]} opacity={0.85} />
              <Bar dataKey="expense" fill={EMERALD} radius={[2, 2, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
            {[{ color: SUCCESS, label: 'Income' }, { color: EMERALD, label: 'Expense' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: l.color }} />
                <span style={{ fontSize: 11, color: theme.textSec }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 20 }}>
        <p style={{ fontWeight: 600, fontSize: 15, color: theme.text, marginBottom: 12 }}>Spending Categories</p>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ flexShrink: 0 }}>
              <ResponsiveContainer width={120} height={120}>
                <RechartsPie>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={38} outerRadius={55} dataKey="value" paddingAngle={3}>
                    {categoryData.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                </RechartsPie>
              </ResponsiveContainer>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categoryData.map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: theme.textSec }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 20, paddingBottom: 24 }}>
        <p style={{ fontWeight: 600, fontSize: 15, color: theme.text, marginBottom: 12 }}>6-Month Trend</p>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}` }}>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={spendingData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={EMERALD} />
                  <stop offset="100%" stopColor={SUCCESS} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: theme.textSec }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: theme.tooltipBg, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12, color: theme.text }} formatter={(v: number) => [`$${v}`, 'Spent']} />
              <Line type="monotone" dataKey="amount" stroke="url(#lineGrad)" strokeWidth={2.5} dot={{ fill: EMERALD, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme()
  const typeColors: Record<string, string> = { alert: ERROR, success: SUCCESS, info: EMERALD, warning: WARNING }
  const typeIcons: Record<string, React.FC<any>> = { alert: AlertTriangle, success: Check, info: Sparkles, warning: Activity }
  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft size={22} color={theme.text} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>Notifications</h1>
        <div style={{ marginLeft: 'auto' }}><Tag>2 New</Tag></div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 16, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifications.map(n => {
          const NIcon = typeIcons[n.type]
          const color = typeColors[n.type]
          return (
            <div key={n.id} style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '14px 16px', border: `1px solid ${n.read ? theme.border : `${color}30`}`, opacity: n.read ? 0.75 : 1, boxShadow: theme.mode === 'light' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <NIcon size={16} color={color} fill={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: theme.text }}>{n.title}</p>
                    <span style={{ fontSize: 10, color: theme.textSec, marginLeft: 8, flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: 12, color: theme.textSec, marginTop: 3, lineHeight: 1.4 }}>{n.desc}</p>
                </div>
                {!n.read && <div style={{ width: 7, height: 7, borderRadius: 3, backgroundColor: color, flexShrink: 0, marginTop: 2 }} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProfileScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { theme } = useTheme()
  const menuItems = [
    { icon: Wallet, label: 'Payment Methods', action: null },
    { icon: Target, label: 'Savings Goals', action: null },
    { icon: Shield, label: 'Security', action: null },
    { icon: Globe, label: 'Currency & Region', action: null },
    { icon: Bell, label: 'Notifications', action: 'notifications' as Screen },
    { icon: Download, label: 'Export Data', action: null },
    { icon: Settings, label: 'Settings', action: 'settings' as Screen },
    { icon: LogOut, label: 'Sign Out', action: null },
  ]
  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={22} color={theme.text} />
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: theme.text }}>Profile</h1>
        </div>
        <button onClick={() => onNav('settings')} style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}`, cursor: 'pointer' }}>
          <Settings size={16} color={theme.textSec} fill={theme.textSec} />
        </button>
      </div>
      <div style={{ padding: '0 20px', marginTop: 16 }}>
        <div style={{ background: LOGO_GRADIENT, borderRadius: 10, padding: '20px', boxShadow: '0 8px 24px rgba(44,199,167,0.25)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.3)' }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF' }}>AJ</span>
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Alex Johnson</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>alex@example.com</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Award size={12} color={WARNING} fill={WARNING} />
                <span style={{ fontSize: 11, color: WARNING, fontWeight: 600 }}>Premium Member</span>
              </div>
            </div>
          </div>
          <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.15)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[{ label: 'Budgets', value: '5' }, { label: 'Transactions', value: '248' }, { label: 'Savings', value: '$4.3k' }].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 20, paddingBottom: 24 }}>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, overflow: 'hidden', boxShadow: theme.mode === 'light' ? '0 2px 12px rgba(0,0,0,0.06)' : 'none' }}>
          {menuItems.map((item, i) => (
            <div key={item.label}>
              {i > 0 && <div style={{ height: 1, backgroundColor: theme.divider, marginLeft: 58 }} />}
              <button onClick={() => item.action && onNav(item.action)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: item.label === 'Sign Out' ? 'rgba(255,90,95,0.1)' : theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={16} color={item.label === 'Sign Out' ? ERROR : theme.textSec} fill={item.label === 'Sign Out' ? ERROR : theme.textSec} strokeWidth={1.5} />
                </div>
                <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 500, color: item.label === 'Sign Out' ? ERROR : theme.text }}>{item.label}</span>
                {item.label !== 'Sign Out' && <ChevronRight size={16} color={theme.textSec} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsScreen({ onBack, isDark, toggleTheme }: { onBack: () => void; isDark: boolean; toggleTheme: () => void }) {
  const { theme } = useTheme()
  const [biometric, setBiometric] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)

  function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
    return (
      <button onClick={onToggle} style={{ width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', background: value ? LOGO_GRADIENT : theme.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)', position: 'relative', transition: 'all 0.3s', flexShrink: 0 }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white', position: 'absolute', top: 3, left: value ? 21 : 3, transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </button>
    )
  }

  const groups = [
    {
      title: 'Appearance', items: [
        { label: 'Dark Mode', icon: isDark ? Moon : Sun, toggle: true, value: isDark, onToggle: toggleTheme },
      ]
    },
    {
      title: 'Security', items: [
        { label: 'Biometric Login', icon: Shield, toggle: true, value: biometric, onToggle: () => setBiometric(s => !s) },
        { label: 'Change PIN', icon: Lock, toggle: false, value: false, onToggle: () => {} },
      ]
    },
    {
      title: 'Notifications', items: [
        { label: 'Push Notifications', icon: Bell, toggle: true, value: pushNotifs, onToggle: () => setPushNotifs(s => !s) },
        { label: 'Budget Alerts', icon: AlertTriangle, toggle: false, value: false, onToggle: () => {} },
      ]
    },
    {
      title: 'Data', items: [
        { label: 'Export as CSV', icon: Download, toggle: false, value: false, onToggle: () => {} },
        { label: 'Share Summary', icon: Share2, toggle: false, value: false, onToggle: () => {} },
        { label: 'Sync Accounts', icon: RefreshCw, toggle: false, value: false, onToggle: () => {} },
      ]
    },
  ]

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft size={22} color={theme.text} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>Settings</h1>
      </div>
      <div style={{ padding: '0 20px', marginTop: 16, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {groups.map(group => (
          <div key={group.title}>
            <p style={{ fontSize: 11, color: theme.textSec, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{group.title}</p>
            <div style={{ backgroundColor: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, overflow: 'hidden', boxShadow: theme.mode === 'light' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
              {group.items.map((item, i) => (
                <div key={item.label}>
                  {i > 0 && <div style={{ height: 1, backgroundColor: theme.divider, marginLeft: 54 }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <item.icon size={15} color={theme.textSec} fill={theme.textSec} strokeWidth={1.5} />
                    </div>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: theme.text }}>{item.label}</span>
                    {item.toggle ? <Toggle value={item.value} onToggle={item.onToggle} /> : <ChevronRight size={16} color={theme.textSec} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, padding: '16px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
            <img src={logoWhite} alt="Trackify" style={{ width: 20, height: 20, objectFit: 'contain', filter: theme.mode === 'dark' ? 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(120deg)' : 'invert(55%) sepia(80%) saturate(400%) hue-rotate(130deg)' }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>Trackify</span>
          </div>
          <p style={{ fontSize: 11, color: theme.textSec }}>Version 2.4.1 · Build 2024.12</p>
        </div>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const [screen, setScreen] = useState<Screen>('splash')
  const [transactions, setTransactions] = useState<Transaction[]>(initTransactions)
  const [budgets, setBudgets] = useState<Budget[]>(initBudgets)

  const theme = isDark ? darkTheme : lightTheme
  const deleteTransaction = (id: number) => setTransactions(t => t.filter(x => x.id !== id))
  const deleteBudget = (id: number) => setBudgets(b => b.filter(x => x.id !== id))

  const mainScreens: Screen[] = ['home', 'budgets', 'expenses', 'analytics', 'ai', 'add-expense']

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen onNext={() => setScreen('onboarding')} />
      case 'onboarding': return <OnboardingScreen onNext={() => setScreen('signin')} />
      case 'signin': return <SignInScreen onNext={() => setScreen('home')} />
      case 'home': return <HomeScreen onNav={setScreen} transactions={transactions} />
      case 'budgets': return <BudgetsScreen onNav={setScreen} budgets={budgets} onDelete={deleteBudget} />
      case 'expenses': return <ExpensesScreen onNav={setScreen} transactions={transactions} onDelete={deleteTransaction} />
      case 'ai': return <AIScreen onNav={setScreen} />
      case 'analytics': return <AnalyticsScreen onNav={setScreen} />
      case 'profile': return <ProfileScreen onNav={setScreen} />
      case 'settings': return <SettingsScreen onBack={() => setScreen('profile')} isDark={isDark} toggleTheme={toggleTheme} />
      case 'add-expense': return <AddExpenseScreen onBack={() => setScreen('expenses')} />
      case 'budget-detail': return <BudgetDetailScreen onBack={() => setScreen('budgets')} theme={theme} />
      case 'notifications': return <NotificationsScreen onBack={() => setScreen('home')} />
      default: return <HomeScreen onNav={setScreen} transactions={transactions} />
    }
  }

  const showNav = mainScreens.includes(screen)
  const isPreAuth = ['splash', 'onboarding', 'signin'].includes(screen)

  // Phone dimensions
  const phoneW = 393
  const phoneH = 852
  const bezel = 12
  const frameRadius = 58
  const totalW = phoneW + bezel * 2 + 8 // +8 for side buttons
  const totalH = phoneH + bezel * 2

  // Responsive scaling — fit phone inside viewport
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const calcScale = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const padX = 80  // horizontal breathing room
      const padY = 80  // vertical breathing room
      const scaleX = (vw - padX) / totalW
      const scaleY = (vh - padY) / totalH
      const s = Math.min(scaleX, scaleY, 1) // never scale up past 1
      setScale(Math.round(s * 1000) / 1000)
    }
    calcScale()
    window.addEventListener('resize', calcScale)
    return () => window.removeEventListener('resize', calcScale)
  }, [totalW, totalH])

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme }}>
      {/* Full page background */}
      <div style={{
        background: isDark
          ? 'radial-gradient(ellipse at 50% 30%, #0a1f1d 0%, #030B0A 60%, #010504 100%)'
          : 'radial-gradient(ellipse at 50% 30%, #e8f5f2 0%, #d0e8e4 60%, #b8dbd6 100%)',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.5s ease',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Ambient glow behind phone */}
        <div style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(44,199,167,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(44,199,167,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />

        {/* Theme toggle outside phone */}
        {!isPreAuth && (
          <button onClick={toggleTheme} style={{
            position: 'fixed', top: 24, right: 24,
            width: 48, height: 48, borderRadius: 12,
            backgroundColor: isDark ? 'rgba(16,40,38,0.9)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 50,
            boxShadow: isDark
              ? '0 4px 20px rgba(0,0,0,0.4)'
              : '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
          }}>
            {isDark ? <Sun size={20} color={WARNING} fill={WARNING} /> : <Moon size={20} color="#5C7A76" fill="#5C7A76" />}
          </button>
        )}

        {/* ─── Scaled Phone Wrapper ─── */}
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease',
        }}>
          {/* ─── Phone Frame ─── */}
          <div style={{ position: 'relative' }}>

            {/* Side buttons — Left: Mute switch + Volume */}
            <div style={{ position: 'absolute', left: -3, top: 140, width: 4, height: 28, backgroundColor: isDark ? '#2a2a2a' : '#c0c0c0', borderRadius: '3px 0 0 3px', boxShadow: isDark ? 'inset 1px 0 2px rgba(255,255,255,0.1)' : 'inset 1px 0 2px rgba(0,0,0,0.1)' }} />
            <div style={{ position: 'absolute', left: -3, top: 190, width: 4, height: 52, backgroundColor: isDark ? '#2a2a2a' : '#c0c0c0', borderRadius: '3px 0 0 3px', boxShadow: isDark ? 'inset 1px 0 2px rgba(255,255,255,0.1)' : 'inset 1px 0 2px rgba(0,0,0,0.1)' }} />
            <div style={{ position: 'absolute', left: -3, top: 252, width: 4, height: 52, backgroundColor: isDark ? '#2a2a2a' : '#c0c0c0', borderRadius: '3px 0 0 3px', boxShadow: isDark ? 'inset 1px 0 2px rgba(255,255,255,0.1)' : 'inset 1px 0 2px rgba(0,0,0,0.1)' }} />

            {/* Side button — Right: Power */}
            <div style={{ position: 'absolute', right: -3, top: 210, width: 4, height: 72, backgroundColor: isDark ? '#2a2a2a' : '#c0c0c0', borderRadius: '0 3px 3px 0', boxShadow: isDark ? 'inset -1px 0 2px rgba(255,255,255,0.1)' : 'inset -1px 0 2px rgba(0,0,0,0.1)' }} />

            {/* Outer phone body — Titanium frame */}
            <div style={{
              width: phoneW + bezel * 2,
              height: phoneH + bezel * 2,
              borderRadius: frameRadius,
              background: isDark
                ? 'linear-gradient(145deg, #3a3a3c 0%, #1c1c1e 30%, #2c2c2e 60%, #1a1a1c 100%)'
                : 'linear-gradient(145deg, #e8e8ed 0%, #d1d1d6 30%, #e0e0e5 60%, #c7c7cc 100%)',
              padding: bezel,
              position: 'relative',
              boxShadow: isDark
                ? `0 50px 100px -20px rgba(0,0,0,0.8),
                   0 30px 60px -30px rgba(0,0,0,0.5),
                   0 0 0 0.5px rgba(255,255,255,0.15),
                   inset 0 1px 0 rgba(255,255,255,0.12),
                   inset 0 -1px 0 rgba(0,0,0,0.3)`
                : `0 50px 100px -20px rgba(0,0,0,0.25),
                   0 30px 60px -30px rgba(0,0,0,0.15),
                   0 0 0 0.5px rgba(0,0,0,0.12),
                   inset 0 1px 0 rgba(255,255,255,0.8),
                   inset 0 -1px 0 rgba(0,0,0,0.08)`,
              transition: 'box-shadow 0.4s ease',
            }}>

              {/* Inner screen area */}
              <div style={{
                width: phoneW,
                height: phoneH,
                borderRadius: frameRadius - bezel + 2,
                backgroundColor: theme.bg,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'background-color 0.4s ease',
              }}>

                {/* Dynamic Island */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 126,
                  height: 37,
                  backgroundColor: '#000000',
                  borderRadius: 22,
                  zIndex: 12,
                  boxShadow: '0 0 0 0.5px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 14,
                  gap: 8,
                }}>
                  {/* Camera lens */}
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #1a2744 0%, #0a1225 50%, #060d1a 100%)',
                    boxShadow: 'inset 0 0 2px rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.06)',
                  }} />
                </div>

                {/* Status Bar */}
                <StatusBar />

                {/* Screen content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {renderScreen()}
                </div>

                {/* Bottom Nav */}
                {showNav && <BottomNav active={screen} onChange={setScreen} />}

                {/* Home Indicator */}
                <div style={{
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: 6,
                  backgroundColor: showNav
                    ? (theme.mode === 'dark' ? 'rgba(16,40,38,0.95)' : 'rgba(255,255,255,0.95)')
                    : theme.bg,
                }}>
                  <div style={{
                    width: 134,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.18)',
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeCtx.Provider>
  )
}
