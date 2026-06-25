import React from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';

export default function RequestingAppCard() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden p-5"
      style={{
        background: 'linear-gradient(135deg, rgba(30,27,22,0.9) 0%, rgba(15,14,12,0.95) 100%)',
        border: '1px solid rgba(120,113,108,0.25)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}
    >
      {/* Decorative top-right glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top right, rgba(146,64,14,0.10) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative">
        {/* App identity row */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xl"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563a0)' }}
          >
            AB
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-stone-100">Axis Bank</h3>
              <StatusBadge variant="verified" label="Trusted App" size="sm" />
            </div>
            <p className="text-xs text-stone-400 mt-0.5">Instant Account Opening</p>
            <p className="text-xs text-stone-500 mt-0.5 font-mono">app.axisbank.com</p>
          </div>
        </div>

        {/* Request context */}
        <div className="p-3 rounded-xl bg-stone-700/15 border border-stone-600/20 mb-4">
          <p className="text-xs font-semibold text-stone-300 mb-1">Why they need this</p>
          <p className="text-xs text-stone-400 leading-relaxed">
            Axis Bank is verifying your identity to open a zero-balance savings account under RBI KYC norms. Only the fields you enable will be shared.
          </p>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: 'ShieldCheckIcon', label: 'RBI Regulated', color: 'text-emerald-500', bg: 'bg-emerald-800/20' },
            { icon: 'LockClosedIcon', label: 'TLS 1.3', color: 'text-amber-500', bg: 'bg-amber-800/15' },
            { icon: 'EyeSlashIcon', label: 'No raw storage', color: 'text-stone-400', bg: 'bg-stone-600/20' },
          ].map((signal) => (
            <div key={`signal-${signal.label}`} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg ${signal.bg}`}>
              <Icon name={signal.icon as Parameters<typeof Icon>[0]['name']} size={16} variant="outline" className={signal.color} />
              <span className="text-xs text-stone-400 text-center leading-tight">{signal.label}</span>
            </div>
          ))}
        </div>

        {/* Request timestamp */}
        <div className="mt-3 flex items-center gap-1.5">
          <Icon name="ClockIcon" size={12} variant="outline" className="text-stone-600" />
          <span className="text-xs text-stone-500 font-mono">Request received: 29 Apr 2026, 10:31 AM</span>
        </div>
      </div>
    </div>
  );
}