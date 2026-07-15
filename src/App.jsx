import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DemoConsole } from './components/DemoConsole';
import { JudgeMode } from './components/JudgeMode';

// Dashboard imports
import { RoleDashboardDoctor } from './components/RoleDashboardDoctor';
import { RoleDashboardReceptionist } from './components/RoleDashboardReceptionist';
import { RoleDashboardHospitalAdmin } from './components/RoleDashboardHospitalAdmin';
import { RoleDashboardSuperAdmin } from './components/RoleDashboardSuperAdmin';

// Operational and Admin Pages
import { CalendarPage } from './components/CalendarPage';
import { EmergencyWorkflowPage } from './components/EmergencyWorkflowPage';
import { DoctorsPage } from './components/DoctorsPage';
import { HospitalsPage } from './components/HospitalsPage';
import { PatientsPage } from './components/PatientsPage';
import { DoctorProfilePage } from './components/DoctorProfilePage';

import {
  AppointmentsPage,
  SettingsPage,
  AuditLogsPage,
  ReportsPage,
  UsersPage,
  RolesPage,
  TicketsPage,
  DepartmentsPage
} from './components/GeneralPages';

import {
  SecurityCenterPage,
  ApiExplorerPage,
  SystemHealthPage,
  ArchitecturePage,
  PerformancePage,
  FeatureFlagsPage,
  AuditTrailPage
} from './components/EnterprisePages';

const DashboardLayout = () => {
  const { role, activePage, judgeModeActive, setJudgeModeActive } = useApp();

  if (judgeModeActive) {
    return <JudgeMode onClose={() => setJudgeModeActive(false)} />;
  }

  const renderPage = () => {
    // 1. Role permission matrices
    const permissions = {
      'Doctor': ['dashboard', 'calendar', 'emergency', 'doctors', 'hospitals', 'patients', 'reliability', 'settings', 'profile', 'architecture'],
      'Receptionist': ['dashboard', 'calendar', 'emergency', 'appointments', 'doctors', 'hospitals', 'patients', 'settings', 'profile', 'architecture'],
      'Hospital Admin': ['dashboard', 'calendar', 'emergency', 'appointments', 'doctors', 'hospitals', 'patients', 'departments', 'reports', 'reliability', 'emergency_analytics', 'settings', 'audit_logs', 'profile', 'architecture', 'performance', 'security', 'system_health'],
      'Super Admin': ['dashboard', 'calendar', 'emergency', 'appointments', 'doctors', 'hospitals', 'patients', 'departments', 'reports', 'reliability', 'emergency_analytics', 'users', 'roles', 'settings', 'audit_logs', 'tickets', 'profile', 'architecture', 'performance', 'security', 'api_explorer', 'system_health', 'feature_flags']
    };

    const hasAccess = permissions[role]?.includes(activePage) || false;

    if (!hasAccess) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-8 max-w-lg mx-auto shadow-sm animate-fade-in">
          <span className="material-symbols-outlined text-danger text-5xl mb-4 bg-danger/10 p-3 rounded-full">lock</span>
          <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Role Authorization Required</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Your current simulator credentials (**{role}**) do not have the required access scopes to view the <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">'{activePage.replace('_', ' ')}'</span> workspace.
          </p>
          <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
            To view this page, use the **Simulator Role** switcher in the top navigation bar to escalate credentials to an eligible role.
          </p>
        </div>
      );
    }

    switch (activePage) {
      case 'dashboard':
        switch (role) {
          case 'Doctor': return <RoleDashboardDoctor />;
          case 'Receptionist': return <RoleDashboardReceptionist />;
          case 'Hospital Admin': return <RoleDashboardHospitalAdmin />;
          case 'Super Admin': return <RoleDashboardSuperAdmin />;
          default: return null;
        }
      case 'calendar':
        return <CalendarPage />;
      case 'emergency':
        return <EmergencyWorkflowPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'doctors':
        return <DoctorsPage />;
      case 'hospitals':
        return <HospitalsPage />;
      case 'patients':
        return <PatientsPage />;
      case 'profile':
        return <DoctorProfilePage />;
      case 'departments':
        return <DepartmentsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'reliability':
        return <ReportsPage />; // Displays metrics summaries
      case 'emergency_analytics':
        return <ReportsPage />;
      case 'users':
        return <UsersPage />;
      case 'roles':
        return <RolesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'audit_logs':
        return <AuditTrailPage />; // Render upgraded immutable audit ledger page
      case 'tickets':
        return <TicketsPage />;
      case 'security':
        return <SecurityCenterPage />;
      case 'api_explorer':
        return <ApiExplorerPage />;
      case 'system_health':
        return <SystemHealthPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'performance':
        return <PerformancePage />;
      case 'feature_flags':
        return <FeatureFlagsPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-2">error</span>
            <p className="text-sm font-semibold">Active workspace page not found</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0b0f19] overflow-hidden">
        {/* Top Navigation */}
        <Header />

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1400px] mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Floating Demo Center Storyboard Console */}
      <DemoConsole />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <DashboardLayout />
    </AppProvider>
  );
}

export default App;
