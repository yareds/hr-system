import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Role, Employee } from '../types';
import { INITIAL_EMPLOYEES } from '../lib/mockData';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  employeeId: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  currentRole: Role;
  currentEmployee: Employee | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authLoading: boolean;
  authError: string | null;
  hasRole: (allowedRoles: Role[]) => boolean;
  canManageEmployees: boolean;
  canManagePayroll: boolean;
  canApproveLeave: boolean;
  canManageAssets: boolean;
  canManageSettings: boolean;
  isEmployeeViewOnly: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth || !db) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setAuthLoading(true);
      setAuthError(null);

      if (!firebaseUser) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (!userSnap.exists()) {
          await signOut(auth);
          setUser(null);
          setAuthError('Your account has not been granted access yet. Contact your Super Admin.');
          setAuthLoading(false);
          return;
        }

        const userData = userSnap.data();
        const role = userData?.role;

        if (!role || (role !== 'Super Admin' && role !== 'HR Manager')) {
          await signOut(auth);
          setUser(null);
          setAuthError('Your account has not been granted access yet. Contact your Super Admin.');
          setAuthLoading(false);
          return;
        }

        const userRole: Role = role as Role;
        const empId = userData.employeeId || 'EMP-1001';
        const employee = INITIAL_EMPLOYEES.find((e) => e.employeeId === empId) || null;

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: userData.displayName || firebaseUser.displayName || employee?.fullName || firebaseUser.email?.split('@')[0] || 'User',
          role: userRole,
          employeeId: empId,
          avatarUrl: employee?.photoUrl || '',
        });
      } catch (err: any) {
        console.error('Error fetching user permissions from Firestore:', err);
        await signOut(auth);
        setUser(null);
        setAuthError('Failed to verify account permissions. Please try again.');
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized.');
    }
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      let msg = 'Failed to sign in. Please check your credentials.';
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        msg = 'Invalid email address or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please wait a few minutes and try again.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password authentication is disabled in your Firebase console. Please enable Email/Password provider in Firebase Auth settings.';
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async (): Promise<void> => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setAuthError(null);
  };

  const currentRole: Role = (user?.role as Role) || 'Super Admin';
  const currentEmployee: Employee | null = user
    ? INITIAL_EMPLOYEES.find((e) => e.employeeId === user.employeeId) || INITIAL_EMPLOYEES[0]
    : INITIAL_EMPLOYEES[0];

  const hasRole = (allowedRoles: Role[]) => {
    return user ? allowedRoles.includes(user.role) : false;
  };

  const canManageEmployees = user ? ['Super Admin', 'HR Manager'].includes(user.role) : false;
  const canManagePayroll = user ? ['Super Admin', 'HR Manager'].includes(user.role) : false;
  const canApproveLeave = user ? ['Super Admin', 'HR Manager'].includes(user.role) : false;
  const canManageAssets = user ? ['Super Admin', 'HR Manager'].includes(user.role) : false;
  const canManageSettings = user ? user.role === 'Super Admin' : false;
  const isEmployeeViewOnly = false;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        currentEmployee,
        login,
        logout,
        authLoading,
        authError,
        hasRole,
        canManageEmployees,
        canManagePayroll,
        canApproveLeave,
        canManageAssets,
        canManageSettings,
        isEmployeeViewOnly,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
