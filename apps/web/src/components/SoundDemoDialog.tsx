import { X } from 'lucide-react';
import { useGuitarStore } from '@/stores/guitarStore';
import { IMAGE_MAP } from '@/lib/catalog';
import { cn } from '@/lib/utils';

export function SoundDemoDialog() {
  const activeDemoGuitarId = useGuitarStore((s) => s.activeDemoGuitarId);
  const guitars = useGuitarStore((s) => s.guitars);
  const setActiveDemoGuitar = useGuitarStore((s) => s.setActiveDemoGuitar);

  const guitar = guitars.find((g) => g.id === activeDemoGuitarId) ?? null;

  if (!guitar) return null;

  const handleClose = () => setActiveDemoGuitar(null);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--ink)] opacity-80" />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--navy)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--navy-mid)]">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--gold)] font-medium mb-0.5">Sound Demo</p>
            <h3 className="font-display text-xl font-bold text-[var(--parchment)]">{guitar.name}</h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--warm-muted)] hover:text-[var(--gold)] hover:bg-[var(--navy-mid)] transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video */}
        <div className="relative w-full aspect-video bg-[var(--ink)]">
          {guitar.videoUrl ? (
            <iframe
              src={guitar.videoUrl}
              title={`${guitar.name} sound demo`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
              <p className="text-[var(--warm-muted)] text-sm leading-relaxed">
                Sound demo coming soon for this model. Sign up below and we'll notify you the moment it's live.
              </p>
            </div>
          )}
        </div>

        {/* Specs below video */}
        <div className="px-6 py-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-[var(--gold)] uppercase tracking-wider mb-1">Body</p>
            <p className="text-sm text-[var(--parchment)]">{guitar.bodyWood}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--gold)] uppercase tracking-wider mb-1">Pickups</p>
            <p className="text-sm text-[var(--parchment)]">{guitar.pickups ?? 'Acoustic'}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--gold)] uppercase tracking-wider mb-1">Price</p>
            <p className="text-sm font-semibold text-[var(--gold)]">${guitar.price.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
