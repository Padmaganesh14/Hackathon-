'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import IdentityCard from './components/IdentityCard';
import DashboardStats from './components/DashboardStats';
import ActivityFeed from './components/ActivityFeed';
import ActiveConsents from './components/ActiveConsents';
import BackgroundOrbs from './components/BackgroundOrbs';
import { calculateTrustScore, getTrustLabel } from '@/lib/trustScore';

export default function IdentityWalletDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [identity, setIdentity] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    const savedIdentity = localStorage.getItem('portaid_identity');
    if (savedIdentity) {
      try {
        setIdentity(JSON.parse(savedIdentity));
      } catch {
        setIdentity(null);
      }
    }

    setAuthorized(true);
  }, [router]);

  const trustScore = identity?.trustScore ?? 0;
  const trustLabel = getTrustLabel(trustScore);
  const maskedDocumentNumber = identity?.documentNumber
    ? `•••• •••• ${identity.documentNumber.replace(/\s/g, '').slice(-4)}`
    : 'Not available';

  if (!authorized) {
    return null;
  }

  return (
    <AppLayout activePath="/identity-wallet-dashboard">
      <div className="relative min-h-screen">
        <BackgroundOrbs />
        <div className="relative z-10 px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto">
          {/* Page header */}
          <div className="mb-8 fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Identity Wallet</h1>
                <p className="text-sm text-slate-400 mt-1">Your portable digital identity — verified and secure</p>
              </div>
              <div className="flex items-center gap-2 glass-card rounded-lg px-3 py-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-slate-300 font-medium">Live</span>
                <span className="text-xs text-slate-500 font-mono">Updated 10:32 AM</span>
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
            {/* Left col — Identity card + stats */}
            <div className="xl:col-span-2 space-y-6">
              <IdentityCard identity={identity} trustScore={trustScore} trustLabel={trustLabel} maskedDocumentNumber={maskedDocumentNumber} />
              <DashboardStats trustScore={trustScore} trustLabel={trustLabel} />
            </div>

            {/* Right col — Activity + consents */}
            <div className="xl:col-span-1 space-y-6">
              <ActivityFeed />
              <ActiveConsents />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}