import React from 'react';

type BadgeVariant = 'verified' | 'pending' | 'suspicious' | 'inactive' | 'success' | 'warning' | 'error';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  verified: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  suspicious: 'bg-red-500/15 text-red-400 border-red-500/25',
  inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  error: 'bg-red-500/15 text-red-400 border-red-500/25',
};

const dotColors: Record<BadgeVariant, string> = {
  verified: 'bg-emerald-400',
  pending: 'bg-amber-400',
  suspicious: 'bg-red-400',
  inactive: 'bg-slate-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  error: 'bg-red-400',
};

export default function StatusBadge({ variant, label, size = 'md', pulse = false }: StatusBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClass} ${variantStyles[variant]}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]} ${pulse ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  );
}