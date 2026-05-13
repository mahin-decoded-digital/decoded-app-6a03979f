export interface Guitar {
  id: string;
  createdAt: Date;
  name: string;
  brand: string;
  category: 'acoustic' | 'electric' | 'bass' | 'classical';
  price: number;
  imageSlot: string;
  videoUrl: string | null;
  bodyWood: string;
  neckWood: string;
  fretboard: string;
  pickups: string | null;
  hardware: string;
  finish: string;
  scaleLength: string;
  nutWidth: string;
  numberOfFrets: number;
  inStock: boolean;
  featured: boolean;
  badge: 'New Arrival' | 'Best Seller' | 'Limited' | 'Staff Pick' | null;
}

export interface ComparisonSelection {
  id: string;
  createdAt: Date;
  guitarIds: string[];
}

export interface EmailSubscriber {
  id: string;
  createdAt: Date;
  email: string;
  interests: ('acoustic' | 'electric' | 'bass' | 'classical')[];
  confirmedAt: Date | null;
}

// Legacy types retained for tradeStore / orphaned component compatibility

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: string;
  mktCap: string;
  high52: number;
  low52: number;
}

export interface ChartPoint {
  time: string;
  price: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface IndexTicker {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePct: number;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  accountType: string;
  agreeTerms: boolean;
  agreeMarketing: boolean;
  tier: string;
}

export interface AccountTier {
  id: string;
  name: string;
  price: number;
  pricePeriod: string;
  description: string;
  highlighted: boolean;
  ctaLabel: string;
  features: string[];
}