import React from 'react';
import AppLayout from '@/components/AppLayout';
import ShareIdentityScreen from './components/ShareIdentityScreen';
import BackgroundOrbs from '../identity-wallet-dashboard/components/BackgroundOrbs';

export default function ShareIdentityFlowPage() {
  return (
    <AppLayout activePath="/share-identity-flow">
      <div className="relative min-h-screen">
        <BackgroundOrbs />
        <div className="relative z-10 px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto">
          <div className="mb-8 fade-in-up">
            <h1 className="text-2xl font-bold text-white tracking-tight">Share Identity</h1>
            <p className="text-sm text-slate-400 mt-1">Control exactly what data you share and with whom</p>
          </div>
          <ShareIdentityScreen />
        </div>
      </div>
    </AppLayout>
  );
}