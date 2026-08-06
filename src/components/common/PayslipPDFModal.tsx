import React from 'react';
import { Download, Printer, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Payslip } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from './Modal';

interface PayslipPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: Payslip | null;
}

export const PayslipPDFModal: React.FC<PayslipPDFModalProps> = ({
  isOpen,
  onClose,
  payslip,
}) => {
  const { settings } = useData();

  if (!payslip) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Company Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(settings.companyName || 'Etex Technologies Inc.', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(settings.address || 'San Francisco, CA', 14, 26);
    doc.text(`Tax ID: ${settings.taxId}`, 14, 31);

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('CONFIDENTIAL PAYSLIP', 130, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Pay Period: ${payslip.periodStart} to ${payslip.periodEnd}`, 130, 26);
    doc.text(`Pay Date: ${payslip.payDate}`, 130, 31);
    doc.text(`Payslip ID: ${payslip.id}`, 130, 36);

    doc.line(14, 42, 196, 42);

    // Employee Summary Table
    autoTable(doc, {
      startY: 46,
      head: [['Employee Information', 'Employment Details']],
      body: [
        [`Name: ${payslip.employeeName}`, `Department: ${payslip.department}`],
        [`Employee ID: ${payslip.employeeId}`, `Position: ${payslip.position}`],
        [`Email: ${payslip.employeeEmail}`, `Pay Frequency: ${payslip.frequency}`],
      ],
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [240, 243, 246], fontStyle: 'bold' },
    });

    const currentY = (doc as any).lastAutoTable.finalY + 8;

    // Earnings & Deductions Table
    autoTable(doc, {
      startY: currentY,
      head: [['Earnings Breakdown', 'Amount (ETB)', 'Deductions Breakdown', 'Amount (ETB)']],
      body: [
        ['Base Salary / Earnings', `ETB ${payslip.baseSalary.toLocaleString()}`, 'Income Tax (Proc 1395/2025)', `ETB ${payslip.taxDeductions.toLocaleString()}`],
        ['Overtime Pay', `ETB ${payslip.overtimePay.toLocaleString()}`, 'Employee Pension (7%)', `ETB ${payslip.retirementDeductions.toLocaleString()}`],
        ['Bonuses', `ETB ${payslip.bonuses.toLocaleString()}`, 'Other Deductions', `ETB ${payslip.otherDeductions.toLocaleString()}`],
        ['Allowances', `ETB ${payslip.allowances.toLocaleString()}`, '', ''],
        ['Gross Earnings', `ETB ${payslip.grossPay.toLocaleString()}`, 'Total Deductions', `ETB ${payslip.totalDeductions.toLocaleString()}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Net Pay Banner
    doc.setFillColor(240, 253, 244);
    doc.rect(14, finalY, 182, 16, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text(`NET PAY DISBURSED: ETB ${payslip.netPay.toLocaleString()}`, 20, finalY + 11);

    // Bank Details
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Paid via ${payslip.paymentMethod} to ${payslip.bankName} (${payslip.accountNumber})`, 14, finalY + 25);
    doc.text('This is a computer-generated document. No signature required.', 14, finalY + 31);

    doc.save(`Payslip_${payslip.employeeId}_${payslip.periodStart}.pdf`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Payslip Statement"
      subtitle={`Pay Period: ${payslip.periodStart} to ${payslip.periodEnd}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Printable Card Area */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{settings.companyName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{settings.address}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Payslip Statement
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Pay Date: {payslip.payDate}</p>
            </div>
          </div>

          {/* Employee & Pay Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="text-slate-400 font-semibold uppercase tracking-wider">Employee Info</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{payslip.employeeName}</div>
              <div className="text-slate-500 dark:text-slate-400">ID: {payslip.employeeId}</div>
              <div className="text-slate-500 dark:text-slate-400">{payslip.position}</div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="text-slate-400 font-semibold uppercase tracking-wider">Payroll Info</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{payslip.department}</div>
              <div className="text-slate-500 dark:text-slate-400">Frequency: {payslip.frequency}</div>
              <div className="text-slate-500 dark:text-slate-400">Hours Worked: {payslip.hoursWorked} hrs</div>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/80 font-semibold text-xs text-slate-700 dark:text-slate-300">
                Earnings Breakdown
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Base Earnings</span>
                  <span className="font-mono">ETB {payslip.baseSalary.toLocaleString()}</span>
                </div>
                {payslip.overtimePay > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Overtime Pay</span>
                    <span className="font-mono">ETB {payslip.overtimePay.toLocaleString()}</span>
                  </div>
                )}
                {payslip.bonuses > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Bonuses</span>
                    <span className="font-mono">ETB {payslip.bonuses.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Allowances</span>
                  <span className="font-mono">ETB {payslip.allowances.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-slate-100">
                  <span>Gross Earnings</span>
                  <span className="font-mono">ETB {payslip.grossPay.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/80 font-semibold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Deductions & Taxes</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Proc No. 1395/2025</span>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Employment Income Tax</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">ETB {payslip.taxDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Employee Pension (7%)</span>
                  <span className="font-mono">ETB {payslip.retirementDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Other Deductions</span>
                  <span className="font-mono">ETB {payslip.otherDeductions.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-slate-100">
                  <span>Total Deductions</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    -ETB {payslip.totalDeductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay Callout */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                Net Disbursed Pay
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
                Deposited to {payslip.bankName} ({payslip.accountNumber})
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 font-mono">
              ETB {payslip.netPay.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" /> Download Official PDF
          </button>
        </div>
      </div>
    </Modal>
  );
};
