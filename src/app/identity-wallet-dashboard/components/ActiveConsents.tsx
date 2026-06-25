'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';

const consents = [
  {
    id: 'consent-001',
    app: 'Axis Bank',
    appType: 'Banking',
    fields: ['KYC Verified', 'Age'],
    grantedOn: '29 Apr 2026',
    expiresOn: '29 Jul 2026',
    status: 'active' as const,
    color: 'bg-blue-900/30',
    initials: 'AB',
  },
  {
    id: 'consent-002',
    app: 'LoanTap',
    appType: 'Lending',
    fields: ['Age only'],
    grantedOn: '27 Apr 2026',
    expiresOn: '27 May 2026',
    status: 'expiring' as const,
    color: 'bg-amber-800/25',
    initials: 'LT',
  },
  {
    id: 'consent-003',
    app: 'HDFC Credit',
    appType: 'Credit Card',
    fields: ['Full Identity'],
    grantedOn: '25 Apr 2026',
    expiresOn: '25 Oct 2026',
    status: 'active' as const,
    color: 'bg-emerald-800/25',
    initials: 'HC',
  },
  {
    id: 'consent-004',
    app: 'Zerodha',
    appType: 'Investment',
    fields: ['KYC Verified', 'PAN'],
    grantedOn: '20 Apr 2026',
    expiresOn: '20 Apr 2027',
    status: 'active' as const,
    color: 'bg-stone-600/25',
    initials: 'ZR',
  },
];

export default function ActiveConsents() {
  const [revoking, setRevoking] = useState<string | null>(null);

  const handleRevoke = (id: string) => {
    setRevoking(id);
    setTimeout(() => setRevoking(null), 1500);
  };

  return (
    <div className="glass-card rounded-2xl border border-stone-700/25 fade-in-up" style={{ animationDelay: '0.25s' }}>
      <div className="px-5 py-4 border-b border-stone-700/25 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-stone-100">Active Consents</h2>
          <p className="text-xs text-stone-500 mt-0.5">Apps with live identity access</p>
        </div>
        <span className="text-xs font-semibold text-amber-400 glass-card px-2.5 py-1 rounded-full border border-amber-700/25">
          {consents.length} active
        </span>
      </div>
      <div className="p-3 space-y-2">
        {consents.map((consent) => (
          <div
            key={consent.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-700/15 transition-colors duration-150 border border-transparent hover:border-stone-600/20"
          >
            <div className={`w-8 h-8 rounded-lg ${consent.color} flex items-center justify-center flex-shrink-0`}>
              <span className="text-xs font-bold text-stone-200">{consent.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-stone-200 truncate">{consent.app}</p>
                {consent.status === 'expiring' && (
                  <StatusBadge variant="warning" label="Expiring" size="sm" />
                )}
              </div>
              <p className="text-xs text-stone-500 truncate">
                {consent.fields.join(', ')} · Expires {consent.expiresOn}
              </p>
            </div>
            <button
              onClick={() => handleRevoke(consent.id)}
              className="p-1.5 rounded-lg hover:bg-red-900/20 transition-colors group"
              aria-label={`Revoke consent for ${consent.app}`}
              title={`Revoke ${consent.app} access`}
            >
              {revoking === consent.id ? (
                <Icon name="ArrowPathIcon" size={14} variant="outline" className="text-stone-400 animate-spin" />
              ) : (
                <Icon name="XMarkIcon" size={14} variant="outline" className="text-stone-500 group-hover:text-red-400 transition-colors" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}