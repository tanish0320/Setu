import React, { useState } from 'react';
import { useApp, ALL_SPECIALTIES } from '../context/AppContext';

export const DoctorsPage = () => {
  const { doctors, hospitals, setActivePage, setSelectedProfileDoctorId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const specialtiesList = ['All', ...ALL_SPECIALTIES];
  const statusesList = ['All', 'Available', 'Busy', 'In Surgery', 'On Call', 'Travelling', 'Emergency Response', 'Consultation', 'Off Duty', 'Break'];

  const getHospitalName = (hospId) => {
    return hospitals.find(h => h.id === hospId)?.shortName || 'Offline';
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  return (
    <div className="w-full py-4 space-y-4 text-left animate-fade-in font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 dark:border-dark-border pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Affiliated Specialists</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered doctors across the network.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            className="bg-white dark:bg-dark-card border border-slate-205 dark:border-dark-border rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand font-medium w-44"
            placeholder="Search name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="bg-white dark:bg-dark-card border border-slate-205 dark:border-dark-border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand font-medium text-slate-700 dark:text-slate-200"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specialtiesList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="bg-white dark:bg-dark-card border border-slate-205 dark:border-dark-border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand font-medium text-slate-700 dark:text-slate-200"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusesList.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-bold text-slate-500 font-mono">
            {filteredDoctors.length} Doctors
          </span>
        </div>
      </div>

      {/* Ranks list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map(doc => {
          const isAvailable = doc.status === 'Available';
          
          return (
            <div
              key={doc.id}
              onClick={() => {
                setSelectedProfileDoctorId(doc.id);
                setActivePage('profile');
              }}
              className="bg-white dark:bg-dark-card border border-slate-205 dark:border-dark-border hover:border-brand/40 rounded-premium p-4 shadow-sm hover:shadow transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-full object-cover border" />
                  <div>
                    <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{doc.name}</h3>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">{doc.specialty}</span>
                  </div>
                </div>
                <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isAvailable ? 'bg-emerald-500/10 text-success' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {doc.status}
                </span>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-dark-border/40 grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed">
                <div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Current Location</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-250">{getHospitalName(doc.currentHospitalId)}</span>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Reliability</span>
                  <span className="font-bold text-brand">{doc.reliability.overall}% Index</span>
                </div>
                <div className="mt-1">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Distance Radius</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-250">{doc.travelRadius} km</span>
                </div>
                <div className="mt-1">
                  <span className="text-[8px] text-slate-400 font-bold uppercase block">Availability Window</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-250">09:00 - 18:00</span>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t flex justify-end text-[9.5px] text-brand font-bold uppercase hover:underline">
                View Profile
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
