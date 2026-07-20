import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PatientsPage = () => {
  const { handoffs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Only show patients previously consulted by this doctor d1
  const doctorHandoffs = handoffs.filter(h => h.doctorId === 'd1');

  const filtered = doctorHandoffs.filter(h => 
    h.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6 text-left animate-fade-in">
      
      {/* Title */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-black font-headline text-slate-850 dark:text-white">Patients Registry</h2>
        <p className="text-xs text-slate-450 mt-1">Search previously consulted patient histories.</p>
      </div>

      {/* Prominent Search Bar (Search First) */}
      <div className="relative text-xs">
        <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-slate-400">search</span>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-slate-205 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded-premium focus:ring-1 focus:ring-brand focus:outline-none font-semibold shadow-sm"
          placeholder="Enter patient name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Consultation Timeline (Then Timeline) */}
      <div className="space-y-4">
        {searchQuery && filtered.length === 0 ? (
          <div className="bg-white dark:bg-dark-card border rounded-premium p-12 text-center text-slate-450">
            <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">person_search</span>
            <p>No patient records match your search query.</p>
          </div>
        ) : (
          (searchQuery ? filtered : doctorHandoffs).map(p => (
            <div
              key={p.id}
              className="bg-white dark:bg-dark-card border border-slate-205 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4 text-xs"
            >
              {/* Patient Basic Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline font-black text-slate-800 dark:text-slate-100 text-sm">
                    {p.patientName}
                    <span className="ml-2 text-xs text-slate-400 font-bold">({p.age}y/{p.gender})</span>
                  </h3>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">Sync Key: {p.id}</span>
                </div>
                <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold px-2 py-0.5 rounded">
                  {p.hospitalName}
                </span>
              </div>

              {/* Patient timeline list details (collapsible) */}
              <div className="border-l border-slate-100 dark:border-dark-border pl-4 space-y-4">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-brand"></span>
                  
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Previous Consultation ({p.date})</span>
                    
                    <div className="grid grid-cols-1 gap-2 leading-relaxed">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-250 block">Doctor Notes:</span>
                        <p className="text-slate-550 dark:text-slate-400">{p.treatment}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-250 block">Handoff Notes:</span>
                        <p className="text-slate-550 dark:text-slate-400">{p.chiefComplaint} ➔ Diagnosis: {p.diagnosis}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-250 block">Follow-up Plans & Medications:</span>
                        <p className="text-slate-555 dark:text-slate-400 font-mono">{p.medications} ({p.followUp})</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-250 block">Uploaded Reports:</span>
                        <span className="inline-flex items-center text-brand font-semibold hover:underline cursor-pointer">
                          <span className="material-symbols-outlined text-xs mr-1">description</span>
                          Clinical_Handoff_Summary.pdf
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
