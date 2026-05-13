import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Eye, Check } from 'lucide-react';
import { useGuitarStore } from '@/stores/guitarStore';
import { IMAGE_MAP } from '@/lib/catalog';
import type { Guitar } from '@/types';
import { cn } from '@/lib/utils';

interface GuitarCardProps {
  guitar: Guitar;
}

const BADGE_COLORS: Record<string, string> = {
  'New Arrival': 'bg-[var(--gold)] text-[var(--navy)]',
  'Best Seller': 'bg-[var(--navy)] text-[var(--gold)] border border-[var(--gold)]',
  'Limited': 'bg-destructive text-destructive-foreground',
  'Staff Pick': 'bg-[var(--navy-mid)] text-[var(--gold-light)]',
};

export function GuitarCard({ guitar }: GuitarCardProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const comparisonIds = useGuitarStore((s) => s.comparisonIds);
  const toggleComparison = useGuitarStore((s) => s.toggleComparison);
  const setActiveDemoGuitar = useGuitarStore((s) => s.setActiveDemoGuitar);

  const isInComparison = comparisonIds.includes(guitar.id);
  const comparisonFull = comparisonIds.length >= 3 && !isInComparison;

  const imgSrc = IMAGE_MAP[guitar.imageSlot] ?? '';

  return (
    <div
      className="relative rounded-[var(--radius-card)] overflow-hidden cursor-pointer group"
      style={{
        boxShadow: hovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transition: 'box-shadow 0.3s var(--ease-smooth), transform 0.3s var(--ease-smooth)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        background: 'var(--card-surface)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge */}
      {guitar.badge && (
        <div className={cn('absolute top-3 left-3 z-20 px-2.5 py-0.5 rounded-full text-xs font-semibold', BADGE_COLORS[guitar.badge])}>
          {guitar.badge}
        </div>
      )}

      {/* Video play icon */}
      {guitar.videoUrl && (
        <button
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[var(--overlay-bg)] flex items-center justify-center text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--navy)] transition-all"
          onClick={(e) => { e.stopPropagation(); setActiveDemoGuitar(guitar.id); }}
          aria-label={`Play demo for ${guitar.name}`}
          title={`Play demo for ${guitar.name}`}
        >
          <Play size={14} fill="currentColor" />
        </button>
      )}

      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={imgSrc}
          alt={guitar.name}
          crossOrigin="anonymous"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300"
          style={{
            background: 'var(--overlay-bg)',
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none',
          }}
        >
          <div className="space-y-1 mb-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <SpecRow label="Body" value={guitar.bodyWood} />
              <SpecRow label="Neck" value={guitar.neckWood} />
              <SpecRow label="Scale" value={guitar.scaleLength} />
              {guitar.pickups && <SpecRow label="Pickups" value={guitar.pickups} />}
              <SpecRow label="Finish" value={guitar.finish} />
              <SpecRow label="Hardware" value={guitar.hardware} />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); navigate(`/guitars/${guitar.id}`); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--gold)] text-[var(--navy)] text-xs font-semibold hover:bg-[var(--gold-light)] transition-colors"
            >
              <Eye size={13} />
              View Details
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); if (!comparisonFull) toggleComparison(guitar.id); }}
              disabled={comparisonFull}
              title={comparisonFull ? 'Max 3 models. Remove one to compare another.' : undefined}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                isInComparison
                  ? 'bg-[var(--gold)] text-[var(--navy)]'
                  : comparisonFull
                  ? 'bg-[var(--navy-mid)] text-[var(--warm-muted)] cursor-not-allowed opacity-60'
                  : 'bg-[var(--navy-mid)] text-[var(--gold)] hover:bg-[var(--navy-light)]'
              )}
            >
              {isInComparison ? <Check size={13} /> : <Plus size={13} />}
              {isInComparison ? 'Added' : '+ Compare'}
            </button>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-4 py-3 border-t border-[var(--warm-muted)]">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{guitar.brand} · {guitar.category}</p>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-[var(--ink)] leading-tight">{guitar.name}</h3>
          <span className="font-mono text-sm font-semibold text-[var(--gold-dim)]">${guitar.price.toLocaleString()}</span>
        </div>
        {!guitar.inStock && (
          <p className="text-xs text-destructive mt-1 font-medium">Out of stock</p>
        )}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] text-[var(--gold)] uppercase tracking-wider leading-none mb-0.5">{label}</p>
      <p className="text-xs text-[var(--parchment)] leading-tight truncate">{value}</p>
    </div>
  );
}
