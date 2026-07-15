import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DoctorsPage = () => {
  const { doctors, hospitals, setActivePage, setSelectedProfileDoctorId } = useApp();
  const [filterSpec, setFilterSpec] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const specialties = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Surgery'];
  
  const getHospitalName = (hospId) => {
    return hospitals.find(h => h.id === hospId)?.shortName || 'Offline';
  };

  const filtered = doctors.filter(doc => {
    const specMatch = filterSpec === 'All' || doc.specialty === filterSpec;
    const statusMatch = filterStatus === 'All' || 
      (filterStatus === 'Available' && doc.status === 'Available') ||
      (filterStatus === 'Busy' && doc.status !== 'Available');
    return specMatch && statusMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-dark-border pb-4">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Affiliated Specialists Network</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered doctors across Apollo, Fortis, Max and Manipal hospital nodes.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex space-x-3 text-xs">
          <select
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand font-medium text-slate-700 dark:text-slate-200"
            value={filterSpec}
            onChange={(e) => setFilterSpec(e.target.value)}
          >
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand font-medium text-slate-700 dark:text-slate-200"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Busy">Consulting / Commuting</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(doc => (
          <div
            key={doc.id}
            onClick={() => {
              setSelectedProfileDoctorId(doc.id);
              setActivePage('profile');
            }}
            className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-brand/40 dark:hover:border-brand/40 rounded-premium p-5 shadow-sm hover:shadow-premium transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 group-hover:border-brand/20 transition-colors" />
                <div>
                  <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-brand transition-colors">{doc.name}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{doc.specialty}</span>
                </div>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                doc.status === 'Available' ? 'bg-emerald-500/15 text-success' :
                doc.status === 'Emergency' ? 'bg-red-500/15 text-danger animate-pulse' :
                doc.status === 'In Transit' ? 'bg-amber-500/15 text-warning' :
                'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {doc.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-dark-border/40 pt-4 text-left">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Current Hub</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{getHospitalName(doc.currentHospitalId)}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Reliability</span>
                <span className="text-xs font-black text-brand">{doc.reliability.overall}% Index</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center text-[10px] text-slate-400 pt-2 font-medium">
              <span>{doc.experience} years experience</span>
              <span className="text-brand font-bold group-hover:underline flex items-center">
                <span>View Profile</span>
                <span className="material-symbols-outlined text-xs ml-0.5">chevron_right</span>
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
