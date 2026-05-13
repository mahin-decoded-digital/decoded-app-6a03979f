import { Check, X } from 'lucide-react';
import { useTradeStore } from '../stores/tradeStore';
import type { AccountTier } from '../types';

export const TIERS: AccountTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    pricePeriod: 'Free forever',
    description: 'For investors just getting started with market exploration.',
    highlighted: false,
    ctaLabel: 'Get Started Free',
    features: [
      'Up to 5 watchlist stocks',
      'Basic market data (15min delay)',
      'Standard charting tools',
      'Email support',
      'Mobile app access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Trader',
    price: 29,
    pricePeriod: 'per month',
    description: 'Real-time data and advanced tools for active traders.',
    highlighted: true,
    ctaLabel: 'Start Pro Trial',
    features: [
      'Unlimited watchlist stocks',
      'Real-time market data',
      'Advanced charting & indicators',
      'Live financial news feed',
      'Options & futures data',
      'Portfolio analytics',
      'Priority support',
      'API access (100 req/min)',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 99,
    pricePeriod: 'per month',
    description: "Institutional-grade tools for professional and HFT traders.",
    highlighted: false,
    ctaLabel: 'Unlock Elite Access',
    features: [
      'Everything in Pro',
      'Level 2 order book data',
      'Algorithmic trading suite',
      'Custom AI screening',
      'DMA execution engine',
      'Dedicated account manager',
      'White-glove onboarding',
      'Unlimited API access',
    ],
  },
];

const ALL_FEATURES = [
  { feature: 'Watchlist capacity', starter: '5 stocks', pro: 'Unlimited', elite: 'Unlimited' },
  { feature: 'Market data delay', starter: '15 min', pro: 'Real-time', elite: 'Real-time' },
  { feature: 'Charting tools', starter: 'Basic', pro: 'Advanced', elite: 'Professional' },
  { feature: 'News feed', starter: false, pro: true, elite: true },
  { feature: 'Options & futures', starter: false, pro: true, elite: true },
  { feature: 'Portfolio analytics', starter: false, pro: true, elite: true },
  { feature: 'API access', starter: false, pro: '100 req/min', elite: 'Unlimited' },
  { feature: 'Order book (Level 2)', starter: false, pro: false, elite: true },
  { feature: 'Algo trading suite', starter: false, pro: false, elite: true },
  { feature: 'AI stock screening', starter: false, pro: false, elite: true },
  { feature: 'Dedicated manager', starter: false, pro: false, elite: true },
];

export function PricingTable() {
  const setSelectedTier = useTradeStore((s) => s.setSelectedTier);
  const setRegModalOpen = useTradeStore((s) => s.setRegModalOpen);

  const handleSelect = (tierId: string) => {
    setSelectedTier(tierId);
    setRegModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {/* Tier Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            style={{
              background: tier.highlighted ? 'linear-gradient(145deg, rgba(0,229,255,0.1), rgba(124,77,255,0.08))' : 'var(--tv-surface-2)',
              border: `1px solid ${tier.highlighted ? 'var(--tv-cyan)' : 'var(--tv-border)'}`,
              borderRadius: 16,
              padding: '28px 24px',
              position: 'relative',
              boxShadow: tier.highlighted ? '0 0 40px rgba(0,229,255,0.12), 0 20px 60px rgba(0,0,0,0.3)' : 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {tier.highlighted && (
              <div style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, var(--tv-cyan), var(--tv-purple))',
                color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 14px', borderRadius: 20,
                letterSpacing: '0.08em', whiteSpace: 'nowrap',
              }}>
                MOST POPULAR
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: tier.highlighted ? 'var(--tv-cyan)' : 'var(--tv-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{tier.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                {tier.price === 0
                  ? <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--tv-text-primary)', fontFamily: 'var(--font-mono)' }}>Free</span>
                  : <>
                    <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--tv-text-primary)', fontFamily: 'var(--font-mono)' }}>${tier.price}</span>
                    <span style={{ fontSize: 13, color: 'var(--tv-text-muted)' }}>/{tier.pricePeriod.replace('per ', '')}</span>
                  </>
                }
              </div>
              <div style={{ fontSize: 13, color: 'var(--tv-text-secondary)', lineHeight: 1.6 }}>{tier.description}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 24 }}>
              {tier.features.map((f) => (
                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: tier.highlighted ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Check style={{ width: 10, height: 10, color: tier.highlighted ? 'var(--tv-cyan)' : 'var(--tv-text-muted)' }} />
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--tv-text-secondary)', lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleSelect(tier.id)}
              style={{
                width: '100%', padding: '12px 20px',
                background: tier.highlighted ? 'linear-gradient(135deg, var(--tv-cyan), var(--tv-purple))' : 'transparent',
                border: tier.highlighted ? 'none' : '1px solid var(--tv-border)',
                borderRadius: 10, fontSize: 14, fontWeight: 700,
                color: tier.highlighted ? 'white' : 'var(--tv-text-secondary)',
                cursor: 'pointer', fontFamily: 'var(--font-display)',
                boxShadow: tier.highlighted ? '0 4px 20px rgba(0,229,255,0.3)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {tier.ctaLabel}
            </button>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--tv-text-muted)', fontWeight: 700, letterSpacing: '0.08em', borderBottom: '2px solid var(--tv-border)' }}>FEATURE</th>
              {TIERS.map((t) => (
                <th key={t.id} style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', borderBottom: '2px solid var(--tv-border)', color: t.highlighted ? 'var(--tv-cyan)' : 'var(--tv-text-muted)', textAlign: 'center' }}>{t.name.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_FEATURES.map((row, i) => (
              <tr key={row.feature} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--tv-text-secondary)', borderBottom: '1px solid var(--tv-border)' }}>{row.feature}</td>
                {(['starter', 'pro', 'elite'] as const).map((tier) => {
                  const val = row[tier];
                  return (
                    <td key={tier} style={{ padding: '11px 16px', textAlign: 'center', borderBottom: '1px solid var(--tv-border)' }}>
                      {val === true
                        ? <Check style={{ width: 16, height: 16, color: 'var(--tv-green)', display: 'inline-block' }} />
                        : val === false
                        ? <X style={{ width: 14, height: 14, color: 'var(--tv-text-muted)', display: 'inline-block' }} />
                        : <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--tv-text-secondary)', fontWeight: 600 }}>{val}</span>
                      }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}