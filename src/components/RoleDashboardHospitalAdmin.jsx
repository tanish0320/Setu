import React from 'react';
import { useApp } from '../context/AppContext';

export const RoleDashboardHospitalAdmin = () => {
  const {
    selectedHospital,
    hospitals,
    doctors,
    appointments,
    activeSOS,
    dispatchSOS,
    setActivePage
  } = useApp();

  const hospitalAppts = appointments.filter(a => a.hospitalId === selectedHospital.id);
  const pendingAppts = hospitalAppts.filter(a => a.status === 'Pending');

  // Counts for KPIs
  const availableSpecialistsCount = doctors.filter(d => d.status === 'Available').length;
  const todaysConsultationsCount = hospitalAppts.length;
  const pendingRequestsCount = pendingAppts.length || 3;
  const criticalRequestsCount = activeSOS && activeSOS.status !== 'Completed' ? 1 : 0;
  const avgResponseTime = "4.2 mins";

  const getHospitalLastName = (fullName) => {
    return fullName.split(',')[0];
  };

  const handleQuickEmergency = () => {
    dispatchSOS('Cardiology', 'Critical', selectedHospital.id);
    setActivePage('emergency');
    alert('🚨 Emergency SOS dispatched! Redirecting to dispatch tracker.');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 animate-fade-in text-left">
      
      {/* Header Title */}
      <div>
        <h1 className="text-xl font-black text-slate-850 dark:text-white font-headline tracking-tight">
          {getHospitalLastName(selectedHospital.name)} Hub
        </h1>
        <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">
          Specialist access coordination and dispatch monitor.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Available Specialists */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
          <span className="text-[9px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">Available Specialists</span>
          <span className="text-2xl font-black text-slate-800 dark:text-white mt-2 block font-headline">
            {availableSpecialistsCount}
          </span>
          <span className="text-[9px] text-emerald-500 font-semibold block mt-1">Ready in pool</span>
        </div>

        {/* Today's Consultations */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
          <span className="text-[9px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">Today's Consults</span>
          <span className="text-2xl font-black text-slate-800 dark:text-white mt-2 block font-headline">
            {todaysConsultationsCount}
          </span>
          <span className="text-[9px] text-slate-450 block mt-1">Active sessions</span>
        </div>

        {/* Pending Requests */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
          <span className="text-[9px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">Pending Requests</span>
          <span className="text-2xl font-black text-slate-800 dark:text-white mt-2 block font-headline">
            {pendingRequestsCount}
          </span>
          <span className="text-[9px] text-brand font-semibold block mt-1">Awaiting accepts</span>
        </div>

        {/* Critical Requests */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
          <span className="text-[9px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">Critical Requests</span>
          <span className={`text-2xl font-black mt-2 block font-headline ${criticalRequestsCount > 0 ? 'text-danger animate-pulse' : 'text-slate-800 dark:text-white'}`}>
            {criticalRequestsCount}
          </span>
          <span className={`text-[9px] font-semibold block mt-1 ${criticalRequestsCount > 0 ? 'text-danger' : 'text-slate-450'}`}>
            {criticalRequestsCount > 0 ? 'SOS Paging Active' : 'Normal level'}
          </span>
        </div>

        {/* Average Response Time */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
          <span className="text-[9px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">Avg Response Time</span>
          <span className="text-2xl font-black text-slate-800 dark:text-white mt-2 block font-headline">
            {avgResponseTime}
          </span>
          <span className="text-[9px] text-emerald-500 font-semibold block mt-1">Under 5m target</span>
        </div>

      </div>

      {/* Main Focus: Quick Actions & Live Specialist Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block border-b pb-2">Quick Actions</span>
          
          <div className="space-y-2.5">
            <button
              onClick={handleQuickEmergency}
              className="w-full bg-danger hover:bg-red-650 text-white font-bold text-xs py-2.5 rounded flex items-center justify-center space-x-1.5 transition-all shadow-sm font-headline"
            >
              <span className="material-symbols-outlined text-sm font-bold">cell_tower</span>
              <span>Trigger Emergency SOS</span>
            </button>
            
            <button
              onClick={() => setActivePage('appointments')}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-200 font-bold text-xs py-2.5 rounded flex items-center justify-center space-x-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>New Routine Consultation</span>
            </button>

            <button
              onClick={() => setActivePage('doctors')}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-200 font-bold text-xs py-2.5 rounded flex items-center justify-center space-x-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-sm">group</span>
              <span>View Specialists Registry</span>
            </button>
          </div>
        </div>

        {/* Live status of specialists list (Overview) */}
        <div className="md:col-span-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block border-b pb-2">Specialist Presence Summary</span>
          
          <div className="divide-y divide-slate-100 dark:divide-dark-border/40 text-xs">
            {doctors.slice(0, 4).map(doc => {
              const hosp = hospitals.find(h => h.id === doc.currentHospitalId);
              return (
                <div key={doc.id} className="py-2.5 flex justify-between items-center">
                  <div className="flex items-center space-x-2.5">
                    <img src={doc.avatar} alt={doc.name} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <span className="font-semibold text-slate-750 dark:text-slate-200 block">{doc.name}</span>
                      <span className="text-[9.5px] text-slate-400 block -mt-0.5">{doc.specialty}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[8.5px] px-2 py-0.5 rounded font-bold uppercase ${
                      doc.status === 'Available' ? 'bg-emerald-500/10 text-success' :
                      doc.status === 'Emergency' ? 'bg-red-500/10 text-danger animate-pulse' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>{doc.status}</span>
                    <span className="text-[9px] text-slate-400 block mt-1 font-mono">{hosp?.shortName || 'Offline'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
