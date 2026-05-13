import { useNavigate } from 'react-router-dom';
import { Play, X, Minus } from 'lucide-react';
import { useMemo } from 'react';
import { useGuitarStore } from '@/stores/guitarStore';
import { IMAGE_MAP } from '@/lib/catalog';
import type { Guitar } from '@/types';

const SPEC_ROWS: { label: string; key: keyof Guitar }[] = [
  { label: 'Body Wood', key: 'bodyWood' },
  { label: 'Neck Wood', key: 'neckWood' },
  { label: 'Fretboard', key: 'fretboard' },
  { label: 'Pickups', key: 'pickups' },
  { label: 'Hardware', key: 'hardware' },
  { label: 'Finish', key: 'finish' },
  { label: 'Scale Length', key: 'scaleLength' },
  { label: 'Nut Width', key: 'nutWidth' },
  { label: 'Frets', key: 'numberOfFrets' },
  { label: 'Price', key: 'price' },
  { label: 'In Stock', key: 'inStock' },
];

function formatValue(key: keyof Guitar, value: unknown): string {
  if (value === null || value === undefined) return '—';
  if (key === 'price') return `$${(value as number).toLocaleString()}`;
  if (key === 'inStock') return (value as boolean) ? 'Yes' : 'No';
  return String(value);
}

function isDifferent(guitars: Guitar[], key: keyof Guitar): boolean {
  const vals = guitars.map((g) => String(g[key] ?? ''));
  return new Set(vals).size > 1;
}

export function ComparisonTable() {
  const navigate = useNavigate();
  const comparisonIds = useGuitarStore((s) => s.comparisonIds);
  const guitars = useGuitarStore((s) => s.guitars);
  const toggleComparison = useGuitarStore((s) => s.toggleComparison);
  const clearComparison = useGuitarStore((s) => s.clearComparison);
  const setActiveDemoGuitar = useGuitarStore((s) => s.setActiveDemoGuitar);

  const selectedGuitars = useMemo(
    () => guitars.filter((g) => comparisonIds.includes(g.id)),
    [guitars, comparisonIds]
  );

  function scrollToGallery() {
    const el = document.getElementById('gallery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  if (selectedGuitars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--parchment)] flex items-center justify-center mb-6">
          <Minus size={28} style={{ color: 'var(--gold)' }} />
        </div>
        <h3 className="font-display text-2xl font-bold text-[var(--ink)] mb-3">Pick your contenders</h3>
        <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
          Your comparison stage is empty. Head up to the gallery, hover any guitar, and hit '+ Compare' to start stacking models side by side.
        </p>
        <button
          onClick={scrollToGallery}
          className="px-6 py-2.5 rounded-full bg-[var(--gold)] text-[var(--navy)] text-sm font-semibold hover:bg-[var(--gold-light)] transition-all shadow-[var(--shadow-gold)]"
        >
          Browse guitars
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={clearComparison}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors underline-offset-2 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-muted-foreground font-medium w-36">Spec</th>
              {selectedGuitars.map((g) => (
                <th key={g.id} className="py-3 px-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <img
                        src={IMAGE_MAP[g.imageSlot] ?? ''}
                        alt={g.name}
                        crossOrigin="anonymous"
                        className="w-20 h-20 object-cover rounded-xl shadow-md"
                      />
                      {g.videoUrl && (
                        <button
                          onClick={() => setActiveDemoGuitar(g.id)}
                          className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center hover:bg-[var(--gold-light)] transition-colors"
                          aria-label={`Play demo for ${g.name}`}
                        >
                          <Play size={10} fill="currentColor" style={{ color: 'var(--navy)' }} />
                        </button>
                      )}
                    </div>
                    <div>
                      <p className="font-display font-bold text-sm text-[var(--ink)] leading-tight">{g.name}</p>
                      <p className="text-xs text-muted-foreground">{g.brand}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/guitars/${g.id}`)}
                        className="text-xs px-2.5 py-1 rounded-full border border-[var(--gold)] text-[var(--gold-dim)] hover:bg-[var(--gold)] hover:text-[var(--navy)] transition-all"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => toggleComparison(g.id)}
                        className="text-xs px-2.5 py-1 rounded-full border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all flex items-center gap-1"
                      >
                        <X size={10} />
                        Remove
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPEC_ROWS.map((row, idx) => {
              const diff = isDifferent(selectedGuitars, row.key);
              return (
                <tr
                  key={row.key}
                  className={idx % 2 === 0 ? 'bg-[var(--parchment)]' : 'bg-[var(--card-surface)]'}
                  style={diff ? { outline: '1px solid var(--gold)', outlineOffset: '-1px' } : {}}
                >
                  <td className="py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {row.label}
                    {diff && <span className="ml-2 text-[var(--gold)] text-[10px] font-bold">DIFF</span>}
                  </td>
                  {selectedGuitars.map((g) => (
                    <td
                      key={g.id}
                      className="py-3 px-4 text-center text-sm text-[var(--ink)] font-medium"
                    >
                      {formatValue(row.key, g[row.key])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
