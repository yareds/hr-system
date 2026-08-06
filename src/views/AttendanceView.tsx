import React, { useState } from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
  CheckCircle,
  AlertTriangle,
  Calendar,
  UserCheck,
  Plus,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';

export const AttendanceView: React.FC = () => {
  const { attendance, clockIn, clockOut, addAttendanceRecord } = useData();
  const { currentEmployee } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];

  // User's attendance record for today
  const userTodayRecord = attendance.find(
    (a) => a.employeeId === currentEmployee?.employeeId && a.date === todayStr
  );

  const isClockedIn = userTodayRecord && userTodayRecord.clockIn && !userTodayRecord.clockOut;

  // Stats
  const todayRecords = attendance.filter((a) => a.date === todayStr);
  const presentCount = todayRecords.filter((a) => a.status === 'Present').length;
  const lateCount = todayRecords.filter((a) => a.status === 'Late').length;
  const onLeaveCount = todayRecords.filter((a) => a.status === 'On Leave').length;

  // Manual Log Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    employeeId: currentEmployee?.employeeId || 'EMP-1001',
    employeeName: currentEmployee?.fullName || 'Sarah Jenkins',
    department: currentEmployee?.department || 'Human Resources',
    date: todayStr,
    clockIn: '09:00 AM',
    clockOut: '05:00 PM',
    breakDurationMinutes: 60,
    status: 'Present' as const,
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAttendanceRecord(manualForm);
    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Attendance & Time Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time clock in/out, break duration, overtime logging, and attendance history.
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Log Manual Attendance
        </button>
      </div>

      {/* Clock In / Out Live Terminal Card */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono text-indigo-300 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Time Terminal: {new Date().toLocaleTimeString()}
          </div>
          <h2 className="text-xl font-bold">
            {currentEmployee?.fullName} ({currentEmployee?.department})
          </h2>
          <p className="text-xs text-slate-300">
            {userTodayRecord?.clockIn ? (
              <span>Clocked In Today at <span className="font-bold text-emerald-400">{userTodayRecord.clockIn}</span></span>
            ) : (
              <span>Not Clocked In Yet Today</span>
            )}
            {userTodayRecord?.clockOut && (
              <span> • Clocked Out at <span className="font-bold text-amber-400">{userTodayRecord.clockOut}</span></span>
            )}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          {!isClockedIn ? (
            <button
              onClick={() =>
                clockIn(
                  currentEmployee?.employeeId || 'EMP-1001',
                  currentEmployee?.fullName || 'Sarah Jenkins',
                  currentEmployee?.department || 'Human Resources'
                )
              }
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 animate-bounce hover:animate-none"
            >
              <LogIn className="w-5 h-5" /> Clock In Now
            </button>
          ) : (
            <button
              onClick={() => clockOut(currentEmployee?.employeeId || 'EMP-1001')}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Clock Out Now
            </button>
          )}
        </div>
      </div>

      {/* Daily Attendance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Present Today"
          value={presentCount}
          subtitle="On-time arrival records"
          icon={<CheckCircle className="w-5 h-5 text-emerald-600" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/40"
        />
        <StatCard
          title="Late Arrivals"
          value={lateCount}
          subtitle="Shift delay logged"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/40"
        />
        <StatCard
          title="Employees On Leave"
          value={onLeaveCount}
          subtitle="Approved leave calendar"
          icon={<Calendar className="w-5 h-5 text-indigo-600" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/40"
        />
      </div>

      {/* Attendance Log Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs space-y-3 p-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Today&apos;s Attendance Log</h3>
          <span className="text-xs text-slate-400 font-mono">{todayStr}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Department</th>
                <th className="p-3">Clock In</th>
                <th className="p-3">Clock Out</th>
                <th className="p-3">Break (Min)</th>
                <th className="p-3">Overtime</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{rec.employeeName}</td>
                  <td className="p-3">{rec.department}</td>
                  <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400">{rec.clockIn || '--'}</td>
                  <td className="p-3 font-mono text-amber-600 dark:text-amber-400">{rec.clockOut || '--'}</td>
                  <td className="p-3 font-mono">{rec.breakDurationMinutes} mins</td>
                  <td className="p-3 font-mono">{rec.overtimeHours} hrs</td>
                  <td className="p-3">
                    <Badge variant={rec.status === 'Present' ? 'success' : rec.status === 'Late' ? 'warning' : 'info'}>
                      {rec.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Log Manual Attendance Record"
        subtitle="Record past shift hours or adjustments"
      >
        <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Employee Name *</label>
            <input
              type="text"
              required
              value={manualForm.employeeName}
              onChange={(e) => setManualForm({ ...manualForm, employeeName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Clock In Time</label>
              <input
                type="text"
                value={manualForm.clockIn}
                onChange={(e) => setManualForm({ ...manualForm, clockIn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Clock Out Time</label>
              <input
                type="text"
                value={manualForm.clockOut}
                onChange={(e) => setManualForm({ ...manualForm, clockOut: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsManualModalOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              Save Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
