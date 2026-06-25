import React from 'react';
import Icon from '@/components/ui/AppIcon';
import ConsentToggle from '@/components/ui/ConsentToggle';
import type { ConsentField } from './ShareIdentityScreen';

interface ConsentFieldsListProps {
  fields: ConsentField[];
  onToggleField: (id: string) => void;
  enabledCount: number;
  onConsent: () => void;
}

const categoryLabels: Record<ConsentField['category'], string> = {
  identity: 'Identity',
  biometric: 'Biometric',
  financial: 'Financial',
  contact: 'Contact',
};

const categoryColors: Record<ConsentField['category'], string> = {
  identity: 'text-amber-500 bg-amber-800/15 border-amber-700/25',
  biometric: 'text-stone-400 bg-stone-600/15 border-stone-600/25',
  financial: 'text-amber-400 bg-amber-700/15 border-amber-700/20',
  contact: 'text-emerald-500 bg-emerald-800/15 border-emerald-700/20',
};

export default function ConsentFieldsList({
  fields,
  onToggleField,
  enabledCount,
  onConsent,
}: ConsentFieldsListProps) {
  return (
    <div className="glass-card rounded-2xl border border-stone-700/25 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-700/25 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-stone-100">Data Requested</h2>
          <p className="text-xs text-stone-500 mt-0.5">Toggle fields to control what you share</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{
              background: 'rgba(146,64,14,0.10)',
              borderColor: 'rgba(180,83,9,0.22)',
              color: '#fbbf24',
            }}
          >
            {enabledCount} of {fields.length} fields
          </span>
        </div>
      </div>

      {/* Fields list */}
      <div className="flex-1 divide-y divide-stone-700/20">
        {fields.map((field) => (
          <div
            key={field.id}
            className={`consent-row flex items-center gap-4 px-6 py-4 transition-colors duration-150 ${
              field.enabled ? '' : 'opacity-60'
            }`}
          >
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: field.enabled ? 'rgba(146,64,14,0.12)' : 'rgba(255,248,235,0.04)',
              }}
            >
              <Icon
                name={field.icon as Parameters<typeof Icon>[0]['name']}
                size={17}
                variant="outline"
                className={field.enabled ? 'text-amber-500' : 'text-stone-600'}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-stone-200">{field.label}</p>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md border font-medium ${categoryColors[field.category]}`}
                >
                  {categoryLabels[field.category]}
                </span>
                {field.required && (
                  <span className="text-xs text-stone-500 bg-stone-700/20 px-1.5 py-0.5 rounded-md border border-stone-600/20 font-medium">
                    Required
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{field.description}</p>
            </div>

            {/* Toggle */}
            <ConsentToggle
              enabled={field.enabled}
              onChange={() => onToggleField(field.id)}
              disabled={field.required}
              label={`Toggle ${field.label}`}
            />
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div
        className="px-6 py-4 border-t border-stone-700/25"
        style={{ background: 'rgba(0,0,0,0.2)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Icon name="InformationCircleIcon" size={14} variant="outline" className="text-stone-500 flex-shrink-0" />
          <p className="text-xs text-stone-500 leading-relaxed">
            Sharing {enabledCount} field{enabledCount !== 1 ? 's' : ''} with Axis Bank.
            This consent expires in 90 days and can be revoked from your wallet at any time.
          </p>
        </div>

        {/* Consent button */}
        <button
          onClick={onConsent}
          disabled={enabledCount === 0}
          className={`
            w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
            ${enabledCount > 0
              ? 'btn-primary text-white' :'bg-stone-700/20 text-stone-600 cursor-not-allowed border border-stone-600/20'
            }
          `}
        >
          <Icon name="LockClosedIcon" size={16} variant="solid" className={enabledCount > 0 ? 'text-white' : 'text-stone-600'} />
          Consent & Share {enabledCount > 0 ? `${enabledCount} Field${enabledCount !== 1 ? 's' : ''}` : ''}
          <span
            className="ml-1 text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            Secure
          </span>
        </button>

        <p className="text-xs text-stone-600 text-center mt-2">
          Protected by zero-knowledge cryptography · Revocable anytime
        </p>
      </div>
    </div>
  );
}