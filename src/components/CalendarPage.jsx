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

  const [apptToMove, setApptToMove] = useState('');
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
    if (!apptToMove) return;
    moveAppointment(apptToMove, newTime, newDay);
    setApptToMove('');
    alert('Appointment rescheduled. Conflict ledger updated.');
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-dark-border pb-4">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Unified Calendar</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {role === 'Doctor' 
              ? `Unified schedule synchronizing all hospital engagements for Dr. ${selectedDoctor.name.split(' ').pop()}.`
              : `Today's appointments scheduled at ${selectedHospital.name}`
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Weekly calendar blocks */}
        <div className="xl:col-span-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-dark-border/40 text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Weekly Schedule View</span>
            
            <div className="flex gap-3 text-[9px] font-bold">
              {hospitals.slice(0, 3).map(h => (
                <span key={h.id} className="flex items-center" style={{ color: h.color }}>
                  <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: h.color }}></span>
                  {h.shortName}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
              const dayAppts = calendarAppts.filter(a => a.date.toLowerCase() === day.toLowerCase());
              
              return (
                <div key={day} className="border border-slate-200 dark:border-dark-border rounded-premium p-3 bg-slate-50/20 dark:bg-slate-900/10 min-h-[350px] flex flex-col">
                  <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 border-b pb-2 mb-3 text-center uppercase tracking-wider">{day}</h3>
                  
                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {dayAppts.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[10px] text-slate-350 italic py-16">
                        No appointments
                      </div>
                    ) : (
                      dayAppts.sort((a,b)=>a.time.localeCompare(b.time)).map(appt => {
                        const hosp = getHospitalDetails(appt.hospitalId);
                        const travelTime = Math.round(hosp.distance * 3.5 + 4);
                        
                        return (
                          <div 
                            key={appt.id} 
                            className="p-3 border rounded text-xs bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border/50 hover:shadow-sm transition-shadow"
                            style={{ borderLeftWidth: '3px', borderLeftColor: hosp.color }}
                          >
                            <div className="flex justify-between items-center text-[9px] font-semibold text-slate-400">
                              <span className="font-mono text-slate-700 dark:text-slate-200 font-bold">{appt.time}</span>
                              <span style={{ color: hosp.color }}>{hosp.shortName}</span>
                            </div>
                            
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 mt-1.5">{appt.patientName}</h4>
                            <span className="text-[9.5px] text-slate-400 block mt-0.5">Physical consultation</span>
                            <span className="text-[9px] text-slate-450 block font-mono mt-1">Commute: {travelTime} mins</span>

                            {/* CONFLICT INDICATOR (AI SUGGESTIONS ONLY RENDER HERE) */}
                            {appt.warning && !appt.overridden && (
                              <div className="mt-2.5 p-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded text-[9.5px] space-y-1.5">
                                <div className="flex items-start space-x-1 font-bold">
                                  <span className="material-symbols-outlined text-[11px] mt-0.5">warning</span>
                                  <span>Conflict Detected:</span>
                                </div>
                                <p className="leading-snug text-slate-500 dark:text-slate-400">{appt.warning}</p>
                                
                                {/* AI suggestion link */}
                                <div className="pt-1.5 border-t border-amber-500/15 text-[9.5px] space-y-1">
                                  <span className="font-bold text-brand uppercase block text-[8px] tracking-wider">AI Reschedule Suggestion:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {getSmartSlotSuggestions(appt.doctorId, appt.hospitalId, appt.date).map((sTime, sIdx) => (
                                      <button
                                        key={sIdx} type="button"
                                        onClick={() => moveAppointment(appt.id, sTime, appt.date)}
                                        className="bg-white dark:bg-dark-card border border-brand/20 text-brand px-1.5 py-0.2 rounded font-bold hover:bg-brand hover:text-white"
                                      >
                                        Move to {sTime}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const r = prompt('Reason for override:');
                                    if (r) overrideConflict(appt.id, r);
                                  }}
                                  className="text-[8.5px] text-slate-400 hover:text-brand font-bold uppercase mt-1 block hover:underline"
                                >
                                  Override Buffer
                                </button>
                              </div>
                            )}

                            {appt.overridden && (
                              <span className="mt-2 text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold px-1 py-0.2 rounded block text-center uppercase">
                                Override Bypass Authorized
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

        {/* Reschedule controller (Right Column) */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm text-xs space-y-4">
          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block border-b pb-2">Shift Rescheduling</span>
          
          <form onSubmit={handleMoveSubmit} className="space-y-4">
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Select Consultation</label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-705 dark:text-slate-200 p-2 rounded focus:outline-none"
                value={apptToMove}
                onChange={(e) => setApptToMove(e.target.value)}
              >
                <option value="">-- Choose Slot --</option>
                {calendarAppts.map(a => (
                  <option key={a.id} value={a.id}>{a.patientName} ({a.date} {a.time})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">New Day</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-705 dark:text-slate-200 p-2 rounded focus:outline-none"
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value)}
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">New Time</label>
                <input
                  type="time"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 p-2 rounded focus:outline-none"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand hover:bg-brand-600 text-white font-bold text-xs py-2 rounded transition-colors"
            >
              Update Slot Buffer
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
