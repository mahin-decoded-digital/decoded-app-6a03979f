import { Shield, Award, Lock, Globe, Users, BarChart2 } from 'lucide-react';

const BADGES = [
  { icon: Shield, label: 'FCA Regulated', sub: 'UK Financial Conduct Authority', color: 'var(--tv-cyan)' },
  { icon: Award, label: 'SEC Registered', sub: 'US Securities & Exchange Commission', color: 'var(--tv-gold)' },
  { icon: Lock, label: '256-bit SSL', sub: 'Bank-grade encryption', color: 'var(--tv-green)' },
  { icon: Globe, label: 'ASIC Licensed', sub: 'Australian Securities Commission', color: 'var(--tv-purple)' },
];

const STATS = [
  { icon: Users, value: '2.4M+', label: 'Active Traders' },
  { icon: BarChart2, value: '$840B', label: 'Monthly Volume' },
  { icon: Globe, value: '195+', label: 'Countries' },
  { icon: Shield, value: '99.99%', label: 'Uptime SLA' },
];

export function TrustBadges() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{ textAlign: 'center', padding: '20px 16px', background: 'var(--tv-surface-2)', border: '1px solid var(--tv-border)', borderRadius: 12 }}>
              <Icon style={{ width: 20, height: 20, color: 'var(--tv-cyan)', marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 800, color: 'var(--tv-text-primary)', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'var(--tv-text-muted)', fontWeight: 600 }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Regulatory Badges */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tv-text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, textAlign: 'center' }}>Regulatory & Security Compliance</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--tv-border)',
                  borderRadius: 10, transition: 'border-color 0.2s',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${badge.color}15`, border: `1px solid ${badge.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: 16, height: 16, color: badge.color }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--tv-text-primary)' }}>{badge.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--tv-text-muted)', marginTop: 1 }}>{badge.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal Footer Text */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(255,214,0,0.03)',
        border: '1px solid rgba(255,214,0,0.15)',
        borderRadius: 10,
        fontSize: 11,
        color: 'var(--tv-text-muted)',
        lineHeight: 1.7,
      }}>
        <strong style={{ color: 'var(--tv-gold)' }}>Risk Warning:</strong> Trading financial instruments involves significant risk and may not be suitable for all investors. Past performance is not a reliable indicator of future results. You may lose more than your initial investment. Please ensure you fully understand the risks involved and consider seeking independent financial advice if necessary. TradeVista Elite is regulated by the Financial Conduct Authority (FCA) under registration number 987654. FSCS protection up to £85,000.
      </div>
    </div>
  );
}