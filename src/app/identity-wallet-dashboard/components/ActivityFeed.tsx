import React from 'react';
import Icon from '@/components/ui/AppIcon';
import StatusBadge from '@/components/ui/StatusBadge';

const activities = [
  {
    id: 'act-001',
    type: 'share',
    title: 'Identity shared with Axis Bank',
    subtitle: 'KYC Verified + Age — 2 fields',
    time: '10:28 AM',
    date: 'Today',
    status: 'verified' as const,
    statusLabel: 'Shared',
    icon: 'ShareIcon',
    iconBg: 'bg-amber-800/20',
    iconColor: 'text-amber-500',
  },
  {
    id: 'act-002',
    type: 'alert',
    title: 'Suspicious login attempt blocked',
    subtitle: 'Unknown device — Mumbai, MH',
    time: '09:14 AM',
    date: 'Today',
    status: 'suspicious' as const,
    statusLabel: 'Blocked',
    icon: 'ExclamationTriangleIcon',
    iconBg: 'bg-red-900/20',
    iconColor: 'text-red-400',
  },
  {
    id: 'act-003',
    type: 'verification',
    title: 'Re-verification completed',
    subtitle: 'Liveness check renewed',
    time: '04:55 PM',
    date: 'Yesterday',
    status: 'verified' as const,
    statusLabel: 'Verified',
    icon: 'CheckBadgeIcon',
    iconBg: 'bg-emerald-800/20',
    iconColor: 'text-emerald-500',
  },
  {
    id: 'act-004',
    type: 'share',
    title: 'Age verification — LoanTap',
    subtitle: 'Age only — 1 field',
    time: '11:02 AM',
    date: '27 Apr',
    status: 'verified' as const,
    statusLabel: 'Shared',
    icon: 'ShareIcon',
    iconBg: 'bg-amber-800/20',
    iconColor: 'text-amber-500',
  },
  {
    id: 'act-005',
    type: 'consent',
    title: 'Consent revoked — PayFi App',
    subtitle: 'User initiated revocation',
    time: '08:30 AM',
    date: '26 Apr',
    status: 'inactive' as const,
    statusLabel: 'Revoked',
    icon: 'XCircleIcon',
    iconBg: 'bg-stone-600/20',
    iconColor: 'text-stone-400',
  },
  {
    id: 'act-006',
    type: 'share',
    title: 'Full KYC bundle — HDFC Credit',
    subtitle: 'Full identity — 6 fields',
    time: '03:18 PM',
    date: '25 Apr',
    status: 'verified' as const,
    statusLabel: 'Shared',
    icon: 'ShareIcon',
    iconBg: 'bg-amber-800/20',
    iconColor: 'text-amber-500',
  },
];

export default function ActivityFeed() {
  return (
    <div className="glass-card rounded-2xl border border-stone-700/25 fade-in-up" style={{ animationDelay: '0.15s' }}>
      <div className="px-5 py-4 border-b border-stone-700/25 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-stone-100">Recent Activity</h2>
          <p className="text-xs text-stone-500 mt-0.5">Identity events & verification log</p>
        </div>
        <button className="text-xs text-amber-500 hover:text-amber-400 transition-colors font-medium">
          View all
        </button>
      </div>
      <div className="divide-y divide-stone-700/20">
        {activities.map((item) => (
          <div
            key={item.id}
            className="activity-item px-5 py-3.5 flex items-start gap-3 transition-colors duration-150 rounded-lg mx-1 my-0.5"
          >
            <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
              <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={15} variant="outline" className={item.iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-200 truncate">{item.title}</p>
              <p className="text-xs text-stone-500 truncate mt-0.5">{item.subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <StatusBadge variant={item.status} label={item.statusLabel} size="sm" />
              <span className="text-xs text-stone-600 font-mono">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}