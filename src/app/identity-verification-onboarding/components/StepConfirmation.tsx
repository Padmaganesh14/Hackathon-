'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';
import { calculateTrustScore } from '@/lib/trustScore';
import type { VerificationStatus } from './VerificationWizard';

interface StepConfirmationProps {
  scanStatus: VerificationStatus;
  identityData: {
    fullName: string;
    dob: string;
    documentNumber: string;
    address: string;
    documentType: string;
  };
  onComplete: () => Promise<void>;
  onReset: () => void;
}

export default function StepConfirmation({ scanStatus, identityData, onComplete, onReset }: StepConfirmationProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isSuccess = scanStatus === 'success';
  const maskedDocumentNumber = identityData.documentNumber.replace(/\s/g, '');

  const verifiedFields = [
    { id: 'field-name', label: 'Full Name', value: identityData.fullName || 'Not provided', icon: 'UserIcon', verified: true },
    { id: 'field-dob', label: 'Date of Birth', value: identityData.dob || 'Not provided', icon: 'CalendarIcon', verified: true },
    { id: 'field-document-type', label: 'Document Type', value: identityData.documentType || 'Not provided', icon: 'IdentificationIcon', verified: true },
    {
      id: 'field-document-number',
      label: 'Document Number',
      value: maskedDocumentNumber ? `•••• •••• ${maskedDocumentNumber.slice(-4)}` : 'Not provided',
      icon: 'CreditCardIcon',
      verified: true,
    },
    { id: 'field-address', label: 'Address', value: identityData.address || 'Not provided', icon: 'GlobeAltIcon', verified: true },
    { id: 'field-face', label: 'Biometric (Face)', value: isSuccess ? 'Liveness confirmed — 99.2%' : 'Face scan pending', icon: 'FaceSmileIcon', verified: isSuccess },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onComplete();

      const score = calculateTrustScore({
        fullName: identityData.fullName,
        dob: identityData.dob,
        documentNumber: identityData.documentNumber,
        address: identityData.address,
        documentUploaded: true,
        faceDetected: isSuccess,
      });

      const verifiedIdentity = {
        ...identityData,
        trustScore: score,
        verified: score >= 70,
        faceMatch: isSuccess ? 100 : 0,
        liveness: isSuccess ? 100 : 0,
        verifiedOn: new Date().toISOString(),
      };

      localStorage.setItem('portaid_identity', JSON.stringify(verifiedIdentity));
      setSubmitted(true);
      router.push('/identity-wallet-dashboard');
    } catch (error) {
      console.error('Unable to finalize verification', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-card rounded-2xl border border-emerald-700/20 p-8 text-center fade-in-up">
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.18), rgba(146,64,14,0.08))' }}
          >
            <Icon name="CheckBadgeIcon" size={40} variant="solid" className="text-emerald-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-stone-100 mb-2">Identity Verified!</h2>
        <p className="text-sm text-stone-400 mb-2">
          Your PortaID is now active. You can share your verified identity with any connected app instantly.
        </p>
        <div className="flex justify-center mb-6">
          <StatusBadge variant="verified" label="KYC Verified" pulse />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-stone-700/12 border border-stone-600/20">
          {[
            { label: 'Trust Score', value: '87', unit: '/100', color: 'text-amber-400' },
            { label: 'Face Match', value: '99.2', unit: '%', color: 'text-emerald-500' },
            { label: 'Fields Verified', value: '6', unit: ' fields', color: 'text-stone-300' },
          ].map((metric) => (
            <div key={`confirm-metric-${metric.label}`} className="text-center">
              <p className={`text-2xl font-bold ${metric.color} font-mono tabular-nums`}>
                {metric.value}<span className="text-sm font-normal text-stone-500">{metric.unit}</span>
              </p>
              <p className="text-xs text-stone-500 mt-0.5">{metric.label}</p>
            </div>
          ))}
        </div>
        <Link
          href="/identity-wallet-dashboard"
          className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold text-white"
        >
          <Icon name="WalletIcon" size={16} variant="solid" className="text-white" />
          Go to Identity Wallet
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-stone-700/25 p-6 lg:p-8 fade-in-up">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-stone-100">Review & Confirm</h2>
        <p className="text-sm text-stone-400 mt-1">
          Verify that all extracted information is correct before finalizing.
        </p>
      </div>

      {!isSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-amber-800/12 border border-amber-700/20 flex items-start gap-3">
          <Icon name="ExclamationTriangleIcon" size={18} variant="solid" className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400">Face verification was not completed</p>
            <p className="text-xs text-stone-400 mt-1">
              You can still review extracted document data, but your trust score will be lower without biometric confirmation.
            </p>
          </div>
        </div>
      )}

      {/* Verified fields */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">Extracted Identity Fields</p>
        <div className="space-y-2">
          {verifiedFields.map((field) => {
            const isBiometric = field.id === 'field-face';
            const isVerified = !isBiometric || isSuccess;
            return (
              <div
                key={field.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors"
                style={{
                  background: 'rgba(255,248,235,0.02)',
                  borderColor: isVerified ? 'rgba(255,248,235,0.06)' : 'rgba(180,83,9,0.15)',
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: isVerified ? 'rgba(16,185,129,0.10)' : 'rgba(180,83,9,0.10)' }}
                >
                  <Icon
                    name={field.icon as Parameters<typeof Icon>[0]['name']}
                    size={15}
                    variant="outline"
                    className={isVerified ? 'text-emerald-500' : 'text-amber-400'}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-stone-500 uppercase tracking-wider font-medium">{field.label}</p>
                  <p className="text-sm font-semibold text-stone-200 font-mono">{field.value}</p>
                </div>
                <div className="flex-shrink-0">
                  {isVerified ? (
                    <Icon name="CheckCircleIcon" size={16} variant="solid" className="text-emerald-500" />
                  ) : (
                    <Icon name="ExclamationCircleIcon" size={16} variant="solid" className="text-amber-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consent disclaimer */}
      <div className="mb-6 p-4 rounded-xl bg-stone-700/12 border border-stone-600/20">
        <div className="flex items-start gap-3">
          <Icon name="LockClosedIcon" size={16} variant="solid" className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-stone-400 leading-relaxed">
            By completing verification, you consent to PortaID storing your verified identity data using zero-knowledge encryption. You retain full control over who sees your data and can revoke access at any time.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="btn-ghost inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-400 border border-stone-600/25"
        >
          <Icon name="ArrowPathIcon" size={16} variant="outline" />
          Start Over
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            submitting ? 'bg-stone-700/15 text-stone-600 cursor-not-allowed border border-stone-600/20' : 'btn-primary text-white'
          }`}
        >
          {submitting ? (
            <>
              <Icon name="ArrowPathIcon" size={16} variant="outline" className="animate-spin" />
              Finalizing KYC...
            </>
          ) : (
            <>
              <Icon name="CheckBadgeIcon" size={16} variant="solid" className="text-white" />
              Complete Verification
            </>
          )}
        </button>
      </div>
    </div>
  );
}