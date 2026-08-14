import React, { useState } from 'react';
import {
  DollarSign,
  FileText,
  CheckCircle2,
  Calendar,
  CreditCard,
  Send,
  Building,
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { PayslipPDFModal } from '../components/common/PayslipPDFModal';
import { Payslip } from '../types';
import { ETHIOPIAN_INCOME_TAX_BRACKETS, calculateEthiopianIncomeTax } from '../lib/taxUtils';

export const PayrollView: React.FC = () => {
  const { payslips = [], employees = [], runPayroll } = useData();
  const safePayslips = payslips || [];
  const { canManagePayroll } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [showTaxBrackets, setShowTaxBrackets] = useState(true);
  
  // Tax Calculator State
  const [calcInput, setCalcInput] = useState<number>(12000);
  const calcResult = calculateEthiopianIncomeTax(calcInput);

  // Success notification banner for running payroll
  const [payrollSuccessMsg, setPayrollSuccessMsg] = useState<string | null>(null);

  // Total metrics
  const totalGross = safePayslips.reduce((acc, p) => acc + (p?.grossPay || 0), 0);
  const totalNet = safePayslips.reduce((acc, p) => acc + (p?.netPay || 0), 0);
  const totalDeductions = safePayslips.reduce((acc, p) => acc + (p?.taxDeductions || 0), 0);

  const filteredPayslips = safePayslips.filter(
    (p) =>
      (p?.periodStart?.startsWith(selectedMonth) || (p as any)?.payPeriod === selectedMonth) &&
      ((p?.employeeName || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
        (p?.department || '').toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const handleViewPayslip = (p: Payslip) => {
    setSelectedPayslip(p);
    setIsPdfOpen(true);
  };

  const handleRunPayroll = () => {
    const startDate = `${selectedMonth}-01`;
    const endDate = `${selectedMonth}-30`;
    const payDate = `${selectedMonth}-30`;
    runPayroll(startDate, endDate, payDate);
    setPayrollSuccessMsg(`Monthly payroll for ${selectedMonth} executed successfully applying Proclamation No. 1395/2025 income tax formulas.`);
    setTimeout(() => setPayrollSuccessMsg(null), 5000);
  };

  return (
    <div className="space-y-6">
      {payrollSuccessMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{payrollSuccessMsg}</span>
          </div>
          <button onClick={() => setPayrollSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Payroll & Compensation Processing
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 rounded-md">
              Proc. No. 1395/2025
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage salary runs, allowances, statutory Ethiopian income tax withholdings, and compliant payslip exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
            </select>
          </div>

          {canManagePayroll && (
            <button
              onClick={handleRunPayroll}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Run Monthly Payroll
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Gross Disbursement"
          value={`ETB ${Math.round(totalGross).toLocaleString()}`}
          subtitle="Before tax & statutory deductions"
          icon={<DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBgColor="bg-emerald-50 dark:bg-emerald-950/40"
        />
        <StatCard
          title="Net Salary Paid Out"
          value={`ETB ${Math.round(totalNet).toLocaleString()}`}
          subtitle="Direct bank deposit total"
          icon={<CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          iconBgColor="bg-indigo-50 dark:bg-indigo-950/40"
        />
        <StatCard
          title="Total Employment Tax Withheld"
          value={`ETB ${Math.round(totalDeductions).toLocaleString()}`}
          subtitle="Proc. No. 1395/2025 Income Tax"
          icon={<Building className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          iconBgColor="bg-amber-50 dark:bg-amber-950/40"
        />
      </div>

      {/* Ethiopian Income Tax Schedule Card & Calculator */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <button
          onClick={() => setShowTaxBrackets(!showTaxBrackets)}
          className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Ethiopia Employment Income Tax Brackets (Proclamation No. 1395/2025)
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Formula: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">(Monthly Taxable Income × Tax Rate) - Fixed Deduction</span>
              </p>
            </div>
          </div>
          {showTaxBrackets ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showTaxBrackets && (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Brackets Table */}
              <div className="lg:col-span-2 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="p-2.5">Monthly Taxable Income (ETB)</th>
                      <th className="p-2.5">Tax Rate</th>
                      <th className="p-2.5">Fixed Shortcut Deduction (ETB)</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {ETHIOPIAN_INCOME_TAX_BRACKETS.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-medium">{b.rangeLabel}</td>
                        <td className="p-2.5 font-semibold text-indigo-600 dark:text-indigo-400">{b.ratePercent}%</td>
                        <td className="p-2.5 font-mono">{b.fixedDeduction.toLocaleString()} ETB</td>
                        <td className="p-2.5 font-medium text-slate-500">{b.notes || 'Taxable'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculator Widget */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                  <Calculator className="w-4 h-4 text-indigo-500" />
                  <span>Interactive Tax Simulator</span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Enter Monthly Taxable Gross (ETB):
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={calcInput}
                    onChange={(e) => setCalcInput(Number(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Bracket Range:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{calcResult.applicableBracket.rangeLabel}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Tax Rate / Deduction:</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {calcResult.taxRatePercent}% - {calcResult.fixedDeduction} ETB
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold">
                    <span className="text-slate-900 dark:text-slate-100">Calculated Tax:</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400">
                      {calcResult.taxAmount.toLocaleString()} ETB
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Effective Tax Rate:</span>
                    <span className="font-mono">{calcResult.effectiveTaxRatePercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Filter employee or department..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full sm:w-64 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing {filteredPayslips.length} payslips for period: {selectedMonth}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Employee</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Basic Salary</th>
                <th className="p-3.5">Allowances</th>
                <th className="p-3.5">Income Tax (Proc 1395)</th>
                <th className="p-3.5">Net Payable</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPayslips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                    No payslips found for {selectedMonth}. Click <span className="font-semibold text-emerald-600 dark:text-emerald-400">"Run Monthly Payroll"</span> above to generate payslips for this period.
                  </td>
                </tr>
              ) : (
                filteredPayslips.map((p) => {
                  const emp = employees.find((e) => e.id === p.employeeId || e.employeeId === p.employeeId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={p.employeeName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">{p.employeeName}</div>
                            <div className="text-[10px] text-slate-400">{emp?.position || 'Staff'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-medium">{p.department}</td>
                      <td className="p-3.5 font-mono">ETB {(p.baseSalary || p.grossPay || 0).toLocaleString()}</td>
                      <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400">
                        +ETB {(p.allowances || 0).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-mono text-rose-600 dark:text-rose-400">
                        -ETB {(p.taxDeductions || 0).toLocaleString()}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                        ETB {(p.netPay || 0).toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <Badge variant="success">
                          <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Paid
                        </Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleViewPayslip(p)}
                          className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 rounded-md font-semibold text-[11px] transition-colors inline-flex items-center gap-1 border border-indigo-200/60 dark:border-indigo-800/60"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Payslip PDF
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip PDF Modal */}
      {selectedPayslip && (
        <PayslipPDFModal
          isOpen={isPdfOpen}
          onClose={() => setIsPdfOpen(false)}
          payslip={selectedPayslip}
        />
      )}
    </div>
  );
};
