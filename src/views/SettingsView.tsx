import React, { useState } from 'react';
import { Settings, ShieldCheck, Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Badge } from '../components/common/Badge';

export const SettingsView: React.FC = () => {
  const { currentRole, user } = useAuth();
  const { auditLogs, seedInitialData } = useData();

  const [isSeeding, setIsSeeding] = useState(false);

  const handleReSeed = async () => {
    setIsSeeding(true);
    await seedInitialData();
    setIsSeeding(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            System Governance & Access Control
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            View active user permissions, audit trails, and manage database synchronization.
          </p>
        </div>

        <button
          onClick={handleReSeed}
          disabled={isSeeding}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
          Reset / Reseed Sample Data
        </button>
      </div>

      {/* Role Display Card (Read-Only) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          Active Account Permissions
        </h2>

        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500">Authenticated Account:</span>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{user?.email}</div>
            <div className="text-xs text-slate-400">UID: <span className="font-mono text-[11px]">{user?.uid}</span></div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Assigned Role:</span>
            <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs">
              {currentRole === 'Super Admin' ? '👑 Super Admin' : '💼 HR Manager'}
            </span>
          </div>
        </div>
      </div>

      {/* System Audit Log Trail */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            Security & System Audit Log
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Module</th>
                <th className="p-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">{log.performedBy}</td>
                  <td className="p-3.5">
                    <Badge variant={log.action.includes('Delete') ? 'danger' : 'info'}>{log.action}</Badge>
                  </td>
                  <td className="p-3.5 font-medium">{log.module}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
