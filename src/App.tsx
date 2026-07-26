import { useState, useRef, useEffect, createContext, useContext } from 'react'
import {
  Home, TrendingUp, TrendingDown, ChevronRight,
  Bell, Plus, Settings, Shield, Globe, Moon, Sun, LogOut,
  Wallet, Target, Coffee, ShoppingBag, Car, Utensils,
  Dumbbell, Music, Film,
  ChevronLeft, Check, Send, Sparkles,
  BarChart3, ArrowRight, Download, Share2, Edit3, Trash2,
  RefreshCw, Eye, EyeOff, Lock, DollarSign, Activity, AlertTriangle, CreditCard,
  Clock, Mail, PieChart as PieIcon,
  ShieldCheck, Cpu, CheckCircle2, Calculator, FileText
} from 'lucide-react'
import {
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, Tooltip, ResponsiveContainer
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
  tooltipBg: string
  divider: string
  chartGrid: string
  tagBg: string
}

const darkTheme: Theme = {
  mode: 'dark',
  bg: '#081A18',
  surface: '#102826',
  surface2: '#163633',
  card: '#143834',
  border: '#1C4440',
  text: '#FFFFFF',
  textSec: '#B8C8C5',
  inputBg: '#163633',
  tooltipBg: '#102826',
  divider: '#1C4440',
  chartGrid: '#1C4440',
  tagBg: '#143834',
}

const lightTheme: Theme = {
  mode: 'light',
  bg: '#F2F7F6',
  surface: '#FFFFFF',
  surface2: '#EBF4F2',
  card: '#E2F0EE',
  border: '#D0E4E1',
  text: '#081A18',
  textSec: '#5C7A76',
  inputBg: '#F0F6F5',
  tooltipBg: '#FFFFFF',
  divider: '#E2F0EE',
  chartGrid: '#E2F0EE',
  tagBg: '#E2F0EE',
}

type Language = 'en' | 'ur' | 'ar' | 'es'
type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PKR' | 'SAR' | 'INR'

const currencyMap: Record<CurrencyCode, { symbol: string; name: string }> = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  PKR: { symbol: 'Rs ', name: 'Pakistani Rupee' },
  INR: { symbol: '₹ ', name: 'Indian Rupee' },
  SAR: { symbol: 'SR ', name: 'Saudi Riyal' },
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    goodMorning: "Good morning",
    totalBalance: "Total Balance",
    income: "Income",
    expenses: "Expenses",
    savings: "Savings",
    recentTransactions: "Recent Transactions",
    seeAll: "See all",
    monthlyBudget: "Monthly Budget",
    spendingTrend: "Spending Trend",
    aiInsight: "AI INSIGHT",
    profile: "Profile",
    settings: "Settings",
    nightMode: "Night Mode",
    resetApp: "Reset App Data",
    resetAppDesc: "Clear all transactions & budgets to $0.00",
    addExpense: "Add Expense",
    budgets: "Budgets",
    analytics: "Analytics",
    aiAssistant: "AI Assistant",
    paymentMethods: "Payment Methods",
    savingsGoals: "Savings Goals",
    security: "Security",
    currencyRegion: "Currency & Region",
    language: "Language",
    notifications: "Notifications",
    exportData: "Export Data",
    signOut: "Sign Out",
    noTransactions: "No transactions yet. Click Add to create one!",
    noBudgets: "No active budgets. Click See all to create one!",
    clearChat: "Clear Chat",
    askAnything: "Ask anything about your finances...",
    dangerZone: "Danger Zone",
    appVersion: "Version 2.4.1 · Build 2024.12",
  },
  ur: {
    goodMorning: "صبح بخیر",
    totalBalance: "کل بیلنس",
    income: "آمدنی",
    expenses: "اخراجات",
    savings: "بچت",
    recentTransactions: "حالیہ لین دین",
    seeAll: "تمام دیکھیں",
    monthlyBudget: "ماہانہ بجٹ",
    spendingTrend: "اخراجات کا رجحان",
    aiInsight: "ذیلی بصیرت",
    profile: "پروفائل",
    settings: "سیٹنگز",
    nightMode: "نائٹ موڈ",
    resetApp: "ایپ ری سیٹ کریں",
    resetAppDesc: "تمام ریکارڈز $0 پر ری سیٹ کریں",
    addExpense: "نیا خرچ شامل کریں",
    budgets: "بجٹس",
    analytics: "تجزیات",
    aiAssistant: "اے آئی اسسٹنٹ",
    paymentMethods: "ادائیگی کے طریقے",
    savingsGoals: "بچت کے اہداف",
    security: "سیکیورٹی",
    currencyRegion: "کرنسی اور علاقہ",
    language: "زبان",
    notifications: "اطلاعات",
    exportData: "ڈیٹا برآمد کریں",
    signOut: "سائن آؤٹ",
    noTransactions: "ابھی کوئی لین دین نہیں ہے۔ نیا شامل کریں!",
    noBudgets: "کوئی فعال بجٹ نہیں ہے۔ نیا بنائیں!",
    clearChat: "چیٹ صاف کریں",
    askAnything: "مالیات کے بارے میں کچھ بھی پوچھیں...",
    dangerZone: "خطرناک زون",
    appVersion: "ورژن 2.4.1 · بلڈ 2024.12",
  },
  ar: {
    goodMorning: "صباح الخير",
    totalBalance: "إجمالي الرصيد",
    income: "الدخل",
    expenses: "المصروفات",
    savings: "المدخرات",
    recentTransactions: "المعاملات الأخيرة",
    seeAll: "عرض الكل",
    monthlyBudget: "الميزانية الشهرية",
    spendingTrend: "اتجاه الإنفاق",
    aiInsight: "رؤية الذكاء الاصطناعي",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    nightMode: "الوضع الليلي",
    resetApp: "إعادة ضبط التطبيق",
    resetAppDesc: "مسح جميع البيانات إلى 0.00$",
    addExpense: "إضافة مصروف",
    budgets: "الميزانيات",
    analytics: "التحليلات",
    aiAssistant: "مساعد الذكاء الاصطناعي",
    paymentMethods: "طرق الدفع",
    savingsGoals: "أهداف الادخار",
    security: "الأمان",
    currencyRegion: "العملة والمنطقة",
    language: "اللغة",
    notifications: "الإشعارات",
    exportData: "تصدير البيانات",
    signOut: "تسجيل الخروج",
    noTransactions: "لا توجد معاملات بعد.",
    noBudgets: "لا توجد ميزانيات نشطة.",
    clearChat: "مسح المحادثة",
    askAnything: "اسأل أي شيء عن أموالك...",
    dangerZone: "منطقة الخطر",
    appVersion: "الإصدار 2.4.1 · البناء 2024.12",
  },
  es: {
    goodMorning: "Buenos días",
    totalBalance: "Balance Total",
    income: "Ingresos",
    expenses: "Gastos",
    savings: "Ahorros",
    recentTransactions: "Transacciones Recientes",
    seeAll: "Ver todo",
    monthlyBudget: "Presupuesto Mensual",
    spendingTrend: "Tendencia de Gastos",
    aiInsight: "ANÁLISIS IA",
    profile: "Perfil",
    settings: "Configuración",
    nightMode: "Modo Noche",
    resetApp: "Restablecer Datos",
    resetAppDesc: "Borrar todo a $0.00",
    addExpense: "Agregar Gasto",
    budgets: "Presupuestos",
    analytics: "Análisis",
    aiAssistant: "Asistente IA",
    paymentMethods: "Métodos de Pago",
    savingsGoals: "Metas de Ahorro",
    security: "Seguridad",
    currencyRegion: "Moneda y Región",
    language: "Idioma",
    notifications: "Notificaciones",
    exportData: "Exportar Datos",
    signOut: "Cerrar Sesión",
    noTransactions: "No hay transacciones aún.",
    noBudgets: "No hay presupuestos activos.",
    clearChat: "Borrar Chat",
    askAnything: "Pregunta cualquier cosa sobre tus finanzas...",
    dangerZone: "Zona de Peligro",
    appVersion: "Versión 2.4.1 · Build 2024.12",
  }
}

interface AppContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void
  lang: Language
  setLang: (l: Language) => void
  t: (key: string) => string
  formatMoney: (amount: number) => string
}

const AppCtx = createContext<AppContextType>({
  theme: darkTheme,
  isDark: false,
  toggleTheme: () => {},
  currency: 'USD',
  setCurrency: () => {},
  lang: 'en',
  setLang: () => {},
  t: (k: string) => k,
  formatMoney: (a: number) => `$${a}`,
})

const useApp = () => useContext(AppCtx)
const useTheme = () => useContext(AppCtx)

// ─── Constants ───────────────────────────────────────────────────────────────

type Screen = 'splash' | 'onboarding' | 'signin' | 'home' | 'budgets' | 'expenses' | 'ai' | 'analytics' | 'profile' | 'settings' | 'add-expense' | 'budget-detail' | 'notifications'

const EMERALD = '#2CC7A7'
const SUCCESS = '#39D98A'
const WARNING = '#F6C343'
const ERROR = '#FF5A5F'
const CARD_DARK_SOLID = '#143834'

// ─── Data ────────────────────────────────────────────────────────────────────

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

type ExpenseType = 'fixed' | 'miscellaneous'

type Transaction = {
  id: number; name: string; category: string; amount: number;
  date: string; icon: React.FC<any>; color: string;
  expenseType?: ExpenseType
}

const initTransactions: Transaction[] = [
  { id: 1, name: 'Starbucks', category: 'Food', amount: -8.50, date: 'Today, 9:30 AM', icon: Coffee, color: '#A0522D', expenseType: 'miscellaneous' },
  { id: 3, name: 'Amazon', category: 'Shopping', amount: -124.99, date: 'Yesterday', icon: ShoppingBag, color: '#F97316', expenseType: 'miscellaneous' },
  { id: 4, name: 'Uber', category: 'Transport', amount: -18.40, date: 'Yesterday', icon: Car, color: '#3B82F6' },
  { id: 5, name: 'Netflix', category: 'Entertainment', amount: -15.99, date: 'Dec 10', icon: Film, color: '#EF4444' },
  { id: 6, name: 'Gym', category: 'Health', amount: -49.00, date: 'Dec 10', icon: Dumbbell, color: SUCCESS },
  { id: 7, name: 'Spotify', category: 'Entertainment', amount: -9.99, date: 'Dec 9', icon: Music, color: '#1DB954' },
  { id: 8, name: 'Dinner', category: 'Food', amount: -67.20, date: 'Dec 9', icon: Utensils, color: '#EF4444' },
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
      backgroundColor: theme.mode === 'dark' ? '#0D211F' : '#FFFFFF',
      borderTop: `1px solid ${theme.border}`,
    }} className="flex items-center px-2 py-2">
      {items.map(item => {
        const isActive = item.id === active
        if (item.fab) return (
          <button key={item.id} onClick={() => onChange(item.id as Screen)}
            className="flex-1 flex flex-col items-center gap-1 py-1" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ width: 42, height: 42, borderRadius: 8, backgroundColor: EMERALD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(44,199,167,0.35)' }}>
              <Plus size={20} color="#081A18" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 10, color: theme.textSec }}>Add</span>
          </button>
        )
        return (
          <button key={item.id} onClick={() => onChange(item.id as Screen)}
            className="flex-1 flex flex-col items-center gap-1 py-1" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{ padding: '6px', borderRadius: 6, backgroundColor: isActive ? 'rgba(44,199,167,0.12)' : 'transparent', transition: 'background-color 0.2s' }}>
              <item.icon size={20} color={isActive ? EMERALD : theme.textSec} fill={isActive ? EMERALD : theme.textSec} strokeWidth={isActive ? 2 : 1.5} />
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
        <button onClick={() => isLast ? onNext() : setStep(s => s + 1)} style={{ backgroundColor: EMERALD, color: '#081A18', fontWeight: 700, fontSize: 15, padding: '16px', borderRadius: 8, width: '100%', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(44,199,167,0.25)' }}>
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
        <div>
          <label style={{ fontSize: 11, color: theme.textSec, fontWeight: 600, letterSpacing: 0.5 }}>EMAIL</label>
          <div style={{ backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', marginTop: 8, gap: 10 }}>
            <Mail size={16} color={theme.textSec} fill={theme.textSec} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@example.com" type="email"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: theme.text, fontSize: 14, padding: '14px 0' }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, color: theme.textSec, fontWeight: 600, letterSpacing: 0.5 }}>PASSWORD</label>
          <div style={{ backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', marginTop: 8, gap: 10 }}>
            <Lock size={16} color={theme.textSec} fill={theme.textSec} />
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
        <button onClick={onNext} style={{ backgroundColor: EMERALD, color: '#081A18', fontWeight: 700, fontSize: 15, padding: '16px', borderRadius: 8, width: '100%', border: 'none', cursor: 'pointer', marginTop: 4, boxShadow: '0 4px 14px rgba(44,199,167,0.25)' }}>Sign In</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
        <div style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
        <span style={{ color: theme.textSec, fontSize: 12 }}>or continue with</span>
        <div style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
      </div>
      <div className="flex gap-3">
        {['Google', 'Apple'].map(p => (
          <button key={p} style={{ flex: 1, padding: '14px', borderRadius: 8, background: 'none', border: `1px solid ${theme.border}`, color: theme.text, fontSize: 14, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <ShieldCheck size={16} color={EMERALD} fill={EMERALD} />
            {p}
          </button>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: theme.textSec }}>
        {"Don't have an account? "}<span style={{ color: EMERALD, cursor: 'pointer', fontWeight: 600 }}>Sign Up</span>
      </p>
    </div>
  )
}

function HomeScreen({ onNav, onOpenModal, monthlyBudgetLimit, transactions }: { onNav: (s: Screen) => void; onOpenModal: (m: string) => void; monthlyBudgetLimit: number; transactions: Transaction[] }) {
  const { theme, isDark, toggleTheme, t, formatMoney } = useApp()

  const fixedExpenses = transactions.filter(t => t.expenseType === 'fixed').reduce((s, t) => s + Math.abs(t.amount), 0)
  const miscExpenses = transactions.filter(t => t.expenseType !== 'fixed' && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const totalSpent = fixedExpenses + miscExpenses

  const budgetPct = monthlyBudgetLimit > 0 ? Math.min(Math.round((totalSpent / monthlyBudgetLimit) * 100), 100) : 0
  const budgetRemaining = Math.max(0, monthlyBudgetLimit - totalSpent)

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => onNav('profile')} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, overflow: 'hidden', border: `2px solid rgba(44,199,167,0.3)` }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: EMERALD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#081A18' }}>AJ</span>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 11, color: theme.textSec }}>{t('goodMorning')}</p>
            <p style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, color: theme.text }}>Alex Johnson</p>
          </div>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}`, cursor: 'pointer' }}>
            {isDark ? <Sun size={16} color={WARNING} fill={WARNING} /> : <Moon size={16} color={theme.textSec} fill={theme.textSec} />}
          </button>
          <button onClick={() => onNav('notifications')} style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}`, position: 'relative', cursor: 'pointer' }}>
            <Bell size={16} color={theme.textSec} fill={theme.textSec} />
            <div style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: 3, backgroundColor: ERROR, border: `1.5px solid ${theme.bg}` }} />
          </button>
        </div>
      </div>

      {/* Main Budget Card - Solid Dark Color */}
      <div style={{ padding: '0 20px', marginTop: 16 }}>
        <div style={{ backgroundColor: CARD_DARK_SOLID, borderRadius: 10, padding: '20px', boxShadow: '0 8px 24px rgba(8,26,24,0.15)', border: '1px solid rgba(44,199,167,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>Monthly Budget Limit</p>
              <p style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.8, marginTop: 4, color: '#FFFFFF' }}>{formatMoney(monthlyBudgetLimit)}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Spent: {formatMoney(totalSpent)}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>•</span>
                <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 600 }}>Left: {formatMoney(budgetRemaining)}</span>
              </div>
            </div>
            <div style={{ position: 'relative', width: 76, height: 76 }}>
              <CircleProgress value={totalSpent} max={monthlyBudgetLimit || 1} size={76} stroke={7} color="#FFFFFF" theme={{ ...theme, mode: 'dark' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{budgetPct}%</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <ProgressBar value={totalSpent} max={monthlyBudgetLimit || 1} color="#FFFFFF" height={6} theme={{ ...theme, mode: 'dark' }} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 20px', marginTop: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {[
            { icon: Plus, label: 'Add', action: () => onNav('add-expense') },
            { icon: Target, label: 'Set Budget', action: () => onOpenModal('set-budget') },
            { icon: BarChart3, label: 'Analytics', action: () => onNav('analytics') },
            { icon: Calculator, label: 'Calc', action: () => onOpenModal('calculator') },
            { icon: FileText, label: 'Notes', action: () => onOpenModal('notes') },
          ].map(({ icon: Icon, label, action }) => (
            <button key={label} onClick={action} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}` }}>
                <Icon size={18} color={EMERALD} fill={EMERALD} strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: 11, color: theme.textSec, fontWeight: 500 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Full Solid Green AI Insight Card */}
      <div style={{ padding: '0 20px', marginTop: 24 }}>
        <button onClick={() => onNav('ai')} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <div style={{ backgroundColor: EMERALD, borderRadius: 8, padding: '16px', boxShadow: '0 4px 16px rgba(44,199,167,0.3)', border: `1px solid ${EMERALD}` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#081A18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={18} color={EMERALD} fill={EMERALD} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#081A18', letterSpacing: 0.6 }}>TRACKIFY AI INSIGHT</span>
                  <ArrowRight size={16} color="#081A18" />
                </div>
                <p style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5, color: '#081A18', fontWeight: 600 }}>
                  {transactions.length === 0 ? (
                    "No expenses recorded yet. Tap here to get live AI advice for managing your fixed & daily budget!"
                  ) : (
                    <>You have <strong>{formatMoney(budgetRemaining)}</strong> remaining in your monthly budget. Tap here for personalized AI recommendations.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Transactions */}
      <div style={{ padding: '0 20px', marginTop: 24, paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={16} color={EMERALD} fill={EMERALD} />
            <span style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>{t('recentTransactions')}</span>
          </div>
          <button onClick={() => onNav('expenses')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: EMERALD }}>{t('seeAll')}</span>
            <ChevronRight size={14} color={EMERALD} />
          </button>
        </div>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, overflow: 'hidden', boxShadow: theme.mode === 'light' ? '0 2px 12px rgba(0,0,0,0.06)' : 'none' }}>
          {transactions.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '24px 16px', fontSize: 13, color: theme.textSec }}>
              {t('noTransactions')}
            </p>
          ) : (
            transactions.slice(0, 5).map((tItem, i) => (
              <div key={tItem.id}>
                {i > 0 && <div style={{ height: 1, backgroundColor: theme.divider, marginLeft: 64 }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: `${tItem.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <tItem.icon size={18} color={tItem.color} fill={tItem.color} strokeWidth={1.5} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, fontSize: 14, color: theme.text }}>{tItem.name}</p>
                    <p style={{ fontSize: 11, color: theme.textSec, marginTop: 2 }}>{tItem.date}</p>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: tItem.amount > 0 ? SUCCESS : theme.text }}>
                    {formatMoney(tItem.amount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function BudgetsScreen({ onNav, onOpenModal, monthlyBudgetLimit, transactions }: { onNav: (s: Screen) => void; onOpenModal: (m: string) => void; monthlyBudgetLimit: number; transactions: Transaction[] }) {
  const { theme, formatMoney } = useApp()

  const fixedExpenses = transactions.filter(t => t.expenseType === 'fixed').reduce((s, t) => s + Math.abs(t.amount), 0)
  const miscExpenses = transactions.filter(t => t.expenseType !== 'fixed' && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const totalSpent = fixedExpenses + miscExpenses

  const budgetPct = monthlyBudgetLimit > 0 ? Math.min(Math.round((totalSpent / monthlyBudgetLimit) * 100), 100) : 0
  const remaining = Math.max(0, monthlyBudgetLimit - totalSpent)

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={22} color={theme.text} />
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: theme.text }}>Monthly Budget</h1>
        </div>
        <button onClick={() => onOpenModal('set-budget')} style={{ backgroundColor: EMERALD, color: '#081A18', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Edit3 size={14} color="#081A18" /> Edit Budget
        </button>
      </div>

      {/* Main Budget Card */}
      <div style={{ padding: '0 20px', marginTop: 12 }}>
        <div style={{ backgroundColor: CARD_DARK_SOLID, borderRadius: 10, padding: '20px', boxShadow: '0 8px 24px rgba(8,26,24,0.15)', border: '1px solid rgba(44,199,167,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 600 }}>Set Monthly Limit</p>
              <p style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.8, marginTop: 4, color: '#FFFFFF' }}>{formatMoney(monthlyBudgetLimit)}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Spent: {formatMoney(totalSpent)}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>•</span>
                <span style={{ fontSize: 12, color: '#FFFFFF', fontWeight: 600 }}>Left: {formatMoney(remaining)}</span>
              </div>
            </div>
            <div style={{ position: 'relative', width: 76, height: 76 }}>
              <CircleProgress value={totalSpent} max={monthlyBudgetLimit || 1} size={76} stroke={7} color="#FFFFFF" theme={{ ...theme, mode: 'dark' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{budgetPct}%</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <ProgressBar value={totalSpent} max={monthlyBudgetLimit || 1} color="#FFFFFF" height={6} theme={{ ...theme, mode: 'dark' }} />
          </div>
        </div>
      </div>

      {/* Two Core Expense Categories */}
      <div style={{ padding: '0 20px', marginTop: 24, paddingBottom: 24 }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: theme.text, marginBottom: 12 }}>Expense Allocation</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Fixed Expenses Section */}
          <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lock size={18} color="#60A5FA" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>Fixed Expenses</p>
                  <p style={{ fontSize: 11, color: theme.textSec }}>Rent, Bills, School Fees, Subscriptions</p>
                </div>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{formatMoney(fixedExpenses)}</span>
            </div>
            <ProgressBar value={fixedExpenses} max={monthlyBudgetLimit || 1} color="#60A5FA" height={6} theme={theme} />
          </div>

          {/* Miscellaneous Expenses Section */}
          <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(44,199,167,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={18} color={EMERALD} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>Miscellaneous Expenses</p>
                  <p style={{ fontSize: 11, color: theme.textSec }}>Dining, Shopping, Daily Cash, Ad-hoc</p>
                </div>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{formatMoney(miscExpenses)}</span>
            </div>
            <ProgressBar value={miscExpenses} max={monthlyBudgetLimit || 1} color={EMERALD} height={6} theme={theme} />
          </div>        </div>
      </div>
    </div>
  )
}

function BudgetDetailScreen({ onBack, theme }: { onBack: () => void; theme: Theme }) {
  const { formatMoney } = useApp()
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
        <div style={{ backgroundColor: CARD_DARK_SOLID, borderRadius: 10, padding: '24px', boxShadow: '0 8px 24px rgba(8,26,24,0.15)', border: '1px solid rgba(44,199,167,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Budget Remaining</p>
              <p style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1, marginTop: 4, color: '#FFFFFF' }}>{formatMoney(Math.max(0, budget.total - budget.spent))}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>of {formatMoney(budget.total)} total</p>
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
              <Tooltip contentStyle={{ backgroundColor: theme.tooltipBg, border: `1px solid ${theme.border}`, borderRadius: 8, fontSize: 12, color: theme.text }} formatter={(v: any) => [`$${v}`, 'Spent']} />
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
  const { theme, formatMoney } = useApp()
  const [filter, setFilter] = useState<'All' | 'Fixed' | 'Misc'>('All')
  const [confirmId, setConfirmId] = useState<number | null>(null)

  const fixedTx = transactions.filter(t => t.expenseType === 'fixed')
  const miscTx = transactions.filter(t => t.expenseType !== 'fixed')

  const fixedTotal = fixedTx.reduce((s, t) => s + Math.abs(t.amount), 0)
  const miscTotal = miscTx.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)

  const displayedFixed = filter === 'Misc' ? [] : fixedTx
  const displayedMisc = filter === 'Fixed' ? [] : miscTx

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

      {/* Header */}
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={22} color={theme.text} />
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: theme.text }}>Expense Manager</h1>
        </div>
        <button onClick={() => onNav('add-expense')} style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: EMERALD, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <Plus size={18} color="#081A18" strokeWidth={2.5} />
        </button>
      </div>

      {/* Category Breakdown Card */}
      <div style={{ padding: '0 20px', marginTop: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '14px', border: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Lock size={14} color="#60A5FA" />
              <p style={{ fontSize: 11, color: theme.textSec, fontWeight: 600 }}>Fixed Expenses</p>
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{formatMoney(fixedTotal)}</p>
            <p style={{ fontSize: 10, color: theme.textSec, marginTop: 4 }}>Rent, Bills, School Fees</p>
          </div>
          <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '14px', border: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <ShoppingBag size={14} color={EMERALD} />
              <p style={{ fontSize: 11, color: theme.textSec, fontWeight: 600 }}>Miscellaneous</p>
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{formatMoney(miscTotal)}</p>
            <p style={{ fontSize: 10, color: theme.textSec, marginTop: 4 }}>Food, Shopping, Ad-hoc</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ padding: '0 20px', marginTop: 16 }}>
        <div style={{ display: 'flex', backgroundColor: theme.surface, borderRadius: 6, padding: 3, border: `1px solid ${theme.border}` }}>
          {[
            { id: 'All', label: 'All Expenses' },
            { id: 'Fixed', label: '📌 Fixed' },
            { id: 'Misc', label: '🛒 Miscellaneous' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              style={{
                flex: 1, padding: '6px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                backgroundColor: filter === f.id ? EMERALD : 'transparent',
                color: filter === f.id ? '#081A18' : theme.textSec,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div style={{ padding: '0 20px', marginTop: 16, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {transactions.length === 0 ? (
          <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '32px 20px', textAlign: 'center', border: `1px solid ${theme.border}` }}>
            <CreditCard size={32} color={theme.textSec} fill={theme.textSec} strokeWidth={1.5} style={{ margin: '0 auto 12px' }} />
            <p style={{ color: theme.text, fontSize: 14, fontWeight: 600 }}>No expenses recorded yet.</p>
            <p style={{ color: theme.textSec, fontSize: 12, marginTop: 4 }}>Tap the + button to add your Fixed or Miscellaneous expenses.</p>
          </div>
        ) : (
          <>
            {/* Section 1: Fixed Expenses */}
            {displayedFixed.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: theme.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lock size={13} color="#60A5FA" /> Fixed Expenses ({displayedFixed.length})
                </p>
                <div style={{ backgroundColor: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                  {displayedFixed.map((t, i) => (
                    <div key={t.id}>
                      {i > 0 && <div style={{ height: 1, backgroundColor: theme.divider, marginLeft: 56 }} />}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Lock size={16} color="#60A5FA" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: 13, color: theme.text }}>{t.name}</p>
                          <p style={{ fontSize: 10, color: theme.textSec, marginTop: 2 }}>{t.category} · {t.date}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: theme.text }}>{formatMoney(t.amount)}</span>
                          <button onClick={() => setConfirmId(t.id)} style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: 'rgba(255,90,95,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                            <Trash2 size={12} color={ERROR} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Miscellaneous Expenses */}
            {displayedMisc.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: theme.text, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShoppingBag size={13} color={EMERALD} /> Miscellaneous Expenses ({displayedMisc.length})
                </p>
                <div style={{ backgroundColor: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                  {displayedMisc.map((t, i) => (
                    <div key={t.id}>
                      {i > 0 && <div style={{ height: 1, backgroundColor: theme.divider, marginLeft: 56 }} />}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(44,199,167,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <t.icon size={16} color={EMERALD} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: 13, color: theme.text }}>{t.name}</p>
                          <p style={{ fontSize: 10, color: theme.textSec, marginTop: 2 }}>{t.category} · {t.date}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: t.amount > 0 ? SUCCESS : theme.text }}>
                            {t.amount > 0 ? '+' : ''}{formatMoney(t.amount)}
                          </span>
                          <button onClick={() => setConfirmId(t.id)} style={{ width: 26, height: 26, borderRadius: 6, backgroundColor: 'rgba(255,90,95,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                            <Trash2 size={12} color={ERROR} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function AddExpenseScreen({ onBack, onAdd }: { onBack: () => void; onAdd?: (t: Omit<Transaction, 'id'>) => void }) {
  const { theme, currency } = useApp()
  const symbol = currencyMap[currency]?.symbol || '$'
  const [amount, setAmount] = useState('0')
  const [category, setCategory] = useState('Food')
  const [expenseType, setExpenseType] = useState<ExpenseType>('miscellaneous')
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

  const handleSave = () => {
    const val = parseFloat(amount)
    if (val > 0 && onAdd) {
      onAdd({
        name: note.trim() || `${category} (${expenseType === 'fixed' ? 'Fixed' : 'Misc'})`,
        category,
        amount: -val,
        date: 'Just now',
        icon: expenseType === 'fixed' ? Lock : Utensils,
        color: expenseType === 'fixed' ? '#60A5FA' : EMERALD,
        expenseType,
      })
    }
    onBack()
  }

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft size={22} color={theme.text} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>Add Expense</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0 12px' }}>
        <p style={{ fontSize: 11, color: theme.textSec, letterSpacing: 0.5, marginBottom: 4 }}>AMOUNT ({symbol.trim()})</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 24, color: EMERALD, fontWeight: 700 }}>{symbol}</span>
          <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: -2, color: theme.text }}>{amount}</span>
        </div>
      </div>

      {/* Expense Type Toggle: Fixed vs Miscellaneous */}
      <div style={{ padding: '0 20px', marginBottom: 12 }}>
        <p style={{ fontSize: 10, color: theme.textSec, letterSpacing: 0.5, marginBottom: 6, fontWeight: 700 }}>EXPENSE TYPE</p>
        <div style={{ display: 'flex', backgroundColor: theme.surface, borderRadius: 8, padding: 3, border: `1px solid ${theme.border}` }}>
          <button
            onClick={() => setExpenseType('fixed')}
            style={{
              flex: 1, padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 700,
              backgroundColor: expenseType === 'fixed' ? EMERALD : 'transparent',
              color: expenseType === 'fixed' ? '#081A18' : theme.textSec,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}
          >
            <Lock size={13} color={expenseType === 'fixed' ? '#081A18' : theme.textSec} />
            Fixed Expense
          </button>
          <button
            onClick={() => setExpenseType('miscellaneous')}
            style={{
              flex: 1, padding: '8px', borderRadius: 6, fontSize: 12, fontWeight: 700,
              backgroundColor: expenseType === 'miscellaneous' ? EMERALD : 'transparent',
              color: expenseType === 'miscellaneous' ? '#081A18' : theme.textSec,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
            }}
          >
            <ShoppingBag size={13} color={expenseType === 'miscellaneous' ? '#081A18' : theme.textSec} />
            Miscellaneous
          </button>
        </div>
      </div>

      <div style={{ padding: '0 20px', marginBottom: 12 }}>
        <p style={{ fontSize: 10, color: theme.textSec, letterSpacing: 0.5, marginBottom: 6, fontWeight: 700 }}>CATEGORY</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          {cats.map(c => (
            <button key={c.label} onClick={() => setCategory(c.label)} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: `1px solid ${category === c.label ? `${c.color}44` : theme.border}`, cursor: 'pointer', backgroundColor: category === c.label ? `${c.color}15` : theme.surface, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transition: 'all 0.2s' }}>
              <c.icon size={16} color={category === c.label ? c.color : theme.textSec} fill={category === c.label ? c.color : 'none'} strokeWidth={1.5} />
              <span style={{ fontSize: 9, color: category === c.label ? c.color : theme.textSec, fontWeight: 600 }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px', marginBottom: 12 }}>
        <div style={{ backgroundColor: theme.inputBg, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', border: `1px solid ${theme.border}`, gap: 10 }}>
          <Edit3 size={15} color={theme.textSec} fill={theme.textSec} />
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: theme.text, fontSize: 13, padding: '10px 0' }} />
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: theme.surface, borderTop: `1px solid ${theme.border}`, padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {['1','2','3','4','5','6','7','8','9','.','0','del'].map(k => (
            <button key={k} onClick={() => handleNum(k)} style={{ padding: '12px', borderRadius: 8, backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: 'none', fontSize: 18, fontWeight: 600, color: theme.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {k === 'del' ? '⌫' : k}
            </button>
          ))}
        </div>
        <button onClick={handleSave} style={{ backgroundColor: EMERALD, color: '#081A18', fontWeight: 700, fontSize: 15, padding: '12px', borderRadius: 8, width: '100%', border: 'none', cursor: 'pointer', marginTop: 10, boxShadow: '0 4px 14px rgba(44,199,167,0.25)' }}>
          Save Expense
        </button>
      </div>
    </div>
  )
}

function AIScreen({ onNav }: { onNav: (s: Screen) => void }) {
  const { theme, t } = useApp()
  const [messages, setMessages] = useState(aiMessages)
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const sendText = (textToSend: string) => {
    const txt = textToSend.trim()
    if (!txt) return
    let reply = "Based on your spending data, I'd recommend reviewing your subscriptions — you're spending $89/month on services you might be underusing. Consider auditing them this week to save up to $45/month."
    if (txt.includes("patterns")) reply = "Your main spending spike occurs on Fridays & Saturdays (averaging $540/weekend). Setting a weekend cap of $250 will boost your monthly savings by 24%."
    if (txt.includes("costs")) reply = "You can cut costs by: 1) Canceling unused streaming apps ($34/mo), 2) Dining out 2 fewer days per week ($180/mo), 3) Switching to annual gym membership ($15/mo savings)."
    if (txt.includes("goal")) reply = "Goal Created: 'Emergency Fund ($5,000)'. At your current savings rate of $430/month, you will reach this goal in 11.5 months!"
    if (txt.includes("Predict")) reply = "Based on recurring bills & seasonal trends, your estimated expenses next month will be approximately $2,650 ($190 lower than this month)."

    setMessages(m => [...m, { role: 'user', content: txt }, { role: 'ai', content: reply }])
    setInput('')
    setTimeout(() => scrollRef.current?.scrollTo({ top: 9999, behavior: 'smooth' }), 100)
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div style={{ backgroundColor: theme.bg, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ flexShrink: 0, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={22} color={theme.text} />
          </button>
          <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: 'rgba(44,199,167,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={18} color={EMERALD} fill={EMERALD} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>Trackify AI Advisor</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: SUCCESS }} />
              <p style={{ fontSize: 11, color: theme.textSec }}>Live Budget Intelligence</p>
            </div>
          </div>
        </div>
        <button onClick={clearChat} style={{ backgroundColor: 'rgba(255,90,95,0.12)', border: `1px solid ${ERROR}40`, borderRadius: 6, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: ERROR, fontSize: 12, fontWeight: 600 }}>
          <Trash2 size={13} color={ERROR} />
          {t('clearChat')}
        </button>
      </div>

      {/* Message History */}
      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', padding: '24px 16px' }}>
            <Sparkles size={32} color={EMERALD} style={{ margin: '0 auto 12px', opacity: 0.6 }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Chat Cleared</p>
            <p style={{ fontSize: 12, color: theme.textSec, marginTop: 4 }}>Ask a question below to start a new conversation with your AI financial advisor.</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: 8 }} className="animate-fade-in">
              {m.role === 'ai' && (
                <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: 'rgba(44,199,167,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Sparkles size={13} color={EMERALD} fill={EMERALD} />
                </div>
              )}
              <div style={{ maxWidth: '78%', backgroundColor: m.role === 'user' ? CARD_DARK_SOLID : theme.surface, color: m.role === 'user' ? '#FFFFFF' : theme.text, borderRadius: 8, padding: '10px 14px', fontSize: 13, lineHeight: 1.6, border: m.role === 'user' ? '1px solid rgba(44,199,167,0.3)' : `1px solid ${theme.border}` }}>
                {m.content}
              </div>
            </div>
          ))
        )}
        {messages.length <= 4 && (
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 11, color: theme.textSec, marginBottom: 8 }}>Suggested questions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => sendText(s)} style={{ padding: '10px 14px', borderRadius: 8, textAlign: 'left', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, color: theme.textSec, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Cpu size={14} color={EMERALD} fill={EMERALD} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Input Bar */}
      <div style={{ flexShrink: 0, padding: '10px 16px 14px', borderTop: `1px solid ${theme.border}`, backgroundColor: theme.bg }}>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, padding: '4px 4px 4px 14px', border: `1px solid ${theme.border}` }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendText(input)} placeholder={t('askAnything')} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: theme.text, fontSize: 13, padding: '10px 0' }} />
          <button onClick={() => sendText(input)} style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: input ? EMERALD : theme.card, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            <Send size={15} color={input ? '#081A18' : theme.textSec} fill={input ? '#081A18' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  )
}

function AnalyticsScreen({ onNav, transactions }: { onNav: (s: Screen) => void; transactions: Transaction[] }) {
  const { theme, t, formatMoney } = useApp()

  const fixedExpenses = transactions.filter(t => t.expenseType === 'fixed').reduce((s, t) => s + Math.abs(t.amount), 0)
  const miscExpenses = transactions.filter(t => t.expenseType !== 'fixed' && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const totalSpent = fixedExpenses + miscExpenses
  const avgDaily = totalSpent > 0 ? totalSpent / 30 : 0

  const metrics = [
    { label: 'Total Spent', value: formatMoney(totalSpent), change: transactions.length > 0 ? '-8.2%' : '0%', up: false },
    { label: 'Fixed Expenses', value: formatMoney(fixedExpenses), change: transactions.length > 0 ? 'Fixed' : '0%', up: true },
    { label: 'Misc Expenses', value: formatMoney(miscExpenses), change: transactions.length > 0 ? 'Daily' : '0%', up: true },
    { label: 'Avg Daily Spend', value: formatMoney(avgDaily), change: transactions.length > 0 ? '-5.3%' : '0%', up: false },
  ]

  const dynamicWeeklyData = transactions.length > 0 ? weeklyData : weeklyData.map(w => ({ ...w, income: 0, expense: 0 }))

  // Calculate Category breakdown dynamically
  const categoryTotals: Record<string, number> = {}
  transactions.filter(t => t.amount < 0).forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount)
  })
  const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0)
  const categoryColors: Record<string, string> = { Food: '#EF4444', Shopping: '#F97316', Transport: '#3B82F6', Entertainment: '#A855F7', Health: SUCCESS, General: EMERALD }
  const dynamicCategories = Object.entries(categoryTotals).map(([name, val]) => ({
    name,
    value: totalExpenses > 0 ? Math.round((val / totalExpenses) * 100) : 0,
    color: categoryColors[name] || EMERALD
  }))

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={22} color={theme.text} />
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: theme.text }}>{t('analytics')}</h1>
        </div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {metrics.map(s => (
          <div key={s.label} style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '14px', border: `1px solid ${theme.border}`, boxShadow: theme.mode === 'light' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            <p style={{ fontSize: 11, color: theme.textSec }}>{s.label}</p>
            <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5, marginTop: 4, color: theme.text }}>{s.value}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {s.up ? <TrendingUp size={11} color={SUCCESS} /> : <TrendingDown size={11} color={ERROR} />}
              <span style={{ fontSize: 11, color: s.up ? SUCCESS : ERROR }}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 20px', marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <BarChart3 size={16} color={EMERALD} fill={EMERALD} />
          <p style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>Weekly Overview</p>
        </div>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}` }}>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={dynamicWeeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <PieIcon size={16} color={EMERALD} fill={EMERALD} />
          <p style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>Spending Categories</p>
        </div>
        <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}` }}>
          {dynamicCategories.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '16px 0', fontSize: 13, color: theme.textSec }}>
              No category expense data recorded yet.
            </p>
          ) : (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ flexShrink: 0 }}>
                <ResponsiveContainer width={120} height={120}>
                  <RechartsPie>
                    <Pie data={dynamicCategories} cx="50%" cy="50%" innerRadius={38} outerRadius={55} dataKey="value" paddingAngle={3}>
                      {dynamicCategories.map((c, i) => <Cell key={i} fill={c.color} />)}
                    </Pie>
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dynamicCategories.map(c => (
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
          )}
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

function SecurityModal({ onClose, theme }: { onClose: () => void; theme: Theme }) {
  const [pin, setPin] = useState('')
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: theme.surface, borderRadius: '12px 12px 0 0', padding: '24px 20px 36px', width: '100%', maxWidth: 390, border: `1px solid ${theme.border}`, borderBottom: 'none' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 17, color: theme.text }}>Security & PIN</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textSec, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
        </div>
        <p style={{ fontSize: 12, color: theme.textSec, marginBottom: 12 }}>Enter a new 4-digit PIN code for quick app authentication:</p>
        <div style={{ backgroundColor: theme.inputBg, borderRadius: 8, padding: '0 14px', border: `1px solid ${theme.border}`, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Lock size={16} color={theme.textSec} />
          <input value={pin} onChange={e => setPin(e.target.value.slice(0, 4))} type="password" placeholder="••••" maxLength={4} style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: theme.text, fontSize: 18, letterSpacing: 6, padding: '12px 0' }} />
        </div>
        <button onClick={onClose} style={{ width: '100%', padding: '14px', borderRadius: 8, backgroundColor: EMERALD, color: '#081A18', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>Update PIN</button>
      </div>
    </div>
  )
}

function CurrencyModal({ onClose, selected, onSelect, theme }: { onClose: () => void; selected: CurrencyCode; onSelect: (c: CurrencyCode) => void; theme: Theme }) {
  const currencies: { code: CurrencyCode; name: string; symbol: string }[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR' },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: theme.surface, borderRadius: '12px 12px 0 0', padding: '24px 20px 36px', width: '100%', maxWidth: 390, border: `1px solid ${theme.border}`, borderBottom: 'none' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 17, color: theme.text }}>Currency & Region</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textSec, cursor: 'pointer', fontSize: 13 }}>Done</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {currencies.map(c => (
            <button key={c.code} onClick={() => { onSelect(c.code); onClose() }} style={{ padding: '12px 16px', borderRadius: 8, backgroundColor: selected === c.code ? 'rgba(44,199,167,0.12)' : theme.inputBg, border: `1px solid ${selected === c.code ? EMERALD : theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: selected === c.code ? EMERALD : theme.text }}>{c.name} ({c.symbol})</span>
              <span style={{ fontSize: 12, color: theme.textSec, fontWeight: 700 }}>{c.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function LanguageModal({ onClose, selected, onSelect, theme }: { onClose: () => void; selected: Language; onSelect: (l: Language) => void; theme: Theme }) {
  const languages: { code: Language; name: string; native: string }[] = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'es', name: 'Spanish', native: 'Español' },
  ]
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: theme.surface, borderRadius: '12px 12px 0 0', padding: '24px 20px 36px', width: '100%', maxWidth: 390, border: `1px solid ${theme.border}`, borderBottom: 'none' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p style={{ fontWeight: 700, fontSize: 17, color: theme.text }}>Language / زبان</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textSec, cursor: 'pointer', fontSize: 13 }}>Done</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {languages.map(l => (
            <button key={l.code} onClick={() => { onSelect(l.code); onClose() }} style={{ padding: '14px 16px', borderRadius: 8, backgroundColor: selected === l.code ? 'rgba(44,199,167,0.12)' : theme.inputBg, border: `1px solid ${selected === l.code ? EMERALD : theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: selected === l.code ? EMERALD : theme.text }}>{l.name}</span>
              <span style={{ fontSize: 14, color: selected === l.code ? EMERALD : theme.textSec, fontWeight: 700 }}>{l.native}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function CalculatorModal({ onClose, theme }: { onClose: () => void; theme: Theme }) {
  const [display, setDisplay] = useState('0')
  const [expr, setExpr] = useState('')

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('0')
      setExpr('')
      return
    }
    if (val === '=') {
      try {
        const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/')
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${sanitized})`)()
        setDisplay(String(res))
        setExpr(String(res))
      } catch {
        setDisplay('Error')
      }
      return
    }
    if (['+', '-', '×', '÷'].includes(val)) {
      setExpr(prev => prev + ' ' + val + ' ')
      setDisplay(val)
      return
    }
    setExpr(prev => (prev === '0' ? val : prev + val))
    setDisplay(prev => (prev === '0' || ['+', '-', '×', '÷'].includes(prev) ? val : prev + val))
  }

  const buttons = [
    ['C', '÷', '×', '-'],
    ['7', '8', '9', '+'],
    ['4', '5', '6', '='],
    ['1', '2', '3', '0'],
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: theme.surface, borderRadius: '12px 12px 0 0', padding: '20px 20px 32px', width: '100%', maxWidth: 390, border: `1px solid ${theme.border}`, borderBottom: 'none' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, margin: '0 auto 14px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calculator size={18} color={EMERALD} />
            <p style={{ fontWeight: 700, fontSize: 16, color: theme.text }}>Expense Calculator</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textSec, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Done</button>
        </div>

        {/* Display */}
        <div style={{ backgroundColor: theme.inputBg, borderRadius: 8, padding: '12px 16px', textAlign: 'right', marginBottom: 14, border: `1px solid ${theme.border}` }}>
          <p style={{ fontSize: 11, color: theme.textSec, minHeight: 14 }}>{expr || '0'}</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: theme.text, marginTop: 2 }}>{display}</p>
        </div>

        {/* Keypad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {buttons.map((row, rIdx) => (
            <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {row.map(btn => {
                const isOp = ['+', '-', '×', '÷', '='].includes(btn)
                const isC = btn === 'C'
                return (
                  <button key={btn} onClick={() => handlePress(btn)} style={{ padding: '14px 0', borderRadius: 8, border: `1px solid ${isOp ? EMERALD : theme.border}`, backgroundColor: isOp ? EMERALD : isC ? 'rgba(255,90,95,0.15)' : theme.surface2, color: isOp ? '#081A18' : isC ? ERROR : theme.text, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                    {btn}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function NotesModal({ onClose, theme }: { onClose: () => void; theme: Theme }) {
  const [notes, setNotes] = useState<{ id: number; text: string; date: string }[]>([
    { id: 1, text: 'Review electric bill before 15th Dec', date: 'Today' },
    { id: 2, text: 'Compare annual health insurance plans', date: 'Yesterday' },
  ])
  const [newNote, setNewNote] = useState('')

  const addNote = () => {
    if (!newNote.trim()) return
    setNotes(n => [{ id: Date.now(), text: newNote.trim(), date: 'Just now' }, ...n])
    setNewNote('')
  }

  const deleteNote = (id: number) => {
    setNotes(n => n.filter(x => x.id !== id))
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: theme.surface, borderRadius: '12px 12px 0 0', padding: '20px 20px 32px', width: '100%', maxWidth: 390, border: `1px solid ${theme.border}`, borderBottom: 'none', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, margin: '0 auto 14px', flexShrink: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} color={EMERALD} />
            <p style={{ fontWeight: 700, fontSize: 16, color: theme.text }}>Financial Notes</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textSec, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Done</button>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexShrink: 0 }}>
          <input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote()} placeholder="Add a budget note or reminder..." style={{ flex: 1, backgroundColor: theme.inputBg, borderRadius: 8, padding: '10px 14px', border: `1px solid ${theme.border}`, outline: 'none', color: theme.text, fontSize: 13 }} />
          <button onClick={addNote} style={{ padding: '10px 16px', borderRadius: 8, backgroundColor: EMERALD, color: '#081A18', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Add</button>
        </div>

        {/* Notes List */}
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notes.length === 0 ? (
            <p style={{ textAlign: 'center', color: theme.textSec, fontSize: 13, padding: '20px 0' }}>No notes saved yet.</p>
          ) : (
            notes.map(n => (
              <div key={n.id} style={{ backgroundColor: theme.inputBg, borderRadius: 8, padding: '12px 14px', border: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <div>
                  <p style={{ fontSize: 13, color: theme.text, lineHeight: 1.4 }}>{n.text}</p>
                  <p style={{ fontSize: 10, color: theme.textSec, marginTop: 4 }}>{n.date}</p>
                </div>
                <button onClick={() => deleteNote(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
                  <Trash2 size={13} color={ERROR} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function SetBudgetModal({ onClose, currentLimit, onSave, theme }: { onClose: () => void; currentLimit: number; onSave: (val: number) => void; theme: Theme }) {
  const { currency } = useApp()
  const symbol = currencyMap[currency]?.symbol || '$'
  const [val, setVal] = useState(String(currentLimit || 3000))

  const handleSave = () => {
    const num = parseFloat(val)
    if (!isNaN(num) && num > 0) {
      onSave(num)
      onClose()
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: theme.surface, borderRadius: '12px 12px 0 0', padding: '24px 20px 36px', width: '100%', maxWidth: 390, border: `1px solid ${theme.border}`, borderBottom: 'none' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wallet size={18} color={EMERALD} fill={EMERALD} />
            <p style={{ fontWeight: 700, fontSize: 17, color: theme.text }}>Set Monthly Budget</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textSec, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Cancel</button>
        </div>

        <p style={{ fontSize: 12, color: theme.textSec, marginBottom: 14, lineHeight: 1.5 }}>
          Set your overall monthly budget limit once. Trackify will monitor your Fixed and Miscellaneous expenses against this limit.
        </p>

        <div style={{ backgroundColor: theme.inputBg, borderRadius: 8, padding: '12px 16px', border: `1px solid ${theme.border}`, marginBottom: 20 }}>
          <p style={{ fontSize: 10, color: theme.textSec, fontWeight: 700, letterSpacing: 0.5 }}>MONTHLY BUDGET LIMIT ({symbol.trim()})</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: EMERALD }}>{symbol}</span>
            <input
              type="number"
              value={val}
              onChange={e => setVal(e.target.value)}
              placeholder="3000"
              style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: theme.text, fontSize: 28, fontWeight: 700 }}
            />
          </div>
        </div>

        <button onClick={handleSave} style={{ width: '100%', padding: '14px', borderRadius: 8, backgroundColor: EMERALD, color: '#081A18', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(44,199,167,0.3)' }}>
          Save Monthly Budget
        </button>
      </div>
    </div>
  )
}

function ShareNotebookModal({ onClose, theme }: { onClose: () => void; theme: Theme }) {
  const [copied, setCopied] = useState(false)
  const shareCode = 'TRACKIFY-PKR-9842'

  const copyCode = () => {
    navigator.clipboard.writeText(shareCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: theme.surface, borderRadius: '12px 12px 0 0', padding: '24px 20px 36px', width: '100%', maxWidth: 390, border: `1px solid ${theme.border}`, borderBottom: 'none' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Share2 size={18} color={EMERALD} />
            <p style={{ fontWeight: 700, fontSize: 17, color: theme.text }}>Share Budget Notebook</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textSec, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Done</button>
        </div>

        <p style={{ fontSize: 12, color: theme.textSec, marginBottom: 14, lineHeight: 1.5 }}>
          Share your family or household budget notebook code with members to track fixed & daily expenses together live.
        </p>

        <div style={{ backgroundColor: theme.inputBg, borderRadius: 8, padding: '14px 16px', border: `1px dashed ${EMERALD}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 10, color: theme.textSec, fontWeight: 700, letterSpacing: 0.5 }}>HOUSEHOLD JOIN CODE</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: EMERALD, letterSpacing: 1, marginTop: 2 }}>{shareCode}</p>
          </div>
          <button onClick={copyCode} style={{ padding: '8px 14px', borderRadius: 6, backgroundColor: EMERALD, color: '#081A18', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
    </div>
  )
}

function RemindersModal({ onClose, theme }: { onClose: () => void; theme: Theme }) {
  const reminders = [
    { id: 1, title: 'House Rent Bill', due: '1st of every month', amount: 850 },
    { id: 2, title: 'Electricity & Gas Bill', due: '15th of every month', amount: 140 },
    { id: 3, title: 'Internet Subscription', due: '20th of every month', amount: 45 },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: theme.surface, borderRadius: '12px 12px 0 0', padding: '24px 20px 36px', width: '100%', maxWidth: 390, border: `1px solid ${theme.border}`, borderBottom: 'none', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, margin: '0 auto 16px', flexShrink: 0 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={18} color={EMERALD} />
            <p style={{ fontWeight: 700, fontSize: 17, color: theme.text }}>Fixed Bill Reminders</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textSec, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Done</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reminders.map(r => (
            <div key={r.id} style={{ backgroundColor: theme.inputBg, borderRadius: 8, padding: '12px 14px', border: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{r.title}</p>
                <p style={{ fontSize: 11, color: theme.textSec, marginTop: 2 }}>Due: {r.due}</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: ERROR }}>${r.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ResetConfirmModal({ onClose, onConfirm, theme }: { onClose: () => void; onConfirm: () => void; theme: Theme }) {
  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ backgroundColor: theme.surface, borderRadius: '12px 12px 0 0', padding: '24px 20px 36px', width: '100%', maxWidth: 390, border: `1px solid ${theme.border}`, borderBottom: 'none' }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, margin: '0 auto 20px' }} />
        <div style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: 'rgba(255,90,95,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: `1px solid ${ERROR}40` }}>
          <AlertTriangle size={28} color={ERROR} fill={ERROR} />
        </div>
        <p style={{ textAlign: 'center', fontWeight: 700, fontSize: 18, color: theme.text }}>Reset All App Data?</p>
        <p style={{ textAlign: 'center', fontSize: 13, color: theme.textSec, marginTop: 8, lineHeight: 1.5 }}>
          ⚠️ <strong>Warning:</strong> This will permanently erase all custom transactions, budgets, AI history, and restore default settings. This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: 6, border: `1px solid ${theme.border}`, backgroundColor: theme.surface2, color: theme.text, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '14px', borderRadius: 6, border: 'none', backgroundColor: ERROR, color: '#FFFFFF', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,90,95,0.3)' }}>
            Yes, Reset
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileScreen({ onNav, onOpenModal, monthlyBudgetLimit, transactions }: { onNav: (s: Screen) => void; onOpenModal: (m: string) => void; monthlyBudgetLimit: number; transactions: Transaction[] }) {
  const { theme, isDark, toggleTheme, t, formatMoney } = useApp()
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)

  const menuItems = [
    { icon: Shield, label: t('security'), action: () => onOpenModal('security'), color: theme.textSec },
    { icon: Globe, label: t('currencyRegion'), action: () => onOpenModal('currency'), color: theme.textSec },
    { icon: Globe, label: t('language'), action: () => onOpenModal('language'), color: EMERALD },
    { icon: Bell, label: t('notifications'), action: () => onNav('notifications'), color: theme.textSec },
    { icon: Download, label: t('exportData'), action: () => onOpenModal('export'), color: theme.textSec },
    { icon: Settings, label: t('settings'), action: () => onNav('settings'), color: theme.textSec },
    { icon: Trash2, label: t('resetApp'), action: () => onOpenModal('reset'), color: ERROR },
    { icon: LogOut, label: t('signOut'), action: () => onNav('signin'), color: ERROR },
  ]
  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => onNav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={22} color={theme.text} />
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, color: theme.text }}>{t('profile')}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}`, cursor: 'pointer' }}>
            {isDark ? <Sun size={16} color={WARNING} fill={WARNING} /> : <Moon size={16} color={theme.textSec} fill={theme.textSec} />}
          </button>
          <button onClick={() => onNav('settings')} style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: theme.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${theme.border}`, cursor: 'pointer' }}>
            <Settings size={16} color={theme.textSec} fill={theme.textSec} />
          </button>
        </div>
      </div>
      <div style={{ padding: '0 20px', marginTop: 16 }}>
        <div style={{ backgroundColor: CARD_DARK_SOLID, borderRadius: 10, padding: '20px', boxShadow: '0 8px 24px rgba(8,26,24,0.15)', border: '1px solid rgba(44,199,167,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 10, backgroundColor: EMERALD, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.3)' }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#081A18' }}>AJ</span>
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF' }}>Alex Johnson</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>alex@example.com</p>
            </div>
          </div>
          <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.12)', margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[{ label: 'Monthly Limit', value: formatMoney(monthlyBudgetLimit) }, { label: 'Total Expenses', value: formatMoney(totalExpenses) }].map(s => (
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
              <button onClick={item.action} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer' }}>
                <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: item.color === ERROR ? 'rgba(255,90,95,0.1)' : theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <item.icon size={16} color={item.color} fill={item.color} strokeWidth={1.5} />
                </div>
                <span style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 500, color: item.color === ERROR ? ERROR : theme.text }}>{item.label}</span>
                {item.color !== ERROR && <ChevronRight size={16} color={theme.textSec} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SettingsScreen({ onBack, isDark, toggleTheme, onOpenModal, onNav }: { onBack: () => void; isDark: boolean; toggleTheme: () => void; onOpenModal: (m: string) => void; onNav: (s: Screen) => void }) {
  const { theme, t } = useApp()
  const [biometric, setBiometric] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)

  function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
    return (
      <button onClick={onToggle} style={{ width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', backgroundColor: value ? EMERALD : theme.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)', position: 'relative', transition: 'all 0.3s', flexShrink: 0 }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: 'white', position: 'absolute', top: 3, left: value ? 21 : 3, transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </button>
    )
  }

  const groups = [
    {
      title: t('security'), items: [
        { label: 'Biometric Login', icon: ShieldCheck, toggle: true, value: biometric, onToggle: () => setBiometric(s => !s) },
        { label: 'Change PIN', icon: Lock, toggle: false, value: false, onToggle: () => onOpenModal('security') },
      ]
    },
    {
      title: t('language') + ' & ' + t('currencyRegion'), items: [
        { label: t('language') + ' (Language)', icon: Globe, toggle: false, value: false, onToggle: () => onOpenModal('language') },
        { label: t('currencyRegion'), icon: DollarSign, toggle: false, value: false, onToggle: () => onOpenModal('currency') },
      ]
    },
    {
      title: t('notifications'), items: [
        { label: 'Push Notifications', icon: Bell, toggle: true, value: pushNotifs, onToggle: () => setPushNotifs(s => !s) },
        { label: 'Budget Alerts', icon: AlertTriangle, toggle: false, value: false, onToggle: () => onNav('notifications') },
      ]
    },
    {
      title: t('exportData'), items: [
        { label: 'Export as CSV', icon: Download, toggle: false, value: false, onToggle: () => onOpenModal('export') },
        { label: 'Share Summary', icon: Share2, toggle: false, value: false, onToggle: () => onOpenModal('export') },
        { label: 'Load Sample Demo Data', icon: RefreshCw, toggle: false, value: false, onToggle: () => onOpenModal('demo') },
      ]
    },
  ]

  return (
    <div style={{ backgroundColor: theme.bg, flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '16px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <ChevronLeft size={22} color={theme.text} />
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{t('settings')}</h1>
      </div>
      <div style={{ padding: '0 20px', marginTop: 16, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Appearance Section */}
        <div>
          <p style={{ fontSize: 11, color: theme.textSec, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>Appearance</p>
          <div style={{ backgroundColor: theme.surface, borderRadius: 8, padding: '16px', border: `1px solid ${theme.border}`, boxShadow: theme.mode === 'light' ? '0 2px 10px rgba(0,0,0,0.05)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: isDark ? 'rgba(246,195,67,0.15)' : 'rgba(44,199,167,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDark ? <Moon size={17} color={WARNING} fill={WARNING} /> : <Sun size={17} color={EMERALD} fill={EMERALD} />}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{t('nightMode')}</p>
                  <p style={{ fontSize: 11, color: theme.textSec, marginTop: 2 }}>{isDark ? 'Night Mode is ON' : 'Night Mode is OFF'}</p>
                </div>
              </div>
              <Toggle value={isDark} onToggle={toggleTheme} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => isDark && toggleTheme()} style={{ padding: '12px 14px', borderRadius: 6, border: `1.5px solid ${!isDark ? EMERALD : theme.border}`, backgroundColor: !isDark ? 'rgba(44,199,167,0.08)' : theme.inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                <Sun size={16} color={!isDark ? EMERALD : theme.textSec} fill={!isDark ? EMERALD : 'none'} />
                <span style={{ fontSize: 13, fontWeight: !isDark ? 700 : 500, color: !isDark ? EMERALD : theme.textSec }}>Light Mode</span>
              </button>
              <button onClick={() => !isDark && toggleTheme()} style={{ padding: '12px 14px', borderRadius: 6, border: `1.5px solid ${isDark ? EMERALD : theme.border}`, backgroundColor: isDark ? 'rgba(44,199,167,0.12)' : theme.inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                <Moon size={16} color={isDark ? EMERALD : theme.textSec} fill={isDark ? EMERALD : 'none'} />
                <span style={{ fontSize: 13, fontWeight: isDark ? 700 : 500, color: isDark ? EMERALD : theme.textSec }}>Night Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Group Settings */}
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
                    {item.toggle ? <Toggle value={item.value} onToggle={item.onToggle} /> : (
                      <button onClick={item.onToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <ChevronRight size={16} color={theme.textSec} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Reset App Section */}
        <div>
          <p style={{ fontSize: 11, color: theme.textSec, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{t('dangerZone')}</p>
          <div style={{ backgroundColor: 'rgba(255,90,95,0.08)', borderRadius: 8, border: '1px solid rgba(255,90,95,0.25)', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: 'rgba(255,90,95,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={18} color={ERROR} fill={ERROR} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: ERROR }}>{t('resetApp')}</p>
                  <p style={{ fontSize: 11, color: theme.textSec, marginTop: 2 }}>{t('resetAppDesc')}</p>
                </div>
              </div>
              <button onClick={() => onOpenModal('reset')} style={{ padding: '8px 14px', borderRadius: 6, backgroundColor: ERROR, color: '#FFFFFF', border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer', boxShadow: '0 2px 8px rgba(255,90,95,0.3)' }}>
                Reset
              </button>
            </div>
          </div>
        </div>

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
  const [hasLoggedIn, setHasLoggedIn] = useState(() => localStorage.getItem('trackify_logged_in') === 'true')
  const [isDark, setIsDark] = useState(false)
  const [screen, setScreen] = useState<Screen>(() => hasLoggedIn ? 'home' : 'splash')
  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState<number>(3000)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [lang, setLang] = useState<Language>('en')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const theme = isDark ? darkTheme : lightTheme
  const toggleTheme = () => setIsDark(d => !d)
  const deleteTransaction = (id: number) => setTransactions(t => t.filter(x => x.id !== id))

  const handleAddExpense = (t: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ id: Date.now(), ...t }, ...prev])
  }

  const t = (key: string) => translations[lang]?.[key] || key

  const formatMoney = (amount: number) => {
    const c = currencyMap[currency] || currencyMap.USD
    const val = Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return `${amount < 0 ? '-' : ''}${c.symbol}${val}`
  }

  const handleOpenModal = (m: string) => {
    if (m === 'export') {
      setToastMsg(lang === 'ur' ? "اسٹیٹمنٹ CSV کے طور پر ایکسپورٹ ہو گئی!" : "Financial statement exported as CSV!")
      setTimeout(() => setToastMsg(null), 3000)
      return
    }
    if (m === 'demo') {
      setTransactions(initTransactions)
      setToastMsg(lang === 'ur' ? "ڈیمو ڈیٹا لوڈ ہو گیا!" : "Demo data loaded successfully!")
      setTimeout(() => setToastMsg(null), 3000)
      return
    }
    setActiveModal(m)
  }

  const handleResetApp = () => {
    setTransactions([])
    setMonthlyBudgetLimit(0)
    setActiveModal(null)
    setScreen('home')
    setToastMsg(lang === 'ur' ? "ایپ کا ڈیٹا ری سیٹ ($0) ہو گیا!" : "App data has been reset to defaults ($0)!")
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleSignIn = () => {
    localStorage.setItem('trackify_logged_in', 'true')
    setHasLoggedIn(true)
    setTransactions([])
    setMonthlyBudgetLimit(3000)
    setScreen('home')
  }

  const mainScreens: Screen[] = ['home', 'budgets', 'expenses', 'analytics', 'ai', 'add-expense']

  const renderScreen = () => {
    switch (screen) {
      case 'splash': return <SplashScreen onNext={() => setScreen('onboarding')} />
      case 'onboarding': return <OnboardingScreen onNext={() => setScreen('signin')} />
      case 'signin': return <SignInScreen onNext={handleSignIn} />
      case 'home': return <HomeScreen onNav={setScreen} onOpenModal={handleOpenModal} monthlyBudgetLimit={monthlyBudgetLimit} transactions={transactions} />
      case 'budgets': return <BudgetsScreen onNav={setScreen} onOpenModal={handleOpenModal} monthlyBudgetLimit={monthlyBudgetLimit} transactions={transactions} />
      case 'expenses': return <ExpensesScreen onNav={setScreen} transactions={transactions} onDelete={deleteTransaction} />
      case 'ai': return <AIScreen onNav={setScreen} />
      case 'analytics': return <AnalyticsScreen onNav={setScreen} transactions={transactions} />
      case 'profile': return <ProfileScreen onNav={setScreen} onOpenModal={handleOpenModal} monthlyBudgetLimit={monthlyBudgetLimit} transactions={transactions} />
      case 'settings': return <SettingsScreen onBack={() => setScreen('profile')} isDark={isDark} toggleTheme={toggleTheme} onOpenModal={handleOpenModal} onNav={setScreen} />
      case 'add-expense': return <AddExpenseScreen onBack={() => setScreen('expenses')} onAdd={handleAddExpense} />
      case 'budget-detail': return <BudgetDetailScreen onBack={() => setScreen('budgets')} theme={theme} />
      case 'notifications': return <NotificationsScreen onBack={() => setScreen('home')} />
      default: return <HomeScreen onNav={setScreen} onOpenModal={handleOpenModal} monthlyBudgetLimit={monthlyBudgetLimit} transactions={transactions} />
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
    <AppCtx.Provider value={{ theme, isDark, toggleTheme, currency, setCurrency, lang, setLang, t, formatMoney }}>
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

                {/* Modals & Toast */}
                {activeModal === 'security' && <SecurityModal onClose={() => setActiveModal(null)} theme={theme} />}
                {activeModal === 'currency' && <CurrencyModal onClose={() => setActiveModal(null)} selected={currency} onSelect={setCurrency} theme={theme} />}
                {activeModal === 'language' && <LanguageModal onClose={() => setActiveModal(null)} selected={lang} onSelect={setLang} theme={theme} />}
                {activeModal === 'calculator' && <CalculatorModal onClose={() => setActiveModal(null)} theme={theme} />}
                {activeModal === 'notes' && <NotesModal onClose={() => setActiveModal(null)} theme={theme} />}
                {activeModal === 'set-budget' && <SetBudgetModal onClose={() => setActiveModal(null)} currentLimit={monthlyBudgetLimit} onSave={setMonthlyBudgetLimit} theme={theme} />}
                {activeModal === 'share' && <ShareNotebookModal onClose={() => setActiveModal(null)} theme={theme} />}
                {activeModal === 'reminders' && <RemindersModal onClose={() => setActiveModal(null)} theme={theme} />}
                {activeModal === 'reset' && <ResetConfirmModal onClose={() => setActiveModal(null)} onConfirm={handleResetApp} theme={theme} />}

                {toastMsg && (
                  <div style={{ position: 'absolute', top: 54, left: 16, right: 16, zIndex: 120, backgroundColor: theme.surface, border: `1px solid ${EMERALD}`, borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }} className="animate-fade-in">
                    <CheckCircle2 size={16} color={EMERALD} fill={EMERALD} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: theme.text }}>{toastMsg}</span>
                  </div>
                )}

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
    </AppCtx.Provider>
  )
}
