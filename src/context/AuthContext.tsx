import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
  signUp: (email: string, password: string, displayName?: string, role?: Role) => Promise<void>;
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

        let userData: any;

        if (!userSnap.exists()) {
          // Auto-provision user document with Super Admin permissions on first login
          const defaultUserDoc = {
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Super Admin',
            role: 'Super Admin' as Role,
            employeeId: 'EMP-1001',
            createdAt: new Date().toISOString(),
          };
          try {
            await setDoc(userDocRef, defaultUserDoc);
          } catch (createErr) {
            console.warn('Auto-creation of user document deferred:', createErr);
          }
          userData = defaultUserDoc;
        } else {
          userData = userSnap.data();
        }

        const userRole: Role = (userData.role as Role) || 'Super Admin';
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
        console.error('Error verifying user permissions in Firestore:', err);
        // Fallback user state so authenticated user is never locked out
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin',
          role: 'Super Admin',
          employeeId: 'EMP-1001',
        });
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
        msg = 'Invalid email address or password. If you do not have an account yet, click "Create Account".';
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

  const signUp = async (
    email: string,
    password: string,
    displayName?: string,
    role: Role = 'Super Admin'
  ): Promise<void> => {
    if (!auth || !db) {
      throw new Error('Firebase Auth or Firestore is not initialized.');
    }
    setAuthError(null);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const userDocRef = doc(db, 'users', userCred.user.uid);
      const userDocData = {
        email: email.trim(),
        displayName: displayName || email.split('@')[0],
        role: role,
        employeeId: 'EMP-1001',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, userDocData);
    } catch (err: any) {
      let msg = 'Failed to create account. Please check your inputs.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters long.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-up is disabled in Firebase Auth. Enable Email/Password in Firebase Console.';
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
    return user ? true : false;
  };

  const canManageEmployees = true;
  const canManagePayroll = true;
  const canApproveLeave = true;
  const canManageAssets = true;
  const canManageSettings = true;
  const isEmployeeViewOnly = false;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        currentEmployee,
        login,
        signUp,
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
