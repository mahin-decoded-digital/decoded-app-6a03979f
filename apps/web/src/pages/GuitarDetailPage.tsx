import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Play, Check, Plus, ChevronRight } from 'lucide-react';
import { useGuitarStore } from '@/stores/guitarStore';
import { GUITAR_CATALOG, IMAGE_MAP } from '@/lib/catalog';
import { SoundDemoDialog } from '@/components/SoundDemoDialog';
import { Navbar } from '@/components/Navbar';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SPEC_FIELDS: { label: string; key: string }[] = [
  { label: 'Brand', key: 'brand' },
  { label: 'Category', key: 'category' },
  { label: 'Body Wood', key: 'bodyWood' },
  { label: 'Neck Wood', key: 'neckWood' },
  { label: 'Fretboard', key: 'fretboard' },
  { label: 'Pickups', key: 'pickups' },
  { label: 'Hardware', key: 'hardware' },
  { label: 'Finish', key: 'finish' },
  { label: 'Scale Length', key: 'scaleLength' },
  { label: 'Nut Width', key: 'nutWidth' },
  { label: 'Number of Frets', key: 'numberOfFrets' },
  { label: 'Availability', key: 'inStock' },
];

function formatSpecValue(key: string, val: unknown): string {
  if (val === null || val === undefined) return '—';
  if (key === 'inStock') return (val as boolean) ? 'In Stock' : 'Out of Stock';
  return String(val);
}

const BADGE_COLORS: Record<string, string> = {
  'New Arrival': 'bg-[var(--gold)] text-[var(--navy)]',
  'Best Seller': 'border border-[var(--gold)] text-[var(--gold-dim)]',
  'Limited': 'bg-destructive text-destructive-foreground',
  'Staff Pick': 'bg-[var(--navy-mid)] text-[var(--gold-light)]',
};

export default function GuitarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // All hooks BEFORE any conditional returns
  const seedGuitars = useGuitarStore((s) => s.seedGuitars);
  const guitars = useGuitarStore((s) => s.guitars);
  const comparisonIds = useGuitarStore((s) => s.comparisonIds);
  const toggleComparison = useGuitarStore((s) => s.toggleComparison);
  const setActiveDemoGuitar = useGuitarStore((s) => s.setActiveDemoGuitar);
  const activeDemoGuitarId = useGuitarStore((s) => s.activeDemoGuitarId);

  useEffect(() => {
    if (guitars.length === 0) {
      seedGuitars(GUITAR_CATALOG);
    }
  }, [guitars.length, seedGuitars]);

  const guitar = useMemo(
    () => (id ? guitars.find((g) => g.id === id) ?? null : null),
    [guitars, id]
  );

  const relatedGuitars = useMemo(
    () => (guitar ? guitars.filter((g) => g.category === guitar.category && g.id !== guitar.id).slice(0, 4) : []),
    [guitars, guitar]
  );

  const isInComparison = id ? comparisonIds.includes(id) : false;
  const comparisonFull = comparisonIds.length >= 3 && !isInComparison;

  // Guards after all hooks
  if (!id) return <Navigate to="/" replace />;

  if (guitars.length > 0 && !guitar) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: 'var(--parchment)' }}>
        <Navbar />
        <div className="mt-24">
          <p className="font-display text-6xl font-black text-[var(--gold)] mb-4">404</p>
          <h1 className="font-display text-3xl font-bold text-[var(--ink)] mb-4">We can't find that guitar</h1>
          <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
            Looks like this one found a new home. Browse the full collection and find your next great instrument.
          </p>
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-[var(--gold)] text-[var(--navy)] font-semibold text-sm hover:bg-[var(--gold-light)] transition-all shadow-[var(--shadow-gold)]"
          >
            Back to all guitars
          </Link>
        </div>
      </div>
    );
  }

  if (!guitar) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--parchment)' }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--gold)] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--parchment)' }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">

        {/* ── BREADCRUMB ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-10 text-sm text-muted-foreground">
          <Link to="/" className="flex items-center gap-1.5 hover:text-[var(--gold)] transition-colors">
            <ArrowLeft size={14} />
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-[var(--ink)] font-medium truncate">{guitar.name}</span>
        </div>

        {/* ── PRODUCT HERO ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div
            className="relative rounded-2xl overflow-hidden aspect-square bg-[var(--card-surface)]"
            style={{ boxShadow: 'var(--shadow-card-hover)' }}
          >
            <img
              src={IMAGE_MAP[guitar.imageSlot] ?? ''}
              alt={guitar.name}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
            />
            {guitar.badge && (
              <div className={cn('absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold', BADGE_COLORS[guitar.badge] ?? '')}>
                {guitar.badge}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-dim)] font-medium mb-2">
              {guitar.brand}
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-black text-[var(--ink)] leading-tight mb-3">
              {guitar.name}
            </h1>
            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize border border-[var(--warm-muted)] text-[var(--ink)]">
                {guitar.category}
              </span>
              {guitar.inStock ? (
                <span className="text-xs font-medium" style={{ color: 'var(--in-stock)' }}>● In Stock</span>
              ) : (
                <span className="text-xs font-medium text-destructive">● Out of Stock</span>
              )}
            </div>

            <p className="font-display text-4xl font-black text-[var(--gold)] mb-8">
              ${guitar.price.toLocaleString()}
            </p>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-3 mb-8 p-5 rounded-xl bg-[var(--card-surface)]" style={{ boxShadow: 'var(--shadow-card)' }}>
              <QuickSpec label="Body" value={guitar.bodyWood} />
              <QuickSpec label="Neck" value={guitar.neckWood} />
              <QuickSpec label="Scale" value={guitar.scaleLength} />
              <QuickSpec label="Frets" value={String(guitar.numberOfFrets)} />
              {guitar.pickups && <QuickSpec label="Pickups" value={guitar.pickups} />}
              <QuickSpec label="Finish" value={guitar.finish} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => toast.success("Added to your wishlist. Check back for price drops.")}
                className="flex-1 min-w-[160px] py-3 rounded-full bg-[var(--gold)] text-[var(--navy)] font-semibold text-sm hover:bg-[var(--gold-light)] transition-all shadow-[var(--shadow-gold)]"
              >
                Add to Wishlist
              </button>
              <button
                onClick={() => { if (!comparisonFull) toggleComparison(guitar.id); }}
                disabled={comparisonFull}
                title={comparisonFull ? 'Max 3 models. Remove one to compare another.' : undefined}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-semibold transition-all',
                  isInComparison
                    ? 'bg-[var(--gold)] text-[var(--navy)] border-[var(--gold)]'
                    : comparisonFull
                    ? 'border-[var(--warm-muted)] text-muted-foreground cursor-not-allowed opacity-60'
                    : 'border-[var(--gold)] text-[var(--gold-dim)] hover:bg-[var(--gold)] hover:text-[var(--navy)]'
                )}
              >
                {isInComparison ? <Check size={14} /> : <Plus size={14} />}
                {isInComparison ? 'In Comparison' : '+ Compare'}
              </button>
              {guitar.videoUrl && (
                <button
                  onClick={() => setActiveDemoGuitar(guitar.id)}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--navy)] text-[var(--ink)] text-sm font-semibold hover:bg-[var(--navy)] hover:text-[var(--parchment)] transition-all"
                >
                  <Play size={14} fill="currentColor" />
                  Hear Demo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── FULL SPECIFICATIONS ─────────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="font-display text-3xl font-black text-[var(--ink)] mb-8">Full Specifications</h2>
          <div className="rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
            <table className="w-full">
              <tbody>
                {SPEC_FIELDS.map((field, idx) => {
                  const val = (guitar as Record<string, unknown>)[field.key];
                  return (
                    <tr
                      key={field.key}
                      className={idx % 2 === 0 ? 'bg-[var(--card-surface)]' : 'bg-[var(--parchment)]'}
                    >
                      <td className="py-4 px-6 text-sm font-semibold text-muted-foreground w-1/3 uppercase tracking-wide text-xs">
                        {field.label}
                      </td>
                      <td className="py-4 px-6 text-sm text-[var(--ink)] font-medium">
                        {formatSpecValue(field.key, val)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── SOUND DEMO PLAYER ───────────────────────────────────────────── */}
        {guitar.videoUrl && (
          <section className="mb-20">
            <h2 className="font-display text-3xl font-black text-[var(--ink)] mb-2">Hear it in action</h2>
            <p className="text-muted-foreground mb-7">
              A live demo so you know exactly what you're getting before it arrives at your door.
            </p>
            <div className="rounded-2xl overflow-hidden aspect-video" style={{ boxShadow: 'var(--shadow-card-hover)' }}>
              <iframe
                src={guitar.videoUrl}
                title={`${guitar.name} sound demo`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* ── RELATED MODELS ───────────────────────────────────────────── */}
        {relatedGuitars.length > 0 && (
          <section>
            <h2 className="font-display text-3xl font-black text-[var(--ink)] mb-8">
              More {guitar.category.charAt(0).toUpperCase() + guitar.category.slice(1)} Guitars
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {relatedGuitars.map((related) => (
                <Link
                  key={related.id}
                  to={`/guitars/${related.id}`}
                  className="shrink-0 w-48 rounded-xl overflow-hidden group"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="aspect-square overflow-hidden bg-[var(--card-surface)]">
                    <img
                      src={IMAGE_MAP[related.imageSlot] ?? ''}
                      alt={related.name}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 bg-[var(--card-surface)]">
                    <p className="text-xs font-bold text-[var(--ink)] leading-tight truncate">{related.name}</p>
                    <p className="text-xs font-semibold text-[var(--gold-dim)] mt-0.5">${related.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {activeDemoGuitarId && <SoundDemoDialog />}
    </div>
  );
}

function QuickSpec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[var(--gold-dim)] font-medium mb-0.5">{label}</p>
      <p className="text-sm text-[var(--ink)] font-medium leading-tight">{value}</p>
    </div>
  );
}
