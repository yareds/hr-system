import React from 'react';
import { Box, Laptop, Smartphone, Monitor, Shield, Plus, CheckCircle, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Badge } from '../components/common/Badge';

export const AssetsView: React.FC = () => {
  const { assets } = useData();

  const assignedCount = assets.filter((a) => a.status === 'Assigned').length;
  const inStockCount = assets.filter((a) => a.status === 'In Stock').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Company IT Asset & Equipment Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track laptops, mobile devices, monitors, licenses, and serial numbers assigned to employees.
          </p>
        </div>

        <button className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" /> Register New Asset
        </button>
      </div>

      {/* Asset Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Total Inventory: {assets.length} Assets ({assignedCount} Assigned, {inStockCount} In Stock)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Asset Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Serial Number</th>
                <th className="p-3.5">Assigned To</th>
                <th className="p-3.5">Assigned Date</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-indigo-500" />
                    {asset.name}
                  </td>
                  <td className="p-3.5 font-medium">{asset.category}</td>
                  <td className="p-3.5 font-mono text-slate-500">{asset.serialNumber}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-slate-100">
                    {asset.assignedToName || 'Unassigned (In Warehouse)'}
                  </td>
                  <td className="p-3.5 text-slate-500">{asset.assignedDate || '-'}</td>
                  <td className="p-3.5">
                    <Badge variant={asset.status === 'Assigned' ? 'info' : 'success'}>
                      {asset.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
