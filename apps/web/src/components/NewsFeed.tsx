import { ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MOCK_NEWS } from '../stores/tradeStore';

export function NewsFeed() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {MOCK_NEWS.map((item, i) => {
        const sentimentColor =
          item.sentiment === 'positive' ? 'var(--tv-green)'
          : item.sentiment === 'negative' ? 'var(--tv-red)'
          : 'var(--tv-text-muted)';

        const SentimentIcon =
          item.sentiment === 'positive' ? TrendingUp
          : item.sentiment === 'negative' ? TrendingDown
          : Minus;

        return (
          <a
            key={item.id}
            href={item.url}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '14px 16px',
              background: i % 2 === 0 ? 'rgba(0,229,255,0.02)' : 'transparent',
              borderBottom: '1px solid var(--tv-border)',
              textDecoration: 'none',
              transition: 'background 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,229,255,0.05)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = i % 2 === 0 ? 'rgba(0,229,255,0.02)' : 'transparent'; }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0, marginTop: 1,
              background: item.sentiment === 'positive' ? 'rgba(0,230,118,0.1)' : item.sentiment === 'negative' ? 'rgba(255,23,68,0.1)' : 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SentimentIcon style={{ width: 13, height: 13, color: sentimentColor }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tv-text-primary)', lineHeight: 1.5, marginBottom: 4 }}>{item.title}</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: sentimentColor, background: item.sentiment === 'positive' ? 'rgba(0,230,118,0.08)' : item.sentiment === 'negative' ? 'rgba(255,23,68,0.08)' : 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4, letterSpacing: '0.04em' }}>{item.source}</span>
                <span style={{ fontSize: 11, color: 'var(--tv-text-muted)' }}>{item.time}</span>
              </div>
            </div>
            <ExternalLink style={{ width: 13, height: 13, color: 'var(--tv-text-muted)', flexShrink: 0, marginTop: 4 }} />
          </a>
        );
      })}
    </div>
  );
}