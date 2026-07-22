import React from 'react';
import { useApp } from '../context/AppContext';

export const RoleDashboardDoctor = () => {
  const {
    selectedDoctor,
    appointments,
    dispatches,
    activityFeed,
    activeSOS, sosCountdown,
    changeDoctorStatus,
    setActivePage,
    hospitals,
    addToast,
    openModal
  } = useApp();

  const docAppts = appointments.filter(a => a.doctorId === selectedDoctor.id);

  // Exact doctor metrics requested
  const todaysConsultationsCount = 6;
  const emergencyCallsCount = 2;
  const travelTimeMinutes = "42 mins";
  const hospitalsTodayCount = 3;

  const getHospitalDetails = (hospId) => {
    return hospitals.find(h => h.id === hospId) || hospitals[0];
  };

  const handleStatusChange = (e) => {
    changeDoctorStatus(selectedDoctor.id, e.target.value);
    addToast('Presence Updated', `Status changed to ${e.target.value}`, 'success');
  };

  return (
    <div className="w-full space-y-4 animate-fade-in text-left font-sans">
      
      {/* Welcome Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-850 dark:text-white font-headline tracking-tight">
            Good Morning, {selectedDoctor.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedDoctor.specialty} Specialist • {selectedDoctor.experience} Years Experience • Punctuality Index {selectedDoctor.reliability.overall}%
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400 font-bold">Presence Status:</span>
          <select
            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border font-bold text-xs text-brand p-1.5 rounded focus:outline-none cursor-pointer"
            value={selectedDoctor.status}
            onChange={handleStatusChange}
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

      {/* Emergency Commute Reminder Banner */}
      {activeSOS && activeSOS.status === 'Accepted' && activeSOS.doctor?.id === selectedDoctor.id && (
        <div 
          onClick={() => setActivePage('emergency')}
          className="bg-red-500/10 border border-red-500/20 text-danger p-3.5 rounded-premium flex items-center justify-between shadow-glow-red animate-pulse cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-danger text-2xl">directions_car</span>
            <div className="text-xs">
              <span className="font-bold block text-red-700 dark:text-red-300">🚨 Code Blue Emergency Commute Active (Click to View Route)</span>
              <span className="text-slate-500 dark:text-slate-400">Destination: {getHospitalDetails(activeSOS.hospitalId).name}</span>
            </div>
          </div>
          <span className="font-mono font-black text-base">
            {sosCountdown > 0 ? `${Math.floor(sosCountdown / 60)}m ${sosCountdown % 60}s` : 'ARRIVED'}
          </span>
        </div>
      )}

      {/* Doctor Metrics (5 KPI Cards Row - ALL INTERACTIVE) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        {/* Today's Consultations */}
        <div 
          onClick={() => {
            setActivePage('calendar');
            addToast('7-Day Calendar', 'Opening multi-hospital schedule grid.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3.5 rounded-premium shadow-xs flex flex-col justify-between hover:border-brand cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Today's Consults</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-brand font-headline">{todaysConsultationsCount}</span>
            <span className="text-[9px] text-brand underline font-bold">View Grid ➔</span>
          </div>
        </div>

        {/* Emergency Calls */}
        <div 
          onClick={() => {
            setActivePage('emergency');
            addToast('Emergency Alerts', 'Opening Code Blue pager alerts.', 'danger');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3.5 rounded-premium shadow-xs flex flex-col justify-between hover:border-red-500 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Emergency Calls</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-danger font-headline">{emergencyCallsCount}</span>
            <span className="text-[9px] text-danger font-bold underline">Pager Hub ➔</span>
          </div>
        </div>

        {/* Travel Time */}
        <div 
          onClick={() => {
            setActivePage('reports');
            addToast('Commute Diagnostics', 'Opening travel buffer telemetry.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3.5 rounded-premium shadow-xs flex flex-col justify-between hover:border-amber-500 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Travel Time</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-amber-500 font-headline">{travelTimeMinutes}</span>
            <span className="text-[9px] text-slate-400 underline">Buffers ➔</span>
          </div>
        </div>

        {/* Hospitals Today */}
        <div 
          onClick={() => {
            setActivePage('hospitals');
            addToast('Hospital Network', 'Viewing assigned hospital nodes.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3.5 rounded-premium shadow-xs flex flex-col justify-between hover:border-slate-400 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Hospitals Today</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-800 dark:text-white font-headline">{hospitalsTodayCount}</span>
            <span className="text-[9px] text-slate-400 underline">Network ➔</span>
          </div>
        </div>

        {/* Availability */}
        <div 
          onClick={() => {
            const nextStatus = selectedDoctor.status === 'Available' ? 'Busy' : 'Available';
            changeDoctorStatus(selectedDoctor.id, nextStatus);
            addToast('Status Toggled', `Switched presence to ${nextStatus}`, 'success');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3.5 rounded-premium shadow-xs flex flex-col justify-between hover:border-emerald-500 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Availability</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-black text-emerald-500 font-headline">{selectedDoctor.status}</span>
            <span className="text-[9px] text-emerald-500 font-bold underline">Toggle ➔</span>
          </div>
        </div>

      </div>

      {/* Main Multi-Column Grid: Today's Schedule + Upcoming Emergencies + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
        
        {/* Column 1: Today's Multi-Hospital Schedule */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center">
                <span className="material-symbols-outlined text-brand text-sm mr-1">calendar_month</span>
                Today's Multi-Hospital Consultation Grid
              </span>
              <button onClick={() => setActivePage('calendar')} className="text-xs text-brand font-bold hover:underline cursor-pointer">
                View Full 7-Day Calendar ➔
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3">
              {docAppts.slice(0, 6).map((appt) => {
                const hosp = getHospitalDetails(appt.hospitalId);
                return (
                  <div 
                    key={appt.id} 
                    onClick={() => openModal('patient_details', { name: appt.patientName, age: appt.age, gender: appt.gender, condition: appt.type || 'Physical Consultation', phone: '+91 98401 22910' })}
                    className="p-3 border border-slate-200 dark:border-dark-border/60 rounded-premium bg-slate-50/30 dark:bg-slate-900/10 space-y-1.5 hover:border-brand cursor-pointer transition-all hover:shadow-xs"
                  >
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-xs">{appt.time}</span>
                      <span className="font-bold text-brand" style={{ color: hosp.color }}>{hosp.shortName}</span>
                    </div>

                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">{appt.patientName} <span className="text-[9px] font-normal text-slate-400">({appt.age}y/{appt.gender})</span></h4>

                    <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1 border-t border-slate-100 dark:border-dark-border/30">
                      <span>Mode: <span className="font-semibold text-slate-700 dark:text-slate-300">{appt.type || 'Physical'}</span></span>
                      <span>Commute: <span className="font-mono font-semibold">{appt.commuteTime || '12 mins'}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-dark-border/40 text-center">
            <button onClick={() => setActivePage('emergency')} className="text-xs text-brand font-bold hover:underline cursor-pointer">
              View Consultation Requests & Emergency Alerts ➔
            </button>
          </div>
        </div>

        {/* Column 2: Emergency Dispatches & Recent Feed */}
        <div className="space-y-4">
          
          {/* Emergency SOS Alerts Widget */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center">
                <span className="material-symbols-outlined text-danger text-sm mr-1">cell_tower</span>
                Active Emergency Dispatches
              </span>
              <span className="text-[9px] font-mono text-danger font-bold bg-danger/10 px-1.5 py-0.2 rounded">LIVE</span>
            </div>

            <div className="space-y-2">
              {dispatches.slice(0, 3).map(disp => (
                <div 
                  key={disp.id} 
                  onClick={() => openModal('patient_details', { name: disp.patientName, age: 52, gender: 'M', condition: disp.condition, severity: disp.severity, phone: '+91 98100 88210' })}
                  className="p-2 bg-slate-50 dark:bg-slate-900/30 rounded border border-slate-100 dark:border-dark-border/40 flex justify-between items-center text-[10.5px] hover:border-red-500 cursor-pointer transition-all"
                >
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">{disp.patientName}</span>
                    <span className="text-[9px] text-slate-400">{disp.condition}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono font-bold text-danger block">ETA: {disp.eta}</span>
                    <span className="text-[8px] bg-red-500/10 text-danger px-1 py-0.2 rounded font-bold uppercase">{disp.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs Feed */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b pb-2">Operational Timeline</span>
            
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-0.5 text-[10px]">
              {activityFeed.slice(0, 4).map((act, idx) => (
                <div 
                  key={idx} 
                  onClick={() => openModal('event_details', act)}
                  className="flex items-start space-x-2 hover:bg-slate-50 dark:hover:bg-slate-900/30 p-1 rounded cursor-pointer transition-colors"
                >
                  <span className="font-mono font-bold text-slate-400 shrink-0">{act.time}</span>
                  <div className="flex-1 truncate">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block truncate">{act.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
