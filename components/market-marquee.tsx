'use client'

import { motion } from 'framer-motion'

const marketItems = [
  { symbol: 'NVDA', name: 'NVIDIA', score: 92, trend: '+4.2%', positive: true },
  { symbol: 'AAPL', name: 'Apple', score: 84, trend: '+1.8%', positive: true },
  { symbol: 'MSFT', name: 'Microsoft', score: 88, trend: '+2.3%', positive: true },
  { symbol: 'NASDAQ', name: 'NASDAQ', score: null, trend: 'Bullish', positive: true },
  { symbol: 'POLY', name: 'Polymarket', score: null, trend: 'Fed Cut 68%', positive: true },
  { symbol: 'TSLA', name: 'Tesla', score: 71, trend: '-1.2%', positive: false },
  { symbol: 'GOOGL', name: 'Alphabet', score: 86, trend: '+3.1%', positive: true },
  { symbol: 'META', name: 'Meta', score: 83, trend: '+2.7%', positive: true },
  { symbol: 'AMZN', name: 'Amazon', score: 80, trend: '+1.5%', positive: true },
  { symbol: 'BTC', name: 'Bitcoin', score: null, trend: '+5.4%', positive: true },
]

function MarketCard({ item }: { item: typeof marketItems[0] }) {
  return (
    <div
      className="flex-none flex items-center gap-4 px-5 py-3 mx-2"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        minWidth: '180px',
      }}
    >
      {/* Symbol */}
      <div>
        <div className="text-xs font-bold text-white tracking-wide">{item.symbol}</div>
        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {item.name}
        </div>
      </div>

      <div className="flex-1" />

      {/* Score or label */}
      <div className="text-right">
        {item.score !== null ? (
          <>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              AI Score
            </div>
            <div
              className="text-sm font-bold"
              style={{ color: item.score >= 85 ? '#2EE88E' : item.score >= 75 ? '#5FF3AB' : 'rgba(255,255,255,0.7)' }}
            >
              {item.score}
            </div>
          </>
        ) : (
          <div
            className="text-xs font-semibold"
            style={{ color: item.positive ? '#34D399' : '#F87171' }}
          >
            {item.trend}
          </div>
        )}
        {item.score !== null && (
          <div
            className="text-xs font-medium"
            style={{ color: item.positive ? '#34D399' : '#F87171' }}
          >
            {item.trend}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MarketMarquee() {
  const doubled = [...marketItems, ...marketItems]

  return (
    <section id="markets" className="relative py-16 overflow-hidden" aria-label="Market intelligence ticker">
      {/* Section label */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span
          className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          <span
            className="w-8 h-px"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          />
          Live Market Intelligence
          <span
            className="w-8 h-px"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          />
        </span>
      </motion.div>

      {/* Top fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #05070D, transparent)',
        }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, #05070D, transparent)',
        }}
      />

      {/* Marquee */}
      <div className="flex overflow-hidden">
        <div className="flex animate-marquee">
          {doubled.map((item, i) => (
            <MarketCard key={`${item.symbol}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
