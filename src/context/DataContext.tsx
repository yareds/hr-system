import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateEthiopianIncomeTax } from '../lib/taxUtils';
import {
  Employee,
  Department,
  Position,
  AttendanceRecord,
  LeaveRequest,
  Payslip,
  PerformanceReview,
  JobOpening,
  Candidate,
  Asset,
  Announcement,
  AuditLog,
  CompanySettings,
  NotificationItem,
  LeaveStatus,
  CandidateStatus,
  AssetStatus,
  EmploymentStatus,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_DEPARTMENTS,
  INITIAL_POSITIONS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_PAYSLIPS,
  INITIAL_PERFORMANCE_REVIEWS,
  INITIAL_JOBS,
  INITIAL_CANDIDATES,
  INITIAL_ASSETS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
} from '../lib/mockData';
import { checkAndSeedFirestore } from '../lib/seedData';

interface DataContextType {
  employees: Employee[];
  departments: Department[];
  positions: Position[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payslips: Payslip[];
  performanceReviews: PerformanceReview[];
  jobs: JobOpening[];
  candidates: Candidate[];
  assets: Asset[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  settings: CompanySettings;
  loading: boolean;

  // Actions
  addEmployee: (empData: Partial<Employee>) => void;
  updateEmployee: (id: string, empData: Partial<Employee>) => void;
  updateEmployeeStatus: (id: string, status: EmploymentStatus) => void;
  addEmployeeDocument: (employeeId: string, docName: string, docType: string, url: string) => void;

  addDepartment: (dept: Partial<Department>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  clockIn: (employeeId: string, employeeName: string, department: string) => void;
  clockOut: (employeeId: string) => void;
  addAttendanceRecord: (record: Partial<AttendanceRecord>) => void;

  submitLeaveRequest: (req: Partial<LeaveRequest>) => void;
  updateLeaveStatus: (id: string, status: LeaveStatus, approverName: string, note?: string) => void;

  runPayroll: (periodStart: string, periodEnd: string, payDate: string) => void;
  
  addPerformanceReview: (review: Partial<PerformanceReview>) => void;
  updatePerformanceReview: (id: string, review: Partial<PerformanceReview>) => void;

  addJobOpening: (job: Partial<JobOpening>) => void;
  addCandidate: (candidate: Partial<Candidate>) => void;
  updateCandidateStatus: (candidateId: string, status: CandidateStatus, notes?: string, interviewDate?: string) => void;

  addAsset: (asset: Partial<Asset>) => void;
  assignAsset: (assetId: string, employeeId: string, employeeName: string) => void;
  returnAsset: (assetId: string) => void;

  addAnnouncement: (announcement: Partial<Announcement>) => void;
  togglePinAnnouncement: (id: string) => void;
  deleteAnnouncement: (id: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  logAction: (userName: string, userRole: any, action: string, module: string, details: string) => void;
  seedInitialData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const HRMS_DATA_VERSION_KEY = 'hrms_data_schema_version';
const CURRENT_DATA_VERSION = 'v2026_etex_salaries_under_100k_v4';

// Check if localStorage contains outdated non-Ethiopian names, legacy salaries > 100,000 or older schema version
const checkAndMigrateLocalStorage = () => {
  try {
    const version = localStorage.getItem(HRMS_DATA_VERSION_KEY);
    const rawEmps = localStorage.getItem('hrms_employees') || '';
    const hasOldNames =
      rawEmps.includes('Sarah Jenkins') ||
      rawEmps.includes('Elena Rostova') ||
      rawEmps.includes('Michael Chang') ||
      rawEmps.includes('San Francisco') ||
      rawEmps.includes('Marcus Vance');

    let hasHighSalary = false;
    try {
      const parsed = JSON.parse(rawEmps);
      if (Array.isArray(parsed) && parsed.some((e: any) => e.salary > 100000)) {
        hasHighSalary = true;
      }
    } catch {}

    if (version !== CURRENT_DATA_VERSION || hasOldNames || hasHighSalary) {
      localStorage.setItem(HRMS_DATA_VERSION_KEY, CURRENT_DATA_VERSION);
      localStorage.setItem('hrms_employees', JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem('hrms_departments', JSON.stringify(INITIAL_DEPARTMENTS));
      localStorage.setItem('hrms_positions', JSON.stringify(INITIAL_POSITIONS));
      localStorage.setItem('hrms_attendance', JSON.stringify(INITIAL_ATTENDANCE));
      localStorage.setItem('hrms_leave', JSON.stringify(INITIAL_LEAVE_REQUESTS));
      localStorage.setItem('hrms_payslips', JSON.stringify(INITIAL_PAYSLIPS));
      localStorage.setItem('hrms_reviews', JSON.stringify(INITIAL_PERFORMANCE_REVIEWS));
      localStorage.setItem('hrms_jobs', JSON.stringify(INITIAL_JOBS));
      localStorage.setItem('hrms_candidates', JSON.stringify(INITIAL_CANDIDATES));
      localStorage.setItem('hrms_assets', JSON.stringify(INITIAL_ASSETS));
      localStorage.setItem('hrms_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
      localStorage.setItem('hrms_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));
      localStorage.setItem('hrms_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem('hrms_settings', JSON.stringify(INITIAL_SETTINGS));
    }
  } catch (e) {
    console.warn('Storage migration skipped:', e);
  }
};

// Run migration immediately
if (typeof window !== 'undefined') {
  checkAndMigrateLocalStorage();
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  // Helper to safely load array state from localStorage
  const safeParseArray = <T,>(key: string, fallback: T[]): T[] => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
    } catch {
      return fallback;
    }
  };

  // State initialization with localStorage or default mockData
  const [employees, setEmployees] = useState<Employee[]>(() => safeParseArray('hrms_employees', INITIAL_EMPLOYEES));
  const [departments, setDepartments] = useState<Department[]>(() => safeParseArray('hrms_departments', INITIAL_DEPARTMENTS));
  const [positions, setPositions] = useState<Position[]>(() => safeParseArray('hrms_positions', INITIAL_POSITIONS));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => safeParseArray('hrms_attendance', INITIAL_ATTENDANCE));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => safeParseArray('hrms_leave', INITIAL_LEAVE_REQUESTS));
  const [payslips, setPayslips] = useState<Payslip[]>(() => safeParseArray('hrms_payslips', INITIAL_PAYSLIPS));
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>(() => safeParseArray('hrms_reviews', INITIAL_PERFORMANCE_REVIEWS));
  const [jobs, setJobs] = useState<JobOpening[]>(() => safeParseArray('hrms_jobs', INITIAL_JOBS));
  const [candidates, setCandidates] = useState<Candidate[]>(() => safeParseArray('hrms_candidates', INITIAL_CANDIDATES));
  const [assets, setAssets] = useState<Asset[]>(() => safeParseArray('hrms_assets', INITIAL_ASSETS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => safeParseArray('hrms_announcements', INITIAL_ANNOUNCEMENTS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => safeParseArray('hrms_audit_logs', INITIAL_AUDIT_LOGS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => safeParseArray('hrms_notifications', INITIAL_NOTIFICATIONS));

  const [settings, setSettings] = useState<CompanySettings>(() => {
    try {
      const saved = localStorage.getItem('hrms_settings');
      if (!saved) return INITIAL_SETTINGS;
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === 'object' ? parsed : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('hrms_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hrms_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('hrms_positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('hrms_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('hrms_leave', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('hrms_payslips', JSON.stringify(payslips));
  }, [payslips]);

  useEffect(() => {
    localStorage.setItem('hrms_reviews', JSON.stringify(performanceReviews));
  }, [performanceReviews]);

  useEffect(() => {
    localStorage.setItem('hrms_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('hrms_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('hrms_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('hrms_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('hrms_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('hrms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('hrms_settings', JSON.stringify(settings));
  }, [settings]);

  // Seed firestore background check
  useEffect(() => {
    checkAndSeedFirestore().finally(() => setLoading(false));
  }, []);

  // Helper audit logger
  const logAction = (userName: string, userRole: any, action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      userName: userName || 'System User',
      userRole: userRole || 'Super Admin',
      action,
      module,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Employee Actions
  const addEmployee = (empData: Partial<Employee>) => {
    const count = employees.length + 1001;
    const empIdStr = `EMP-${count}`;
    const newEmp: Employee = {
      id: 'emp-' + Date.now(),
      employeeId: empData.employeeId || empIdStr,
      firstName: empData.firstName || 'New',
      lastName: empData.lastName || 'Employee',
      fullName: `${empData.firstName || 'New'} ${empData.lastName || 'Employee'}`,
      email: empData.email || `emp.${Date.now()}@etex.com`,
      phone: empData.phone || '+251 91 100 0000',
      gender: empData.gender || 'Other',
      dateOfBirth: empData.dateOfBirth || '1995-01-01',
      photoUrl: empData.photoUrl || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`,
      address: empData.address || 'Bole Sub-City, Addis Ababa, Ethiopia',
      emergencyContact: empData.emergencyContact || { name: 'Contact', relationship: 'Relative', phone: '+251 91 100 0000' },
      department: empData.department || 'Engineering',
      position: empData.position || 'Software Engineer',
      managerId: empData.managerId,
      managerName: empData.managerName,
      employmentType: empData.employmentType || 'Full-Time',
      hireDate: empData.hireDate || new Date().toISOString().split('T')[0],
      employmentStatus: 'Active',
      salary: empData.salary || 65000,
      payType: empData.payType || 'Salary',
      hourlyRate: empData.hourlyRate || 375,
      payFrequency: empData.payFrequency || 'Monthly',
      costCenter: empData.costCenter || 'CC-101',
      location: empData.location || 'HQ - Addis Ababa',
      bankInfo: empData.bankInfo || { bankName: 'Commercial Bank of Ethiopia', accountNumber: '****1234', routingNumber: 'CBE-001' },
      taxInfo: empData.taxInfo || { taxId: 'ET-TIN-1234', filingStatus: 'Single', allowances: 0 },
      workSchedule: empData.workSchedule || 'Mon - Fri, 8:30 AM - 5:30 PM',
      documents: empData.documents || [],
      leaveBalance: empData.leaveBalance || { annual: 20, sick: 10, personal: 5, maternity: 120, paternity: 10, bereavement: 5 },
      notes: empData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setEmployees((prev) => [newEmp, ...prev]);
    logAction('Admin', 'HR Manager', 'Added New Employee', 'Employee Management', `Added ${newEmp.fullName} (${newEmp.employeeId})`);
  };

  const updateEmployee = (id: string, empData: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id || e.employeeId === id) {
          const updated = { ...e, ...empData, updatedAt: new Date().toISOString() };
          if (empData.firstName || empData.lastName) {
            updated.fullName = `${updated.firstName} ${updated.lastName}`;
          }
          return updated;
        }
        return e;
      })
    );
    logAction('Admin', 'HR Manager', 'Updated Employee', 'Employee Management', `Updated profile for ID: ${id}`);
  };

  const updateEmployeeStatus = (id: string, status: EmploymentStatus) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id || e.employeeId === id ? { ...e, employmentStatus: status, updatedAt: new Date().toISOString() } : e))
    );
    logAction('Admin', 'HR Manager', `Changed Status to ${status}`, 'Employee Management', `Updated status for employee ID ${id}`);
  };

  const addEmployeeDocument = (employeeId: string, docName: string, docType: string, url: string) => {
    const newDoc = {
      id: 'doc-' + Date.now(),
      name: docName,
      type: docType,
      url,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === employeeId || e.employeeId === employeeId) {
          return { ...e, documents: [newDoc, ...e.documents] };
        }
        return e;
      })
    );
    logAction('Admin', 'HR Manager', 'Uploaded Employee Document', 'Employee Management', `Uploaded ${docName} for employee ID ${employeeId}`);
  };

  // Department Actions
  const addDepartment = (dept: Partial<Department>) => {
    const newDept: Department = {
      id: 'dept-' + Date.now(),
      name: dept.name || 'New Department',
      code: dept.code || 'DEPT',
      managerId: dept.managerId,
      managerName: dept.managerName,
      costCenter: dept.costCenter || 'CC-200',
      location: dept.location || 'HQ - Addis Ababa',
      description: dept.description || '',
      employeeCount: 0,
    };
    setDepartments((prev) => [...prev, newDept]);
    logAction('Admin', 'HR Manager', 'Created Department', 'Organization', `Created department ${newDept.name}`);
  };

  const updateDepartment = (id: string, dept: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...dept } : d)));
  };

  const deleteDepartment = (id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  // Attendance Actions
  const clockIn = (employeeId: string, employeeName: string, department: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if already clocked in today
    const existingIndex = attendance.findIndex((a) => a.employeeId === employeeId && a.date === todayStr);

    if (existingIndex >= 0) {
      setAttendance((prev) =>
        prev.map((a, idx) => (idx === existingIndex ? { ...a, clockIn: timeStr, status: 'Present' } : a))
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: 'att-' + Date.now(),
        employeeId,
        employeeName,
        department,
        date: todayStr,
        clockIn: timeStr,
        breakDurationMinutes: 0,
        totalHours: 0,
        overtimeHours: 0,
        status: 'Present',
      };
      setAttendance((prev) => [newRecord, ...prev]);
    }
    logAction(employeeName, 'Employee', 'Clocked In', 'Attendance', `${employeeName} clocked in at ${timeStr}`);
  };

  const clockOut = (employeeId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendance((prev) =>
      prev.map((a) => {
        if (a.employeeId === employeeId && a.date === todayStr) {
          // Calculate approx hours (standard 8 hour day simulation)
          return {
            ...a,
            clockOut: timeStr,
            totalHours: 8.0,
            overtimeHours: 0,
          };
        }
        return a;
      })
    );
    logAction('Employee', 'Employee', 'Clocked Out', 'Attendance', `Employee ${employeeId} clocked out at ${timeStr}`);
  };

  const addAttendanceRecord = (record: Partial<AttendanceRecord>) => {
    const newRecord: AttendanceRecord = {
      id: 'att-' + Date.now(),
      employeeId: record.employeeId || 'EMP-1001',
      employeeName: record.employeeName || 'Employee',
      department: record.department || 'General',
      date: record.date || new Date().toISOString().split('T')[0],
      clockIn: record.clockIn || '09:00 AM',
      clockOut: record.clockOut || '05:00 PM',
      breakDurationMinutes: record.breakDurationMinutes || 60,
      totalHours: record.totalHours || 8,
      overtimeHours: record.overtimeHours || 0,
      status: record.status || 'Present',
      notes: record.notes,
    };
    setAttendance((prev) => [newRecord, ...prev]);
  };

  // Leave Actions
  const submitLeaveRequest = (req: Partial<LeaveRequest>) => {
    const newReq: LeaveRequest = {
      id: 'lv-' + Date.now(),
      employeeId: req.employeeId || 'EMP-1001',
      employeeName: req.employeeName || 'Employee',
      department: req.department || 'Engineering',
      leaveType: req.leaveType || 'Annual',
      startDate: req.startDate || new Date().toISOString().split('T')[0],
      endDate: req.endDate || new Date().toISOString().split('T')[0],
      totalDays: req.totalDays || 1,
      reason: req.reason || 'Personal time off',
      status: 'Pending',
      appliedAt: new Date().toISOString(),
    };

    setLeaveRequests((prev) => [newReq, ...prev]);

    // Send notification to HR / Manager
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      recipientId: 'EMP-1001',
      title: 'New Leave Request Submitted',
      message: `${newReq.employeeName} submitted a ${newReq.totalDays}-day ${newReq.leaveType} leave request.`,
      type: 'leave',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
    logAction(newReq.employeeName, 'Employee', 'Submitted Leave Request', 'Leave Management', `Requested ${newReq.totalDays} days ${newReq.leaveType} leave`);
  };

  const updateLeaveStatus = (id: string, status: LeaveStatus, approverName: string, note?: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          // If approved, deduct leave balance from employee
          if (status === 'Approved' && l.status !== 'Approved') {
            const leaveKey = l.leaveType.toLowerCase() as keyof typeof employees[0]['leaveBalance'];
            setEmployees((empList) =>
              empList.map((e) => {
                if (e.employeeId === l.employeeId || e.id === l.employeeId) {
                  const currentVal = e.leaveBalance[leaveKey] ?? 10;
                  return {
                    ...e,
                    leaveBalance: {
                      ...e.leaveBalance,
                      [leaveKey]: Math.max(0, currentVal - l.totalDays),
                    },
                  };
                }
                return e;
              })
            );
          }
          return {
            ...l,
            status,
            approverName,
            approverNote: note,
          };
        }
        return l;
      })
    );

    logAction(approverName, 'Manager', `${status} Leave Request`, 'Leave Management', `Leave request ${id} mark as ${status}`);
  };

  // Payroll Actions
  const runPayroll = (periodStart: string, periodEnd: string, payDate: string) => {
    const runId = 'pr-' + Date.now();
    const newPayslips: Payslip[] = employees
      .filter((e) => e.employmentStatus === 'Active')
      .map((e) => {
        const monthlyBase = e.payType === 'Salary' ? e.salary : e.hourlyRate * 160;
        const allowances = 3000;
        const gross = monthlyBase + allowances;
        
        // Ethiopia Federal Income Tax Amendment Proclamation No. 1395/2025
        const taxRes = calculateEthiopianIncomeTax(gross);
        const tax = taxRes.taxAmount;
        const retirement = gross * 0.07; // Employee Pension (7%)
        const other = 500;
        const totalDeductions = tax + retirement + other;
        const net = gross - totalDeductions;

        return {
          id: `ps-${runId}-${e.employeeId}`,
          payrollRunId: runId,
          employeeId: e.employeeId,
          employeeName: e.fullName,
          employeeEmail: e.email,
          department: e.department,
          position: e.position,
          periodStart,
          periodEnd,
          payDate,
          frequency: e.payFrequency,
          baseSalary: Math.round(monthlyBase * 100) / 100,
          hourlyRate: e.hourlyRate,
          hoursWorked: 160,
          overtimePay: 0,
          bonuses: 0,
          commissions: 0,
          allowances,
          grossPay: Math.round(gross * 100) / 100,
          taxDeductions: Math.round(tax * 100) / 100,
          retirementDeductions: Math.round(retirement * 100) / 100,
          otherDeductions: other,
          totalDeductions: Math.round(totalDeductions * 100) / 100,
          netPay: Math.round(net * 100) / 100,
          paymentMethod: 'Direct Deposit',
          bankName: e.bankInfo.bankName || 'Bank',
          accountNumber: e.bankInfo.accountNumber || '****1234',
          status: 'Completed',
        };
      });

    setPayslips((prev) => [...newPayslips, ...prev]);

    // Send notifications to all employees
    const notifs: NotificationItem[] = newPayslips.map((p) => ({
      id: 'notif-' + Date.now() + '-' + p.employeeId,
      recipientId: p.employeeId,
      title: 'Payslip Ready for Download',
      message: `Your payslip for period ${periodStart} to ${periodEnd} is now available. Net Pay: $${p.netPay.toLocaleString()}`,
      type: 'payroll',
      read: false,
      createdAt: new Date().toISOString(),
    }));

    setNotifications((prev) => [...notifs, ...prev]);
    logAction('Payroll Officer', 'Payroll Officer', 'Executed Payroll Run', 'Payroll', `Generated ${newPayslips.length} payslips for period ${periodStart} - ${periodEnd}`);
  };

  // Performance Review
  const addPerformanceReview = (review: Partial<PerformanceReview>) => {
    const newRev: PerformanceReview = {
      id: 'rev-' + Date.now(),
      employeeId: review.employeeId || 'EMP-1001',
      employeeName: review.employeeName || 'Employee',
      reviewerId: review.reviewerId || 'EMP-1002',
      reviewerName: review.reviewerName || 'Manager',
      reviewPeriod: review.reviewPeriod || 'Q3 2026',
      overallRating: review.overallRating || 4.0,
      goals: review.goals || [],
      feedback: review.feedback || 'Great performance overall.',
      strengths: review.strengths || 'Strong commitment & execution',
      improvements: review.improvements || 'Focus on strategic delegation',
      status: review.status || 'Completed',
      reviewDate: new Date().toISOString().split('T')[0],
    };
    setPerformanceReviews((prev) => [newRev, ...prev]);
    logAction('Manager', 'Department Manager', 'Submitted Performance Review', 'Performance', `Completed review for ${newRev.employeeName}`);
  };

  const updatePerformanceReview = (id: string, review: Partial<PerformanceReview>) => {
    setPerformanceReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...review } : r)));
  };

  // Recruitment Actions
  const addJobOpening = (job: Partial<JobOpening>) => {
    const newJob: JobOpening = {
      id: 'job-' + Date.now(),
      title: job.title || 'New Position',
      department: job.department || 'Engineering',
      location: job.location || 'HQ - Addis Ababa',
      employmentType: job.employmentType || 'Full-Time',
      status: 'Open',
      applicantsCount: 0,
      description: job.description || 'Job role overview.',
      requirements: job.requirements || ['Degree in relevant field'],
      postedDate: new Date().toISOString().split('T')[0],
    };
    setJobs((prev) => [newJob, ...prev]);
    logAction('HR Manager', 'HR Manager', 'Posted New Job Opening', 'Recruitment', `Posted opening for ${newJob.title}`);
  };

  const addCandidate = (candidate: Partial<Candidate>) => {
    const newCand: Candidate = {
      id: 'cand-' + Date.now(),
      jobId: candidate.jobId || 'job-1',
      jobTitle: candidate.jobTitle || 'Job Opening',
      name: candidate.name || 'Candidate Name',
      email: candidate.email || 'cand@gmail.com',
      phone: candidate.phone || '+251 91 100 0000',
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: candidate.notes || '',
    };
    setCandidates((prev) => [newCand, ...prev]);

    // Update job count
    setJobs((prev) =>
      prev.map((j) => (j.id === newCand.jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );
  };

  const updateCandidateStatus = (candidateId: string, status: CandidateStatus, notes?: string, interviewDate?: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            status,
            notes: notes || c.notes,
            interviewDate: interviewDate || c.interviewDate,
          };
        }
        return c;
      })
    );
    logAction('HR Manager', 'HR Manager', `Candidate Status Changed to ${status}`, 'Recruitment', `Candidate ID: ${candidateId}`);
  };

  // Asset Actions
  const addAsset = (asset: Partial<Asset>) => {
    const newAsset: Asset = {
      id: 'ast-' + Date.now(),
      assetTag: asset.assetTag || `AST-${Date.now().toString().slice(-4)}`,
      name: asset.name || 'Hardware Equipment',
      category: asset.category || 'Laptop',
      serialNumber: asset.serialNumber || 'SN-' + Date.now(),
      status: asset.status || 'Available',
      value: asset.value || 1000,
      notes: asset.notes || '',
    };
    setAssets((prev) => [newAsset, ...prev]);
    logAction('Admin', 'HR Manager', 'Registered New Asset', 'Asset Management', `Added asset ${newAsset.assetTag} (${newAsset.name})`);
  };

  const assignAsset = (assetId: string, employeeId: string, employeeName: string) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          return {
            ...a,
            status: 'Assigned',
            assignedEmployeeId: employeeId,
            assignedEmployeeName: employeeName,
            assignedDate: new Date().toISOString().split('T')[0],
          };
        }
        return a;
      })
    );
    logAction('Admin', 'HR Manager', 'Assigned Asset', 'Asset Management', `Assigned asset ${assetId} to ${employeeName}`);
  };

  const returnAsset = (assetId: string) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          return {
            ...a,
            status: 'Available',
            assignedEmployeeId: undefined,
            assignedEmployeeName: undefined,
            assignedDate: undefined,
          };
        }
        return a;
      })
    );
    logAction('Admin', 'HR Manager', 'Returned Asset', 'Asset Management', `Asset ${assetId} returned to inventory`);
  };

  // Announcements
  const addAnnouncement = (anc: Partial<Announcement>) => {
    const newAnc: Announcement = {
      id: 'anc-' + Date.now(),
      title: anc.title || 'Announcement',
      content: anc.content || '',
      author: anc.author || 'HR Department',
      category: anc.category || 'General',
      isPinned: anc.isPinned || false,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    logAction('Admin', 'HR Manager', 'Created Announcement', 'Announcements', `Posted: ${newAnc.title}`);
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Settings
  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAction('Super Admin', 'Super Admin', 'Updated System Settings', 'Settings', 'Modified company payroll & leave settings');
  };

  // Reseed all state & storage to clean Ethiopian defaults
  const seedInitialData = async (): Promise<void> => {
    try {
      localStorage.setItem(HRMS_DATA_VERSION_KEY, CURRENT_DATA_VERSION);
      localStorage.setItem('hrms_employees', JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem('hrms_departments', JSON.stringify(INITIAL_DEPARTMENTS));
      localStorage.setItem('hrms_positions', JSON.stringify(INITIAL_POSITIONS));
      localStorage.setItem('hrms_attendance', JSON.stringify(INITIAL_ATTENDANCE));
      localStorage.setItem('hrms_leave', JSON.stringify(INITIAL_LEAVE_REQUESTS));
      localStorage.setItem('hrms_payslips', JSON.stringify(INITIAL_PAYSLIPS));
      localStorage.setItem('hrms_reviews', JSON.stringify(INITIAL_PERFORMANCE_REVIEWS));
      localStorage.setItem('hrms_jobs', JSON.stringify(INITIAL_JOBS));
      localStorage.setItem('hrms_candidates', JSON.stringify(INITIAL_CANDIDATES));
      localStorage.setItem('hrms_assets', JSON.stringify(INITIAL_ASSETS));
      localStorage.setItem('hrms_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
      localStorage.setItem('hrms_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));
      localStorage.setItem('hrms_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem('hrms_settings', JSON.stringify(INITIAL_SETTINGS));

      setEmployees(INITIAL_EMPLOYEES);
      setDepartments(INITIAL_DEPARTMENTS);
      setPositions(INITIAL_POSITIONS);
      setAttendance(INITIAL_ATTENDANCE);
      setLeaveRequests(INITIAL_LEAVE_REQUESTS);
      setPayslips(INITIAL_PAYSLIPS);
      setPerformanceReviews(INITIAL_PERFORMANCE_REVIEWS);
      setJobs(INITIAL_JOBS);
      setCandidates(INITIAL_CANDIDATES);
      setAssets(INITIAL_ASSETS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setSettings(INITIAL_SETTINGS);

      await checkAndSeedFirestore();
    } catch (e) {
      console.error('Failed to reseed dataset:', e);
    }
  };

  return (
    <DataContext.Provider
      value={{
        employees: Array.isArray(employees) ? employees : [],
        departments: Array.isArray(departments) ? departments : [],
        positions: Array.isArray(positions) ? positions : [],
        attendance: Array.isArray(attendance) ? attendance : [],
        leaveRequests: Array.isArray(leaveRequests) ? leaveRequests : [],
        payslips: Array.isArray(payslips) ? payslips : [],
        performanceReviews: Array.isArray(performanceReviews) ? performanceReviews : [],
        jobs: Array.isArray(jobs) ? jobs : [],
        candidates: Array.isArray(candidates) ? candidates : [],
        assets: Array.isArray(assets) ? assets : [],
        announcements: Array.isArray(announcements) ? announcements : [],
        auditLogs: Array.isArray(auditLogs) ? auditLogs : [],
        notifications: Array.isArray(notifications) ? notifications : [],
        settings,
        loading,
        addEmployee,
        updateEmployee,
        updateEmployeeStatus,
        addEmployeeDocument,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        clockIn,
        clockOut,
        addAttendanceRecord,
        submitLeaveRequest,
        updateLeaveStatus,
        runPayroll,
        addPerformanceReview,
        updatePerformanceReview,
        addJobOpening,
        addCandidate,
        updateCandidateStatus,
        addAsset,
        assignAsset,
        returnAsset,
        addAnnouncement,
        togglePinAnnouncement,
        deleteAnnouncement,
        markNotificationRead,
        markAllNotificationsRead,
        updateSettings,
        logAction,
        seedInitialData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
