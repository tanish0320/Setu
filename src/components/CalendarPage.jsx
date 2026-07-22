import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CalendarPage = () => {
  const {
    role,
    appointments,
    doctors,
    hospitals,
    selectedHospital,
    selectedDoctor,
    moveAppointment,
    detectScheduleConflict,
    getSmartSlotSuggestions,
    overrideConflict
  } = useApp();

  const [selectedAppt, setSelectedAppt] = useState(null);
  const [newTime, setNewTime] = useState('10:00');
  const [newDay, setNewDay] = useState('Monday');

  // Filter appointments: Doctor schedule vs Hospital schedule
  const calendarAppts = role === 'Doctor' 
    ? appointments.filter(a => a.doctorId === selectedDoctor.id)
    : appointments.filter(a => a.hospitalId === selectedHospital.id);

  const getHospitalDetails = (hospId) => {
    return hospitals.find(h => h.id === hospId) || { name: 'Apollo Hospital', color: '#2563EB', shortName: 'Apollo', distance: 2.0 };
  };

  const handleMoveSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    moveAppointment(selectedAppt.id, newTime, newDay);
    setSelectedAppt(prev => prev ? { ...prev, time: newTime, date: newDay } : null);
    alert(`Appointment rescheduled to ${newDay} ${newTime}. Conflict ledger updated.`);
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-4 animate-fade-in text-left font-sans relative">
      
      {/* Page Title & Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 dark:border-dark-border pb-3 gap-3">
        <div>
          <h2 className="text-xl font-black font-headline text-slate-800 dark:text-white">Unified 7-Day Network Calendar</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {role === 'Doctor' 
              ? `Synchronized multi-hospital schedule for Dr. ${selectedDoctor.name.split(' ').pop()}`
              : `Operational schedule and travel buffer grid for ${selectedHospital.name}`
            }
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold">
          <span className="text-slate-400 uppercase tracking-wider">Hospitals:</span>
          {hospitals.slice(0, 5).map(h => (
            <span key={h.id} className="flex items-center" style={{ color: h.color }}>
              <span className="w-2 h-2 rounded-full mr-1 shrink-0" style={{ backgroundColor: h.color }}></span>
              {h.shortName}
            </span>
          ))}
        </div>
      </div>

      {/* 7-Day Full Width Calendar Grid (100% Usable Width) */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {daysOfWeek.map(day => {
            const isSunday = day === 'Sunday';
            const dayAppts = calendarAppts.filter(a => a.date.toLowerCase() === day.toLowerCase());
            
            return (
              <div 
                key={day} 
                className={`border rounded-premium p-2 flex flex-col transition-all min-h-[420px] ${
                  isSunday 
                    ? 'bg-slate-100/40 dark:bg-slate-900/40 border-slate-200 dark:border-dark-border/40 opacity-80 border-dashed' 
                    : 'bg-slate-50/20 dark:bg-slate-900/10 border-slate-200 dark:border-dark-border/70'
                }`}
              >
                {/* Day Header */}
                <div className="border-b pb-1.5 mb-2 text-center border-slate-200 dark:border-dark-border/40">
                  <h3 className={`text-[10.5px] font-black uppercase tracking-wider ${isSunday ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {day}
                  </h3>
                  {isSunday ? (
                    <span className="text-[8px] font-bold text-amber-500 block uppercase font-mono">Off Duty / Emergency</span>
                  ) : (
                    <span className="text-[8.5px] font-mono text-slate-400 block">{dayAppts.length} Consults</span>
                  )}
                </div>

                {/* Day Slots List */}
                <div className="space-y-1.5 flex-1 overflow-y-auto pr-0.5">
                  {dayAppts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[9.5px] text-slate-350 italic py-20 text-center">
                      {isSunday ? 'On-Call Only' : 'No Slots'}
                    </div>
                  ) : (
                    dayAppts.sort((a,b) => a.time.localeCompare(b.time)).map(appt => {
                      const hosp = getHospitalDetails(appt.hospitalId);
                      const isSelected = selectedAppt?.id === appt.id;
                      
                      return (
                        <div 
                          key={appt.id}
                          onClick={() => {
                            setSelectedAppt(appt);
                            setNewTime(appt.time);
                            setNewDay(appt.date);
                          }}
                          className={`p-1.5 border rounded cursor-pointer transition-all text-[11px] ${
                            isSelected 
                              ? 'ring-2 ring-brand bg-brand-50/20 dark:bg-brand-900/20 shadow' 
                              : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border/60 hover:border-brand/40 hover:shadow-xs'
                          }`}
                          style={{ borderLeftWidth: '3px', borderLeftColor: hosp.color }}
                        >
                          {/* Time & Hospital Badge */}
                          <div className="flex justify-between items-center text-[8.5px] font-semibold text-slate-400">
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{appt.time}</span>
                            <span className="font-bold truncate max-w-[65px]" style={{ color: hosp.color }}>{hosp.shortName}</span>
                          </div>

                          {/* Patient Name */}
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5 text-[10.5px]">
                            {appt.patientName} <span className="text-[8.5px] font-normal text-slate-400">({appt.age}y/{appt.gender})</span>
                          </h4>

                          {/* Compact Badges Row */}
                          <div className="flex items-center justify-between text-[8px] mt-1 gap-1">
                            <span className="bg-brand/10 text-brand px-1 py-0.2 rounded font-bold truncate">
                              {appt.type || 'Physical'}
                            </span>
                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono px-1 py-0.2 rounded">
                              {appt.duration || '30m'}
                            </span>
                          </div>

                          {/* Commute Badge */}
                          <div className="text-[8px] text-slate-400 font-mono mt-1 flex justify-between items-center">
                            <span>Commute:</span>
                            <span className="font-bold text-slate-600 dark:text-slate-300">{appt.commuteTime || '12 mins'}</span>
                          </div>

                          {/* Conflict Alert Flag */}
                          {appt.warning && !appt.overridden && (
                            <div className="mt-1 px-1 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded text-[8px] font-bold flex items-center justify-between">
                              <span>⚠️ Buffer Alert</span>
                              <span className="underline">Details</span>
                            </div>
                          )}

                          {appt.overridden && (
                            <span className="mt-1 text-[7.5px] bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold px-1 py-0.2 rounded block text-center uppercase">
                              Bypass Approved
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-Over Contextual Rescheduling & Details Drawer */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in bg-slate-900/30 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-dark-card border-l border-slate-200 dark:border-dark-border h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto text-left">
            
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-dark-border">
                <div>
                  <h3 className="text-sm font-bold font-headline text-slate-800 dark:text-white">Appointment Details & Rescheduler</h3>
                  <span className="text-[9px] text-slate-400 font-mono">ID: {selectedAppt.id}</span>
                </div>
                <button
                  onClick={() => setSelectedAppt(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {/* Patient & Hospital Info */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-premium border border-slate-200 dark:border-dark-border/40 text-xs space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{selectedAppt.patientName}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold">{selectedAppt.age} years • {selectedAppt.gender === 'M' ? 'Male' : 'Female'}</span>
                  </div>
                  <span className="text-[9px] bg-brand/10 text-brand font-bold px-2 py-0.5 rounded border border-brand/20">
                    {selectedAppt.type || 'Physical'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-dark-border/30 grid grid-cols-2 gap-2 text-[10.5px]">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">Scheduled Node</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{selectedAppt.hospitalName}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">Current Slot</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">{selectedAppt.date} {selectedAppt.time}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">Duration</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{selectedAppt.duration || '30 min'}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">Commute Buffer</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{selectedAppt.commuteTime || '12 mins'}</span>
                  </div>
                </div>
              </div>

              {/* Conflict Detection Banner */}
              {selectedAppt.warning && !selectedAppt.overridden && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-premium text-xs space-y-2">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span>Commute Conflict Warning</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">{selectedAppt.warning}</p>

                  {/* AI Reschedule Suggestion */}
                  <div className="pt-2 border-t border-amber-500/20 space-y-1.5">
                    <span className="text-[9px] font-bold text-brand uppercase tracking-wider block">AI Suggested Optimal Slots:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {getSmartSlotSuggestions(selectedAppt.doctorId, selectedAppt.hospitalId, selectedAppt.date).map((sTime, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => {
                            moveAppointment(selectedAppt.id, sTime, selectedAppt.date);
                            setSelectedAppt(prev => ({ ...prev, time: sTime }));
                          }}
                          className="bg-white dark:bg-dark-card border border-brand/30 text-brand font-bold text-[10px] px-2 py-0.5 rounded hover:bg-brand hover:text-white transition-colors"
                        >
                          Move to {sTime}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const r = prompt('Enter authorization rationale for buffer override:');
                      if (r) {
                        overrideConflict(selectedAppt.id, r);
                        setSelectedAppt(prev => ({ ...prev, overridden: true }));
                      }
                    }}
                    className="text-[9.5px] text-slate-400 hover:text-brand font-bold uppercase mt-1 block hover:underline"
                  >
                    Authorize Conflict Override
                  </button>
                </div>
              )}

              {/* Reschedule Controls Form */}
              <form onSubmit={handleMoveSubmit} className="space-y-4 text-xs pt-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b pb-1">Reschedule Shift Slot</span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Target Day</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 p-2 rounded focus:outline-none font-medium"
                      value={newDay}
                      onChange={(e) => setNewDay(e.target.value)}
                    >
                      {daysOfWeek.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Target Time</label>
                    <input
                      type="time"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 p-2 rounded focus:outline-none font-mono"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-600 text-white font-bold text-xs py-2.5 rounded shadow transition-colors font-headline uppercase tracking-wider"
                >
                  Confirm Slot Update
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-dark-border/40 text-center">
              <button
                onClick={() => setSelectedAppt(null)}
                className="text-xs text-slate-400 font-bold hover:underline"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
