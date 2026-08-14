import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  CalendarDays,
  DollarSign,
  Award,
  Briefcase,
  Box,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Role } from '../../types';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  const { currentRole, hasRole, user, logout } = useAuth();
  const { leaveRequests, jobs } = useData();
  const [collapsed, setCollapsed] = useState(false);

  const pendingLeavesCount = (leaveRequests || []).filter((l) => l?.status === 'Pending').length;
  const openJobsCount = (jobs || []).filter((j) => j?.status === 'Open').length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    allowedRoles?: Role[];
  }

  interface NavSection {
    sectionTitle: string;
    items: NavItem[];
  }

  const navSections: NavSection[] = [
    {
      sectionTitle: 'Main',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      sectionTitle: 'Workforce',
      items: [
        { id: 'employees', label: 'Employee Directory', icon: Users, allowedRoles: ['Super Admin', 'HR Manager'] },
        { id: 'organization', label: 'Org Structure', icon: Building2, allowedRoles: ['Super Admin', 'HR Manager'] },
      ],
    },
    {
      sectionTitle: 'Operations',
      items: [
        { id: 'attendance', label: 'Attendance & Time', icon: Clock, allowedRoles: ['Super Admin', 'HR Manager'] },
        { id: 'leave', label: 'Leave Management', icon: CalendarDays, badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined, allowedRoles: ['Super Admin', 'HR Manager'] },
        { id: 'payroll', label: 'Payroll & Payslips', icon: DollarSign, allowedRoles: ['Super Admin', 'HR Manager'] },
      ],
    },
    {
      sectionTitle: 'Talent & Assets',
      items: [
        { id: 'performance', label: 'Performance', icon: Award, allowedRoles: ['Super Admin', 'HR Manager'] },
        { id: 'recruitment', label: 'Recruitment', icon: Briefcase, badge: openJobsCount > 0 ? `${openJobsCount} Open` : undefined, allowedRoles: ['Super Admin', 'HR Manager'] },
        { id: 'assets', label: 'Asset Management', icon: Box, allowedRoles: ['Super Admin', 'HR Manager'] },
      ],
    },
    {
      sectionTitle: 'Analytics & System',
      items: [
        { id: 'reports', label: 'Reports & Exports', icon: BarChart3, allowedRoles: ['Super Admin', 'HR Manager'] },
        { id: 'settings', label: 'Settings & Audit', icon: Settings, allowedRoles: ['Super Admin'] },
      ],
    },
  ];

  return (
    <aside
      className={`relative h-screen bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        {!collapsed ? (
          <div>
            <div className="font-bold text-white text-base tracking-tight">Etex HRMS</div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Admin Portal
            </div>
          </div>
        ) : (
          <div className="font-black text-indigo-400 text-base tracking-wider mx-auto select-none" title="Etex HRMS Admin">
            E
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors hidden sm:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, sIdx) => {
          const visibleItems = section.items;

          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {section.sectionTitle}
                </div>
              )}

              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />

                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer Role Badge & Sign Out */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
        {!collapsed ? (
          <>
            <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="truncate">
                  <div className="text-[11px] font-semibold text-slate-200">{currentRole}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user?.email || 'Logged In'}</div>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full py-2 px-3 bg-slate-800/90 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700/60 hover:border-rose-800/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <div className="space-y-2 text-center">
            <div className="flex justify-center" title={`Active Role: ${currentRole} (${user?.email})`}>
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 mx-auto block transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
