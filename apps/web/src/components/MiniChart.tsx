import { useMemo } from 'react';
import type { ChartPoint } from '../types';

interface MiniChartProps {
  data: ChartPoint[];
  width?: number;
  height?: number;
  up?: boolean;
}

export function MiniChart({ data, width = 120, height = 40, up = true }: MiniChartProps) {
  const { path, areaPath } = useMemo(() => {
    if (data.length < 2) return { path: '', areaPath: '' };
    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const pad = 2;
    const w = width;
    const h = height - pad * 2;
    const pts = prices.map((p, i) => {
      const x = (i / (prices.length - 1)) * w;
      const y = pad + h - ((p - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const linePath = 'M ' + pts.join(' L ');
    const areaPath = linePath + ` L ${w},${height} L 0,${height} Z`;
    return { path: linePath, areaPath };
  }, [data, width, height]);

  const color = up ? 'var(--tv-green)' : 'var(--tv-red)';
  const gradId = `grad-${up ? 'up' : 'down'}-${Math.floor(Math.random() * 100000)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1000}
        strokeDashoffset={0}
        style={{ animation: 'tv-chart-draw 1.2s ease-out forwards' }}
      />
    </svg>
  );
}

interface SparklineProps {
  prices: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export function Sparkline({ prices, width = 80, height = 28, color, strokeWidth = 1.5 }: SparklineProps) {
  const { path } = useMemo(() => {
    if (prices.length < 2) return { path: '' };
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const pad = 2;
    const h = height - pad * 2;
    const pts = prices.map((p, i) => {
      const x = (i / (prices.length - 1)) * width;
      const y = pad + h - ((p - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return { path: 'M ' + pts.join(' L ') };
  }, [prices, width, height]);

  const up = prices[prices.length - 1] >= prices[0];
  const strokeColor = color || (up ? 'var(--tv-green)' : 'var(--tv-red)');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={path} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}