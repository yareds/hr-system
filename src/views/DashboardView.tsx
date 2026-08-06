import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  CalendarDays,
  Clock,
  DollarSign,
  Cake,
  Award,
  Pin,
  ArrowRight,
  Plus,
  CheckCircle2,
  XCircle,
  Megaphone,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    employees,
    attendance,
    leaveRequests,
    payslips,
    announcements,
    updateLeaveStatus,
  } = useData();
  const { currentEmployee, currentRole, canApproveLeave, canManagePayroll, canManageEmployees } = useAuth();

  // Metrics
  const activeEmployees = employees.filter((e) => e.employmentStatus === 'Active');
  const totalCount = employees.length;
  const onLeaveCount = employees.filter((e) => e.employmentStatus === 'On Leave').length;
  
  // New hires in last 6 months
  const newHiresCount = employees.filter((e) => {
    const hireDate = new Date(e.hireDate);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return hireDate >= sixMonthsAgo;
  }).length;

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');

  // Attendance summary for today
  const presentCount = attendance.filter((a) => a.status === 'Present').length;
  const lateCount = attendance.filter((a) => a.status === 'Late').length;
  const attendanceRate = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 100;

  // Monthly Payroll total sum
  const latestPayrollSum = payslips.reduce((acc, p) => acc + p.grossPay, 0);

  // Department Headcount Chart Data
  const deptMap: Record<string, number> = {};
  employees.forEach((e) => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([name, count]) => ({ name, count }));

  // Attendance Donut Data
  const attendanceData = [
    { name: 'Present', value: presentCount || 6, color: '#10b981' },
    { name: 'Late', value: lateCount || 1, color: '#f59e0b' },
    { name: 'On Leave', value: onLeaveCount || 1, color: '#6366f1' },
  ];

  // Upcoming Birthdays (August simulated current month)
  const upcomingBirthdays = employees.filter((e) => {
    const dob = new Date(e.dateOfBirth);
    return dob.getMonth() === 7; // August
  });

  // Upcoming Anniversaries
  const upcomingAnniversaries = employees.filter((e) => {
    const hire = new Date(e.hireDate);
    return hire.getMonth() === 7;
  });

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Executive HR Dashboard • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">
            Welcome back, {currentEmployee?.firstName || 'Sarah'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            You are managing <span className="font-semibold text-white">{activeEmployees.length} active employees</span> across 5 departments with an overall workforce attendance rate of <span className="font-semibold text-emerald-400">{attendanceRate}%</span>.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {canManageEmployees && (
            <button
              onClick={() => onNavigate('employees')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Employee
            </button>
          )}
          <button
            onClick={() => onNavigate('leave')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <CalendarDays className="w-4 h-4" /> Request Leave
          </button>
          {canManagePayroll && (
            <button
              onClick={() => onNavigate('payroll')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" /> Run Payroll
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={totalCount}
          subtitle={`${activeEmployees.length} active, ${onLeaveCount} on leave`}
          trend={{ value: '12%', isPositive: true, label: 'vs last quarter' }}
          icon={<Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          onClick={() => onNavigate('employees')}
        />
        <StatCard
          title="New Hires"
          value={newHiresCount}
          subtitle="Joined in last 6 months"
          trend={{ value: '3', isPositive: true, label: 'recent additions' }}
          icon={<UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/40"
          onClick={() => onNavigate('employees')}
        />
        <StatCard
          title="Pending Leave Approvals"
          value={pendingLeaves.length}
          subtitle="Requires manager action"
          icon={<CalendarDays className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/40"
          onClick={() => onNavigate('leave')}
        />
        <StatCard
          title="Monthly Gross Payroll"
          value={`$${Math.round(latestPayrollSum).toLocaleString()}`}
          subtitle="Last completed payroll run"
          icon={<DollarSign className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
          iconBgColor="bg-sky-50 dark:bg-sky-950/40"
          onClick={() => onNavigate('payroll')}
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Headcount Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Headcount Distribution by Department
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staff distribution across functional divisions
              </p>
            </div>
            <button
              onClick={() => onNavigate('organization')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View Org <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Attendance Donut */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Today&apos;s Attendance Status
              </h3>
              <Badge variant="success">{attendanceRate}% Rate</Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live clock in & leave status tracking
            </p>
          </div>

          <div className="h-44 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 dark:border-slate-800 pt-3">
            {attendanceData.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.name}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Grid: Pending Approvals & Upcoming Celebrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Pending Leave Requests
              </h3>
            </div>
            <button
              onClick={() => onNavigate('leave')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All
            </button>
          </div>

          {pendingLeaves.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No leave requests pending approval
            </div>
          ) : (
            <div className="space-y-3">
              {pendingLeaves.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs gap-3"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {req.employeeName} ({req.department})
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {req.leaveType} Leave • {req.startDate} to {req.endDate} ({req.totalDays} days)
                    </div>
                    <p className="text-slate-400 italic text-[11px] mt-1">&quot;{req.reason}&quot;</p>
                  </div>

                  {canApproveLeave && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => updateLeaveStatus(req.id, 'Approved', currentEmployee?.fullName || 'Manager')}
                        className="p-1.5 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg transition-colors"
                        title="Approve Leave"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateLeaveStatus(req.id, 'Rejected', currentEmployee?.fullName || 'Manager')}
                        className="p-1.5 bg-rose-600 text-white hover:bg-rose-500 rounded-lg transition-colors"
                        title="Reject Leave"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Celebrations: Birthdays & Anniversaries */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cake className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Celebrations This Month
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">August 2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Birthdays */}
            <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl space-y-2">
              <div className="font-semibold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <Cake className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Birthdays ({upcomingBirthdays.length})
              </div>
              <div className="space-y-1.5">
                {upcomingBirthdays.map((b) => (
                  <div key={b.id} className="flex items-center gap-2">
                    <img src={b.photoUrl} alt={b.fullName} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{b.fullName}</div>
                      <div className="text-[10px] text-slate-500">{new Date(b.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anniversaries */}
            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-2">
              <div className="font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Work Anniversaries ({upcomingAnniversaries.length})
              </div>
              <div className="space-y-1.5">
                {upcomingAnniversaries.map((a) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <img src={a.photoUrl} alt={a.fullName} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{a.fullName}</div>
                      <div className="text-[10px] text-slate-500">Joined {new Date(a.hireDate).getFullYear()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Announcements Banner Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Company Announcements
            </h3>
          </div>
          <span className="text-xs text-slate-400">Internal Notice Board</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((anc) => (
            <div
              key={anc.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {anc.isPinned && <Pin className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />}
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{anc.title}</span>
                </div>
                <Badge variant={anc.category === 'Event' ? 'purple' : 'info'}>{anc.category}</Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{anc.content}</p>
              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-800">
                <span>By {anc.author}</span>
                <span>{new Date(anc.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
