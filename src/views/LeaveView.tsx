import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Building,
  Check,
  X,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { LeaveType, LeaveStatus, LeaveRequest } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const LeaveView: React.FC = () => {
  const { leaveRequests = [], submitLeaveRequest, updateLeaveStatus, employees = [] } = useData();
  const safeLeaveRequests = leaveRequests || [];
  const { currentEmployee, canApproveLeave } = useAuth();

  const [activeTab, setActiveTab] = useState<'requests' | 'calendar' | 'balances'>('requests');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Request Leave Modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Annual' as LeaveType,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    totalDays: 1,
    reason: '',
  });

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLeaveRequest({
      employeeId: currentEmployee?.employeeId || 'EMP-1001',
      employeeName: currentEmployee?.fullName || 'Sara Belay',
      department: currentEmployee?.department || 'Human Resources',
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      totalDays: Number(leaveForm.totalDays),
      reason: leaveForm.reason,
    });
    setIsRequestModalOpen(false);
    setLeaveForm({
      leaveType: 'Annual',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      totalDays: 1,
      reason: '',
    });
  };

  const filteredRequests = safeLeaveRequests.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r?.status === filterStatus;
  });

  const leaveTypesList: LeaveType[] = [
    'Annual',
    'Sick',
    'Personal',
    'Maternity',
    'Paternity',
    'Bereavement',
    'Unpaid',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Leave Management & Approvals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit leave requests, track accrued leave balances, and execute manager approvals.
          </p>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Request Leave
        </button>
      </div>

      {/* User Leave Balances Quick Row */}
      {currentEmployee && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-[11px] font-semibold text-slate-500">Annual Leave</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {currentEmployee.leaveBalance?.annual || 20} Days
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-[11px] font-semibold text-slate-500">Sick Leave</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {currentEmployee.leaveBalance?.sick || 10} Days
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-[11px] font-semibold text-slate-500">Personal Leave</div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">
              {currentEmployee.leaveBalance?.personal || 5} Days
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-[11px] font-semibold text-slate-500">Maternity</div>
            <div className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-1">
              {currentEmployee.leaveBalance?.maternity || 90} Days
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-[11px] font-semibold text-slate-500">Paternity</div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">
              {currentEmployee.leaveBalance?.paternity || 14} Days
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <div className="text-[11px] font-semibold text-slate-500">Bereavement</div>
            <div className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-1">
              {currentEmployee.leaveBalance?.bereavement || 5} Days
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
          {['ALL', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Total Days</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                {canApproveLeave && <th className="p-3">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{req.employeeName}</div>
                    <div className="text-[10px] text-slate-400">{req.department}</div>
                  </td>
                  <td className="p-3">
                    <Badge variant={req.leaveType === 'Sick' ? 'danger' : 'info'}>{req.leaveType}</Badge>
                  </td>
                  <td className="p-3 font-mono">
                    {req.startDate} to {req.endDate}
                  </td>
                  <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{req.totalDays} Days</td>
                  <td className="p-3 max-w-xs truncate">{req.reason}</td>
                  <td className="p-3">
                    <Badge
                      variant={
                        req.status === 'Approved'
                          ? 'success'
                          : req.status === 'Pending'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {req.status}
                    </Badge>
                  </td>
                  {canApproveLeave && (
                    <td className="p-3">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              updateLeaveStatus(
                                req.id,
                                'Approved',
                                currentEmployee?.fullName || 'Manager',
                                'Approved via HRMS'
                              )
                            }
                            className="px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Approve
                          </button>
                          <button
                            onClick={() =>
                              updateLeaveStatus(
                                req.id,
                                'Rejected',
                                currentEmployee?.fullName || 'Manager',
                                'Rejected - staffing requirement'
                              )
                            }
                            className="px-2 py-1 bg-rose-600 text-white hover:bg-rose-700 rounded text-[11px] font-semibold flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          By {req.approverName || 'Manager'}
                        </span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Leave Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Submit Leave Request"
        subtitle="Automatic balance deduction upon approval"
      >
        <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Leave Type *</label>
            <select
              value={leaveForm.leaveType}
              onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveType })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              {leaveTypesList.map((type) => (
                <option key={type} value={type}>
                  {type} Leave
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">End Date *</label>
              <input
                type="date"
                required
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Total Days *</label>
            <input
              type="number"
              required
              min={1}
              value={leaveForm.totalDays}
              onChange={(e) => setLeaveForm({ ...leaveForm, totalDays: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Reason for Leave *</label>
            <textarea
              required
              rows={3}
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              placeholder="Briefly state reason for leave..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-semibold"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
