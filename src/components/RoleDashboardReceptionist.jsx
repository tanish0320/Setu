import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SvgNetworkMap } from './SvgNetworkMap';

export const RoleDashboardReceptionist = () => {
  const {
    selectedHospital,
    hospitals,
    doctors,
    appointments,
    bookAppointment,
    activeSOS, sosCountdown, rankedDoctors,
    sosStep, setSosStep, triggerDoctorNotification,
    dispatchSOS, acceptSOS, cancelSOS,
    getSmartSlotSuggestions
  } = useApp();

  // Booking Form State
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('M');
  const [selectedDocId, setSelectedDocId] = useState(doctors[0]?.id || '');
  const [apptTime, setApptTime] = useState('10:00');
  const [apptDate, setApptDate] = useState('Monday');
  const [department, setDepartment] = useState('Cardiology');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search Doctor presence state
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [docSpecialtyFilter, setDocSpecialtyFilter] = useState('All');

  // Emergency SOS Form State
  const [sosSpecialty, setSosSpecialty] = useState('Cardiology');
  const [sosUrgency, setSosUrgency] = useState('Critical');

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(docSearchQuery.toLowerCase());
    const matchesSpecialty = docSpecialtyFilter === 'All' || doc.specialty === docSpecialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const hospitalAppts = appointments.filter(a => a.hospitalId === selectedHospital.id);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!patientName || !age || !selectedDocId) return;

    bookAppointment({
      patientName,
      age,
      gender,
      doctorId: selectedDocId,
      hospitalId: selectedHospital.id,
      date: apptDate,
      time: apptTime,
      department
    });

    setPatientName('');
    setAge('');
    setShowSuggestions(false);
  };

  const handleSOSSubmit = (e) => {
    e.preventDefault();
    dispatchSOS(sosSpecialty, sosUrgency, selectedHospital.id);
  };

  const getDocSmartSuggestions = () => {
    if (!selectedDocId) return [];
    return getSmartSlotSuggestions(selectedDocId, selectedHospital.id, apptDate);
  };

  const activeDocDetails = doctors.find(d => d.id === selectedDocId);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Main Grid: Mission Control Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* LARGE EMERGENCY SOS PANEL */}
          <div id="emergency" className={`border rounded-premium p-6 transition-all ${
            activeSOS 
              ? 'bg-red-500/10 border-red-500/40 shadow-glow-red' 
              : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border shadow-sm'
          }`}>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100 dark:border-dark-border/40">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center">
                <span className="material-symbols-outlined text-danger mr-2 animate-bounce">cell_tower</span>
                EMERGENCY DISPATCH CONTROL ROOM
              </h3>
              {activeSOS && (
                <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded tracking-wider animate-pulse uppercase">
                  Alert Active
                </span>
              )}
            </div>

            {!activeSOS ? (
              // Large trigger form
              <form onSubmit={handleSOSSubmit} className="space-y-5">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Triggers an immediate high-frequency alert. Ranks network doctors dynamically based on distance, presence workload, and reliability. target hospital node: <span className="font-bold text-brand">{selectedHospital.name}</span>.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Select Specialty Needed</label>
                    <select
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-danger focus:outline-none"
                      value={sosSpecialty}
                      onChange={(e) => setSosSpecialty(e.target.value)}
                    >
                      <option value="Cardiology">Cardiology (Heart failure / code blue)</option>
                      <option value="Neurology">Neurology (Stroke suspect)</option>
                      <option value="Orthopedics">Orthopedics (Trauma fracture)</option>
                      <option value="Pediatrics">Pediatrics (Neonatal emergency)</option>
                      <option value="General Surgery">General Surgery (Acute abdomen)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Urgency Level</label>
                    <select
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-danger focus:outline-none"
                      value={sosUrgency}
                      onChange={(e) => setSosUrgency(e.target.value)}
                    >
                      <option value="Critical">Critical (Code Blue - Under 5 mins)</option>
                      <option value="Urgent">Urgent (Commute required - Under 15 mins)</option>
                      <option value="Standard">Standard Advice Page (Consultation requested)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-danger hover:bg-red-600 text-white font-bold text-xs py-3 rounded-premium shadow-lg shadow-red-500/20 transition-all flex items-center justify-center space-x-2 pulse-red-glow font-headline"
                >
                  <span className="material-symbols-outlined text-sm font-bold">cell_tower</span>
                  <span>TRIGGER EMERGENCY SPECIALIST SOS PAGE</span>
                </button>
              </form>
            ) : (
              // Live tracking steps details
              <div className="space-y-5 animate-fade-in text-xs">
                
                {/* 3-column stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/70 dark:bg-slate-900/40 p-4 border border-red-500/20 rounded-premium">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Specialty Requested</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{activeSOS.specialty}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Transit State</span>
                    <span className="text-xs font-black text-danger flex items-center">
                      {activeSOS.status === 'Dispatched' ? 'Awaiting specialist acceptance...' : `Commuting (ETA: ${activeSOS.eta})`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">En-route Countdown</span>
                    <span className="text-xs font-black font-mono text-slate-700 dark:text-slate-200">
                      {activeSOS.status === 'Dispatched' ? '-- : --' : `${Math.floor(sosCountdown / 60)}m ${sosCountdown % 60}s`}
                    </span>
                  </div>
                </div>

                {/* Match details & Accept buttons */}
                {activeSOS.status === 'Dispatched' && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Matched Specialists (Ranked by suitability index)</span>
                    {rankedDoctors.slice(0, 3).map((doc, idx) => (
                      <div key={doc.id} className="flex justify-between items-center bg-slate-50/20 dark:bg-slate-900/10 border border-slate-100 dark:border-dark-border/40 p-3 rounded">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-bold text-slate-400">#{idx+1}</span>
                          <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-full object-cover border" />
                          <div>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{doc.name}</span>
                            <span className="text-[10px] text-slate-400 block font-medium">Dist: {doc.distance} km • Commute time: ~{doc.estimatedETA} mins</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className="text-[9px] text-slate-400 uppercase block font-bold">Match rating</span>
                            <span className="font-black text-brand">{doc.matchScore}%</span>
                          </div>
                          
                          {/* Step 4 mock pager broadcast first or direct accept */}
                          {sosStep === 3 ? (
                            <button
                              type="button"
                              onClick={triggerDoctorNotification}
                              className="bg-brand hover:bg-brand-600 text-white font-bold text-[10px] py-1.5 px-3 rounded shadow-sm"
                            >
                              Dispatch Page
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => acceptSOS(doc.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] py-1.5 px-3 rounded shadow-sm"
                            >
                              Mock Accept
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Progress bar tracker */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2.5">Escalation protocol logging</span>
                  <div className="grid grid-cols-4 gap-2">
                    {activeSOS.escalationTimeline.map((item, idx) => (
                      <div key={idx} className={`p-2.5 border rounded text-[10px] flex flex-col justify-between ${
                        item.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold' :
                        item.status === 'active' ? 'bg-brand-500/10 border-brand-500/20 text-brand-600 dark:text-brand-400 animate-pulse font-bold' :
                        'bg-slate-50 dark:bg-slate-900/10 border-slate-100 dark:border-dark-border/40 text-slate-400'
                      }`}>
                        <span className="font-bold text-[8px] uppercase">{item.time}</span>
                        <span className="mt-1 leading-snug">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-dark-border/40">
                  <button
                    onClick={cancelSOS}
                    className="text-xs text-slate-400 hover:text-danger hover:underline font-bold flex items-center space-x-1"
                  >
                    <span className="material-symbols-outlined text-sm">cancel</span>
                    <span>Retract SOS Dispatch</span>
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Svg Network Routing Map */}
          <SvgNetworkMap />

          {/* DOCTOR AVAILABILITY PRESENCE GRID */}
          <div id="presence" className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-dark-border/40 space-y-3 md:space-y-0">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <span className="material-symbols-outlined text-brand mr-2">wifi_find</span>
                Specialist Network Presence monitor
              </h3>

              <div className="flex space-x-2 text-xs">
                <input
                  type="text" placeholder="Filter by name..."
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-brand"
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                />
                <select
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded px-2 py-1 focus:outline-none"
                  value={docSpecialtyFilter}
                  onChange={(e) => setDocSpecialtyFilter(e.target.value)}
                >
                  <option value="All">All Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General Surgery">General Surgery</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map(doc => {
                const hosp = hospitals.find(h => h.id === doc.currentHospitalId);
                const nextH = hospitals.find(h => h.id === doc.nextHospitalId);
                return (
                  <div key={doc.id} className="p-3.5 border border-slate-100 dark:border-dark-border/60 rounded bg-slate-50/50 dark:bg-slate-900/10 flex items-start space-x-3 hover:border-slate-200 transition-colors">
                    <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-full object-cover border" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{doc.name}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          doc.status === 'Available' ? 'bg-emerald-500/15 text-success' :
                          doc.status === 'Emergency' ? 'bg-red-500/15 text-danger animate-pulse' :
                          doc.status === 'In Transit' ? 'bg-amber-500/15 text-warning' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>{doc.status}</span>
                      </div>
                      <span className="text-[10px] text-brand font-semibold -mt-0.5 block">{doc.specialty}</span>
                      
                      <div className="mt-2.5 space-y-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center">
                          <span className="material-symbols-outlined text-sm mr-1">location_on</span>
                          <span>Hub: {hosp ? hosp.shortName : 'Offline / Commute Disconnected'}</span>
                        </div>
                        {doc.status === 'In Transit' && nextH && (
                          <div className="flex items-center text-amber-500 font-semibold">
                            <span className="material-symbols-outlined text-sm mr-1">directions_car</span>
                            <span>En-route to: {nextH.shortName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Columns: Forms & Queue */}
        <div className="space-y-6">
          
          {/* APPOINTMENT SCHEDULER */}
          <div id="book" className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4 pb-3 border-b border-slate-100 dark:border-dark-border/40">
              <span className="material-symbols-outlined text-brand mr-2">edit_calendar</span>
              Book Consultation Session
            </h3>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Patient Name</label>
                <input
                  type="text" required placeholder="Full Name"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-brand focus:outline-none"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Age</label>
                  <input
                    type="number" required placeholder="Age"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-brand focus:outline-none"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Gender</label>
                  <select
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 p-2 rounded focus:outline-none"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Required Specialist</label>
                <select
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 p-2 rounded focus:outline-none"
                  value={selectedDocId}
                  onChange={(e) => {
                    setSelectedDocId(e.target.value);
                    setShowSuggestions(false);
                  }}
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Day</label>
                  <select
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 p-2 rounded focus:outline-none"
                    value={apptDate}
                    onChange={(e) => {
                      setApptDate(e.target.value);
                      setShowSuggestions(false);
                    }}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Time</label>
                  <input
                    type="time" required
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-800 dark:text-slate-200 p-2 rounded focus:outline-none"
                    value={apptTime}
                    onChange={(e) => {
                      setApptTime(e.target.value);
                      setShowSuggestions(false);
                    }}
                  />
                </div>
              </div>

              {/* Suggestions control */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="text-xs text-brand font-bold hover:underline flex items-center space-x-0.5"
                >
                  <span className="material-symbols-outlined text-sm font-bold">psychology</span>
                  <span>AI Suggestions slot finder</span>
                </button>

                {showSuggestions && (
                  <div className="mt-2.5 p-3 bg-brand-50/20 dark:bg-brand-900/10 border border-brand-500/20 rounded space-y-2 animate-fade-in">
                    <span className="text-[9px] font-bold text-brand uppercase tracking-wider block">Recommended Conflict-Free Slots</span>
                    <div className="flex gap-1.5">
                      {getDocSmartSuggestions().map((sTime, idx) => (
                        <button
                          key={idx} type="button"
                          onClick={() => {
                            setApptTime(sTime);
                            setShowSuggestions(false);
                          }}
                          className="bg-white dark:bg-dark-card border border-brand-500/30 text-brand text-[10px] font-bold px-2 py-0.5 rounded hover:bg-brand-500 hover:text-white transition-colors"
                        >
                          {sTime}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-600 text-white font-bold text-xs py-2 rounded-premium transition-colors"
              >
                Schedule Appointment Slot
              </button>
            </form>
          </div>

          {/* TODAY'S OPD QUEUE */}
          <div id="opd" className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm max-h-[300px] flex flex-col">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4 pb-3 border-b border-slate-100 dark:border-dark-border/40">
              <span className="material-symbols-outlined text-brand mr-2">patient_list</span>
              Today's OPD Patient Queue
            </h3>
            
            <div className="space-y-3 overflow-y-auto flex-1 text-xs">
              {hospitalAppts.length === 0 ? (
                <div className="py-8 text-center text-slate-400">No scheduled patients today</div>
              ) : (
                hospitalAppts.map(appt => {
                  const doc = doctors.find(d => d.id === appt.doctorId);
                  return (
                    <div key={appt.id} className="p-3 border border-slate-100 dark:border-dark-border/40 rounded flex justify-between items-center bg-slate-50/40 dark:bg-slate-900/5">
                      <div>
                        <div className="font-bold text-slate-700 dark:text-slate-200">{appt.patientName}</div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Specialist: {doc?.name || 'Physician'} • {appt.time}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        appt.status === 'Completed' ? 'bg-emerald-500/10 text-success' : 'bg-brand-500/10 text-brand'
                      }`}>{appt.status}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
