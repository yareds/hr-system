import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Employee } from '../types';
import { INITIAL_EMPLOYEES } from '../lib/mockData';

interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  employeeId: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: AuthUser | null;
  currentRole: Role;
  currentEmployee: Employee | null;
  switchRole: (role: Role) => void;
  switchEmployee: (employeeId: string) => void;
  login: (email: string, role?: Role) => void;
  logout: () => void;
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
  // Default administrative user: Super Admin (Yared Abegaz)
  const [currentRole, setCurrentRole] = useState<Role>('Super Admin');
  const [activeEmployeeId, setActiveEmployeeId] = useState<string>('EMP-1001');

  const currentEmployee = INITIAL_EMPLOYEES.find((e) => e.employeeId === activeEmployeeId) || INITIAL_EMPLOYEES[0];

  const [user, setUser] = useState<AuthUser | null>({
    uid: 'user-admin-yared',
    email: 'yared.abegaz@gmail.com',
    displayName: 'Yared Abegaz',
    role: 'Super Admin',
    employeeId: 'EMP-1001',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  });

  useEffect(() => {
    if (user) {
      setUser({
        ...user,
        role: currentRole,
        displayName: user.displayName,
        email: user.email,
        employeeId: activeEmployeeId,
      });
    }
  }, [currentRole, activeEmployeeId]);

  const switchRole = (newRole: Role) => {
    setCurrentRole(newRole);
    if (newRole === 'HR Manager') {
      setActiveEmployeeId('EMP-1002');
    } else {
      setActiveEmployeeId('EMP-1001');
    }
  };

  const switchEmployee = (empId: string) => {
    setActiveEmployeeId(empId);
  };

  const login = (email: string, role?: Role) => {
    const cleanEmail = email.trim().toLowerCase();
    
    if (cleanEmail === 'yared.abegaz@gmail.com') {
      setCurrentRole('Super Admin');
      setActiveEmployeeId('EMP-1001');
      setUser({
        uid: 'user-admin-yared',
        email: 'yared.abegaz@gmail.com',
        displayName: 'Yared Abegaz',
        role: 'Super Admin',
        employeeId: 'EMP-1001',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      });
    } else if (cleanEmail === 'molla.yareds@gmail.com') {
      setCurrentRole('HR Manager');
      setActiveEmployeeId('EMP-1002');
      setUser({
        uid: 'user-hr-yared',
        email: 'molla.yareds@gmail.com',
        displayName: 'Yared Molla',
        role: 'HR Manager',
        employeeId: 'EMP-1002',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      });
    } else {
      const adminRole: Role = role === 'HR Manager' ? 'HR Manager' : 'Super Admin';
      setCurrentRole(adminRole);
      setUser({
        uid: 'user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        role: adminRole,
        employeeId: 'EMP-1001',
        avatarUrl: '',
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasRole = (allowedRoles: Role[]) => {
    return allowedRoles.includes(currentRole);
  };

  const canManageEmployees = true; // Super Admin & HR Manager
  const canManagePayroll = true;   // Super Admin & HR Manager
  const canApproveLeave = true;   // Super Admin & HR Manager
  const canManageAssets = true;   // Super Admin & HR Manager
  const canManageSettings = currentRole === 'Super Admin';
  const isEmployeeViewOnly = false;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        currentEmployee,
        switchRole,
        switchEmployee,
        login,
        logout,
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

