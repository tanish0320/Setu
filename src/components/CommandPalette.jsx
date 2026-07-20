import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const { 
    doctors, hospitals, handoffs, appointments, activeSOS,
    setRole, setSelectedDoctor, setActivePage, startWowDemo 
  } = useApp();
  
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const paletteRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Filter items
  const filteredDoctors = query === '' ? [] : doctors.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) || 
    d.specialty.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredHospitals = query === '' ? [] : hospitals.filter(h => 
    h.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredPatients = query === '' ? [] : handoffs.filter(h => 
    h.patientName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredAppointments = query === '' ? [] : appointments.filter(a => 
    a.patientName.toLowerCase().includes(query.toLowerCase()) ||
    a.department.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredEmergencies = query === '' ? [] : (
    activeSOS && (
      activeSOS.specialty.toLowerCase().includes(query.toLowerCase()) || 
      activeSOS.status.toLowerCase().includes(query.toLowerCase())
    ) ? [activeSOS] : []
  );

  const actions = [
    // Redirection Shortcuts
    { name: 'Go to Workspace Dashboard', category: 'Pages', action: () => { setActivePage('dashboard'); onClose(); } },
    { name: 'Go to Advanced Scheduling Calendar', category: 'Pages', action: () => { setActivePage('calendar'); onClose(); } },
    { name: 'Go to Emergency SOS Dispatcher', category: 'Pages', action: () => { setActivePage('emergency'); onClose(); } },
    { name: 'Go to Appointments Registry', category: 'Pages', action: () => { setActivePage('appointments'); onClose(); } },
    { name: 'Go to Specialist Directory', category: 'Pages', action: () => { setActivePage('doctors'); onClose(); } },
    { name: 'Go to Hospital Node Configurations', category: 'Pages', action: () => { setActivePage('hospitals'); onClose(); } },
    { name: 'Go to Secure Audit Logs', category: 'Pages', action: () => { setActivePage('audit_logs'); onClose(); } },
    { name: 'Go to Support Tickets', category: 'Pages', action: () => { setActivePage('tickets'); onClose(); } },
    { name: 'Go to Clinical Departments Monitor', category: 'Pages', action: () => { setActivePage('departments'); onClose(); } },
    // Command Shortcuts
    { name: 'Launch Interactive WOW Demo Story', category: 'Commands', action: () => { startWowDemo(); onClose(); } },
    { name: 'Switch to Super Admin Dashboard', category: 'Role Credentials', action: () => { setRole('Super Admin'); onClose(); } },
    { name: 'Switch to Hospital Admin Dashboard', category: 'Role Credentials', action: () => { setRole('Hospital Admin'); onClose(); } },
    { name: 'Switch to Receptionist Dashboard', category: 'Role Credentials', action: () => { setRole('Receptionist'); onClose(); } },
    { name: 'Switch to Doctor Dashboard', category: 'Role Credentials', action: () => { setRole('Doctor'); onClose(); } },
    { name: 'Switch to Ambulance User Dashboard', category: 'Role Credentials', action: () => { setRole('Ambulance User'); onClose(); } },
  ];

  const filteredActions = query === '' ? actions.slice(0, 5) : actions.filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleBackdropClick = (e) => {
    if (paletteRef.current && !paletteRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4 font-sans"
      onClick={handleBackdropClick}
    >
      <div 
        ref={paletteRef}
        className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border w-full max-w-2xl rounded-premium shadow-2xl overflow-hidden animate-fade-in text-left"
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-slate-100 dark:border-dark-border px-4 py-3">
          <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 mr-3">search</span>
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-0 text-sm font-sans"
            placeholder="Search doctors, hospitals, appointments, pages, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">ESC</span>
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-slate-50 dark:divide-dark-border/20">
          
          {/* Shortcuts & Actions */}
          {filteredActions.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Pages & Commands
              </div>
              {filteredActions.map((action, idx) => (
                <button
                  key={`act-${idx}`}
                  onClick={action.action}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 group transition-colors"
                >
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 mr-3 text-lg group-hover:text-brand">terminal</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{action.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{action.category}</span>
                </button>
              ))}
            </div>
          )}

          {/* Emergency SOS Requests */}
          {filteredEmergencies.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] font-bold text-danger uppercase tracking-wider">
                Active SOS Requests
              </div>
              {filteredEmergencies.map(sos => (
                <div 
                  key={sos.id}
                  className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-bold text-danger">🚨 {sos.specialty} SOS Dispatch</span>
                    <span className="text-slate-400 block mt-0.5">Status: {sos.status} • Urgency: {sos.urgency}</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[10px]">{sos.timestamp}</span>
                </div>
              ))}
            </div>
          )}

          {/* Doctors */}
          {filteredDoctors.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Doctors</div>
              {filteredDoctors.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setRole('Doctor');
                    onClose();
                  }}
                  className="w-full text-left flex items-center px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <img src={doc.avatar} alt={doc.name} className="w-7 h-7 rounded-full mr-3 object-cover border" />
                  <div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{doc.name}</div>
                    <div className="text-[10px] text-slate-400">{doc.specialty} • Presence: {doc.status}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Hospitals */}
          {filteredHospitals.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Hospitals</div>
              {filteredHospitals.map(hosp => (
                <div
                  key={hosp.id}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs"
                >
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: hosp.color }}></span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{hosp.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{hosp.distance} km</span>
                </div>
              ))}
            </div>
          )}

          {/* Appointments */}
          {filteredAppointments.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Appointments</div>
              {filteredAppointments.map(appt => (
                <div
                  key={appt.id}
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{appt.patientName}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({appt.date} • {appt.time})</span>
                  </div>
                  <span className="text-[10px] text-brand font-semibold">{appt.department}</span>
                </div>
              ))}
            </div>
          )}

          {/* Patients (handoffs) */}
          {filteredPatients.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Patient Handoff Logs</div>
              {filteredPatients.map(p => (
                <div
                  key={p.id}
                  className="px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{p.patientName}</span>
                      <span className="text-[10px] text-slate-400 ml-2">({p.age}y/{p.gender})</span>
                    </div>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{p.hospitalName}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Dx: {p.diagnosis}</p>
                </div>
              ))}
            </div>
          )}

          {query !== '' && 
           filteredDoctors.length === 0 && 
           filteredHospitals.length === 0 && 
           filteredPatients.length === 0 && 
           filteredAppointments.length === 0 &&
           filteredEmergencies.length === 0 &&
           filteredActions.length === 0 && (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p className="text-xs">No matches found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
