import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PatientsPage = () => {
  const { handoffs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = handoffs.filter(h => 
    h.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-dark-border pb-4">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Unified Patient Registry (Cross-Hospital)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access secure structured clinical handoffs synced automatically across independent clinics.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-64 text-xs">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-lg text-slate-400">search</span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded-premium focus:ring-1 focus:ring-brand focus:outline-none"
            placeholder="Search patient record or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Registry Lists */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-12 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2">person_search</span>
            <p className="text-sm">No patient profiles matched search</p>
          </div>
        ) : (
          filtered.map(p => (
            <div
              key={p.id}
              className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4 hover:border-brand/35 transition-colors text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-black text-slate-700 dark:text-slate-100 flex items-center">
                    {p.patientName}
                    <span className="ml-2 text-xs text-slate-400 font-bold uppercase">({p.age}y / {p.gender})</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Last consultation: {p.date}</p>
                </div>
                <span className="text-[9px] bg-brand-500/10 text-brand border border-brand-500/20 font-bold px-2.5 py-0.5 rounded">
                  Origin: {p.hospitalName}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 dark:bg-slate-900/20 p-3 border border-slate-100 dark:border-dark-border/40 rounded leading-relaxed">
                  <span className="font-bold text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Chief Complaint</span>
                  <p className="text-slate-700 dark:text-slate-300">{p.chiefComplaint}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/20 p-3 border border-slate-100 dark:border-dark-border/40 rounded leading-relaxed">
                  <span className="font-bold text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Clinical Diagnosis</span>
                  <p className="text-slate-700 dark:text-slate-300">{p.diagnosis}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/20 p-3 border border-slate-100 dark:border-dark-border/40 rounded leading-relaxed">
                  <span className="font-bold text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Treatment Plan</span>
                  <p className="text-slate-700 dark:text-slate-300">{p.treatment}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/20 p-3 border border-slate-100 dark:border-dark-border/40 rounded leading-relaxed">
                  <span className="font-bold text-[9px] text-slate-400 uppercase tracking-wider block mb-1">Prescriptions & Follow-Up</span>
                  <p className="text-slate-700 dark:text-slate-300">{p.medications} — <span className="italic">{p.followUp}</span></p>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-50 dark:border-dark-border/40 font-medium">
                <span>Physician: {p.doctorName}</span>
                <span>Handoff Sync Key: {p.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
