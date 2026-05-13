import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StockQuote, ChartPoint, NewsItem, IndexTicker, RegistrationData } from '../types';

// ── Static seed data (not user-created — this is market data simulation) ──

export const MOCK_INDICES: IndexTicker[] = [
  { symbol: 'S&P 500', name: 'S&P 500', value: 5248.15, change: 23.45, changePct: 0.45 },
  { symbol: 'NASDAQ', name: 'NASDAQ', value: 16384.47, change: -45.12, changePct: -0.27 },
  { symbol: 'DOW', name: 'Dow Jones', value: 39187.38, change: 112.84, changePct: 0.29 },
  { symbol: 'FTSE', name: 'FTSE 100', value: 8312.56, change: -18.34, changePct: -0.22 },
  { symbol: 'DAX', name: 'DAX 40', value: 18384.35, change: 56.78, changePct: 0.31 },
  { symbol: 'NIKKEI', name: 'Nikkei 225', value: 38487.24, change: -123.45, changePct: -0.32 },
  { symbol: 'HSI', name: 'Hang Seng', value: 17651.05, change: 89.12, changePct: 0.51 },
  { symbol: 'CAC', name: 'CAC 40', value: 8112.73, change: 34.56, changePct: 0.43 },
  { symbol: 'ASX', name: 'ASX 200', value: 7812.45, change: -22.33, changePct: -0.29 },
  { symbol: 'TSX', name: 'TSX Composite', value: 21945.67, change: 67.89, changePct: 0.31 },
];

export const MOCK_STOCKS: Record<string, StockQuote> = {
  AAPL: { symbol: 'AAPL', name: 'Apple Inc.', price: 189.84, change: 2.13, changePct: 1.14, volume: '52.4M', mktCap: '$2.93T', high52: 199.62, low52: 164.08 },
  GOOGL: { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.98, change: -1.23, changePct: -0.69, volume: '18.7M', mktCap: '$2.19T', high52: 193.31, low52: 130.67 },
  MSFT: { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.32, change: 4.87, changePct: 1.19, volume: '21.3M', mktCap: '$3.09T', high52: 430.82, low52: 309.45 },
  NVDA: { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 874.15, change: 23.45, changePct: 2.76, volume: '41.8M', mktCap: '$2.15T', high52: 974.00, low52: 410.83 },
  TSLA: { symbol: 'TSLA', name: 'Tesla Inc.', price: 177.58, change: -5.34, changePct: -2.92, volume: '88.2M', mktCap: '$564.1B', high52: 299.29, low52: 138.80 },
  AMZN: { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.07, change: 1.94, changePct: 1.06, volume: '33.5M', mktCap: '$1.93T', high52: 201.20, low52: 118.35 },
  META: { symbol: 'META', name: 'Meta Platforms', price: 511.33, change: 8.12, changePct: 1.61, volume: '14.9M', mktCap: '$1.31T', high52: 531.49, low52: 274.38 },
  JPM: { symbol: 'JPM', name: 'JPMorgan Chase', price: 200.44, change: -0.87, changePct: -0.43, volume: '9.4M', mktCap: '$577.6B', high52: 205.89, low52: 143.43 },
};

function generateChart(basePrice: number, points = 60): ChartPoint[] {
  const data: ChartPoint[] = [];
  let price = basePrice * 0.96;
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.48) * basePrice * 0.012;
    price = Math.max(price, basePrice * 0.88);
    const date = new Date(Date.now() - (points - i) * 86400000 / 4);
    data.push({ time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), price: parseFloat(price.toFixed(2)) });
  }
  data[data.length - 1].price = basePrice;
  return data;
}

export const MOCK_NEWS: NewsItem[] = [
  { id: '1', title: 'Fed signals potential rate cuts as inflation cools to 3-year low', source: 'Reuters', time: '2m ago', url: '#', sentiment: 'positive' },
  { id: '2', title: 'NVIDIA surpasses $2T market cap on AI chip demand surge', source: 'Bloomberg', time: '8m ago', url: '#', sentiment: 'positive' },
  { id: '3', title: 'Tesla faces margin pressure amid EV price war escalation', source: 'WSJ', time: '15m ago', url: '#', sentiment: 'negative' },
  { id: '4', title: "Apple's Vision Pro shipments fall short of analyst estimates", source: 'CNBC', time: '24m ago', url: '#', sentiment: 'negative' },
  { id: '5', title: 'S&P 500 hits new record as Big Tech earnings impress markets', source: 'FT', time: '31m ago', url: '#', sentiment: 'positive' },
  { id: '6', title: 'JPMorgan raises S&P 500 year-end target to 5,800 on AI optimism', source: 'Barron\'s', time: '45m ago', url: '#', sentiment: 'positive' },
  { id: '7', title: 'Oil prices slip on demand concerns from China slowdown data', source: 'Reuters', time: '1h ago', url: '#', sentiment: 'negative' },
  { id: '8', title: 'Meta Platforms reports 27% revenue jump, beats expectations', source: 'Bloomberg', time: '2h ago', url: '#', sentiment: 'positive' },
];

interface TradeState {
  searchQuery: string;
  selectedSymbol: string;
  chartData: ChartPoint[];
  theme: 'dark' | 'light';
  registrationStep: number;
  registrationData: Partial<RegistrationData>;
  leadEmail: string;
  selectedTier: string;
  regModalOpen: boolean;
  setSearchQuery: (q: string) => void;
  setSelectedSymbol: (sym: string) => void;
  setTheme: (t: 'dark' | 'light') => void;
  setRegistrationStep: (s: number) => void;
  updateRegistrationData: (data: Partial<RegistrationData>) => void;
  setLeadEmail: (email: string) => void;
  setSelectedTier: (tier: string) => void;
  setRegModalOpen: (open: boolean) => void;
  loadChart: (symbol: string) => void;
}

export const useTradeStore = create<TradeState>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      selectedSymbol: 'AAPL',
      chartData: generateChart(189.84),
      theme: 'dark',
      registrationStep: 1,
      registrationData: {},
      leadEmail: '',
      selectedTier: 'pro',
      regModalOpen: false,
      setSearchQuery: (q) => set({ searchQuery: q }),
      setSelectedSymbol: (sym) => {
        const stock = MOCK_STOCKS[sym];
        if (stock) {
          set({ selectedSymbol: sym, chartData: generateChart(stock.price) });
        }
      },
      setTheme: (t) => set({ theme: t }),
      setRegistrationStep: (s) => set({ registrationStep: s }),
      updateRegistrationData: (data) => set((state) => ({ registrationData: { ...state.registrationData, ...data } })),
      setLeadEmail: (email) => set({ leadEmail: email }),
      setSelectedTier: (tier) => set({ selectedTier: tier }),
      setRegModalOpen: (open) => set({ regModalOpen: open }),
      loadChart: (symbol) => {
        const stock = MOCK_STOCKS[symbol];
        if (stock) {
          set({ selectedSymbol: symbol, chartData: generateChart(stock.price) });
        }
      },
    }),
    { name: 'tradevista-store', partialize: (state) => ({ theme: state.theme, leadEmail: state.leadEmail }) }
  )
);