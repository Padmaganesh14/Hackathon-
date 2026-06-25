import React from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  activePath: string;
}

export default function AppLayout({ children, activePath }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#161410' }}>
      <Sidebar activePath={activePath} />
      <main className="flex-1 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}