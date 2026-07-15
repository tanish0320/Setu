import React from 'react';
import { useApp } from '../context/AppContext';

export const HospitalsPage = () => {
  const { hospitals, doctors } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-dark-border pb-4">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Affiliated Hospital Registry Nodes</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Active medical centers linked to the SETU physician coordination layer.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hospitals.map(hosp => {
          // Count active doctors here
          const activeDocsCount = doctors.filter(d => d.currentHospitalId === hosp.id).length;

          return (
            <div
              key={hosp.id}
              className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-brand/40 dark:hover:border-brand/40 rounded-premium p-5 shadow-sm hover:shadow-premium transition-all flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: hosp.color }}></span>
                  <div>
                    <h3 className="text-xs font-black text-slate-700 dark:text-slate-100">{hosp.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">{hosp.address}</p>
                  </div>
                </div>
                
                <span className="text-[9px] bg-emerald-500/10 text-success border border-emerald-500/20 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {hosp.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-dark-border/40 mt-5 pt-4 text-left text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Distance Weight</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{hosp.distance} km (Radial)</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Coordinators</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{hosp.coordinators} Accounts</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Specialists Inside</span>
                  <span className="font-semibold text-brand font-headline">{activeDocsCount} Doctors</span>
                </div>
              </div>

              <div className="mt-4 pt-2 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-50 dark:border-dark-border/30">
                <span>Node Endpoint Ref: {hosp.id}</span>
                <span className="text-brand font-bold hover:underline cursor-pointer flex items-center">
                  <span>Manage Node Config</span>
                  <span className="material-symbols-outlined text-xs ml-0.5">chevron_right</span>
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
