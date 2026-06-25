'use client';

import React, { useState } from 'react';
import RequestingAppCard from './RequestingAppCard';
import ConsentFieldsList from './ConsentFieldsList';
import TransferAnimation from './TransferAnimation';
import ShareSuccess from './ShareSuccess';

export type ShareStage = 'review' | 'transferring' | 'success';

export interface ConsentField {
  id: string;
  label: string;
  description: string;
  icon: string;
  required: boolean;
  enabled: boolean;
  category: 'identity' | 'biometric' | 'financial' | 'contact';
}

const initialFields: ConsentField[] = [
  {
    id: 'field-kyc-status',
    label: 'KYC Verified Status',
    description: 'Confirms your identity has been verified — no raw data exposed',
    icon: 'ShieldCheckIcon',
    required: true,
    enabled: true,
    category: 'identity',
  },
  {
    id: 'field-full-name',
    label: 'Full Legal Name',
    description: 'Your name as it appears on your government ID',
    icon: 'UserIcon',
    required: false,
    enabled: true,
    category: 'identity',
  },
  {
    id: 'field-dob',
    label: 'Date of Birth',
    description: 'Exact date of birth for age and eligibility checks',
    icon: 'CalendarIcon',
    required: false,
    enabled: true,
    category: 'identity',
  },
  {
    id: 'field-age-proof',
    label: 'Age Verification (18+)',
    description: 'Confirms you are above 18 without revealing your exact age',
    icon: 'CheckCircleIcon',
    required: false,
    enabled: true,
    category: 'identity',
  },
  {
    id: 'field-nationality',
    label: 'Nationality',
    description: 'Your country of citizenship for regulatory compliance',
    icon: 'GlobeAltIcon',
    required: false,
    enabled: false,
    category: 'identity',
  },
  {
    id: 'field-pan',
    label: 'PAN Number',
    description: 'Required for income tax and financial product eligibility',
    icon: 'CreditCardIcon',
    required: false,
    enabled: false,
    category: 'financial',
  },
];

export default function ShareIdentityScreen() {
  const [stage, setStage] = useState<ShareStage>('review');
  const [fields, setFields] = useState<ConsentField[]>(initialFields);
  const [shareMode, setShareMode] = useState<'selective' | 'kyc-only' | 'age-only'>('selective');

  const handleToggleField = (id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id && !f.required ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleShareModeChange = (mode: typeof shareMode) => {
    setShareMode(mode);
    if (mode === 'kyc-only') {
      setFields((prev) =>
        prev.map((f) => ({ ...f, enabled: f.id === 'field-kyc-status' }))
      );
    } else if (mode === 'age-only') {
      setFields((prev) =>
        prev.map((f) => ({ ...f, enabled: f.id === 'field-kyc-status' || f.id === 'field-age-proof' }))
      );
    } else {
      setFields(initialFields);
    }
  };

  const enabledCount = fields.filter((f) => f.enabled).length;

  const handleConsent = () => {
    setStage('transferring');
    // Backend integration point: POST /api/identity/consent-share
    setTimeout(() => setStage('success'), 3200);
  };

  const handleReset = () => {
    setStage('review');
    setFields(initialFields);
    setShareMode('selective');
  };

  if (stage === 'transferring') {
    return <TransferAnimation fields={fields.filter((f) => f.enabled)} />;
  }

  if (stage === 'success') {
    return <ShareSuccess fields={fields.filter((f) => f.enabled)} onReset={handleReset} />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 fade-in-up">
      {/* Left: Requesting app + mode */}
      <div className="xl:col-span-2 space-y-5">
        <RequestingAppCard />

        {/* Share mode selector */}
        <div className="glass-card rounded-2xl border border-stone-700/25 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">Share Mode</p>
          <div className="space-y-2">
            {([
              { id: 'selective', label: 'Selective Share', desc: 'Choose individual fields below' },
              { id: 'kyc-only', label: 'KYC Status Only', desc: 'Minimal — just verified badge' },
              { id: 'age-only', label: 'Age Verification', desc: 'Confirm 18+ without full identity' },
            ] as const).map((mode) => (
              <button
                key={`mode-${mode.id}`}
                onClick={() => handleShareModeChange(mode.id)}
                className={`
                  w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200
                  ${shareMode === mode.id
                    ? 'border-amber-700/35 bg-amber-800/10 text-amber-300' :'border-stone-600/20 bg-stone-700/10 text-stone-400 hover:border-stone-500/30 hover:bg-stone-700/15'
                  }
                `}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all ${
                    shareMode === mode.id ? 'border-amber-500 bg-amber-500' : 'border-stone-600'
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold">{mode.label}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{mode.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Security notice */}
        <div
          className="rounded-xl p-4 border"
          style={{
            background: 'rgba(146,64,14,0.06)',
            borderColor: 'rgba(180,83,9,0.18)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(146,64,14,0.14)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1L2 4v4c0 3.31 2.56 6.41 6 7 3.44-.59 6-3.69 6-7V4L8 1z" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-300">Zero-knowledge transfer</p>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Your raw data never leaves your device. Only cryptographic proofs are shared with Axis Bank.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Consent fields + CTA */}
      <div className="xl:col-span-3">
        <ConsentFieldsList
          fields={fields}
          onToggleField={handleToggleField}
          enabledCount={enabledCount}
          onConsent={handleConsent}
        />
      </div>
    </div>
  );
}