'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowRightLeft,
  ArrowUpFromLine,
  Bell,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleHelp,
  Copy,
  Cpu,
  CreditCard,
  Globe2,
  House,
  Landmark,
  LockKeyhole,
  MessageCircle,
  Network,
  ReceiptText,
  ScanLine,
  Search,
  SendHorizontal,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserRound,
  WalletCards,
} from 'lucide-react'

type Screen = 'home' | 'invest' | 'ai' | 'wallet' | 'profile'
type InvestCategory = 'All' | 'Compute' | 'RWA' | 'Stocks' | 'Prediction'

const investmentCategories: InvestCategory[] = ['All', 'Compute', 'RWA', 'Stocks', 'Prediction']

const opportunities = [
  { title: 'AI Compute', detail: 'H100 Compute Unit', metric: '18% APY', kind: 'compute' },
  { title: 'RWA', detail: 'Solar Energy Project', metric: '12% APY', kind: 'rwa' },
  { title: 'Stocks', detail: 'Global equity access', metric: 'AI score 92', kind: 'stocks' },
  { title: 'Prediction', detail: 'Fed Rate Cut', metric: 'YES 68¢', kind: 'prediction' },
]

const assets = [
  { name: 'USDT', chain: 'TRON · Ethereum · Arbitrum', value: '12,540.20', mark: 'U' },
  { name: 'ETH', chain: 'Ethereum', value: '2.08', mark: 'Ξ' },
  { name: 'Compute Token', chain: 'AI Compute', value: '2,430.00', mark: 'C' },
  { name: 'RWA Token', chain: 'Solar Income', value: '1,180.00', mark: 'R' },
]

function BrandMark({ wordmark = true }: { wordmark?: boolean }) {
  return (
    <div className="brand-mark" aria-label="RWA.LAT">
      <svg viewBox="0 0 42 42" role="img" aria-hidden="true">
        <circle cx="21" cy="21" r="15.5" className="brand-orbit" />
        <path d="M7 21h27" className="brand-latitude" />
        <path d="M14 30V12h7.4c4.7 0 7.5 2.4 7.5 6.1 0 2.7-1.5 4.7-4.1 5.7L30 30" className="brand-r" />
        <circle cx="31.5" cy="12" r="2.25" className="brand-node" />
      </svg>
      {wordmark && <span>RWA.LAT</span>}
    </div>
  )
}

function AssetVisual({ kind, className = '' }: { kind: string; className?: string }) {
  return (
    <span className={`asset-visual asset-visual--${kind} ${className}`}>
      <img src={`/asset-icons/${kind}.png`} alt="" />
    </span>
  )
}

function OrbitalCore({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`orbital-core ${compact ? 'orbital-core--compact' : ''}`} aria-hidden="true">
      <div className="orbital-haze" />
      <div className="orbital-plane orbital-plane--one" />
      <div className="orbital-plane orbital-plane--two" />
      <div className="orbital-plane orbital-plane--three" />
      <div className="orbital-sphere">
        <span className="orbital-grid orbital-grid--one" />
        <span className="orbital-grid orbital-grid--two" />
        <span className="orbital-lens" />
      </div>
      <span className="orbital-node orbital-node--one" />
      <span className="orbital-node orbital-node--two" />
      <span className="orbital-node orbital-node--three" />
      <div className="orbital-platform" />
    </div>
  )
}

function Header({ title, onProfile }: { title?: string; onProfile: () => void }) {
  return (
    <header className="app-header">
      {title ? <h1>{title}</h1> : <BrandMark />}
      <div className="header-actions">
        <button className="header-icon" type="button" aria-label="Notifications"><Bell size={18} /></button>
        <button className="avatar" type="button" aria-label="Open profile" onClick={onProfile}>R</button>
      </div>
    </header>
  )
}

function BottomDock({ screen, setScreen }: { screen: Screen; setScreen: (screen: Screen) => void }) {
  const nav = [
    { id: 'home' as Screen, label: 'Home', icon: House },
    { id: 'invest' as Screen, label: 'Invest', icon: TrendingUp },
    { id: 'wallet' as Screen, label: 'Wallet', icon: WalletCards },
    { id: 'profile' as Screen, label: 'Profile', icon: UserRound },
  ]

  return (
    <nav className="bottom-dock" aria-label="Primary navigation">
      <div className="dock-pill">
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            className={`dock-item ${screen === id ? 'is-active' : ''}`}
            aria-current={screen === id ? 'page' : undefined}
            onClick={() => setScreen(id)}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className={`ai-dock-button ${screen === 'ai' ? 'is-active' : ''}`}
        aria-label="Open AI Advisor"
        aria-current={screen === 'ai' ? 'page' : undefined}
        onClick={() => setScreen('ai')}
      >
        <span className="ai-dock-orbit" />
        <MessageCircle size={23} strokeWidth={1.8} />
        <i />
      </button>
    </nav>
  )
}

function QuickButton({ icon: Icon, label, onClick }: { icon: typeof ArrowDownToLine; label: string; onClick: () => void }) {
  return (
    <button className="quick-action" type="button" onClick={onClick}>
      <span><Icon size={19} strokeWidth={1.8} /></span>
      {label}
    </button>
  )
}

function HomeScreen({ setScreen, toast }: { setScreen: (screen: Screen) => void; toast: (message: string) => void }) {
  return (
    <section className="screen-stack home-screen">
      <Header onProfile={() => setScreen('profile')} />
      <div className="portfolio-copy">
        <p className="eyebrow">TOTAL PORTFOLIO</p>
        <div className="portfolio-value">$128,540<span>.20</span></div>
        <div className="profit-line"><TrendingUp size={16} /> +$328.40 <span>·</span> +1.2% today</div>
        <div className="score-line"><span>AI Portfolio Score</span><b>87</b><i /></div>
      </div>

      <div className="home-orbital-wrap"><OrbitalCore /></div>

      <button className="market-brief glass-surface" type="button" onClick={() => setScreen('ai')}>
        <div className="brief-glyph"><Sparkles size={18} /></div>
        <span><b>AI Market Brief</b><small>Compute demand is accelerating.</small></span>
        <ChevronRight size={19} />
      </button>

      <div className="section-heading"><span>Explore opportunities</span><button type="button" onClick={() => setScreen('invest')}>View all</button></div>
      <div className="opportunity-list">
        {opportunities.map(({ title, detail, metric, kind }) => (
          <button className="opportunity-row" key={title} type="button" onClick={() => setScreen('invest')}>
            <AssetVisual kind={kind} />
            <span className="opportunity-content"><b>{title}</b><small>{detail}</small></span>
            <strong>{metric}</strong><ChevronRight size={17} />
          </button>
        ))}
      </div>

      <div className="mini-actions">
        <QuickButton icon={ArrowDownToLine} label="Deposit" onClick={() => { setScreen('wallet'); toast('Deposit flow opened') }} />
        <QuickButton icon={BrainCircuit} label="Ask AI" onClick={() => setScreen('ai')} />
        <QuickButton icon={ReceiptText} label="Activity" onClick={() => toast('Your activity is up to date')} />
      </div>
    </section>
  )
}

function InvestScreen({ toast }: { toast: (message: string) => void }) {
  const [category, setCategory] = useState<InvestCategory>('All')
  const productList = useMemo(() => {
    const all = [
      { title: 'AI Compute', category: 'Compute', detail: 'H100 Compute Unit', metric: '18% APY', kind: 'compute' },
      { title: 'RWA', category: 'RWA', detail: 'Solar Energy Project', metric: '12% APY', kind: 'rwa' },
      { title: 'Stocks', category: 'Stocks', detail: 'NVIDIA', metric: 'AI Score 92', kind: 'stocks' },
      { title: 'Prediction', category: 'Prediction', detail: 'Fed Rate Cut', metric: 'YES 68¢', kind: 'prediction' },
    ] as const
    return category === 'All' ? all : all.filter((item) => item.category === category)
  }, [category])

  return (
    <section className="screen-stack invest-screen">
      <Header title="Invest" onProfile={() => undefined} />
      <div className="invest-intro"><p>Build your next position.</p><button type="button" aria-label="Search"><Search size={19} /></button></div>
      <div className="category-scroll" role="tablist" aria-label="Investment categories">
        {investmentCategories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
      </div>

      <article className="featured-compute glass-surface">
        <div className="featured-copy"><p className="eyebrow">FEATURED OPPORTUNITY</p><h2>AI Compute</h2><span>H100 Compute Unit</span><div><b>18% APY</b><small>Expected return</small></div><button type="button" onClick={() => toast('AI Compute details opened')}>Explore <ChevronRight size={16} /></button></div>
        <AssetVisual kind="compute" className="featured-asset" />
      </article>

      <div className="section-heading"><span>Curated for you</span><button type="button" aria-label="Filter"><SlidersHorizontal size={18} /></button></div>
      <div className="invest-list">
        {productList.map(({ title, detail, metric, kind }) => (
          <button key={title} className="invest-product" type="button" onClick={() => toast(`${title} details opened`)}>
            <AssetVisual kind={kind} />
            <span><b>{title}</b><small>{detail}</small></span>
            <strong>{metric}</strong><ChevronRight size={17} />
          </button>
        ))}
      </div>
    </section>
  )
}

function AiScreen({ toast }: { toast: (message: string) => void }) {
  const [input, setInput] = useState('')
  const [asked, setAsked] = useState(false)
  const send = () => {
    if (!input.trim()) return
    setAsked(true)
    toast('AI analysis generated')
    setInput('')
  }
  return (
    <section className="screen-stack ai-screen">
      <Header title="AI Advisor" onProfile={() => undefined} />
      <div className="ai-presence"><span className="ai-presence-orbit" /><BrainCircuit size={28} /><i /></div>
      <p className="ai-kicker">YOUR INVESTMENT COPILOT</p>
      <h2>Clarity before every move.</h2>
      <div className="conversation">
        <div className="message message--user">Help me allocate 10,000 USDT</div>
        <div className="message message--assistant"><b>Recommended allocation</b><p>Balanced for yield, growth and liquidity.</p>
          <div className="allocation"><span><i style={{ width: '40%' }} />AI Compute <b>40%</b></span><span><i style={{ width: '30%' }} />RWA <b>30%</b></span><span><i style={{ width: '20%' }} />Stocks <b>20%</b></span><span><i style={{ width: '10%' }} />Cash <b>10%</b></span></div>
          <button type="button" onClick={() => toast('Portfolio plan is ready to review')}>Review plan <ChevronRight size={16} /></button>
        </div>
        {asked && <div className="message message--user">{input || 'Show me the risk behind this plan.'}</div>}
      </div>
      <form className="ai-composer" onSubmit={(event) => { event.preventDefault(); send() }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your portfolio" /><button type="submit" aria-label="Send"><SendHorizontal size={18} /></button></form>
    </section>
  )
}

function WalletScreen({ toast }: { toast: (message: string) => void }) {
  const copyAddress = () => {
    void navigator.clipboard?.writeText('TQx7...8vZp')
    toast('Wallet address copied')
  }
  return (
    <section className="screen-stack wallet-screen">
      <Header title="Wallet" onProfile={() => undefined} />
      <div className="wallet-balance glass-surface"><p>AVAILABLE BALANCE</p><h2>12,540.20 <span>USDT</span></h2><small>≈ $12,540.20 USD</small><div className="wallet-network"><Network size={14} /> TRON · Ethereum · Arbitrum</div></div>
      <div className="wallet-actions">
        <QuickButton icon={ArrowDownToLine} label="Deposit" onClick={() => toast('Choose a network to deposit')} />
        <QuickButton icon={ArrowUpFromLine} label="Withdraw" onClick={() => toast('Withdrawal review opened')} />
        <QuickButton icon={ArrowRightLeft} label="Transfer" onClick={() => toast('Transfer flow opened')} />
        <QuickButton icon={CreditCard} label="Buy" onClick={() => toast('Fiat on-ramp coming soon')} />
      </div>
      <div className="wallet-address"><span><b>My USDT address</b><small>TQx7...8vZp</small></span><button type="button" onClick={copyAddress}><Copy size={17} /></button><button type="button" onClick={() => toast('QR scanner opened')}><ScanLine size={17} /></button></div>
      <div className="section-heading"><span>Assets</span><button type="button" onClick={() => toast('Asset filter opened')}>Manage</button></div>
      <div className="asset-list">{assets.map((asset) => <button type="button" className="asset-row" key={asset.name} onClick={() => toast(`${asset.name} details opened`)}><span className="token-mark">{asset.mark}</span><span><b>{asset.name}</b><small>{asset.chain}</small></span><strong>{asset.value}</strong><ChevronRight size={17} /></button>)}</div>
    </section>
  )
}

function ProfileScreen({ toast }: { toast: (message: string) => void }) {
  const rows = [
    ['Security & devices', 'Passkey enabled', LockKeyhole],
    ['KYC & eligibility', 'Verified', ShieldCheck],
    ['Referral rewards', 'Invite friends, earn points', Sparkles],
    ['AI Premium', 'Advanced portfolio intelligence', BrainCircuit],
    ['Language', 'English', Globe2],
    ['Support & legal', 'Help centre and disclosures', CircleHelp],
  ] as const
  return (
    <section className="screen-stack profile-screen">
      <Header title="Profile" onProfile={() => undefined} />
      <div className="profile-card glass-surface"><div className="profile-avatar">R</div><div><h2>0x82...92A</h2><p><ShieldCheck size={14} /> KYC verified</p></div><button type="button" aria-label="Open settings" onClick={() => toast('Settings opened')}><Settings2 size={19} /></button></div>
      <div className="profile-balance"><span><small>Total assets</small><b>$128,540.20</b></span><span><small>Portfolio score</small><b className="mint">87</b></span></div>
      <div className="profile-list">{rows.map(([title, detail, Icon]) => <button type="button" key={title} onClick={() => toast(`${title} opened`)}><span className="profile-icon"><Icon size={18} /></span><span><b>{title}</b><small>{detail}</small></span><ChevronRight size={17} /></button>)}</div>
      <button type="button" className="sign-out" onClick={() => toast('Signed out of this H5 preview')}>Sign out</button>
    </section>
  )
}

export default function RwaH5() {
  const [screen, setScreen] = useState<Screen>('home')
  const [toast, setToast] = useState<string | null>(null)
  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  return (
    <main className="rwa-app-shell">
      <div className="app-ambient app-ambient--one" /><div className="app-ambient app-ambient--two" />
      <div className="mobile-app" data-screen={screen}>
        {screen === 'home' && <HomeScreen setScreen={setScreen} toast={notify} />}
        {screen === 'invest' && <InvestScreen toast={notify} />}
        {screen === 'ai' && <AiScreen toast={notify} />}
        {screen === 'wallet' && <WalletScreen toast={notify} />}
        {screen === 'profile' && <ProfileScreen toast={notify} />}
        <BottomDock screen={screen} setScreen={setScreen} />
      </div>
      {toast && <div className="app-toast" role="status"><Check size={17} />{toast}</div>}
    </main>
  )
}
