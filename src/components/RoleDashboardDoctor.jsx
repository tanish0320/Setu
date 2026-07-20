import React from 'react';
import { useApp } from '../context/AppContext';

export const RoleDashboardDoctor = () => {
  const {
    selectedDoctor,
    appointments,
    activeSOS, sosCountdown,
    changeDoctorStatus,
    setActivePage,
    hospitals
  } = useApp();

  // Get doctor specific schedule
  const docAppts = appointments.filter(a => a.doctorId === selectedDoctor.id);
  const pendingAppts = docAppts.filter(a => a.status === 'Pending');

  // Hardcoded values from specifications for realistic demo
  const nextApptMinutes = 35; 
  const pendingRequestsCount = 3;
  const criticalRequestsCount = activeSOS ? 1 : 0;

  const getHospitalDetails = (hospId) => {
    return hospitals.find(h => h.id === hospId) || { name: 'Apollo Hospital', shortName: 'Apollo' };
  };

  const handleStatusChange = (e) => {
    changeDoctorStatus(selectedDoctor.id, e.target.value);
  };

  const doctorLastName = selectedDoctor.name.split(' ').pop();

  return (
    <div className="max-w-xl mx-auto py-8 px-4 text-left space-y-8 animate-fade-in">
      
      {/* Welcome Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-850 dark:text-white font-headline tracking-tight">
          Good Morning, Dr. {doctorLastName}
        </h1>
        <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">
          Simplicity first coordination workspace.
        </p>
      </div>

      {/* Travel Reminder (Emergency SOS Commute) */}
      {activeSOS && activeSOS.status === 'Accepted' && activeSOS.doctor?.id === selectedDoctor.id && (
        <div className="bg-red-500/10 border border-red-500/20 text-danger p-4 rounded-premium flex items-center justify-between shadow-glow-red animate-pulse">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-danger text-2xl">directions_car</span>
            <div className="text-xs">
              <span className="font-bold block text-red-700 dark:text-red-300">En-route Emergency Commute</span>
              <span className="text-slate-500 dark:text-slate-400">Destination: {getHospitalDetails(activeSOS.hospitalId).name}</span>
            </div>
          </div>
          <span className="font-mono font-black text-base">
            {sosCountdown > 0 ? `${Math.floor(sosCountdown / 60)}m ${sosCountdown % 60}s` : 'ARRIVED'}
          </span>
        </div>
      )}

      {/* Main Grid Card: Today's Focus */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-6">
        
        {/* Next Appointment & Status row */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-dark-border/40 pb-5">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Current Status</span>
            <select
              className="mt-1 bg-transparent border-0 font-headline font-black text-brand text-lg p-0 focus:ring-0 focus:outline-none cursor-pointer"
              value={selectedDoctor.status}
              onChange={handleStatusChange}
            >
              <option value="Available">Available</option>
              <option value="Travelling">Travelling</option>
              <option value="In Consultation">In Consultation</option>
              <option value="On Break">On Break</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Next Appointment</span>
            <span className="font-headline font-black text-slate-800 dark:text-white text-lg block mt-1">
              {nextApptMinutes} minutes
            </span>
          </div>
        </div>

        {/* Pending Requests & Critical Requests counts */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-dark-border/40 pb-5">
          <div 
            onClick={() => setActivePage('emergency')}
            className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/10 p-2 rounded transition-colors"
          >
            <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block">Pending Requests</span>
            <span className="text-xl font-headline font-black text-brand block mt-1">
              {pendingRequestsCount}
            </span>
          </div>
          <div 
            onClick={() => setActivePage('emergency')}
            className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/10 p-2 rounded transition-colors"
          >
            <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block">Critical Requests</span>
            <span className={`text-xl font-headline font-black block mt-1 ${criticalRequestsCount > 0 ? 'text-danger animate-pulse' : 'text-slate-800 dark:text-white'}`}>
              {criticalRequestsCount}
            </span>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="space-y-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Today's Schedule</span>
          
          <div className="space-y-3.5">
            {docAppts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 italic">No shift appointments scheduled for today.</p>
            ) : (
              docAppts.slice(0, 3).map((appt, idx) => {
                const hosp = getHospitalDetails(appt.hospitalId);
                // Mock times matching specification
                const mockTimes = ['9:00 AM', '11:30 AM', '2:00 PM'];
                const apptTime = mockTimes[idx % mockTimes.length];
                const modeLabel = idx === 2 ? 'Online Consultation' : hosp.name;

                return (
                  <div key={appt.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-3.5">
                      <span className="font-mono font-bold text-slate-550 dark:text-slate-400 w-16">{apptTime}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{modeLabel}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{appt.patientName}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
