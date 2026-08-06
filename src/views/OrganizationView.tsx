import React, { useState } from 'react';
import {
  Building2,
  Users,
  MapPin,
  CreditCard,
  Plus,
  ChevronRight,
  GitMerge,
  Shield,
  Briefcase,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const OrganizationView: React.FC = () => {
  const { departments, positions, employees, addDepartment } = useData();
  const { canManageEmployees } = useAuth();

  const [activeTab, setActiveTab] = useState<'departments' | 'positions' | 'hierarchy' | 'locations'>('departments');

  // Add Department Modal
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    costCenter: 'CC-106',
    location: 'HQ - San Francisco',
    description: '',
  });

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    addDepartment(newDept);
    setIsDeptModalOpen(false);
    setNewDept({ name: '', code: '', costCenter: 'CC-106', location: 'HQ - San Francisco', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Organizational Architecture
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage company departments, job positions, reporting structures, cost centers, and branch locations.
          </p>
        </div>

        {canManageEmployees && (
          <button
            onClick={() => setIsDeptModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Department
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold gap-6">
        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'departments'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" /> Departments ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab('positions')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'positions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Job Positions ({positions.length})
        </button>
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`pb-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'hierarchy'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GitMerge className="w-4 h-4" /> Reporting Hierarchy Tree
        </button>
      </div>

      {/* Tab: Departments */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const empCount = employees.filter((e) => e.department === dept.name).length;
            return (
              <div
                key={dept.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="primary">{dept.code}</Badge>
                    <span className="text-xs text-slate-400 font-mono">{dept.costCenter}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mt-2">{dept.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{dept.description}</p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Department Lead</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{dept.managerName || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location</span>
                    <span>{dept.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Headcount</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{empCount} Employees</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Positions */}
      {activeTab === 'positions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Job Title</th>
                <th className="p-3">Department</th>
                <th className="p-3">Grade Level</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {positions.map((pos) => (
                <tr key={pos.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{pos.title}</td>
                  <td className="p-3">{pos.department}</td>
                  <td className="p-3 font-mono">{pos.grade}</td>
                  <td className="p-3">{pos.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Hierarchy Tree Diagram */}
      {activeTab === 'hierarchy' && (
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Organizational Leadership Hierarchy</h3>
            <p className="text-xs text-slate-400">Reporting structure from Executive Leadership down to Department Leads</p>
          </div>

          {/* Root Level: HR Director & VP of Engineering */}
          <div className="flex flex-col items-center space-y-8">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/60 border-2 border-indigo-500 rounded-xl shadow-md text-center max-w-sm w-full">
              <Badge variant="purple">Executive Leadership</Badge>
              <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">Elena Rostova</div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">VP of Engineering</div>
              <div className="text-[10px] text-slate-400 mt-1">Reports directly to CEO</div>
            </div>

            {/* Connecting Lines */}
            <div className="w-0.5 h-8 bg-indigo-300 dark:bg-indigo-700"></div>

            {/* Department Managers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">Sarah Jenkins</div>
                <div className="text-[11px] text-slate-500">HR Director</div>
                <Badge variant="info">Human Resources</Badge>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">Marcus Vance</div>
                <div className="text-[11px] text-slate-500">Sales Manager</div>
                <Badge variant="success">Sales & Marketing</Badge>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-center space-y-1">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">Alex Thorne</div>
                <div className="text-[11px] text-slate-500">Lead Designer</div>
                <Badge variant="primary">Product & Design</Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      <Modal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        title="Add New Department"
        subtitle="Define cost center, location, and department code"
      >
        <form onSubmit={handleCreateDepartment} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              placeholder="e.g. Legal & Compliance"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department Code *</label>
              <input
                type="text"
                required
                value={newDept.code}
                onChange={(e) => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                placeholder="e.g. LGL"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Cost Center</label>
              <input
                type="text"
                value={newDept.costCenter}
                onChange={(e) => setNewDept({ ...newDept, costCenter: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Location</label>
            <input
              type="text"
              value={newDept.location}
              onChange={(e) => setNewDept({ ...newDept, location: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsDeptModalOpen(false)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              Create Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
