import React from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, ProgressRing } from './SvgCharts';
import { SvgNetworkMap } from './SvgNetworkMap';

export const DoctorProfilePage = () => {
  const {
    selectedProfileDoctorId,
    doctors,
    appointments,
    hospitals,
    setActivePage
  } = useApp();

  const doc = doctors.find(d => d.id === selectedProfileDoctorId) || doctors[0];

  const docAppts = appointments.filter(a => a.doctorId === doc.id);

  const getHospitalName = (hospId) => {
    return hospitals.find(h => h.id === hospId)?.name || 'Offline Node';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header and Back navigation */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setActivePage('doctors')}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Specialist Clinical Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5">Credential registry node: {doc.id}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Affiliations */}
        <div className="space-y-6">
          
          {/* Avatar box */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 shadow-sm flex flex-col items-center text-center">
            <img src={doc.avatar} alt={doc.name} className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-sm" />
            <h3 className="text-md font-black text-slate-800 dark:text-slate-100 mt-4">{doc.name}</h3>
            <span className="text-xs bg-brand/10 text-brand px-2.5 py-0.5 rounded-full font-bold mt-1.5">{doc.specialty} Specialist</span>
            
            <div className="w-full border-t border-slate-100 dark:border-dark-border/40 mt-5 pt-4 space-y-2 text-xs text-left text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex justify-between">
                <span>Active Status:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{doc.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Commute Hub:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{hospitals.find(h=>h.id === doc.currentHospitalId)?.shortName || 'Offline'}</span>
              </div>
              <div className="flex justify-between">
                <span>Travel Radius:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{doc.travelRadius} km Commute</span>
              </div>
              <div className="flex justify-between">
                <span>Experience:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{doc.experience} Years</span>
              </div>
            </div>
          </div>

          {/* Affiliations & Skills */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Hospital Affiliations</h4>
              <div className="space-y-2">
                {hospitals.filter(h => h.id === doc.currentHospitalId || h.id === doc.nextHospitalId).map(h => (
                  <div key={h.id} className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/20 p-2 rounded">
                    <span>{h.name}</span>
                    <span className="text-emerald-500 font-semibold text-[10px] flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Core Clinical Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {doc.skills.map(skill => (
                  <span key={skill} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Center & Right Column: Metrics & Calendar */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Reliability index summary */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* SVG line chart */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">6-Month Reliability Trend</span>
              <LineChart data={doc.reliability.history} height={100} />
              <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                <span>Month 1</span>
                <span>Month 2</span>
                <span>Month 3</span>
                <span>Month 4</span>
                <span>Month 5</span>
                <span>Month 6 (Active)</span>
              </div>
            </div>

            {/* Circular progress rings */}
            <div className="flex flex-col justify-between p-3 bg-slate-50 dark:bg-slate-900/20 border border-slate-100 dark:border-dark-border/40 rounded items-center text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Global Match Score</span>
              <ProgressRing percentage={doc.reliability.overall} size={70} strokeWidth={5} color="#2563EB" />
              <p className="text-[9.5px] text-slate-400 mt-2 font-medium">Rank index representing speed, distance and completion rates.</p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Commute Map */}
            <SvgNetworkMap />

            {/* Active shifts appointment checklist */}
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm flex flex-col h-full">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-3">
                <span className="material-symbols-outlined text-brand mr-2">event_note</span>
                Consultation Shifts Today
              </h4>

              <div className="space-y-3 overflow-y-auto max-h-[180px] flex-1">
                {docAppts.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-400">No shifts booked today.</div>
                ) : (
                  docAppts.map(appt => (
                    <div key={appt.id} className="p-3 border border-slate-100 dark:border-dark-border/50 rounded text-xs flex justify-between items-center bg-slate-50/20 dark:bg-slate-900/10">
                      <div>
                        <div className="font-bold text-slate-700 dark:text-slate-200">{appt.patientName}</div>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{getHospitalName(appt.hospitalId)} • {appt.time}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        appt.status === 'Completed' ? 'bg-emerald-500/10 text-success' : 'bg-brand-500/10 text-brand'
                      }`}>{appt.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
