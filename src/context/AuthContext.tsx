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
  // Default administrative user: Sarah Jenkins (Super Admin / Company Owner)
  const [currentRole, setCurrentRole] = useState<Role>('Super Admin');
  const [activeEmployeeId, setActiveEmployeeId] = useState<string>('EMP-1001');

  const currentEmployee = INITIAL_EMPLOYEES.find((e) => e.employeeId === activeEmployeeId) || INITIAL_EMPLOYEES[0];

  const [user, setUser] = useState<AuthUser | null>({
    uid: 'demo-admin-101',
    email: currentEmployee?.email || 'sarah.jenkins@etex.com',
    displayName: currentEmployee?.fullName || 'Sarah Jenkins',
    role: currentRole,
    employeeId: currentEmployee?.employeeId || 'EMP-1001',
    avatarUrl: currentEmployee?.photoUrl || '',
  });

  useEffect(() => {
    if (user) {
      setUser({
        ...user,
        role: currentRole,
        displayName: currentEmployee?.fullName || user.displayName,
        email: currentEmployee?.email || user.email,
        employeeId: currentEmployee?.employeeId || user.employeeId,
        avatarUrl: currentEmployee?.photoUrl || user.avatarUrl,
      });
    }
  }, [currentRole, activeEmployeeId]);

  const switchRole = (newRole: Role) => {
    setCurrentRole(newRole);
    if (newRole === 'HR Manager') {
      setActiveEmployeeId('EMP-1002'); // Elena Rostova (HR Manager)
    } else {
      setActiveEmployeeId('EMP-1001'); // Sarah Jenkins (Company Owner / Super Admin)
    }
  };

  const switchEmployee = (empId: string) => {
    setActiveEmployeeId(empId);
  };

  const login = (email: string, role: Role = 'Super Admin') => {
    const matched = INITIAL_EMPLOYEES.find((e) => e.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setActiveEmployeeId(matched.employeeId);
    }
    const adminRole: Role = role === 'HR Manager' ? 'HR Manager' : 'Super Admin';
    setCurrentRole(adminRole);
    setUser({
      uid: 'user-' + Date.now(),
      email: email,
      displayName: matched ? matched.fullName : 'System Administrator',
      role: adminRole,
      employeeId: matched ? matched.employeeId : 'EMP-1001',
      avatarUrl: matched ? matched.photoUrl : '',
    });
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

