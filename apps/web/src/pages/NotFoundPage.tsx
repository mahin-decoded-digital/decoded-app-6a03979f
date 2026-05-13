import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--parchment)' }}>
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          {/* Large decorative numeral */}
          <div className="relative mb-4">
            <p
              className="font-display font-black text-[160px] md:text-[220px] leading-none select-none"
              style={{ color: 'var(--warm-muted)', lineHeight: 1 }}
            >
              404
            </p>
            <div
              className="absolute inset-0 flex items-center justify-center text-6xl pointer-events-none"
            >
              🎸
            </div>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-black text-[var(--ink)] mb-3 leading-tight">
            Looks like this string is missing.
          </h1>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            The page you're looking for may have moved or been retired. Our collection, however, is very much alive.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--gold)] text-[var(--navy)] font-semibold text-sm hover:bg-[var(--gold-light)] transition-all shadow-[var(--shadow-gold)]"
          >
            Take me home
          </Link>
        </div>
      </div>
    </div>
  );
}
