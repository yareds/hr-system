import React from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, PieChart, Users, DollarSign, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';

export const ReportsView: React.FC = () => {
  const { employees, payslips, leaveRequests } = useData();

  const handleDownloadCSV = (reportName: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (reportName === 'Headcount') {
      csvContent += 'Employee ID,Full Name,Email,Department,Designation,Status\n';
      employees.forEach((e) => {
        csvContent += `${e.employeeId},"${e.fullName}",${e.email},${e.department},${e.designation},${e.employmentStatus}\n`;
      });
    } else if (reportName === 'Payroll') {
      csvContent += 'Employee Name,Department,Pay Period,Basic Salary,Allowances,Deductions,Net Pay\n';
      payslips.forEach((p) => {
        csvContent += `"${p.employeeName}",${p.department},${p.payPeriod},${p.basicSalary},${p.allowances},${p.taxDeductions},${p.netPay}\n`;
      });
    } else {
      csvContent += 'Employee Name,Department,Leave Type,Start Date,End Date,Days,Status\n';
      leaveRequests.forEach((l) => {
        csvContent += `"${l.employeeName}",${l.department},${l.leaveType},${l.startDate},${l.endDate},${l.totalDays},${l.status}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${reportName}_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Executive Reports & Analytics Export
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Export structured CSV data files for payroll compliance, attendance audits, and headcount tracking.
          </p>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Workforce Census Report</h3>
              <p className="text-xs text-slate-500">{employees.length} records ready</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Full directory dump including contact details, departments, designations, hire dates, and compensation tiers.
          </p>
          <button
            onClick={() => handleDownloadCSV('Headcount')}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" /> Export CSV Census
          </button>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Payroll Audit Report</h3>
              <p className="text-xs text-slate-500">{payslips.length} payslip entries</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Historical breakdown of gross salaries, tax deductions, bonuses, and net disbursals per employee.
          </p>
          <button
            onClick={() => handleDownloadCSV('Payroll')}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" /> Export Payroll CSV
          </button>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Leave & Absence Logs</h3>
              <p className="text-xs text-slate-500">{leaveRequests.length} requests logged</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Comprehensive audit of annual, sick, and unpaid leave requests along with manager approval timestamps.
          </p>
          <button
            onClick={() => handleDownloadCSV('Leave')}
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" /> Export Leave CSV
          </button>
        </div>
      </div>
    </div>
  );
};
