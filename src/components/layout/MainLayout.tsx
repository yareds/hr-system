import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  activeView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  activeView,
  onNavigate,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex overflow-hidden transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} onNavigate={onNavigate} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header activeView={activeView} onNavigate={onNavigate} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
