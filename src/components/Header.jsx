import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CommandPalette } from './CommandPalette';

export const Header = () => {
  const { 
    role, setRole, 
    activePage,
    notifications, setNotifications,
    activeSOS, cancelSOS,
    hospitals, selectedHospital,
    doctors, selectedDoctor,
    setJudgeModeActive
  } = useApp();

  const getBreadcrumbs = () => {
    const breadcrumbMap = {
      'dashboard': ['Workspace', 'Dashboard'],
      'calendar': ['Workspace', 'Calendar'],
      'emergency': ['Workspace', 'Emergency SOS'],
      'appointments': ['Workspace', 'Appointments'],
      'doctors': ['Operations', 'Doctors'],
      'hospitals': ['Operations', 'Hospitals'],
      'patients': ['Operations', 'Patients'],
      'departments': ['Operations', 'Departments'],
      'reports': ['Analytics', 'Reports'],
      'reliability': ['Analytics', 'Reliability Metrics'],
      'emergency_analytics': ['Analytics', 'Emergency Analytics'],
      'users': ['Administration', 'Users'],
      'roles': ['Administration', 'Roles Matrix'],
      'settings': ['Administration', 'Settings'],
      'audit_logs': ['Administration', 'Audit Logs'],
      'tickets': ['Administration', 'Support Tickets'],
      'profile': ['Operations', 'Doctor Profile'],
    };
    return breadcrumbMap[activePage] || ['Workspace', 'Dashboard'];
  };

  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('theme') === 'dark';
  });

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const roleRef = useRef(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Click outside to close popovers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Shortcut key listener for Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Hospital Admin': return 'bg-blue-100 text-brand-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Receptionist': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Doctor': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Ambulance User': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-dark-border bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md">
      
      {/* Left: Breadcrumbs & Global Search */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-1.5 text-xs font-semibold text-slate-400 mr-4 select-none">
          <span>{getBreadcrumbs()[0]}</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-slate-700 dark:text-slate-200 font-bold">{getBreadcrumbs()[1]}</span>
        </div>
        <button 
          onClick={() => setIsPaletteOpen(true)}
          className="flex items-center space-x-2 px-3 py-1.5 w-44 md:w-56 text-left bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-dark-border text-slate-400 dark:text-slate-500 rounded-premium hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">search</span>
          <span className="text-xs flex-1 truncate font-sans">Search (⌘K)...</span>
          <span className="text-[10px] bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-slate-500">⌘K</span>
        </button>
      </div>

      {/* Right: Simulation Controls + Actions */}
      <div className="flex items-center space-x-4">
        
        {/* Presentation Judge Mode Launcher */}
        <button
          onClick={() => setJudgeModeActive(true)}
          className="bg-brand text-white hover:bg-brand-600 font-bold text-xs px-3 py-1.5 rounded-premium shadow-sm flex items-center space-x-1"
          title="Launch Guided Presentation slide deck"
        >
          <span className="material-symbols-outlined text-sm">gavel</span>
          <span>Judge Mode</span>
        </button>

        {/* Role Selector Trigger */}
        <div ref={roleRef} className="relative">
          <button 
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className={`flex items-center space-x-2 px-3 py-1.5 border text-xs font-semibold rounded-premium transition-all shadow-sm ${getRoleBadgeColor()}`}
          >
            <span className="material-symbols-outlined text-sm">settings_accessibility</span>
            <span>Role: {role}</span>
            <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
          </button>
          
          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium shadow-lg py-1 z-40 animate-fade-in">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-dark-border">
                Switch Simulator Role
              </div>
              {['Super Admin', 'Hospital Admin', 'Receptionist', 'Doctor', 'Ambulance User'].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setIsRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 ${role === r ? 'text-brand font-semibold bg-brand-50/50 dark:bg-brand-900/10' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>{r}</span>
                  {role === r && <span className="material-symbols-outlined text-sm">check</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Context Header text */}
        <div className="hidden lg:block text-right">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Context Node</div>
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {role === 'Doctor' ? selectedDoctor.name : selectedHospital.shortName}
          </div>
        </div>

        {/* SOS Warning Indicator */}
        {activeSOS && (
          <div className="flex items-center space-x-2 bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-premium animate-pulse">
            <span className="material-symbols-outlined text-sm font-bold animate-ping">emergency</span>
            <span className="text-[11px] font-bold tracking-wider">ACTIVE EMERGENCY</span>
          </div>
        )}

        {/* Dark Mode Switcher */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title="Toggle Light/Dark Theme"
        >
          <span className="material-symbols-outlined text-xl">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Hub */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-white dark:ring-dark-card"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium shadow-lg z-40 overflow-hidden animate-fade-in">
              <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-100 dark:border-dark-border bg-slate-50 dark:bg-slate-800/20">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">System Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead} 
                    className="text-[10px] text-brand hover:underline font-semibold"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-3 border-b border-slate-50 dark:border-dark-border/40 text-xs flex items-start space-x-2.5 transition-colors ${!n.read ? 'bg-brand-50/20 dark:bg-brand-900/5' : ''}`}
                    >
                      <span className={`material-symbols-outlined text-sm mt-0.5 ${
                        n.type === 'danger' ? 'text-danger' : 
                        n.type === 'warning' ? 'text-warning' : 
                        n.type === 'success' ? 'text-success' : 'text-slate-400'
                      }`}>
                        {n.type === 'danger' ? 'error' : n.type === 'warning' ? 'warning' : n.type === 'success' ? 'check_circle' : 'info'}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex justify-between">
                          <span>{n.title}</span>
                          <span className="text-[9px] text-slate-400 font-normal">{n.time}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Global Command Palette Dialog */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </header>
  );
};
