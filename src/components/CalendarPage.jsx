import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SvgNetworkMap } from './SvgNetworkMap';

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
    overrideConflict,
    overrides
  } = useApp();

  const [apptToMove, setApptToMove] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [newDay, setNewDay] = useState('Monday');

  // Filter calendar appointments:
  // If doctor, show their appointments. If receptionist/admin, show hospital appointments.
  const calendarAppts = role === 'Doctor' 
    ? appointments.filter(a => a.doctorId === selectedDoctor.id)
    : appointments.filter(a => a.hospitalId === selectedHospital.id);

  const getHospitalDetails = (hospId) => {
    return hospitals.find(h => h.id === hospId) || { name: 'Apollo', color: '#2563EB', shortName: 'Apollo' };
  };

  const getDoctorDetails = (docId) => {
    return doctors.find(d => d.id === docId) || { name: 'Doctor' };
  };

  const handleMoveSubmit = (e) => {
    e.preventDefault();
    if (!apptToMove) return;
    moveAppointment(apptToMove, newTime, newDay);
    alert('Appointment rescheduled. Conflict status updated.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Title */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-dark-border pb-4">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Unified Cross-Hospital Calendar</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {role === 'Doctor' 
              ? `Displaying all shifts and appointments for Dr. ${selectedDoctor.name.split(' ')[1]}`
              : `Displaying active appointments scheduled at ${selectedHospital.name}`
            }
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs bg-brand-500/10 border border-brand-500/20 text-brand px-3 py-1.5 rounded-premium font-bold">
          <span className="material-symbols-outlined text-sm">sync</span>
          <span>Transit Commutes Checked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Grid: Calendar Columns */}
        <div className="xl:col-span-3 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-dark-border/40 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Schedule View</span>
            <div className="flex space-x-3 text-[10px] font-bold">
              {hospitals.map(h => (
                <span key={h.id} className="flex items-center" style={{ color: h.color }}>
                  <span className="w-2.5 h-2.5 rounded-full mr-1" style={{ backgroundColor: h.color }}></span>
                  {h.shortName}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
              const dayAppts = calendarAppts.filter(a => a.date.toLowerCase() === day.toLowerCase());
              
              return (
                <div key={day} className="border border-slate-100 dark:border-dark-border/40 rounded-premium p-3 bg-slate-50/20 dark:bg-slate-900/10 min-h-[350px]">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-dark-border/40 pb-2 mb-3 text-center uppercase tracking-wider">{day}</h3>
                  
                  {dayAppts.length === 0 ? (
                    <div className="text-center py-20 text-[10px] text-slate-400 dark:text-slate-500">
                      Empty Slot
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dayAppts.sort((a,b)=>a.time.localeCompare(b.time)).map(appt => {
                        const hosp = getHospitalDetails(appt.hospitalId);
                        const doc = getDoctorDetails(appt.doctorId);
                        
                        return (
                          <div 
                            key={appt.id} 
                            className="p-3 border rounded shadow-sm text-xs transition-transform hover:-translate-y-0.5 bg-white dark:bg-dark-card border-slate-100 dark:border-dark-border/50"
                            style={{ borderLeftWidth: '4px', borderLeftColor: hosp.color }}
                          >
                            <div className="flex justify-between items-center font-bold text-[10px] text-slate-500 mb-1">
                              <span className="font-mono text-slate-600 dark:text-slate-300">{appt.time}</span>
                              <span style={{ color: hosp.color }}>{hosp.shortName}</span>
                            </div>
                            <div className="font-bold text-slate-800 dark:text-slate-100">{appt.patientName}</div>
                            {role !== 'Doctor' && (
                              <div className="text-[10px] text-slate-400 mt-0.5">{doc.name}</div>
                            )}
                            
                            {appt.warning && (
                              <div className="mt-2 text-[9px] text-amber-500 font-medium space-y-1">
                                <div className="flex items-start space-x-0.5" title={appt.warning}>
                                  <span className="material-symbols-outlined text-xs mr-0.5">warning</span>
                                  <span>Transit Delay</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const reason = prompt('Enter Override Authorization Reason:');
                                    if (reason) overrideConflict(appt.id, reason);
                                  }}
                                  className="text-[9px] text-brand hover:underline font-bold block"
                                >
                                  Override Bypass
                                </button>
                              </div>
                            )}
                            {appt.overridden && (
                              <span className="mt-2 text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-1.5 py-0.5 rounded block text-center">
                                OVERRIDDEN
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Controls: Drag/Drop Rescheduler & Map */}
        <div className="space-y-6">
          
          {/* Commute Network Map */}
          <SvgNetworkMap />

          {/* Simulated Rescheduling Control */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-3">
              <span className="material-symbols-outlined text-brand mr-2">drag_pan</span>
              Commute conflict checker
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal mb-4">
              Select an appointment and shift its slot to test live conflict warnings and travel-time limits.
            </p>

            <form onSubmit={handleMoveSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Select Consultation</label>
                <select
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 p-2 rounded focus:outline-none"
                  value={apptToMove}
                  onChange={(e) => setApptToMove(e.target.value)}
                >
                  <option value="">-- Choose Slot --</option>
                  {calendarAppts.map(a => (
                    <option key={a.id} value={a.id}>{a.patientName} ({a.date} {a.time})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">New Day</label>
                  <select
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 p-2 rounded focus:outline-none"
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">New Time</label>
                  <input
                    type="time"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 p-2 rounded focus:outline-none"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-600 text-white font-bold text-xs py-2 rounded-premium transition-colors"
              >
                Reschedule & Re-Audit Slot
              </button>
            </form>
          </div>
          
        </div>

      </div>

    </div>
  );
};
