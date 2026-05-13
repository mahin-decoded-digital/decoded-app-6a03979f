import { useState } from 'react';
import { toast } from 'sonner';
import { X, Check, ChevronRight } from 'lucide-react';
import { useTradeStore } from '../stores/tradeStore';
import type { RegistrationData } from '../types';

const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Singapore', 'Hong Kong', 'Japan', 'Other'];
const ACCOUNT_TYPES = ['Starter', 'Pro Trader', 'Elite'];

const STEPS = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Account Setup' },
  { id: 3, label: 'Verification' },
];

export function RegistrationModal() {
  const regModalOpen = useTradeStore((s) => s.regModalOpen);
  const setRegModalOpen = useTradeStore((s) => s.setRegModalOpen);
  const regStep = useTradeStore((s) => s.registrationStep);
  const setRegStep = useTradeStore((s) => s.setRegistrationStep);
  const updateRegData = useTradeStore((s) => s.updateRegistrationData);
  const registrationData = useTradeStore((s) => s.registrationData);
  const selectedTier = useTradeStore((s) => s.selectedTier);

  const [localData, setLocalData] = useState<Partial<RegistrationData>>({
    accountType: selectedTier === 'pro' ? 'Pro Trader' : selectedTier === 'elite' ? 'Elite' : 'Starter',
    agreeTerms: false,
    agreeMarketing: false,
  });
  const [completed, setCompleted] = useState(false);

  if (!regModalOpen) return null;

  const update = (field: keyof RegistrationData, value: string | boolean) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (regStep === 1) {
      if (!localData.firstName?.trim()) { toast.error('First name is required'); return; }
      if (!localData.lastName?.trim()) { toast.error('Last name is required'); return; }
      if (!localData.email?.trim() || !localData.email.includes('@')) { toast.error('Valid email is required'); return; }
      if (!localData.phone?.trim()) { toast.error('Phone number is required'); return; }
      updateRegData(localData);
      setRegStep(2);
    } else if (regStep === 2) {
      if (!localData.country) { toast.error('Please select your country'); return; }
      if (!localData.accountType) { toast.error('Please select an account type'); return; }
      updateRegData(localData);
      setRegStep(3);
    } else if (regStep === 3) {
      if (!localData.agreeTerms) { toast.error('You must accept the terms and conditions'); return; }
      updateRegData(localData);
      setCompleted(true);
    }
  };

  const handleClose = () => {
    setRegModalOpen(false);
    setRegStep(1);
    setLocalData({ agreeTerms: false, agreeMarketing: false });
    setCompleted(false);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        style={{
          background: 'var(--tv-surface-1)',
          border: '1px solid var(--tv-border)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(0,229,255,0.05)',
          animation: 'tv-fade-up 0.3s ease-out',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--tv-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--tv-text-primary)', fontFamily: 'var(--font-display)' }}>Open Your Account</div>
            <div style={{ fontSize: 12, color: 'var(--tv-text-muted)', marginTop: 2 }}>Start trading in minutes</div>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tv-text-muted)', padding: 4 }}>
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {completed ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,230,118,0.15)', border: '2px solid var(--tv-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'tv-pulse 1s ease-out' }}>
              <Check style={{ width: 28, height: 28, color: 'var(--tv-green)' }} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--tv-text-primary)', fontFamily: 'var(--font-display)' }}>Application Submitted!</div>
              <div style={{ fontSize: 13, color: 'var(--tv-text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
                Welcome to TradeVista Elite. Check your email at <strong style={{ color: 'var(--tv-cyan)' }}>{localData.email || registrationData.email}</strong> for next steps.
              </div>
            </div>
            <button onClick={handleClose} style={{ marginTop: 8, padding: '10px 28px', background: 'var(--tv-cyan)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, color: 'var(--tv-surface-0)', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Step Indicators */}
            <div style={{ padding: '16px 24px', display: 'flex', gap: 8, alignItems: 'center' }}>
              {STEPS.map((step, i) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: i < STEPS.length - 1 ? 1 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: regStep > step.id ? 'var(--tv-green)' : regStep === step.id ? 'var(--tv-cyan)' : 'rgba(255,255,255,0.08)',
                      border: `2px solid ${regStep >= step.id ? (regStep > step.id ? 'var(--tv-green)' : 'var(--tv-cyan)') : 'var(--tv-border)'}`,
                      fontSize: 11, fontWeight: 700, color: regStep >= step.id ? 'var(--tv-surface-0)' : 'var(--tv-text-muted)',
                      transition: 'all 0.2s',
                    }}>
                      {regStep > step.id ? <Check style={{ width: 12, height: 12 }} /> : step.id}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: regStep === step.id ? 'var(--tv-text-primary)' : 'var(--tv-text-muted)' }}>{step.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: regStep > step.id ? 'var(--tv-green)' : 'var(--tv-border)', transition: 'background 0.2s' }} />}
                </div>
              ))}
            </div>

            {/* Form Body */}
            <div style={{ padding: '8px 24px 24px' }}>
              {regStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'tv-step-enter 0.25s ease-out' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <FormField label="First Name" placeholder="John" value={localData.firstName || ''} onChange={(v) => update('firstName', v)} />
                    <FormField label="Last Name" placeholder="Doe" value={localData.lastName || ''} onChange={(v) => update('lastName', v)} />
                  </div>
                  <FormField label="Email Address" type="email" placeholder="john@example.com" value={localData.email || ''} onChange={(v) => update('email', v)} />
                  <FormField label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" value={localData.phone || ''} onChange={(v) => update('phone', v)} />
                </div>
              )}

              {regStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'tv-step-enter 0.25s ease-out' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--tv-text-muted)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Country of Residence</label>
                    <select
                      value={localData.country || ''}
                      onChange={(e) => update('country', e.target.value)}
                      style={{ width: '100%', background: 'rgba(0,229,255,0.04)', border: '1px solid var(--tv-border)', borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--tv-text-primary)', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="" style={{ background: '#0c1423' }}>Select country...</option>
                      {COUNTRIES.map((c) => <option key={c} value={c} style={{ background: '#0c1423' }}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--tv-text-muted)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Account Type</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {ACCOUNT_TYPES.map((at) => (
                        <button
                          key={at}
                          onClick={() => update('accountType', at)}
                          style={{
                            padding: '10px 14px',
                            background: localData.accountType === at ? 'rgba(0,229,255,0.1)' : 'rgba(0,229,255,0.03)',
                            border: `1px solid ${localData.accountType === at ? 'var(--tv-cyan)' : 'var(--tv-border)'}`,
                            borderRadius: 8, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 600, color: localData.accountType === at ? 'var(--tv-cyan)' : 'var(--tv-text-secondary)' }}>{at}</span>
                          {localData.accountType === at && <Check style={{ width: 14, height: 14, color: 'var(--tv-cyan)' }} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {regStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'tv-step-enter 0.25s ease-out' }}>
                  <div style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid var(--tv-border)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tv-text-secondary)', marginBottom: 8 }}>Application Summary</div>
                    {[
                      { label: 'Name', value: `${localData.firstName || ''} ${localData.lastName || ''}`.trim() },
                      { label: 'Email', value: localData.email || '' },
                      { label: 'Country', value: localData.country || '' },
                      { label: 'Account', value: localData.accountType || '' },
                    ].map((row) => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--tv-border)' }}>
                        <span style={{ fontSize: 12, color: 'var(--tv-text-muted)' }}>{row.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tv-text-primary)' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <CheckboxField
                      id="terms"
                      checked={!!localData.agreeTerms}
                      onChange={(v) => update('agreeTerms', v)}
                      label="I agree to the Terms of Service, Privacy Policy, and Risk Disclosure"
                    />
                    <CheckboxField
                      id="marketing"
                      checked={!!localData.agreeMarketing}
                      onChange={(v) => update('agreeMarketing', v)}
                      label="I agree to receive market updates and promotional communications"
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--tv-text-muted)', lineHeight: 1.6, padding: '8px 12px', background: 'rgba(255,214,0,0.04)', border: '1px solid rgba(255,214,0,0.15)', borderRadius: 8 }}>
                    ⚠️ Trading involves significant risk of loss. Past performance is not indicative of future results. Please ensure you understand the risks involved.
                  </div>
                </div>
              )}

              {/* Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12 }}>
                {regStep > 1 ? (
                  <button
                    onClick={() => setRegStep(regStep - 1)}
                    style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--tv-border)', borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--tv-text-secondary)', cursor: 'pointer' }}
                  >
                    Back
                  </button>
                ) : <div />}
                <button
                  onClick={handleNext}
                  style={{
                    padding: '10px 24px', background: 'linear-gradient(135deg, var(--tv-cyan), var(--tv-purple))',
                    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, color: 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-display)',
                    boxShadow: '0 4px 20px rgba(0,229,255,0.3)',
                  }}
                >
                  {regStep === 3 ? 'Submit Application' : 'Continue'}
                  <ChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FormField({ label, placeholder, value, onChange, type = 'text' }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--tv-text-muted)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%', background: 'rgba(0,229,255,0.04)', border: '1px solid var(--tv-border)', borderRadius: 8,
          padding: '10px 12px', fontSize: 13, color: 'var(--tv-text-primary)', outline: 'none',
          boxSizing: 'border-box', transition: 'border-color 0.15s',
        }}
      />
    </div>
  );
}

function CheckboxField({ id, checked, onChange, label }: {
  id: string; checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <label htmlFor={id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 18, height: 18, borderRadius: 4, border: `2px solid ${checked ? 'var(--tv-cyan)' : 'var(--tv-border)'}`,
          background: checked ? 'var(--tv-cyan)' : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', transition: 'all 0.15s', marginTop: 1, cursor: 'pointer',
        }}
      >
        {checked && <Check style={{ width: 10, height: 10, color: 'var(--tv-surface-0)' }} />}
      </div>
      <span style={{ fontSize: 12, color: 'var(--tv-text-secondary)', lineHeight: 1.5 }}>{label}</span>
    </label>
  );
}