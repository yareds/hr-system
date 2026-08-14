import React, { useState, useEffect } from 'react';
import { Search, User, Building, FileText, DollarSign, Calendar, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult?: (type: string, id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const { employees = [], departments = [], payslips = [], leaveRequests = [] } = useData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal (triggered from header)
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredEmployees = q
    ? (employees || []).filter(
        (e) =>
          e?.fullName?.toLowerCase().includes(q) ||
          e?.employeeId?.toLowerCase().includes(q) ||
          e?.department?.toLowerCase().includes(q) ||
          e?.position?.toLowerCase().includes(q) ||
          e?.email?.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const filteredDepts = q
    ? (departments || []).filter(
        (d) => d?.name?.toLowerCase().includes(q) || d?.code?.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const filteredPayslips = q
    ? (payslips || []).filter(
        (p) =>
          p?.employeeName?.toLowerCase().includes(q) ||
          p?.employeeId?.toLowerCase().includes(q) ||
          p?.periodStart?.includes(q)
      ).slice(0, 3)
    : [];

  const filteredLeaves = q
    ? (leaveRequests || []).filter(
        (l) =>
          l?.employeeName?.toLowerCase().includes(q) ||
          l?.leaveType?.toLowerCase().includes(q) ||
          l?.status?.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const totalResults =
    filteredEmployees.length + filteredDepts.length + filteredPayslips.length + filteredLeaves.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees, departments, payslips, leaves... (e.g. 'Sara', 'ENG', 'Payroll')"
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="ml-2 text-xs font-mono text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-96 overflow-y-auto space-y-4">
          {!q && (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              Type a keyword to quickly navigate HR records
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No results found for &quot;{query}&quot;
            </div>
          )}

          {/* Employees */}
          {filteredEmployees.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Employees
              </div>
              <div className="space-y-1 mt-1">
                {filteredEmployees.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => {
                      onSelectResult?.('employee', e.id);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={e.photoUrl}
                        alt={e.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {e.fullName}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {e.position} • {e.department}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{e.employeeId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Departments */}
          {filteredDepts.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Departments
              </div>
              <div className="space-y-1 mt-1">
                {filteredDepts.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onSelectResult?.('department', d.id);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {d.name} ({d.code})
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Manager: {d.managerName || 'Unassigned'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payslips */}
          {filteredPayslips.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Payslips
              </div>
              <div className="space-y-1 mt-1">
                {filteredPayslips.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectResult?.('payroll', p.id);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {p.employeeName} - {p.periodStart} to {p.periodEnd}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Net Pay: ETB {p.netPay.toLocaleString()}
                      </div>
                    </div>
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leaves */}
          {filteredLeaves.length > 0 && (
            <div>
              <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Leave Requests
              </div>
              <div className="space-y-1 mt-1">
                {filteredLeaves.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onSelectResult?.('leave', l.id);
                      onClose();
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {l.employeeName} ({l.leaveType} Leave)
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {l.startDate} to {l.endDate} ({l.totalDays} days)
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
