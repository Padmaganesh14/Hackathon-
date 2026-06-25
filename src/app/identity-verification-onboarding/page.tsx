import React from 'react';
import AppLayout from '@/components/AppLayout';
import VerificationWizard from './components/VerificationWizard';
import BackgroundOrbs from '../identity-wallet-dashboard/components/BackgroundOrbs';

export default function IdentityVerificationOnboardingPage() {
  return (
    <AppLayout activePath="/identity-verification-onboarding">
      <div className="relative min-h-screen">
        <BackgroundOrbs />
        <div className="relative z-10 px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto">
          <div className="mb-8 fade-in-up">
            <h1 className="text-2xl font-bold text-white tracking-tight">Verify Your Identity</h1>
            <p className="text-sm text-slate-400 mt-1">Complete KYC in 3 steps — takes about 3 minutes</p>
          </div>
          <VerificationWizard />
        </div>
      </div>
    </AppLayout>
  );
}