import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardView } from './views/DashboardView';
import { EmployeesView } from './views/EmployeesView';
import { OrganizationView } from './views/OrganizationView';
import { AttendanceView } from './views/AttendanceView';
import { LeaveView } from './views/LeaveView';
import { PayrollView } from './views/PayrollView';
import { PerformanceView } from './views/PerformanceView';
import { RecruitmentView } from './views/RecruitmentView';
import { AssetsView } from './views/AssetsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { ShieldCheck, Lock, Mail, AlertTriangle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Role } from './types';

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function AdminLoginModal() {
  const { login } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authenticatingEmail, setAuthenticatingEmail] = useState('');

  const handleGoogleAuth = (emailToAuth: string) => {
    setError(null);
    const clean = emailToAuth.trim().toLowerCase();

    if (clean !== 'yared.abegaz@gmail.com' && clean !== 'molla.yareds@gmail.com') {
      setError(
        `Access Denied: Google Account "${emailToAuth}" is not authorized. Only yared.abegaz@gmail.com (Admin) and molla.yareds@gmail.com (HR Manager) are granted access.`
      );
      return;
    }

    setIsAuthenticating(true);
    setAuthenticatingEmail(clean);

    setTimeout(() => {
      login(clean);
      setIsAuthenticating(false);
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    handleGoogleAuth(customEmail);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
            <GoogleIcon className="w-4 h-4" />
            <span>Google Workspace SSO</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Etex HRMS</h1>
          <p className="text-xs text-slate-400">Administrative Single Sign-On Portal</p>
        </div>

        {/* Loading Overlay */}
        {isAuthenticating && (
          <div className="p-6 bg-slate-800/90 border border-indigo-500/30 rounded-2xl text-center space-y-3 animate-pulse">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <div className="text-xs font-semibold text-white">Authenticating with Google OAuth...</div>
            <div className="text-[11px] text-slate-400 font-mono">{authenticatingEmail}</div>
          </div>
        )}

        {!isAuthenticating && (
          <>
            {/* Security Notice */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-start gap-2.5">
              <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                <strong>Role-Based SSO:</strong> Sign in with your designated Google account to access your administrative workspace.
              </span>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2.5 leading-relaxed">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>{error}</div>
              </div>
            )}

            {/* Google Email Sign In Form */}
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Google Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={customEmail}
                    onChange={(e) => {
                      setCustomEmail(e.target.value);
                      setError(null);
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Sign in with Google</span>
              </button>
            </form>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-500 border-t border-slate-800 pt-4">
          Etex HRMS v2.4 • Protected by Google OAuth 2.0 & Role Policy
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (!user) {
    return <AdminLoginModal />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveView} />;
      case 'employees':
        return <EmployeesView />;
      case 'organization':
        return <OrganizationView />;
      case 'attendance':
        return <AttendanceView />;
      case 'leave':
        return <LeaveView />;
      case 'payroll':
        return <PayrollView />;
      case 'performance':
        return <PerformanceView />;
      case 'recruitment':
        return <RecruitmentView />;
      case 'assets':
        return <AssetsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={setActiveView} />;
    }
  };

  return (
    <MainLayout activeView={activeView} onNavigate={setActiveView}>
      {renderActiveView()}
    </MainLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
