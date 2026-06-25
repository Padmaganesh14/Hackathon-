import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface DashboardStatsProps {
  trustScore?: number;
  trustLabel?: string;
}

const stats = (trustScore: number, trustLabel: string) => [
  {
    id: 'stat-shares',
    label: 'Identity Shares',
    sublabel: 'This month',
    value: trustScore.toString(),
    delta: '+3 this week',
    deltaPositive: true,
    icon: 'ShareIcon',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-800/20',
    borderColor: 'border-amber-700/20',
  },
  {
    id: 'stat-consents',
    label: 'Active Consents',
    sublabel: 'Apps with access',
    value: trustLabel === 'Not Verified' ? '0' : '4',
    delta: '1 expiring soon',
    deltaPositive: false,
    icon: 'LinkIcon',
    iconColor: 'text-stone-400',
    iconBg: 'bg-stone-600/20',
    borderColor: 'border-stone-600/20',
  },
  {
    id: 'stat-verif-age',
    label: 'Verification Age',
    sublabel: 'Days since KYC',
    value: '17d',
    delta: 'Valid for 711 more',
    deltaPositive: true,
    icon: 'CalendarDaysIcon',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-800/20',
    borderColor: 'border-emerald-700/20',
  },
  {
    id: 'stat-alerts',
    label: 'Security Alerts',
    sublabel: 'Last 30 days',
    value: '1',
    delta: 'Review recommended',
    deltaPositive: false,
    icon: 'ExclamationTriangleIcon',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-700/15',
    borderColor: 'border-amber-700/20',
  },
];

export default function DashboardStats({ trustScore = 0, trustLabel = 'Not Verified' }: DashboardStatsProps) {
  const derivedStats = stats(trustScore, trustLabel);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
      {derivedStats.map((stat) => (
        <div
          key={stat.id}
          className={`glass-card rounded-xl p-4 border ${stat.borderColor} hover:bg-stone-700/10 transition-all duration-200`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
              <Icon name={stat.icon as Parameters<typeof Icon>[0]['name']} size={18} variant="outline" className={stat.iconColor} />
            </div>
          </div>
          <p className="text-2xl font-bold text-stone-100 tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {stat.value}
          </p>
          <p className="text-xs font-semibold text-stone-300 mt-0.5">{stat.label}</p>
          <p className="text-xs text-stone-500 mt-0.5">{stat.sublabel}</p>
          <p className={`text-xs mt-2 font-medium ${stat.deltaPositive ? 'text-emerald-500' : 'text-amber-400'}`}>
            {stat.delta}
          </p>
        </div>
      ))}
    </div>
  );
}