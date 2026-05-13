import { useEffect, useMemo } from 'react';
import { Play, Shield, Truck, Star, RotateCcw, Lock, ChevronRight } from 'lucide-react';
import { useGuitarStore } from '@/stores/guitarStore';
import { GUITAR_CATALOG, IMAGE_MAP } from '@/lib/catalog';
import { GuitarCard } from '@/components/GuitarCard';
import { ComparisonTable } from '@/components/ComparisonTable';
import { EmailSignup } from '@/components/EmailSignup';
import { SoundDemoDialog } from '@/components/SoundDemoDialog';
import { ComparisonBar } from '@/components/ComparisonBar';
import { Navbar } from '@/components/Navbar';

const CATEGORIES = ['All', 'acoustic', 'electric', 'bass', 'classical'] as const;

const TRUST_BADGES = [
  { icon: Truck, label: 'Free shipping over $500' },
  { icon: RotateCcw, label: '30-day returns' },
  { icon: Shield, label: 'Certificate of Authenticity' },
  { icon: Star, label: '2-year warranty' },
  { icon: Lock, label: 'Secure checkout' },
];

const DEMO_ENTRIES = [
  { guitarIndex: 0, imageSlot: 'demo-1', videoSlotGuitar: 'g1' },
  { guitarIndex: 5, imageSlot: 'demo-2', videoSlotGuitar: 'g6' },
  { guitarIndex: 1, imageSlot: 'demo-3', videoSlotGuitar: 'g2' },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function HomePage() {
  const seedGuitars = useGuitarStore((s) => s.seedGuitars);
  const guitars = useGuitarStore((s) => s.guitars);
  const filterCategory = useGuitarStore((s) => s.filterCategory);
  const setFilterCategory = useGuitarStore((s) => s.setFilterCategory);
  const setActiveDemoGuitar = useGuitarStore((s) => s.setActiveDemoGuitar);
  const activeDemoGuitarId = useGuitarStore((s) => s.activeDemoGuitarId);

  useEffect(() => {
    seedGuitars(GUITAR_CATALOG);
  }, [seedGuitars]);

  const filteredGuitars = useMemo(
    () => (filterCategory ? guitars.filter((g) => g.category === filterCategory) : guitars),
    [guitars, filterCategory]
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--parchment)' }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <img
          src={IMAGE_MAP['hero']}
          alt="Premium electric guitar on stage with dramatic lighting"
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Multi-layer scrim for editorial contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)] via-[hsla(220,30%,10%,0.72)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-transparent opacity-70" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-medium mb-5">
              Premium Instrument Retail
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-black text-[var(--parchment)] leading-[1.05] mb-6">
              Every string<br />
              <em className="not-italic text-[var(--gold)]">tells a story.</em>
            </h1>
            <p className="text-lg text-[var(--warm-muted)] max-w-lg leading-relaxed mb-10">
              See it. Hear it. Own it. Our curated collection of professional instruments is built for players who know exactly what they're looking for — and some who are still finding out.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('gallery')}
                className="px-7 py-3.5 rounded-full bg-[var(--gold)] text-[var(--navy)] font-semibold text-sm hover:bg-[var(--gold-light)] transition-all shadow-[var(--shadow-gold)] flex items-center gap-2"
              >
                Shop Featured Guitars
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => scrollToSection('demos')}
                className="px-7 py-3.5 rounded-full border border-[var(--warm-muted)] text-[var(--parchment)] font-semibold text-sm hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all flex items-center gap-2"
              >
                Hear them play →
              </button>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-12 bg-[var(--warm-muted)]" />
          <p className="text-[10px] uppercase tracking-widest text-[var(--warm-muted)]">Scroll</p>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────────────────── */}
      <section id="gallery" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-dim)] font-medium mb-2">The Collection</p>
            <h2 className="font-display text-4xl font-black text-[var(--ink)] mb-4">Fine Instruments</h2>
            <p className="text-muted-foreground max-w-lg">
              Hover any guitar to reveal full specs. Click '+ Compare' to stack models side by side.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => {
              const isActive = cat === 'All' ? filterCategory === null : filterCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat === 'All' ? null : cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize ${
                    isActive
                      ? 'bg-[var(--gold)] text-[var(--navy)] border-[var(--gold)]'
                      : 'bg-transparent text-[var(--ink)] border-[var(--warm-muted)] hover:border-[var(--gold)] hover:text-[var(--gold-dim)]'
                  }`}
                >
                  {cat === 'All' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              );
            })}
          </div>

          {filteredGuitars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 text-3xl" style={{ background: 'var(--warm-muted)' }}>
                🎸
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--ink)] mb-3">Nothing in this category yet</h3>
              <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
                Nothing in this category at the moment. Try browsing the full collection or sign up to be first when new stock lands.
              </p>
              <button
                onClick={() => setFilterCategory(null)}
                className="px-6 py-2.5 rounded-full bg-[var(--gold)] text-[var(--navy)] text-sm font-semibold hover:bg-[var(--gold-light)] transition-all shadow-[var(--shadow-gold)]"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuitars.map((guitar) => (
                <GuitarCard key={guitar.id} guitar={guitar} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────── */}
      <section id="compare" className="py-24 px-6" style={{ background: 'var(--card-surface)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-dim)] font-medium mb-2">Side by Side</p>
            <h2 className="font-display text-4xl font-black text-[var(--ink)] mb-4">Compare Models</h2>
            <p className="text-muted-foreground max-w-lg">
              Stack up to 3 instruments and see every spec at a glance. Differences are highlighted so the decision is yours to make.
            </p>
          </div>
          <ComparisonTable />
        </div>
      </section>

      {/* ── SOUND DEMOS ─────────────────────────────────────────────────── */}
      <section id="demos" className="py-24 px-6" style={{ background: 'var(--navy)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-medium mb-2">Hear Before You Buy</p>
            <h2 className="font-display text-4xl font-black text-[var(--parchment)] mb-4">Sound Demos</h2>
            <p style={{ color: 'var(--warm-muted)' }} className="max-w-lg">
              If you can't play it in the shop, at least hear it played by someone who lives for it. Real instruments, real sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEMO_ENTRIES.map((entry, i) => {
              const guitar = GUITAR_CATALOG.find((g) => g.id === entry.videoSlotGuitar);
              const imgUrl = IMAGE_MAP[entry.imageSlot];
              if (!guitar) return null;
              return (
                <button
                  key={i}
                  onClick={() => setActiveDemoGuitar(guitar.id)}
                  className="group relative rounded-[var(--radius-card)] overflow-hidden text-left"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={`Sound demo for ${guitar.name}`}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[var(--overlay-bg)] opacity-60 group-hover:opacity-40 transition-opacity" />
                    {/* Big play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[var(--gold)] flex items-center justify-center shadow-[var(--shadow-gold)] group-hover:scale-110 transition-transform">
                        <Play size={24} fill="var(--navy)" style={{ color: 'var(--navy)' }} className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4" style={{ background: 'var(--navy-mid)' }}>
                    <p className="text-xs uppercase tracking-wider text-[var(--gold)] mb-1 font-medium">{guitar.category}</p>
                    <h4 className="font-display font-bold text-[var(--parchment)]">{guitar.name}</h4>
                    <p className="text-xs text-[var(--warm-muted)] mt-1">{guitar.brand} · ${guitar.price.toLocaleString()}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WORKSHOP / ABOUT ─────────────────────────────────────────────── */}
      <section id="about" className="py-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[480px]">
          <div className="lg:w-1/2 relative min-h-[320px]">
            <img
              src={IMAGE_MAP['about-workshop']}
              alt="Guitar luthier workshop with craftsmanship tools"
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="lg:w-1/2 flex items-center px-10 py-16" style={{ background: 'var(--ink)' }}>
            <div className="max-w-md">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-medium mb-4">Our Craft</p>
              <h2 className="font-display text-4xl font-black text-[var(--parchment)] mb-5 leading-tight">
                Built for players<br />who mean it.
              </h2>
              <p style={{ color: 'var(--warm-muted)' }} className="leading-relaxed mb-5">
                Every instrument in our collection is sourced, inspected, and played before it reaches our shelves. We don't move inventory — we steward instruments to the musicians they belong with.
              </p>
              <p style={{ color: 'var(--warm-muted)' }} className="leading-relaxed text-sm opacity-80">
                Strum &amp; Scale is a curated digital showroom for serious players. No padding. No filler. Just the instruments that make the grade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────────────────────── */}
      <section className="py-14 px-6 border-y border-[var(--warm-muted)]" style={{ background: 'var(--card-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-[var(--ink)]">
                <Icon size={20} style={{ color: 'var(--gold)' }} strokeWidth={1.5} />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL SIGNUP ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: 'var(--navy)' }}>
        <div className="max-w-xl mx-auto text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-medium mb-3">Insider Access</p>
          <h2 className="font-display text-4xl font-black text-[var(--parchment)] mb-4">
            Feed the GAS.
          </h2>
          <p style={{ color: 'var(--warm-muted)' }} className="leading-relaxed">
            Gear Acquisition Syndrome is real. We get it. Sign up and we'll hit you first when rare stock lands — before it's gone.
          </p>
        </div>
        <div className="max-w-md mx-auto">
          <EmailSignup />
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="py-12 px-6 border-t border-[var(--navy-mid)]" style={{ background: 'var(--ink)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl font-black text-[var(--gold)] mb-1">Strum &amp; Scale</p>
            <p className="text-xs text-[var(--warm-muted)]">Premium instruments for serious players.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            {[
              { label: 'Shop', id: 'gallery' },
              { label: 'Compare', id: 'compare' },
              { label: 'Sound Demos', id: 'demos' },
              { label: 'About', id: 'about' },
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.id)}
                className="text-[var(--warm-muted)] hover:text-[var(--gold)] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--warm-muted)] opacity-60">
            © {new Date().getFullYear()} Strum &amp; Scale. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── GLOBAL OVERLAYS ─────────────────────────────────────────────── */}
      <ComparisonBar />
      {activeDemoGuitarId && <SoundDemoDialog />}
    </div>
  );
}
