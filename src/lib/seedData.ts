import { collection, getDocs, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import {
  INITIAL_SETTINGS,
  INITIAL_DEPARTMENTS,
  INITIAL_POSITIONS,
  INITIAL_EMPLOYEES,
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
} from './mockData';

export async function checkAndSeedFirestore(): Promise<void> {
  if (!db) {
    console.log('Firebase DB not initialized; using in-memory state.');
    return;
  }
  try {
    const empSnap = await getDocs(collection(db, 'employees'));
    if (!empSnap.empty) {
      console.log('Firestore already contains seed data.');
      return;
    }

    console.log('Seeding Firestore collections with initial HRMS data...');
    const batch = writeBatch(db);

    // Settings
    batch.set(doc(db, 'settings', 'companyConfig'), INITIAL_SETTINGS);

    // Departments
    for (const d of INITIAL_DEPARTMENTS) {
      batch.set(doc(db, 'departments', d.id), d);
    }

    // Positions
    for (const p of INITIAL_POSITIONS) {
      batch.set(doc(db, 'positions', p.id), p);
    }

    // Employees
    for (const e of INITIAL_EMPLOYEES) {
      batch.set(doc(db, 'employees', e.id), e);
    }

    // Attendance
    for (const a of INITIAL_ATTENDANCE) {
      batch.set(doc(db, 'attendance', a.id), a);
    }

    // Leave Requests
    for (const l of INITIAL_LEAVE_REQUESTS) {
      batch.set(doc(db, 'leaveRequests', l.id), l);
    }

    // Payslips / Payroll
    for (const p of INITIAL_PAYSLIPS) {
      batch.set(doc(db, 'payroll', p.id), p);
    }

    // Reviews
    for (const r of INITIAL_PERFORMANCE_REVIEWS) {
      batch.set(doc(db, 'performanceReviews', r.id), r);
    }

    // Jobs & Recruitment
    for (const j of INITIAL_JOBS) {
      batch.set(doc(db, 'recruitment_jobs', j.id), j);
    }
    for (const c of INITIAL_CANDIDATES) {
      batch.set(doc(db, 'recruitment_candidates', c.id), c);
    }

    // Assets
    for (const a of INITIAL_ASSETS) {
      batch.set(doc(db, 'assets', a.id), a);
    }

    // Announcements
    for (const anc of INITIAL_ANNOUNCEMENTS) {
      batch.set(doc(db, 'announcements', anc.id), anc);
    }

    // Notifications
    for (const n of INITIAL_NOTIFICATIONS) {
      batch.set(doc(db, 'notifications', n.id), n);
    }

    // Audit logs
    for (const log of INITIAL_AUDIT_LOGS) {
      batch.set(doc(db, 'auditLogs', log.id), log);
    }

    await batch.commit();
    console.log('Firestore seeding completed successfully.');
  } catch (err) {
    console.warn('Firestore seed notice (falling back to memory state if offline):', err);
  }
}
