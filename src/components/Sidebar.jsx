import React from 'react';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { 
    role, 
    activePage, setActivePage,
    hospitals, selectedHospital, setSelectedHospital,
    doctors, selectedDoctor, setSelectedDoctor,
    changeDoctorStatus,
    setJudgeModeActive
  } = useApp();

  // Unified Grouped Navigation
  const navigationGroups = [
    {
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
        { id: 'emergency', label: 'Emergency SOS', icon: 'emergency', highlight: true },
        { id: 'appointments', label: 'Appointments', icon: 'event_note' }
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'doctors', label: 'Doctors', icon: 'medical_services' },
        { id: 'hospitals', label: 'Hospitals', icon: 'domain' },
        { id: 'patients', label: 'Patients', icon: 'person' },
        { id: 'departments', label: 'Departments', icon: 'lan' },
        { id: 'architecture', label: 'Architecture Schema', icon: 'hub' }
      ]
    },
    {
      title: 'Analytics',
      items: [
        { id: 'reports', label: 'Reports', icon: 'analytics' },
        { id: 'reliability', label: 'Reliability metrics', icon: 'leaderboard' },
        { id: 'emergency_analytics', label: 'Emergency Analytics', icon: 'query_stats' },
        { id: 'performance', label: 'Performance SLA', icon: 'speed' }
      ]
    },
    {
      title: 'Administration',
      items: [
        { id: 'users', label: 'Users', icon: 'manage_accounts' },
        { id: 'roles', label: 'Roles Matrix', icon: 'verified_user' },
        { id: 'settings', label: 'Settings', icon: 'settings' },
        { id: 'audit_logs', label: 'Audit Trail', icon: 'rule' },
        { id: 'tickets', label: 'Support Tickets', icon: 'support' },
        { id: 'security', label: 'Security Center (SOC)', icon: 'shield' },
        { id: 'api_explorer', label: 'API Explorer', icon: 'integration_instructions' },
        { id: 'system_health', label: 'Platform Health', icon: 'dns' },
        { id: 'feature_flags', label: 'Feature Flags', icon: 'toggle_on' }
      ]
    }
  ];

  // Helper to verify if the active role has access to this page
  const checkAccess = (pageId) => {
    const permissions = {
      'Doctor': ['dashboard', 'calendar', 'emergency', 'doctors', 'hospitals', 'patients', 'reliability', 'settings', 'profile', 'architecture'],
      'Receptionist': ['dashboard', 'calendar', 'emergency', 'appointments', 'doctors', 'hospitals', 'patients', 'settings', 'profile', 'architecture'],
      'Hospital Admin': ['dashboard', 'calendar', 'emergency', 'appointments', 'doctors', 'hospitals', 'patients', 'departments', 'reports', 'reliability', 'emergency_analytics', 'settings', 'audit_logs', 'profile', 'architecture', 'performance', 'security', 'system_health'],
      'Super Admin': ['dashboard', 'calendar', 'emergency', 'appointments', 'doctors', 'hospitals', 'patients', 'departments', 'reports', 'reliability', 'emergency_analytics', 'users', 'roles', 'settings', 'audit_logs', 'tickets', 'profile', 'architecture', 'performance', 'security', 'api_explorer', 'system_health', 'feature_flags']
    };
    return permissions[role]?.includes(pageId) || false;
  };

  const handleStatusChange = (status) => {
    if (role === 'Doctor') {
      changeDoctorStatus(selectedDoctor.id, status);
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-dark-border flex flex-col h-screen shrink-0 shadow-sm z-20">
      
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-lg shadow-glow-blue">
            S
          </div>
          <div>
            <h1 className="text-sm font-bold font-headline tracking-tight text-slate-800 dark:text-white">
              SETU <span className="text-[10px] ml-1 bg-brand/10 text-brand px-1 py-0.2 rounded font-sans uppercase">OS</span>
            </h1>
            <span className="text-[9px] text-slate-400 font-semibold tracking-wider block -mt-0.5">COORDINATION LAYER</span>
          </div>
        </div>
        <button
          onClick={() => setJudgeModeActive(true)}
          className="text-brand hover:text-brand-600 hover:scale-110 transition-all p-1 bg-brand/5 dark:bg-brand/10 rounded"
          title="Launch Judge Guided Presentation"
        >
          <span className="material-symbols-outlined text-base font-bold block">gavel</span>
        </button>
      </div>

      {/* Simulator Switcher Block */}
      <div className="p-4 border-b border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-slate-900/10">
        {role === 'Doctor' ? (
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Doctor Node</label>
            <select
              className="w-full text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-brand font-medium"
              value={selectedDoctor.id}
              onChange={(e) => {
                const doc = doctors.find(d => d.id === e.target.value);
                if (doc) setSelectedDoctor(doc);
              }}
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Hospital Node</label>
            <select
              className="w-full text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-brand font-medium"
              value={selectedHospital.id}
              onChange={(e) => {
                const hosp = hospitals.find(h => h.id === e.target.value);
                if (hosp) setSelectedHospital(hosp);
              }}
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grouped Navigations */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {navigationGroups.map(group => (
          <div key={group.title} className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 block mb-1.5">
              {group.title}
            </span>
            {group.items.map(item => {
              const isActive = activePage === item.id;
              const hasAccess = checkAccess(item.id);
              
              let btnClass = 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200';
              if (isActive) {
                btnClass = 'bg-brand-50/50 dark:bg-brand-900/10 text-brand font-semibold border-brand-500';
              }
              if (item.highlight && !isActive) {
                btnClass = 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/15';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-premium transition-all ${btnClass}`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className={`material-symbols-outlined text-lg ${isActive ? 'text-brand' : ''}`}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {!hasAccess && (
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-600 text-xs" title="Access Restricted">lock</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Doctor Status Panel */}
      {role === 'Doctor' && (
        <div className="p-4 border-t border-slate-200 dark:border-dark-border bg-slate-50/50 dark:bg-slate-900/20">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Presence Status</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
          </div>
          
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'Available', label: 'Available', color: 'success' },
              { id: 'Consulting', label: 'Consulting', color: 'brand' },
              { id: 'In Transit', label: 'In Transit', color: 'warning' },
              { id: 'On Break', label: 'On Break', color: 'slate' },
              { id: 'Emergency', label: 'Emergency', color: 'danger', disabled: true },
              { id: 'Offline', label: 'Offline', color: 'slate' },
            ].map(status => {
              const isActive = selectedDoctor.status === status.id;
              let activeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700';
              if (isActive) {
                if (status.color === 'success') activeClass = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
                else if (status.color === 'brand') activeClass = 'bg-brand-500/15 border-brand-500/30 text-brand-600 dark:text-brand-400';
                else if (status.color === 'warning') activeClass = 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400';
                else if (status.color === 'danger') activeClass = 'bg-red-500/15 border-red-500/30 text-red-600 dark:text-red-400';
              }

              return (
                <button
                  key={status.id}
                  disabled={status.disabled}
                  onClick={() => handleStatusChange(status.id)}
                  className={`text-[9px] py-1 px-1.5 border rounded font-medium text-left truncate transition-all ${
                    isActive ? activeClass + ' font-bold border-current' : 'border-slate-200 dark:border-dark-border text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  } ${status.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="p-4 border-t border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-slate-900/30 text-center flex flex-col items-center">
        <div className="text-[10px] font-semibold text-slate-400 flex items-center justify-center space-x-1.5">
          <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
          <span>SETU Engine v2.4</span>
        </div>
        <span className="text-[8px] text-slate-400 font-mono mt-0.5 uppercase">Node: {role.replace(' ', '_').toLowerCase()}</span>
      </div>

    </aside>
  );
};
