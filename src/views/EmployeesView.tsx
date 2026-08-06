import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Mail,
  Phone,
  Building,
  MoreVertical,
  FileText,
  DollarSign,
  Calendar,
  CreditCard,
  Briefcase,
  ShieldAlert,
  UserCheck,
  Archive,
  UserX,
  Upload,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Employee, EmploymentStatus } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

export const EmployeesView: React.FC = () => {
  const { employees, addEmployee, updateEmployee, updateEmployeeStatus, addEmployeeDocument } = useData();
  const { canManageEmployees, currentRole } = useAuth();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Selected Employee Detail Modal
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'info' | 'financial' | 'docs' | 'leave'>('info');

  // Add / Edit Employee Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    position: 'Software Engineer',
    salary: 110000,
    hireDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-Time',
    payType: 'Salary',
    payFrequency: 'Monthly',
  });

  // Filter Logic
  const filteredEmployees = employees.filter((e) => {
    const matchesQuery =
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || e.department === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || e.employmentStatus === selectedStatus;

    return matchesQuery && matchesDept && matchesStatus;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee(newEmpForm);
    setIsAddModalOpen(false);
    setNewEmpForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'Engineering',
      position: 'Software Engineer',
      salary: 110000,
      hireDate: new Date().toISOString().split('T')[0],
      employmentType: 'Full-Time',
      payType: 'Salary',
      payFrequency: 'Monthly',
    });
  };

  const getStatusBadge = (status: EmploymentStatus) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>;
      case 'On Leave':
        return <Badge variant="warning">On Leave</Badge>;
      case 'Archived':
        return <Badge variant="neutral">Archived</Badge>;
      case 'Terminated':
        return <Badge variant="danger">Terminated</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Employee Directory ({employees.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage employee profiles, onboarding, contracts, and employment status.
          </p>
        </div>

        {canManageEmployees && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add New Employee
          </button>
        )}
      </div>

      {/* Filter Bar & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, ID, title, email..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Sales & Marketing">Sales & Marketing</option>
            <option value="Finance & Accounting">Finance & Accounting</option>
            <option value="Product & Design">Product & Design</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Archived">Archived</option>
            <option value="Terminated">Terminated</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-md text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-900 shadow-xs text-indigo-600' : 'text-slate-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-md text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-900 shadow-xs text-indigo-600' : 'text-slate-400'
              }`}
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.photoUrl}
                    alt={emp.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {emp.fullName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{emp.position}</p>
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">{emp.employeeId}</span>
                  </div>
                </div>
                {getStatusBadge(emp.employmentStatus)}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{emp.employmentType} • Salary: ${emp.salary.toLocaleString()}/yr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[10px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">ID</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Position</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Salary</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={emp.photoUrl} alt={emp.fullName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{emp.fullName}</div>
                        <div className="text-[10px] text-slate-400">{emp.email}</div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{emp.employeeId}</td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3">{emp.position}</td>
                    <td className="p-3">{getStatusBadge(emp.employmentStatus)}</td>
                    <td className="p-3 font-mono">${emp.salary.toLocaleString()}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Employee Detailed Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={!!selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          title={`Profile: ${selectedEmployee.fullName}`}
          subtitle={`${selectedEmployee.position} • ${selectedEmployee.department} (${selectedEmployee.employeeId})`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Header Avatar card */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={selectedEmployee.photoUrl}
                  alt={selectedEmployee.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedEmployee.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selectedEmployee.email} • {selectedEmployee.phone}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedEmployee.employmentStatus)}
                    <span className="text-xs text-slate-400">Hired {selectedEmployee.hireDate}</span>
                  </div>
                </div>
              </div>

              {canManageEmployees && (
                <div className="flex items-center gap-2">
                  {selectedEmployee.employmentStatus === 'Active' ? (
                    <>
                      <button
                        onClick={() => {
                          updateEmployeeStatus(selectedEmployee.id, 'On Leave');
                          setSelectedEmployee({ ...selectedEmployee, employmentStatus: 'On Leave' });
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg border border-amber-200"
                      >
                        Set On Leave
                      </button>
                      <button
                        onClick={() => {
                          updateEmployeeStatus(selectedEmployee.id, 'Archived');
                          setSelectedEmployee({ ...selectedEmployee, employmentStatus: 'Archived' });
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg"
                      >
                        Archive
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        updateEmployeeStatus(selectedEmployee.id, 'Active');
                        setSelectedEmployee({ ...selectedEmployee, employmentStatus: 'Active' });
                      }}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-semibold">
              <button
                onClick={() => setActiveProfileTab('info')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeProfileTab === 'info'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Personal & Employment
              </button>
              <button
                onClick={() => setActiveProfileTab('financial')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeProfileTab === 'financial'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Bank & Tax Information
              </button>
              <button
                onClick={() => setActiveProfileTab('docs')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeProfileTab === 'docs'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Documents ({selectedEmployee.documents?.length || 0})
              </button>
              <button
                onClick={() => setActiveProfileTab('leave')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeProfileTab === 'leave'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Leave Balances
              </button>
            </div>

            {/* Tab Contents */}
            {activeProfileTab === 'info' && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 border-b pb-1">Emergency Contact</div>
                  <div>Name: {selectedEmployee.emergencyContact?.name || 'N/A'}</div>
                  <div>Relationship: {selectedEmployee.emergencyContact?.relationship || 'N/A'}</div>
                  <div>Phone: {selectedEmployee.emergencyContact?.phone || 'N/A'}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 border-b pb-1">Work Location & Cost Center</div>
                  <div>Location: {selectedEmployee.location}</div>
                  <div>Cost Center: {selectedEmployee.costCenter}</div>
                  <div>Work Schedule: {selectedEmployee.workSchedule}</div>
                </div>
              </div>
            )}

            {activeProfileTab === 'financial' && (
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 border-b pb-1">Bank Information</div>
                  <div>Bank Name: {selectedEmployee.bankInfo?.bankName}</div>
                  <div>Account Number: {selectedEmployee.bankInfo?.accountNumber}</div>
                  <div>Routing Number: {selectedEmployee.bankInfo?.routingNumber}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 border-b pb-1">Tax Setup</div>
                  <div>Tax ID / SSN: {selectedEmployee.taxInfo?.taxId}</div>
                  <div>Filing Status: {selectedEmployee.taxInfo?.filingStatus}</div>
                  <div>Annual Salary: ${selectedEmployee.salary.toLocaleString()}</div>
                </div>
              </div>
            )}

            {activeProfileTab === 'docs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Employee Uploaded Records</span>
                  <button
                    onClick={() => addEmployeeDocument(selectedEmployee.id, 'Contract_Update.pdf', 'Contract', '#')}
                    className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Document
                  </button>
                </div>

                {selectedEmployee.documents.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-lg">
                    No documents uploaded yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedEmployee.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-500" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{doc.name}</div>
                            <div className="text-[10px] text-slate-400">{doc.type} • Uploaded {doc.uploadedAt}</div>
                          </div>
                        </div>
                        <a href={doc.url} className="text-indigo-600 hover:underline text-xs">Download</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeProfileTab === 'leave' && (
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg">
                  <div className="text-slate-500 font-semibold">Annual Leave</div>
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{selectedEmployee.leaveBalance.annual} days</div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                  <div className="text-slate-500 font-semibold">Sick Leave</div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{selectedEmployee.leaveBalance.sick} days</div>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg">
                  <div className="text-slate-500 font-semibold">Personal Leave</div>
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{selectedEmployee.leaveBalance.personal} days</div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Add Employee Form Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Employee"
        subtitle="Create employee profile and auto-generate credentials"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">First Name *</label>
              <input
                type="text"
                required
                value={newEmpForm.firstName}
                onChange={(e) => setNewEmpForm({ ...newEmpForm, firstName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={newEmpForm.lastName}
                onChange={(e) => setNewEmpForm({ ...newEmpForm, lastName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={newEmpForm.email}
                onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={newEmpForm.phone}
                onChange={(e) => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Department</label>
              <select
                value={newEmpForm.department}
                onChange={(e) => setNewEmpForm({ ...newEmpForm, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Product & Design">Product & Design</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Position Title</label>
              <input
                type="text"
                required
                value={newEmpForm.position}
                onChange={(e) => setNewEmpForm({ ...newEmpForm, position: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Annual Salary ($)</label>
              <input
                type="number"
                required
                value={newEmpForm.salary}
                onChange={(e) => setNewEmpForm({ ...newEmpForm, salary: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Hire Date</label>
              <input
                type="date"
                required
                value={newEmpForm.hireDate}
                onChange={(e) => setNewEmpForm({ ...newEmpForm, hireDate: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-semibold"
            >
              Onboard Employee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
