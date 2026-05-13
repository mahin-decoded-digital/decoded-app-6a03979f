import { MOCK_INDICES } from '../stores/tradeStore';

export function MarketTicker() {
  const doubled = [...MOCK_INDICES, ...MOCK_INDICES];

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.6)',
        borderBottom: '1px solid var(--tv-border)',
        borderTop: '1px solid var(--tv-border)',
        overflow: 'hidden',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        backdropFilter: 'blur(8px)',
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* Fade masks */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(90deg, rgba(7,12,21,1), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(270deg, rgba(7,12,21,1), transparent)', zIndex: 2, pointerEvents: 'none' }} />

      <div
        style={{
          display: 'flex',
          gap: 0,
          animation: 'tv-ticker 40s linear infinite',
          whiteSpace: 'nowrap',
        }}
      >
        {doubled.map((idx, i) => {
          const up = idx.changePct >= 0;
          return (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 24px',
                borderRight: '1px solid var(--tv-border)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
              }}
            >
              <span style={{ color: 'var(--tv-text-secondary)', fontWeight: 600, letterSpacing: '0.06em' }}>{idx.symbol}</span>
              <span style={{ color: 'var(--tv-text-primary)', fontWeight: 700 }}>{idx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span style={{ color: up ? 'var(--tv-green)' : 'var(--tv-red)', fontWeight: 600 }}>
                {up ? '▲' : '▼'} {Math.abs(idx.changePct).toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}