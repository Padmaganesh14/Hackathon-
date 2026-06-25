'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TrustRing from '@/components/ui/TrustRing';
import StatusBadge from '@/components/ui/StatusBadge';
import Icon from '@/components/ui/AppIcon';

interface UserProfile {
  fullName?: string;
  kycStatus?: string;
  trustScore?: number;
  nationality?: string;
  idType?: string;
  dob?: string;
  documentNumber?: string;
  faceMatch?: number;
  liveness?: number;
  verifiedOn?: string;
}

interface IdentityCardProps {
  identity?: UserProfile | null;
  trustScore?: number;
  trustLabel?: string;
  maskedDocumentNumber?: string;
}

export default function IdentityCard({ identity, trustScore = 0, trustLabel = 'Not Verified', maskedDocumentNumber = 'Not available' }: IdentityCardProps) {
  const [detailsRevealed, setDetailsRevealed] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    if (identity) {
      setUser((previous) => ({ ...previous, ...identity }));
    }

    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.replace('/login');
      }
    };

    fetchLoggedInUser();
  }, [apiBaseUrl, identity, router]);

  const getMaskedName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return 'Arjun K•••••••••••';
    if (parts.length === 1) return `${parts[0].charAt(0)}•••••••••••`;
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}••••••••`;
  };

  const displayName = detailsRevealed
    ? user?.fullName || 'Not verified'
    : user?.fullName
      ? getMaskedName(user.fullName)
      : 'Not verified';

  return (
    <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(146,64,14,0.20) 0%, rgba(120,113,108,0.08) 50%, rgba(15,14,12,0.95) 100%)',
          border: '1px solid rgba(180,83,9,0.25)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,248,235,0.04)',
        }}
      >
        {/* Card inner glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 20% 20%, rgba(146,64,14,0.12) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        {/* Decorative corner accent */}
        <div
          className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at top right, rgba(180,83,9,0.10) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Left: Identity info */}
            <div className="flex-1">
              {/* Header row */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #92400e, #d97706)' }}
                    >
                      <Icon name="FingerPrintIcon" size={16} variant="solid" className="text-white" />
                    </div>
                    <span className="text-xs font-semibold tracking-widest uppercase text-stone-400">
                      PortaID
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <StatusBadge variant="verified" label={user?.kycStatus || trustLabel} pulse />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Icon name="ShieldCheckIcon" size={14} variant="solid" className="text-emerald-500" />
                  <span className="font-mono">ID-8842-KYC</span>
                </div>
              </div>

              {/* Name */}
              <div className="mb-4">
                <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-1">Full Name</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-stone-100 tracking-tight">
                    {displayName}
                  </p>
                  <button
                    onClick={() => setDetailsRevealed(!detailsRevealed)}
                    className="p-1.5 rounded-lg hover:bg-stone-700/30 transition-colors"
                    aria-label={detailsRevealed ? 'Hide details' : 'Reveal details'}
                  >
                    <Icon name={detailsRevealed ? 'EyeSlashIcon' : 'EyeIcon'} size={16} variant="outline" className="text-stone-400" />
                  </button>
                </div>
              </div>

              {/* Meta fields */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Date of Birth', value: detailsRevealed ? user?.dob || 'Not available' : '•• ••• ••••' },
                  { label: 'Nationality', value: user?.nationality || 'Indian' },
                  { label: 'ID Type', value: user?.idType || 'Aadhaar' },
                  { label: 'Verified On', value: user?.verifiedOn ? new Date(user.verifiedOn).toLocaleDateString() : 'Not available' },
                  { label: 'Document Number', value: detailsRevealed ? maskedDocumentNumber : '•••• •••• ••••' },
                  { label: 'Liveness', value: `${identity?.liveness ?? 0}%` },
                ]?.map((field) => (
                  <div key={`field-${field?.label}`}>
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-medium mb-0.5">{field?.label}</p>
                    <p className="text-sm font-semibold text-stone-200 font-mono">{field?.value}</p>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/share-identity-flow"
                  className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                >
                  <Icon name="ShareIcon" size={16} variant="solid" className="text-white" />
                  Share Identity
                </Link>
                <Link
                  href="/identity-verification-onboarding"
                  className="btn-ghost inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-300 border border-stone-600/30"
                >
                  <Icon name="DocumentMagnifyingGlassIcon" size={16} variant="outline" />
                  View Details
                </Link>
              </div>
            </div>

            {/* Right: Trust ring */}
            <div className="flex flex-col items-center gap-3 lg:flex-shrink-0">
              <TrustRing score={trustScore} size={130} strokeWidth={9} />
              <div className="text-center">
                <p className="text-xs text-stone-400 font-medium">Trust Score</p>
                <p className="text-xs text-emerald-500 font-medium">{trustLabel}</p>
              </div>

              {/* Mini sub-scores */}
              <div className="w-full space-y-2 mt-2 min-w-[130px]">
                {[
                  { label: 'Face Match', value: identity?.faceMatch ?? 0, color: 'bg-emerald-600' },
                  { label: 'Liveness', value: identity?.liveness ?? 0, color: 'bg-amber-600' },
                  { label: 'Consistency', value: trustScore >= 70 ? 100 : 0, color: 'bg-stone-500' },
                ]?.map((sub) => (
                  <div key={`sub-${sub?.label}`}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-stone-500">{sub?.label}</span>
                      <span className="text-xs font-semibold text-stone-300 font-mono">{sub?.value}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-stone-700/50 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sub?.color}`}
                        style={{ width: `${sub?.value}%`, transition: 'width 1s ease-in-out' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="px-6 lg:px-8 py-3 border-t border-stone-700/25 flex items-center justify-between"
          style={{ background: 'rgba(0,0,0,0.25)' }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Icon name="LockClosedIcon" size={12} variant="solid" className="text-emerald-500" />
              <span className="text-xs text-stone-400">End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="CloudIcon" size={12} variant="solid" className="text-amber-500" />
              <span className="text-xs text-stone-400">Zero-knowledge storage</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 font-mono">DID:porta:0x7f4a...9c2b</span>
          </div>
        </div>
      </div>
    </div>
  );
}