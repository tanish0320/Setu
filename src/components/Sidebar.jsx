import React from 'react';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { 
    role, 
    activePage, setActivePage,
    hospitals, selectedHospital, setSelectedHospital,
    doctors, selectedDoctor, setSelectedDoctor,
    activeSOS,
    changeDoctorStatus,
    setJudgeModeActive
  } = useApp();

  const getNavItems = () => {
    if (role === 'Doctor') {
      return [
        { id: 'dashboard', label: 'Home', icon: 'home' },
        { id: 'emergency', label: 'Requests', icon: 'notifications_active', highlight: true },
        { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
        { id: 'patients', label: 'Patients', icon: 'group' },
        { id: 'profile', label: 'Profile', icon: 'person' }
      ];
    } else if (role === 'Ambulance User') {
      return [
        { id: 'dashboard', label: 'Nearby Hospitals', icon: 'local_hospital' },
        { id: 'emergency', label: 'Emergency Cases', icon: 'ambulance', highlight: true },
        { id: 'smart_recommendations', label: 'Smart Recommendations', icon: 'psychology' },
        { id: 'live_status', label: 'Live Hospital Status', icon: 'location_on' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];
    } else {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
        { id: 'appointments', label: 'New Consultation', icon: 'add_circle' },
        { id: 'doctors', label: 'Doctors', icon: 'medical_services' },
        { id: 'emergency', label: 'Requests', icon: 'track_changes' },
        { id: 'settings', label: 'Settings', icon: 'settings' }
      ];
    }
  };

  const handleStatusChange = (status) => {
    if (role === 'Doctor') {
      changeDoctorStatus(selectedDoctor.id, status);
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-dark-border flex flex-col h-screen shrink-0 shadow-sm z-20">
      
      {/* Brand Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-brand flex items-center justify-center text-white font-bold text-base shadow-sm">
            S
          </div>
          <div>
            <h1 className="text-xs font-bold font-headline tracking-tight text-slate-800 dark:text-white">
              SETU OS
            </h1>
            <span className="text-[8px] text-slate-400 font-semibold tracking-wider block -mt-0.5 uppercase">
              {role === 'Doctor' ? 'Doctor Workspace' : role === 'Ambulance User' ? 'Emergency Response Unit' : 'Hospital Cluster'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setJudgeModeActive(true)}
          className="text-brand hover:text-brand-600 hover:scale-105 transition-all p-1 bg-brand-50/50 dark:bg-brand-900/10 rounded"
          title="Launch Presentation Mode"
        >
          <span className="material-symbols-outlined text-base block font-bold">gavel</span>
        </button>
      </div>

      {/* Simulator Switcher Block */}
      <div className="p-3.5 border-b border-slate-100 dark:border-dark-border bg-slate-50/40 dark:bg-slate-900/10">
        {role === 'Doctor' ? (
          <div>
            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Specialist Doctor</label>
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
        ) : role === 'Ambulance User' ? (
          <div>
            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Emergency Unit</label>
            <select
              className="w-full text-xs bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-brand font-medium"
              defaultValue="u104"
            >
              <option value="u104">🚑 Unit #104 - Indiranagar</option>
              <option value="u108">🚑 Unit #108 - Koramangala</option>
              <option value="u112">🚑 Unit #112 - Whitefield</option>
            </select>
          </div>
        ) : (
          <div>
            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Hospital Portal</label>
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

      {/* Navigations list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {getNavItems().map(item => {
          const isActive = activePage === item.id;
          
          let btnClass = 'text-slate-650 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/20 hover:text-slate-800 dark:hover:text-slate-200';
          if (isActive) {
            btnClass = 'bg-brand-50/40 dark:bg-brand-900/10 text-brand font-bold border-brand-500';
          }
          if (item.highlight && !isActive) {
            btnClass = 'bg-red-500/5 border-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-500/10';
          }

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center px-3 py-2 text-xs rounded transition-all ${btnClass}`}
            >
              <span className={`material-symbols-outlined text-lg mr-3 ${isActive ? 'text-brand' : ''}`}>{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contextual Operational Widgets (Bottom of Sidebar) */}
      <div className="p-3 border-t border-slate-200 dark:border-dark-border bg-slate-50/50 dark:bg-slate-900/30 space-y-2 text-[10.5px]">
        {/* Widget 1: Emergency Alert Status */}
        <div className="p-2 rounded bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border flex justify-between items-center">
          <span className="text-[9px] text-slate-400 font-bold uppercase">Alert Status</span>
          {activeSOS && activeSOS.status !== 'Completed' ? (
            <span className="text-[8.5px] font-bold text-danger bg-red-500/10 px-2 py-0.2 rounded border border-red-500/20 animate-pulse">
              🚨 Code Blue
            </span>
          ) : (
            <span className="text-[8.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded border border-emerald-500/20">
              🟢 Grid Normal
            </span>
          )}
        </div>

        {/* Widget 2: Next Consultation */}
        <div className="p-2 rounded bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border space-y-0.5">
          <div className="flex justify-between items-center text-[8.5px] text-slate-400 font-bold uppercase">
            <span>Next Consult</span>
            <span className="font-mono text-brand">10:45 AM</span>
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 truncate block text-[10px]">{selectedDoctor?.name || 'Dr. Priya Sharma'}</span>
          <span className="text-[9px] text-slate-400 truncate block">{selectedHospital?.shortName || 'Apollo Delhi'}</span>
        </div>

        {/* Widget 3: Daily Travel Estimate & Quick Availability Toggle */}
        <div className="p-2 rounded bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border space-y-1.5">
          <div className="flex justify-between items-center text-[9px] text-slate-500 dark:text-slate-400">
            <span className="font-bold">🚘 Commute Today:</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-200">~42 mins</span>
          </div>

          <div>
            <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Availability Toggle</label>
            <select
              className="w-full text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-brand font-bold p-1 rounded focus:outline-none cursor-pointer"
              value={selectedDoctor?.status || 'Available'}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Travelling">Travelling</option>
              <option value="Consultation">Consultation</option>
              <option value="In Surgery">In Surgery</option>
              <option value="On Break">On Break</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-slate-200 dark:border-dark-border bg-slate-50/40 dark:bg-slate-900/10 text-center">
        <span className="text-[9px] text-slate-400 font-mono block">SETU v3 • Production Grid</span>
      </div>

    </aside>
  );
};
