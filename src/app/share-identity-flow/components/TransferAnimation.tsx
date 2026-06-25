'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { ConsentField } from './ShareIdentityScreen';

interface TransferAnimationProps {
  fields: ConsentField[];
}

export default function TransferAnimation({ fields }: TransferAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [activeFieldIndex, setActiveFieldIndex] = useState(0);
  const [dots, setDots] = useState<{ id: string; left: number; opacity: number }[]>([]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1.5, 100));
    }, 45);

    const fieldInterval = setInterval(() => {
      setActiveFieldIndex((prev) => (prev + 1) % fields.length);
    }, 600);

    const dotInterval = setInterval(() => {
      const id = `dot-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      setDots((prev) => [...prev.slice(-6), { id, left: 0, opacity: 1 }]);
    }, 300);

    return () => {
      clearInterval(progressInterval);
      clearInterval(fieldInterval);
      clearInterval(dotInterval);
    };
  }, [fields.length]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] fade-in-up">
      <div className="w-full max-w-2xl">
        <div className="glass-card rounded-2xl border border-amber-700/20 p-8 lg:p-10 text-center">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-stone-100">Secure Transfer in Progress</h2>
            <p className="text-sm text-stone-400 mt-1">
              Encrypted identity proofs are being transmitted to Axis Bank
            </p>
          </div>

          {/* Transfer visual */}
          <div className="flex items-center justify-between gap-6 mb-8">
            {/* Source — PortaID */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(146,64,14,0.25), rgba(180,83,9,0.15))',
                  border: '1px solid rgba(180,83,9,0.30)',
                  boxShadow: '0 0 25px rgba(146,64,14,0.15)',
                }}
              >
                <Icon name="FingerPrintIcon" size={28} variant="solid" className="text-amber-500" />
              </div>
              <span className="text-xs font-semibold text-stone-300">PortaID</span>
              <span className="text-xs text-stone-500">Your Wallet</span>
            </div>

            {/* Data flow line */}
            <div className="flex-1 relative">
              {/* Track */}
              <div className="h-1 rounded-full bg-stone-700/40 relative overflow-hidden">
                {/* Fill */}
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #92400e, #d97706)',
                  }}
                />
              </div>

              {/* Animated dots */}
              {dots.map((dot) => (
                <div
                  key={dot.id}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full data-flow-dot"
                  style={{
                    background: 'linear-gradient(90deg, #92400e, #d97706)',
                    boxShadow: '0 0 6px rgba(217,119,6,0.5)',
                  }}
                  aria-hidden="true"
                />
              ))}

              {/* Lock icon in center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: '#161410', border: '1px solid rgba(180,83,9,0.25)' }}
                >
                  <Icon name="LockClosedIcon" size={13} variant="solid" className="text-amber-500" />
                </div>
              </div>
            </div>

            {/* Destination — Axis Bank */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
                style={{
                  background: 'linear-gradient(135deg, #1e3a5f, #2563a0)',
                  border: '1px solid rgba(59,130,180,0.30)',
                  boxShadow: progress >= 100 ? '0 0 25px rgba(59,130,180,0.20)' : 'none',
                  transition: 'box-shadow 0.5s ease',
                }}
              >
                AB
              </div>
              <span className="text-xs font-semibold text-stone-300">Axis Bank</span>
              <span className="text-xs text-stone-500">Receiving</span>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-stone-400">
                Transmitting: <span className="text-amber-400 font-medium">{fields[activeFieldIndex]?.label}</span>
              </p>
              <span className="text-sm font-bold text-amber-400 font-mono">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-stone-700/40 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #92400e, #d97706)',
                  boxShadow: '0 0 8px rgba(217,119,6,0.3)',
                }}
              />
            </div>
          </div>

          {/* Field pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {fields.map((field, i) => (
              <span
                key={field.id}
                className={`text-xs px-3 py-1 rounded-full border font-medium transition-all duration-300 ${
                  i <= activeFieldIndex
                    ? 'bg-amber-800/20 text-amber-400 border-amber-700/25' :'bg-stone-700/15 text-stone-600 border-stone-600/20'
                }`}
              >
                {i <= activeFieldIndex && (
                  <span className="mr-1.5">✓</span>
                )}
                {field.label}
              </span>
            ))}
          </div>

          <p className="text-xs text-stone-600 mt-6">
            Zero-knowledge proofs generated · No raw data transmitted · TLS 1.3 encrypted
          </p>
        </div>
      </div>
    </div>
  );
}