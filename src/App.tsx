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
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { Role } from './types';

function AdminLoginModal() {
  const { login } = useAuth();
  const [email, setEmail] = useState('sarah.jenkins@etex.com');
  const [selectedRole, setSelectedRole] = useState<Role>('Super Admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Etex HRMS</h1>
          <p className="text-xs text-slate-400">Administrative Management System</p>
        </div>

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-start gap-2.5">
          <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>
            <strong>Restricted Access:</strong> Only Super Admins (Company Owners) and HR Managers can access this portal.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Administrative Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('Super Admin');
                  setEmail('sarah.jenkins@etex.com');
                }}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'Super Admin'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>👑 Super Admin</span>
                <span className="text-[10px] opacity-80 font-normal">Company Owner</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('HR Manager');
                  setEmail('elena.rostova@etex.com');
                }}
                className={`p-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'HR Manager'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>💼 HR Manager</span>
                <span className="text-[10px] opacity-80 font-normal">HR Administrator</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                defaultValue="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Authenticate Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-[10px] text-slate-500 border-t border-slate-800 pt-4">
          Etex HRMS v2.4 • Secured Administrative Access Control
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
