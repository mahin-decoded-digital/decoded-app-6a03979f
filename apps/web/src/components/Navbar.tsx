import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Shop', href: '#gallery' },
  { label: 'Compare', href: '#compare' },
  { label: 'Sound Demos', href: '#demos' },
  { label: 'About', href: '#about' },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id.replace('#', ''));
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[var(--navy)] shadow-[0_2px_24px_hsla(220,50%,10%,0.35)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Wordmark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display text-xl font-bold tracking-tight text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
        >
          Strum &amp; Scale
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="text-sm font-medium text-[var(--warm-muted)] hover:text-[var(--gold)] transition-colors tracking-wide"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scrollToSection('#gallery')}
            className="px-5 py-2 rounded-full bg-[var(--gold)] text-[var(--navy)] text-sm font-semibold hover:bg-[var(--gold-light)] transition-all shadow-[var(--shadow-gold)]"
          >
            Shop Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[var(--warm-muted)] hover:text-[var(--gold)] transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--navy)] border-t border-[var(--navy-mid)] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => { scrollToSection(link.href); setMenuOpen(false); }}
              className="text-sm font-medium text-[var(--warm-muted)] hover:text-[var(--gold)] transition-colors text-left"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { scrollToSection('#gallery'); setMenuOpen(false); }}
            className="mt-2 px-5 py-2 rounded-full bg-[var(--gold)] text-[var(--navy)] text-sm font-semibold hover:bg-[var(--gold-light)] transition-all self-start"
          >
            Shop Now
          </button>
        </div>
      )}
    </nav>
  );
}
