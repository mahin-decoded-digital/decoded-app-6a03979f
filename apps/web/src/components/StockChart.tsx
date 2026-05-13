import { useMemo, useState } from 'react';
import { useTradeStore, MOCK_STOCKS } from '../stores/tradeStore';
import { Search } from 'lucide-react';
import { MiniChart } from './MiniChart';

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '6M', '1Y'];

export function StockChart() {
  const selectedSymbol = useTradeStore((s) => s.selectedSymbol);
  const chartData = useTradeStore((s) => s.chartData);
  const searchQuery = useTradeStore((s) => s.searchQuery);
  const setSearchQuery = useTradeStore((s) => s.setSearchQuery);
  const setSelectedSymbol = useTradeStore((s) => s.setSelectedSymbol);

  const [activeFrame, setActiveFrame] = useState('1D');

  const stock = MOCK_STOCKS[selectedSymbol];
  const up = stock ? stock.change >= 0 : true;

  const filteredSymbols = useMemo(() => {
    if (!searchQuery.trim()) return Object.keys(MOCK_STOCKS);
    const q = searchQuery.toLowerCase();
    return Object.keys(MOCK_STOCKS).filter(
      (sym) => sym.toLowerCase().includes(q) || MOCK_STOCKS[sym].name.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const prices = useMemo(() => chartData.map((d) => d.price), [chartData]);
  const minPrice = useMemo(() => Math.min(...prices), [prices]);
  const maxPrice = useMemo(() => Math.max(...prices), [prices]);
  const priceRange = maxPrice - minPrice || 1;
  const svgWidth = 560;
  const svgHeight = 220;
  const pad = { top: 16, right: 16, bottom: 32, left: 60 };

  const chartPoints = useMemo(() => {
    return prices.map((p, i) => {
      const x = pad.left + (i / (prices.length - 1)) * (svgWidth - pad.left - pad.right);
      const y = pad.top + (1 - (p - minPrice) / priceRange) * (svgHeight - pad.top - pad.bottom);
      return { x, y, p };
    });
  }, [prices, minPrice, priceRange, pad.left, pad.right, pad.top, pad.bottom]);

  const linePath = chartPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');
  const areaPath = linePath + ` L ${(svgWidth - pad.right).toFixed(1)} ${(svgHeight - pad.bottom).toFixed(1)} L ${pad.left.toFixed(1)} ${(svgHeight - pad.bottom).toFixed(1)} Z`;

  const yLabels = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: pad.top + (1 - f) * (svgHeight - pad.top - pad.bottom),
    label: (minPrice + f * priceRange).toFixed(2),
  }));

  const xLabels = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const idx = Math.floor(f * (chartData.length - 1));
    return {
      x: pad.left + f * (svgWidth - pad.left - pad.right),
      label: chartData[idx]?.time || '',
    };
  });

  return (
    <div style={{ display: 'flex', gap: 20, width: '100%', flexWrap: 'wrap' }}>
      {/* Stock List */}
      <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--tv-text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symbol..."
            style={{
              width: '100%',
              background: 'rgba(0,229,255,0.04)',
              border: '1px solid var(--tv-border)',
              borderRadius: 8,
              padding: '8px 10px 8px 32px',
              fontSize: 13,
              color: 'var(--tv-text-primary)',
              outline: 'none',
              fontFamily: 'var(--font-mono)',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 320, overflowY: 'auto' }}>
          {filteredSymbols.map((sym) => {
            const s = MOCK_STOCKS[sym];
            const isActive = sym === selectedSymbol;
            return (
              <button
                key={sym}
                onClick={() => { setSelectedSymbol(sym); setSearchQuery(''); }}
                style={{
                  background: isActive ? 'rgba(0,229,255,0.1)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${isActive ? 'var(--tv-border-hover)' : 'var(--tv-border)'}`,
                  borderRadius: 8,
                  padding: '8px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: isActive ? 'var(--tv-cyan)' : 'var(--tv-text-primary)' }}>{s.symbol}</span>
                  <span style={{ fontSize: 10, color: 'var(--tv-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{s.name}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--tv-text-primary)' }}>${s.price.toFixed(2)}</span>
                  <span style={{ fontSize: 11, color: s.change >= 0 ? 'var(--tv-green)' : 'var(--tv-red)', fontWeight: 600 }}>
                    {s.change >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Area */}
      {stock && (
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800, color: 'var(--tv-text-primary)' }}>${stock.price.toFixed(2)}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: up ? 'var(--tv-green)' : 'var(--tv-red)', fontWeight: 600 }}>
                  {up ? '+' : ''}{stock.change.toFixed(2)} ({up ? '+' : ''}{stock.changePct.toFixed(2)}%)
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--tv-text-muted)', fontWeight: 500 }}>{stock.name}</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveFrame(tf)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: `1px solid ${tf === activeFrame ? 'var(--tv-cyan)' : 'var(--tv-border)'}`,
                    background: tf === activeFrame ? 'rgba(0,229,255,0.12)' : 'transparent',
                    color: tf === activeFrame ? 'var(--tv-cyan)' : 'var(--tv-text-muted)',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    transition: 'all 0.15s',
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Chart */}
          <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, border: '1px solid var(--tv-border)', overflow: 'hidden', padding: '8px 0' }}>
            <svg width="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none" style={{ display: 'block', minHeight: 160 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={up ? 'var(--tv-green)' : 'var(--tv-red)'} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={up ? 'var(--tv-green)' : 'var(--tv-red)'} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              {/* Grid */}
              {yLabels.map((l, i) => (
                <g key={i}>
                  <line x1={pad.left} y1={l.y} x2={svgWidth - pad.right} y2={l.y} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                  <text x={pad.left - 6} y={l.y + 4} textAnchor="end" fontSize={9} fill="rgba(232,244,255,0.35)" fontFamily="var(--font-mono)">{l.label}</text>
                </g>
              ))}
              {xLabels.map((l, i) => (
                <text key={i} x={l.x} y={svgHeight - 4} textAnchor="middle" fontSize={9} fill="rgba(232,244,255,0.35)" fontFamily="var(--font-mono)">{l.label}</text>
              ))}
              {/* Area + Line */}
              <path d={areaPath} fill="url(#chartGrad)" />
              <path d={linePath} fill="none" stroke={up ? 'var(--tv-green)' : 'var(--tv-red)'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              {/* Last point dot */}
              {chartPoints.length > 0 && (
                <circle cx={chartPoints[chartPoints.length - 1].x} cy={chartPoints[chartPoints.length - 1].y} r={4} fill={up ? 'var(--tv-green)' : 'var(--tv-red)'} />
              )}
            </svg>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'Volume', value: stock.volume },
              { label: 'Mkt Cap', value: stock.mktCap },
              { label: '52W High', value: `$${stock.high52.toFixed(2)}` },
              { label: '52W Low', value: `$${stock.low52.toFixed(2)}` },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{ flex: '1 1 120px', background: 'rgba(0,229,255,0.04)', border: '1px solid var(--tv-border)', borderRadius: 8, padding: '8px 12px' }}
              >
                <div style={{ fontSize: 10, color: 'var(--tv-text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--tv-text-primary)' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function MiniStockCard({ symbol }: { symbol: string }) {
  const stock = MOCK_STOCKS[symbol];
  if (!stock) return null;
  const up = stock.change >= 0;
  const sparkPrices = useMemo(() => {
    let p = stock.price * 0.97;
    const arr: number[] = [];
    for (let i = 0; i < 20; i++) {
      p += (Math.random() - 0.48) * stock.price * 0.01;
      arr.push(p);
    }
    arr[arr.length - 1] = stock.price;
    return arr;
  }, [stock.price]);

  return (
    <div
      style={{
        background: 'var(--tv-grad-card)',
        border: '1px solid var(--tv-border)',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 800, color: 'var(--tv-text-primary)' }}>{symbol}</div>
          <div style={{ fontSize: 10, color: 'var(--tv-text-muted)', marginTop: 2 }}>{stock.name}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: up ? 'var(--tv-green)' : 'var(--tv-red)', background: up ? 'rgba(0,230,118,0.1)' : 'rgba(255,23,68,0.1)', padding: '2px 6px', borderRadius: 4 }}>
          {up ? '+' : ''}{stock.changePct.toFixed(2)}%
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--tv-text-primary)' }}>${stock.price.toFixed(2)}</span>
        <MiniChart data={sparkPrices.map((p, i) => ({ time: String(i), price: p }))} width={80} height={28} up={up} />
      </div>
    </div>
  );
}