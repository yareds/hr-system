export type Role = 'Super Admin' | 'HR Manager';

export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
export type EmploymentStatus = 'Active' | 'On Leave' | 'Archived' | 'Terminated';
export type PayFrequency = 'Monthly' | 'Biweekly' | 'Weekly';
export type PayType = 'Salary' | 'Hourly';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
}

export interface TaxInfo {
  taxId: string;
  filingStatus: string;
  allowances: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string; // 'Resume' | 'Offer Letter' | 'Contract' | 'ID' | 'Certificate' | 'Performance Review'
  url: string;
  uploadedAt: string;
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  personal: number;
  maternity: number;
  paternity: number;
  bereavement: number;
}

export interface Employee {
  id: string;
  employeeId: string; // e.g. EMP-1001
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  photoUrl: string;
  address: string;
  emergencyContact: EmergencyContact;
  department: string;
  position: string;
  managerId?: string;
  managerName?: string;
  employmentType: EmploymentType;
  hireDate: string;
  employmentStatus: EmploymentStatus;
  salary: number;
  payType: PayType;
  hourlyRate: number;
  payFrequency: PayFrequency;
  costCenter: string;
  location: string;
  bankInfo: BankInfo;
  taxInfo: TaxInfo;
  workSchedule: string;
  documents: DocumentItem[];
  leaveBalance: LeaveBalance;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId?: string;
  managerName?: string;
  costCenter: string;
  location: string;
  description: string;
  employeeCount?: number;
}

export interface Position {
  id: string;
  title: string;
  department: string;
  grade: string;
  description: string;
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Half-Day' | 'On Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  clockIn?: string; // HH:MM AM/PM
  clockOut?: string;
  breakDurationMinutes: number;
  totalHours: number;
  overtimeHours: number;
  status: AttendanceStatus;
  notes?: string;
}

export type LeaveType = 'Annual' | 'Sick' | 'Personal' | 'Maternity' | 'Paternity' | 'Bereavement' | 'Unpaid';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approverId?: string;
  approverName?: string;
  approverNote?: string;
  appliedAt: string;
}

export type PayrollRunStatus = 'Draft' | 'Processing' | 'Completed' | 'Cancelled';

export interface Payslip {
  id: string;
  payrollRunId: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  position: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  frequency: PayFrequency;
  baseSalary: number;
  hourlyRate: number;
  hoursWorked: number;
  overtimePay: number;
  bonuses: number;
  commissions: number;
  allowances: number;
  grossPay: number;
  taxDeductions: number;
  retirementDeductions: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  paymentMethod: string;
  bankName: string;
  accountNumber: string;
  status: PayrollRunStatus;
}

export interface PerformanceGoal {
  id: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number; // 0 - 100
  dueDate: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  reviewPeriod: string; // e.g., "Q3 2026", "Annual 2025"
  overallRating: number; // 1 to 5
  goals: PerformanceGoal[];
  feedback: string;
  strengths: string;
  improvements: string;
  status: 'Draft' | 'Submitted' | 'Completed';
  reviewDate: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  status: 'Draft' | 'Open' | 'Interviewing' | 'Closed';
  salaryRange?: string;
  applicantsCount: number;
  description: string;
  requirements: string[];
  postedDate: string;
}

export type CandidateStatus = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  status: CandidateStatus;
  appliedDate: string;
  interviewDate?: string;
  notes?: string;
  rating?: number;
}

export type AssetCategory = 'Laptop' | 'Phone' | 'Monitor' | 'Keys' | 'Access Card' | 'Vehicle' | 'Other';
export type AssetStatus = 'Available' | 'Assigned' | 'Under Maintenance' | 'Retired';

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: AssetCategory;
  serialNumber: string;
  status: AssetStatus;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  assignedDate?: string;
  value: number;
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'General' | 'Policy' | 'Event' | 'Holiday' | 'Important';
  isPinned: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientId: string; // or 'ALL'
  title: string;
  message: string;
  type: 'leave' | 'payroll' | 'announcement' | 'birthday' | 'system' | 'review';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: Role;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

export interface CompanySettings {
  companyName: string;
  taxId: string;
  currency: string;
  fiscalYearStart: string;
  payFrequency: PayFrequency;
  standardWorkHours: number;
  overtimeMultiplier: number;
  annualLeaveDays: number;
  sickLeaveDays: number;
  maternityLeaveDays: number;
  paternityLeaveDays: number;
  address: string;
  contactEmail: string;
  contactPhone: string;
}
