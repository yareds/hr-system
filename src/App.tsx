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
import { LoginView } from './views/LoginView';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, authLoading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 font-sans p-4">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-400">Verifying session & permissions...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
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
