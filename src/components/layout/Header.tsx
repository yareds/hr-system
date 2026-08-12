import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck,
  Clock,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

interface HeaderProps {
  onNavigate: (view: string) => void;
  activeView: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, activeView }) => {
  const { user, currentRole, currentEmployee, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
        {/* Left: View Breadcrumb & Search Trigger */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Etex HRMS</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100 capitalize font-bold">
              {activeView.replace('-', ' ')}
            </span>
          </div>

          {/* Search Trigger Input */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg text-xs transition-colors w-48 sm:w-64 justify-between border border-transparent dark:border-slate-700"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search HR records...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Controls (Role Indicator, Theme, Notifications, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Read-Only Role Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden md:inline">Role:</span>
            <span>{currentRole}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-2 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>Notifications</span>
                    {unreadNotifications.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px]">
                        {unreadNotifications.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                          !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{n.title}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative pl-1 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <img
                  src={
                    user?.avatarUrl ||
                    currentEmployee?.photoUrl ||
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'
                  }
                  alt={user?.displayName || currentEmployee?.fullName || 'User'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {user?.displayName || currentEmployee?.fullName || 'User'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{currentRole}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              <button
                onClick={() => logout()}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-0.5"
                title="Sign Out of Etex HRMS"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-1.5 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="px-4 py-2.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {user?.displayName || currentEmployee?.fullName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{user?.email || currentEmployee?.email}</div>
                  <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                    Role: {currentRole}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Company & Governance Settings</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(type) => {
          if (type === 'employee') onNavigate('employees');
          else if (type === 'department') onNavigate('organization');
          else if (type === 'payroll') onNavigate('payroll');
          else if (type === 'leave') onNavigate('leave');
        }}
      />
    </>
  );
};
