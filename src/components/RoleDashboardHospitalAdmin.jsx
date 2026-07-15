import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, ProgressRing } from './SvgCharts';

export const RoleDashboardHospitalAdmin = () => {
  const {
    selectedHospital,
    doctors,
    appointments,
    activeSOS,
    audits
  } = useApp();

  // Filter hospital appointments
  const hospitalAppts = appointments.filter(a => a.hospitalId === selectedHospital.id);
  const activeSOSAlarms = activeSOS && activeSOS.hospitalId === selectedHospital.id && activeSOS.status !== 'Completed';

  // Conflict lists
  const conflictedAppts = hospitalAppts.filter(a => a.warning);

  // SVG bar chart mock data for conflicts
  const weeklyConflicts = [
    { label: 'Mon', value: 3 },
    { label: 'Tue', value: conflictedAppts.length || 1 },
    { label: 'Wed', value: 1 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 2 }
  ];

  // Calculations
  const averageUtilization = Math.round(doctors.reduce((acc, d) => acc + d.utilization, 0) / doctors.length);
  const totalNoShows = doctors.reduce((acc, d) => acc + d.noShows, 0);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* 5 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* KPI 1 */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Emergency Response</span>
            <span className="material-symbols-outlined text-danger text-lg bg-danger/10 p-1.5 rounded">emergency</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline">4.2 min</span>
            <span className="text-[9.5px] text-emerald-500 font-semibold block mt-1">Under 5m target met</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Today's OPD</span>
            <span className="material-symbols-outlined text-brand text-lg bg-brand/10 p-1.5 rounded">patient_list</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline">{hospitalAppts.length}</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block mt-1">Across active clinics</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Doctor Utilization</span>
            <span className="material-symbols-outlined text-indigo-500 text-lg bg-indigo-500/10 p-1.5 rounded">monitoring</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline">{averageUtilization}%</span>
            <span className="text-[9.5px] text-indigo-500 font-semibold block mt-1">Optimal scheduling load</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Average Delay</span>
            <span className="material-symbols-outlined text-warning text-lg bg-warning/10 p-1.5 rounded">history</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline">+6 min</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block mt-1">comm commute latency</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">No Shows Recorded</span>
            <span className="material-symbols-outlined text-slate-400 text-lg bg-slate-100 dark:bg-slate-800 p-1.5 rounded">person_off</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline">{totalNoShows}</span>
            <span className="text-[9.5px] text-slate-400 font-semibold block mt-1">Auto slots re-opened</span>
          </div>
        </div>

      </div>

      {/* Main dashboard columns */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* SPECIALIST AVAILABILITY TABLE */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4 pb-3 border-b border-slate-100 dark:border-dark-border/40">
              <span className="material-symbols-outlined text-brand mr-2">groups</span>
              Specialists Commuting & Status Grid
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-dark-border/40 text-slate-400 font-bold uppercase">
                    <th className="py-2.5">Doctor</th>
                    <th className="py-2.5">Specialty</th>
                    <th className="py-2.5">Presence</th>
                    <th className="py-2.5">Commute Node</th>
                    <th className="py-2.5">Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-dark-border/30">
                  {doctors.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15 transition-colors">
                      <td className="py-3 font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-2">
                        <img src={doc.avatar} alt={doc.name} className="w-6 h-6 rounded-full object-cover border" />
                        <span>{doc.name}</span>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400">{doc.specialty}</td>
                      <td className="py-3">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          doc.status === 'Available' ? 'bg-emerald-500/15 text-success' :
                          doc.status === 'Emergency' ? 'bg-red-500/15 text-danger animate-pulse' :
                          doc.status === 'In Transit' ? 'bg-amber-500/15 text-warning' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>{doc.status}</span>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 font-medium">
                        {hospitals.find(h=>h.id === doc.currentHospitalId)?.shortName || 'Offline'}
                      </td>
                      <td className="py-3 font-bold text-slate-700 dark:text-slate-300">{doc.utilization}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CONFLICTS & HOSPITAL PERFORMANCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-4">Conflict Analytics (Weekly Overlaps)</span>
              <BarChart data={weeklyConflicts} height={120} />
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 space-y-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b pb-2 border-slate-100 dark:border-dark-border/40">Hospital Node Performance Index</span>
              
              <div className="space-y-3 text-xs leading-normal">
                {[
                  { dept: 'Cardiothoracic Surgery Group', score: 98, status: 'Optimal' },
                  { dept: 'Neurosurgery Unit', score: 95, status: 'Optimal' },
                  { dept: 'Orthopedic joint unit', score: 91, status: 'Optimal' },
                ].map(item => (
                  <div key={item.dept} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-600 dark:text-slate-300 block">{item.dept}</span>
                      <span className="text-[9px] text-emerald-500 font-bold uppercase">{item.status}</span>
                    </div>
                    <span className="font-headline font-black text-brand text-sm">{item.score}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          
          {/* RELIABILITY LEADERBOARD */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4">
              <span className="material-symbols-outlined text-brand mr-2">military_tech</span>
              Reliability Leaderboard
            </h3>

            <div className="space-y-3.5">
              {doctors.sort((a,b) => b.reliability.overall - a.reliability.overall).map((doc, idx) => (
                <div key={doc.id} className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/5 p-2.5 border border-slate-100 dark:border-dark-border/40 rounded hover:border-slate-200 transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-bold text-slate-400 w-4">#{idx+1}</span>
                    <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-full object-cover border" />
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">{doc.name}</span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">{doc.specialty}</span>
                    </div>
                  </div>
                  <ProgressRing percentage={doc.reliability.overall} size={36} strokeWidth={3.5} />
                </div>
              ))}
            </div>
          </div>

          {/* RECENT ACTIVITY LOGS */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 max-h-[300px] flex flex-col">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-3">
              <span className="material-symbols-outlined text-brand mr-2">rule</span>
              Recent Audit Activity Logs
            </h3>

            <div className="space-y-3 overflow-y-auto flex-1 text-[10px] leading-snug">
              {audits.map(log => (
                <div key={log.id} className="p-2 border border-slate-50 dark:border-dark-border/30 rounded bg-slate-50/20 dark:bg-slate-900/5">
                  <div className="flex justify-between text-slate-400 font-semibold">
                    <span>{log.action}</span>
                    <span className="font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{log.details}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
