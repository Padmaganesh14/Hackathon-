'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'nav-dashboard', label: 'Identity Wallet', icon: 'WalletIcon', path: '/identity-wallet-dashboard' },
  { id: 'nav-verify', label: 'Verify Identity', icon: 'ShieldCheckIcon', path: '/identity-verification-onboarding', badge: 1 },
  { id: 'nav-share', label: 'Share Identity', icon: 'ShareIcon', path: '/share-identity-flow' },
];

const bottomItems: NavItem[] = [
  { id: 'nav-settings', label: 'Settings', icon: 'Cog6ToothIcon', path: '#' },
];

interface SidebarProps {
  activePath: string;
}

interface UserProfile {
  fullName?: string;
  kycStatus?: string;
  trustScore?: number;
  nationality?: string;
  idType?: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const isAuthPage = pathname === '/login';
    const token = localStorage.getItem('token');

    if (!token) {
      if (!isAuthPage) {
        router.replace('/login');
      }
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
        if (!isAuthPage) {
          router.replace('/login');
        }
      }
    };

    fetchLoggedInUser();
  }, [apiBaseUrl, pathname, router]);

  const SidebarContent = () => {
    const initials = user?.fullName
      ?.split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-stone-700/30 ${collapsed ? 'justify-center px-3' : ''}`}>
        <AppLogo size={32} />
        {!collapsed && (
          <span className="font-bold text-base tracking-tight text-stone-100">
            PortaID
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <div className={`mb-3 ${collapsed ? 'hidden' : ''}`}>
          <span className="text-xs font-500 tracking-widest uppercase text-stone-500 px-3">
            Identity
          </span>
        </div>
        {navItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group
                ${isActive
                  ? 'bg-amber-800/20 text-amber-300 border border-amber-700/30' :'text-stone-400 hover:bg-stone-700/20 hover:text-stone-200 border border-transparent'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                name={item.icon as Parameters<typeof Icon>[0]['name']}
                size={18}
                variant={isActive ? 'solid' : 'outline'}
                className={isActive ? 'text-amber-400' : 'text-stone-400 group-hover:text-stone-200'}
              />
              {!collapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="text-xs bg-amber-700/25 text-amber-400 border border-amber-600/30 rounded-full px-1.5 py-0.5 leading-none">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 py-4 border-t border-stone-700/30 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:bg-stone-700/20 hover:text-stone-200 transition-all duration-200 border border-transparent ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <Icon name={item.icon as Parameters<typeof Icon>[0]['name']} size={18} variant="outline" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {/* User avatar */}
        <div className={`flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg glass-card ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-full gradient-warm flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-200 truncate">{user?.fullName || 'Loading...'}</p>
              <p className="text-xs text-stone-500 truncate">{user?.kycStatus || 'Not Verified'}</p>
            </div>
          )}
        </div>
      </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-3 border-t border-stone-700/30 text-stone-500 hover:text-stone-300 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon
            name={collapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'}
            size={16}
            variant="outline"
          />
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden lg:flex flex-col h-full flex-shrink-0
          transition-all duration-300 ease-in-out
          border-r border-stone-700/25
          ${collapsed ? 'w-16' : 'w-56'}
        `}
        style={{ background: 'rgba(15, 14, 12, 0.97)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card rounded-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={20} variant="outline" className="text-stone-300" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-56 h-full flex flex-col border-r border-stone-700/25" style={{ background: 'rgba(15, 14, 12, 0.99)' }}>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}