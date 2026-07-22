import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const HospitalsPage = () => {
  const { hospitals, doctors, setSelectedHospital, setActivePage, openModal, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const citiesList = ['All', 'Delhi', 'Mumbai', 'Bengaluru', 'Gurugram', 'Hyderabad', 'Chennai', 'Pune', 'Vellore'];
  const typesList = ['All', 'Private Super Speciality', 'Private Multi-Speciality', 'Government Apex Institute', 'Specialty Cardiac & Care', 'Private Quaternary Care'];

  const filteredHospitals = hospitals.filter(hosp => {
    const matchesSearch = hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          hosp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hosp.cap.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === 'All' || hosp.city === selectedCity;
    const matchesType = selectedType === 'All' || hosp.type.includes(selectedType);

    return matchesSearch && matchesCity && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 dark:border-dark-border pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Affiliated Hospital Registry Nodes</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            20 Apex Medical Institutes, Multi-Speciality Centers & Quaternary Trauma Grids.
          </p>
        </div>

        <span className="text-xs font-mono font-bold bg-brand/10 text-brand px-3 py-1 rounded-full border border-brand/20">
          {filteredHospitals.length} Active Hospital Nodes
        </span>
      </div>

      {/* Filter controls bar */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm space-y-3">
        <div className="relative text-xs">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-slate-400">search</span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded focus:ring-1 focus:ring-brand focus:outline-none font-semibold"
            placeholder="Search hospital name, hospital code (e.g. APL-DEL), or emergency capability..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Filter by Metro / City</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 p-2 rounded focus:outline-none font-medium"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Hospital Category</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 p-2 rounded focus:outline-none font-medium"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {typesList.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Hospital Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredHospitals.map(hosp => {
          const activeDocsCount = doctors.filter(d => d.currentHospitalId === hosp.id).length;

          return (
            <div
              key={hosp.id}
              onClick={() => openModal('hospital_details', hosp)}
              className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-brand rounded-premium p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: hosp.color }}></span>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 font-headline">{hosp.name}</h3>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-[9px] font-mono font-bold text-brand bg-brand/10 px-1.5 py-0.2 rounded border border-brand/20">{hosp.code}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{hosp.city} • {hosp.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-[8.5px] bg-emerald-500/10 text-success border border-emerald-500/20 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Node Operational
                  </span>
                </div>

                {/* Capability highlight box */}
                <div className="mt-3 p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-dark-border/40 text-[10.5px]">
                  <span className="text-[8.5px] text-slate-400 font-bold uppercase block tracking-wider">Emergency Capability</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{hosp.cap}</span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-4 gap-2 border-t border-slate-100 dark:border-dark-border/40 mt-3 pt-3 text-left text-xs">
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">Total Beds</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">{hosp.beds}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">ICU Beds</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 font-mono">{hosp.icu}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">Occupancy</span>
                    <span className="font-bold text-amber-500 font-mono">{hosp.occ}%</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 font-bold uppercase block">Specialists</span>
                    <span className="font-bold text-brand font-mono">{activeDocsCount} Active</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-50 dark:border-dark-border/30">
                <span className="font-mono">Contact: {hosp.phone}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHospital(hosp);
                    setActivePage('dashboard');
                  }}
                  className="text-brand font-bold hover:underline flex items-center"
                >
                  <span>Select Node Hub</span>
                  <span className="material-symbols-outlined text-xs ml-0.5">chevron_right</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
