import { X, ArrowDown } from 'lucide-react';
import { useGuitarStore } from '@/stores/guitarStore';
import { IMAGE_MAP } from '@/lib/catalog';
import { useMemo } from 'react';

function scrollToCompare() {
  const el = document.getElementById('compare');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function ComparisonBar() {
  const comparisonIds = useGuitarStore((s) => s.comparisonIds);
  const guitars = useGuitarStore((s) => s.guitars);
  const toggleComparison = useGuitarStore((s) => s.toggleComparison);
  const clearComparison = useGuitarStore((s) => s.clearComparison);

  const selectedGuitars = useMemo(
    () => guitars.filter((g) => comparisonIds.includes(g.id)),
    [guitars, comparisonIds]
  );

  if (comparisonIds.length === 0) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--navy-mid)]"
      style={{ background: 'var(--navy)', boxShadow: '0 -4px 32px hsla(220,50%,10%,0.4)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
          <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-medium shrink-0 mr-2">
            Compare ({comparisonIds.length}/3)
          </span>
          {selectedGuitars.map((g) => (
            <div
              key={g.id}
              className="flex items-center gap-2 bg-[var(--navy-mid)] rounded-lg px-2.5 py-1.5 shrink-0"
            >
              <img
                src={IMAGE_MAP[g.imageSlot] ?? ''}
                alt={g.name}
                crossOrigin="anonymous"
                className="w-8 h-8 rounded object-cover"
              />
              <span className="text-xs text-[var(--parchment)] font-medium max-w-[100px] truncate">{g.name}</span>
              <button
                onClick={() => toggleComparison(g.id)}
                className="text-[var(--warm-muted)] hover:text-destructive transition-colors ml-1"
                aria-label={`Remove ${g.name} from comparison`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={clearComparison}
            className="text-xs text-[var(--warm-muted)] hover:text-destructive transition-colors underline-offset-2 hover:underline"
          >
            Clear All
          </button>
          <button
            onClick={scrollToCompare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--gold)] text-[var(--navy)] text-sm font-semibold hover:bg-[var(--gold-light)] transition-all shadow-[var(--shadow-gold)]"
          >
            Compare Now
            <ArrowDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
