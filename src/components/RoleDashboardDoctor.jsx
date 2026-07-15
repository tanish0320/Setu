import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, ProgressRing } from './SvgCharts';
import { SvgNetworkMap } from './SvgNetworkMap';

export const RoleDashboardDoctor = () => {
  const {
    selectedDoctor,
    appointments,
    handoffs, addHandoffNote,
    hospitals,
    activeSOS, acceptSOS,
    changeDoctorStatus,
    detectScheduleConflict
  } = useApp();

  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('M');
  const [diagnosis, setDiagnosis] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [treatment, setTreatment] = useState('');

  // Filter Doctor Specific Lists
  const docAppts = appointments.filter(a => a.doctorId === selectedDoctor.id);
  const pendingAppts = docAppts.filter(a => a.status === 'Pending');
  const completedAppts = docAppts.filter(a => a.status === 'Completed');
  const docHandoffs = handoffs.filter(h => h.doctorId === selectedDoctor.id);

  const getHospitalDetails = (hospId) => {
    return hospitals.find(h => h.id === hospId) || { name: 'Unknown Hospital', color: '#64748B', shortName: 'Unknown' };
  };

  const handleHandoffNoteSubmit = (e) => {
    e.preventDefault();
    if (!patientName || !diagnosis) return;
    addHandoffNote({
      patientName, age, gender,
      chiefComplaint, diagnosis, treatment,
      medications: 'Aspirin PRN', followUp: 'Review in 1 week',
      doctorId: selectedDoctor.id,
      hospitalId: selectedDoctor.currentHospitalId !== 'none' ? selectedDoctor.currentHospitalId : 'h1'
    });
    setPatientName('');
    setAge('');
    setDiagnosis('');
    setChiefComplaint('');
    setTreatment('');
    alert('Structured Handoff Profile Synced!');
  };

  const pendingSOSAlert = activeSOS && 
    activeSOS.status === 'Dispatched' && 
    activeSOS.specialty.toLowerCase() === selectedDoctor.specialty.toLowerCase();

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Emergency alert banner at the top */}
      {pendingSOSAlert && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-premium p-5 flex flex-col md:flex-row items-center justify-between shadow-glow-red animate-pulse">
          <div className="flex items-center space-x-3.5 mb-3 md:mb-0">
            <span className="material-symbols-outlined text-danger text-3xl animate-bounce">emergency</span>
            <div>
              <h4 className="text-xs font-black text-slate-800 dark:text-red-300">🚨 INCOMING CRITICAL EMERGENCY SOS DISPATCH</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Cohort specialty needed: <span className="font-bold text-danger">{activeSOS.specialty}</span> • 
                Node: <span className="font-bold">{getHospitalDetails(activeSOS.hospitalId).name}</span> • 
                Priority: <span className="font-bold text-danger">{activeSOS.urgency}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => acceptSOS(selectedDoctor.id)}
            className="bg-danger hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-premium shadow-md shadow-red-500/10 transition-colors"
          >
            ACCEPT & COMMENCE ROUTING
          </button>
        </div>
      )}

      {/* Main Grid: Left 2/3 for Timeline and Logs, Right 1/3 for Metrics and comms */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Today's Schedule Timeline & Commutes */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-dark-border/40">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <span className="material-symbols-outlined text-brand mr-2">clinical_trial</span>
                Today's Chronological Consultations Timeline
              </h3>
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded">
                {docAppts.length} appointments
              </span>
            </div>

            {docAppts.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <span className="material-symbols-outlined text-3xl mb-1">calendar_today</span>
                <p className="text-xs">No shifts scheduled for today</p>
              </div>
            ) : (
              <div className="relative border-l border-slate-100 dark:border-dark-border/40 pl-6 space-y-5">
                {docAppts.map(appt => {
                  const hosp = getHospitalDetails(appt.hospitalId);
                  
                  return (
                    <div key={appt.id} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-dark-card" style={{ backgroundColor: hosp.color }}></span>
                      
                      <div className="flex items-start justify-between border border-slate-100 dark:border-dark-border/40 p-3.5 rounded bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-200 transition-colors">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                              {appt.time}
                            </span>
                            <span className="text-xs font-bold" style={{ color: hosp.color }}>
                              {hosp.shortName}
                            </span>
                          </div>
                          
                          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mt-2">
                            {appt.patientName} <span className="text-[10px] text-slate-400 font-normal">({appt.age}y/{appt.gender})</span>
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{appt.department}</p>
                          
                          {appt.warning && (
                            <div className="mt-2 flex items-start space-x-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-2 rounded text-[10px]">
                              <span className="material-symbols-outlined text-xs font-bold mt-0.5">warning</span>
                              <span>{appt.warning}</span>
                            </div>
                          )}
                        </div>

                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                          appt.status === 'Completed' ? 'bg-emerald-500/15 text-success' : 'bg-brand-500/15 text-brand'
                        }`}>{appt.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Confirmations list */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4 pb-3 border-b border-slate-100 dark:border-dark-border/40">
              <span className="material-symbols-outlined text-brand mr-2">event_repeat</span>
              Pending Confirmations
            </h3>

            <div className="space-y-2.5">
              {pendingAppts.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No pending schedule confirmations.</p>
              ) : (
                pendingAppts.map(appt => (
                  <div key={appt.id} className="p-3 border border-slate-50 dark:border-dark-border/40 rounded bg-slate-50/20 dark:bg-slate-900/5 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{appt.patientName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold ml-2">({getHospitalDetails(appt.hospitalId).shortName} • {appt.time})</span>
                    </div>
                    <span className="text-[9px] bg-brand/10 text-brand px-2 py-0.5 rounded font-bold uppercase">{appt.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Patient Handoff Structured Summary */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4 pb-3 border-b border-slate-100 dark:border-dark-border/40">
              <span className="material-symbols-outlined text-brand mr-2">note_add</span>
              Log Structured Patient Handoff Note
            </h3>

            <form onSubmit={handleHandoffNoteSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Patient Name</label>
                  <input
                    type="text" required placeholder="Aarav Mehta"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-brand focus:outline-none"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Age & Gender</label>
                  <div className="flex space-x-1">
                    <input
                      type="number" required placeholder="Age"
                      className="w-14 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-brand focus:outline-none"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                    <select
                      className="flex-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded p-2 focus:outline-none"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Chief Complaint</label>
                  <input
                    type="text" required placeholder="Symptoms summary"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-brand focus:outline-none"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Clinical Diagnosis</label>
                  <input
                    type="text" required placeholder="Suspected condition"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-brand focus:outline-none"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Treatment Strategy</label>
                <input
                  type="text" required placeholder="Medications & care plan..."
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-brand focus:outline-none"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-600 text-white font-bold text-xs py-2 rounded-premium transition-colors"
              >
                Sync & Broadcast Handoff Profile
              </button>
            </form>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Active node presence details */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm text-xs space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Node Live Status</span>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Current Hospital:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{selectedDoctor.currentHospitalId !== 'none' ? getHospitalDetails(selectedDoctor.currentHospitalId).name : 'Offline'}</span>
            </div>
            
            {activeSOS && activeSOS.status === 'Accepted' && activeSOS.doctor.id === selectedDoctor.id && (
              <div className="bg-red-500/10 border border-red-500/20 text-danger p-2.5 rounded font-medium flex justify-between items-center">
                <span>SOS Transit ETA:</span>
                <span className="font-mono font-bold animate-pulse">
                  {sosCountdown > 0 ? `${Math.floor(sosCountdown / 60)}m ${sosCountdown % 60}s` : 'ARRIVED'}
                </span>
              </div>
            )}
          </div>

          {/* Quick status presence toggle */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-3">Quick Presence Status Toggle</span>
            <div className="grid grid-cols-3 gap-2">
              {['Available', 'On Break', 'Offline'].map(st => (
                <button
                  key={st}
                  onClick={() => changeDoctorStatus(selectedDoctor.id, st)}
                  className={`text-[10px] py-1.5 border rounded font-semibold transition-all ${
                    selectedDoctor.status === st 
                      ? 'bg-brand/10 text-brand border-brand font-bold' 
                      : 'border-slate-200 dark:border-dark-border text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Svg Map preview */}
          <SvgNetworkMap />

          {/* Reliability history trend (SVG Line Chart) */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Reliability Metrics</span>
              <span className="text-xs font-black text-brand">{selectedDoctor.reliability.overall}% Overall</span>
            </div>
            <LineChart data={selectedDoctor.reliability.history} height={100} />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          {/* Calendar Preview Grid */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-3">Calendar slots preview</span>
            <div className="grid grid-cols-5 gap-1.5">
              {['M', 'T', 'W', 'T', 'F'].map((day, idx) => {
                const apptsCount = docAppts.filter(a => a.date.toLowerCase() === ['monday','tuesday','wednesday','thursday','friday'][idx]).length;
                return (
                  <div key={idx} className="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-dark-border/40 rounded">
                    <span className="text-[9px] text-slate-400 font-bold">{day}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">{apptsCount}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
