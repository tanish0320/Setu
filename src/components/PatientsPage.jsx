import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PatientsPage = () => {
  const { patients, hospitals, handoffs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('All');
  const [selectedHospital, setSelectedHospital] = useState('All');

  const getHospitalName = (hospId) => {
    return hospitals.find(h => h.id === hospId)?.shortName || 'Network Node';
  };

  const getAgeCategory = (age) => {
    if (age <= 2) return 'Infants (0-2y)';
    if (age <= 12) return 'Children (3-12y)';
    if (age <= 19) return 'Teenagers (13-19y)';
    if (age <= 59) return 'Adults (20-59y)';
    return 'Senior Citizens (60y+)';
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.condition.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender;
    const matchesHosp = selectedHospital === 'All' || p.hospitalId === selectedHospital;

    let matchesAge = true;
    if (selectedAgeGroup === 'Infants') matchesAge = p.age <= 2;
    else if (selectedAgeGroup === 'Children') matchesAge = p.age >= 3 && p.age <= 12;
    else if (selectedAgeGroup === 'Teenagers') matchesAge = p.age >= 13 && p.age <= 19;
    else if (selectedAgeGroup === 'Adults') matchesAge = p.age >= 20 && p.age <= 59;
    else if (selectedAgeGroup === 'Seniors') matchesAge = p.age >= 60;

    return matchesSearch && matchesGender && matchesHosp && matchesAge;
  });

  return (
    <div className="w-full py-4 space-y-4 text-left animate-fade-in font-sans">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 dark:border-dark-border pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Patients Clinical Registry</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered network patient records, emergency admissions, and handoff summaries.
          </p>
        </div>

        {/* Count Badge */}
        <span className="text-xs font-mono font-bold bg-brand/10 text-brand px-3 py-1 rounded-full self-start sm:self-auto border border-brand/20">
          {filteredPatients.length} Active Records
        </span>
      </div>

      {/* Filter Controls Row */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm space-y-3">
        <div className="relative text-xs">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-slate-400">search</span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded focus:ring-1 focus:ring-brand focus:outline-none font-semibold"
            placeholder="Search patient name, MRN, condition, or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Age Bracket</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 p-2 rounded focus:outline-none font-medium"
              value={selectedAgeGroup}
              onChange={(e) => setSelectedAgeGroup(e.target.value)}
            >
              <option value="All">All Age Groups</option>
              <option value="Infants">Infants (0-2 yrs)</option>
              <option value="Children">Children (3-12 yrs)</option>
              <option value="Teenagers">Teenagers (13-19 yrs)</option>
              <option value="Adults">Adults (20-59 yrs)</option>
              <option value="Seniors">Senior Citizens (60+ yrs)</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Gender Filter</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 p-2 rounded focus:outline-none font-medium"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="All">All Genders</option>
              <option value="M">Male (M)</option>
              <option value="F">Female (F)</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Hospital Node</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 p-2 rounded focus:outline-none font-medium"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              <option value="All">All Hospitals</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.shortName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {filteredPatients.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-dark-card border rounded-premium p-12 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">person_search</span>
            <p className="font-bold text-slate-600 dark:text-slate-300">No patient records match the selected filter criteria.</p>
          </div>
        ) : (
          filteredPatients.slice(0, 40).map(p => {
            const patientHandoff = handoffs.find(h => h.patientName === p.name);

            return (
              <div
                key={p.id}
                onClick={() => openModal('patient_details', p)}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-brand/40 rounded-premium p-4 shadow-sm hover:shadow transition-all space-y-3 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline font-bold text-slate-800 dark:text-slate-100 text-sm">
                        {p.name}
                        <span className="ml-2 text-xs text-slate-400 font-normal">({p.age}y / {p.gender})</span>
                      </h3>
                      <span className="text-[9px] font-mono text-brand font-bold block mt-0.5">{p.mrn} • Blood: {p.bloodGroup}</span>
                    </div>

                    <span className="text-[8.5px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-dark-border">
                      {getHospitalName(p.hospitalId)}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-dark-border/40 space-y-2 text-[10.5px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Category:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{getAgeCategory(p.age)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Condition:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{p.condition}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Severity Level:</span>
                      <span className={`font-bold uppercase text-[9px] px-2 py-0.2 rounded ${
                        p.severity === 'Critical' ? 'bg-red-500/10 text-danger' :
                        p.severity === 'High' ? 'bg-amber-500/10 text-warning' : 'bg-emerald-500/10 text-success'
                      }`}>
                        {p.severity}
                      </span>
                    </div>

                    <div className="flex justify-between items-center font-mono text-[10px]">
                      <span className="text-slate-400">Phone Contact:</span>
                      <span className="text-slate-600 dark:text-slate-300">{p.phone}</span>
                    </div>

                    {patientHandoff && (
                      <div className="mt-2.5 p-2 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-dark-border/40 text-[9.5px] space-y-1">
                        <span className="font-bold text-brand block uppercase text-[8px] tracking-wider">Clinical Handoff Summary ({patientHandoff.date}):</span>
                        <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{patientHandoff.diagnosis}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-50 dark:border-dark-border/30 flex justify-between items-center text-[9.5px]">
                  <span className="text-slate-400 font-mono">Emergency Contact: {p.emergencyContact}</span>
                  <span className="text-brand font-bold hover:underline cursor-pointer">
                    View Full Chart ➔
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
