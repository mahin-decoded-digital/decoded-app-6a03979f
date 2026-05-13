import { useState } from 'react';
import { useSubscriberStore } from '@/stores/subscriberStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const INTERESTS: { value: 'acoustic' | 'electric' | 'bass' | 'classical'; label: string }[] = [
  { value: 'acoustic', label: 'Acoustic' },
  { value: 'electric', label: 'Electric' },
  { value: 'bass', label: 'Bass' },
  { value: 'classical', label: 'Classical' },
];

export function EmailSignup() {
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<('acoustic' | 'electric' | 'bass' | 'classical')[]>([]);
  const [emailError, setEmailError] = useState('');
  const [interestError, setInterestError] = useState('');

  const subscribe = useSubscriberStore((s) => s.subscribe);
  const submitStatus = useSubscriberStore((s) => s.submitStatus);
  const resetStatus = useSubscriberStore((s) => s.resetStatus);

  function toggleInterest(val: 'acoustic' | 'electric' | 'bass' | 'classical') {
    setInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
    setInterestError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError('');
    setInterestError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    if (interests.length === 0) {
      setInterestError('Pick at least one category so we know what to watch for you.');
      return;
    }

    subscribe(email, interests);
  }

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-[var(--gold)] flex items-center justify-center mx-auto mb-5 text-3xl">
          🎸
        </div>
        <h3 className="font-display text-2xl font-bold text-[var(--parchment)] mb-2">
          You're on the list!
        </h3>
        <p className="text-[var(--warm-muted)] max-w-sm mx-auto">
          We'll alert you when your next instrument arrives. Stay tuned — your GAS is safe with us.
        </p>
        <button
          onClick={() => { resetStatus(); setEmail(''); setInterests([]); }}
          className="mt-6 text-xs text-[var(--gold)] underline hover:text-[var(--gold-light)] transition-colors"
        >
          Sign up another email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(''); if (submitStatus) resetStatus(); }}
          placeholder="your@email.com"
          className={cn(
            'w-full px-4 py-3 rounded-xl bg-[var(--navy-mid)] border text-[var(--parchment)] placeholder-[var(--warm-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] transition-all',
            emailError || submitStatus === 'duplicate'
              ? 'border-destructive'
              : 'border-[var(--navy-light)]'
          )}
        />
        {emailError && <p className="mt-1.5 text-xs text-destructive">{emailError}</p>}
        {submitStatus === 'duplicate' && (
          <p className="mt-1.5 text-xs text-destructive">This email is already signed up. Check your inbox!</p>
        )}
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--gold)] font-medium mb-2">
          I'm interested in
        </p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => toggleInterest(item.value)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
                interests.includes(item.value)
                  ? 'bg-[var(--gold)] text-[var(--navy)] border-[var(--gold)]'
                  : 'bg-transparent text-[var(--warm-muted)] border-[var(--navy-light)] hover:border-[var(--gold)] hover:text-[var(--gold)]'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        {interestError && <p className="mt-1.5 text-xs text-destructive">{interestError}</p>}
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-[var(--gold)] text-[var(--navy)] font-semibold hover:bg-[var(--gold-light)] transition-all shadow-[var(--shadow-gold)] text-sm"
      >
        Notify Me
      </button>
    </form>
  );
}
