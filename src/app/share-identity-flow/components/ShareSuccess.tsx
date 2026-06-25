'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import type { ConsentField } from './ShareIdentityScreen';

interface ShareSuccessProps {
  fields: ConsentField[];
  onReset: () => void;
}

export default function ShareSuccess({ fields, onReset }: ShareSuccessProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] fade-in-up">
      <div className="w-full max-w-lg">
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(146,64,14,0.04) 50%, rgba(15,14,12,0.97) 100%)',
            border: '1px solid rgba(16,185,129,0.18)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(146,64,14,0.08))',
                  border: '2px solid rgba(16,185,129,0.25)',
                  boxShadow: '0 0 35px rgba(16,185,129,0.12)',
                }}
              >
                <Icon name="CheckIcon" size={40} variant="solid" className="text-emerald-500" />
              </div>
              <div
                className="absolute inset-0 rounded-full border border-emerald-500/15 pulse-ring"
                aria-hidden="true"
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-stone-100 mb-2">Identity Shared Successfully</h2>
          <p className="text-sm text-stone-400 mb-4">
            Axis Bank has received your verified identity proofs and is processing your account application.
          </p>

          <div className="flex justify-center mb-6">
            <StatusBadge variant="verified" label="Transfer Complete" pulse />
          </div>

          {/* Summary */}
          <div className="p-4 rounded-xl bg-stone-700/15 border border-stone-600/20 mb-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">What was shared</p>
            <div className="space-y-2">
              {fields.map((field) => (
                <div key={`success-${field.id}`} className="flex items-center gap-2">
                  <Icon name="CheckCircleIcon" size={14} variant="solid" className="text-emerald-500 flex-shrink-0" />
                  <span className="text-sm text-stone-300">{field.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consent reference */}
          <div className="p-3 rounded-xl bg-amber-800/10 border border-amber-700/20 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="ReceiptRefundIcon" size={14} variant="outline" className="text-amber-500" />
                <span className="text-xs text-stone-400">Consent Reference</span>
              </div>
              <span className="text-xs font-mono text-amber-400">CST-29APR-8842</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs text-stone-500">Expires</span>
              <span className="text-xs font-mono text-stone-400">29 Jul 2026</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link
              href="/identity-wallet-dashboard"
              className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
            >
              <Icon name="WalletIcon" size={16} variant="solid" className="text-white" />
              Back to Identity Wallet
            </Link>
            <button
              onClick={onReset}
              className="btn-ghost inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-stone-400 border border-stone-600/25"
            >
              Share with another app
            </button>
          </div>

          <p className="text-xs text-stone-600 mt-4">
            This consent can be revoked from Active Consents in your wallet
          </p>
        </div>
      </div>
    </div>
  );
}