import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RoleDashboardSuperAdmin = () => {
  const {
    hospitals,
    doctors,
    tickets,
    audits,
    logAudit,
    featureFlags,
    toggleFeatureFlag
  } = useApp();

  const subscriptions = [
    { id: 'sub-01', name: 'Apollo Health Group', tier: 'Enterprise Tier', mrr: '$2,450', status: 'Active', renewal: '2026-08-01' },
    { id: 'sub-02', name: 'Fortis Group Solutions', tier: 'Enterprise Tier', mrr: '$2,450', status: 'Active', renewal: '2026-08-15' },
    { id: 'sub-03', name: 'Max Group Speciality', tier: 'Pro Tier', mrr: '$1,200', status: 'Active', renewal: '2026-07-28' },
    { id: 'sub-04', name: 'Manipal Clinics', tier: 'Pro Tier', mrr: '$1,200', status: 'Active', renewal: '2026-08-05' },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Platform Health KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-premium shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Global Hospital Nodes</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline mt-1">{hospitals.length}</span>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">4 active regional centers</span>
          </div>
          <span className="material-symbols-outlined text-3xl text-slate-400/30 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">domain</span>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-premium shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Registered Specialists</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline mt-1">{doctors.length}</span>
            <span className="text-[10px] text-emerald-500 font-semibold block mt-1">100% license verified</span>
          </div>
          <span className="material-symbols-outlined text-3xl text-brand/30 bg-brand/10 p-2 rounded-lg">medical_services</span>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-premium shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Recurring Revenue</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline">$7,300/mo</span>
            <span className="text-[10px] text-success font-semibold flex items-center mt-1">
              <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
              +14% growth
            </span>
          </div>
          <span className="material-symbols-outlined text-3xl text-success/30 bg-success/10 p-2 rounded-lg">payments</span>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-premium shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Server Core Uptime</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline">99.98%</span>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center mt-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping mr-1.5"></span>
              All systems online
            </span>
          </div>
          <span className="material-symbols-outlined text-3xl text-indigo-400/30 bg-indigo-500/10 p-2 rounded-lg">dns</span>
        </div>

      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* HOSPITAL NODES LIST */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4 pb-3 border-b border-slate-100 dark:border-dark-border/40">
              <span className="material-symbols-outlined text-brand mr-2">domain</span>
              Hospital Node Registry Config
            </h3>

            <div className="space-y-3">
              {hospitals.map(h => (
                <div key={h.id} className="p-3 border border-slate-100 dark:border-dark-border/60 rounded bg-slate-50/50 dark:bg-slate-900/10 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: h.color }}></span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{h.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{h.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Radius Weight: {h.distance} km</span>
                    <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono px-1.5 py-0.5 rounded mt-0.5 inline-block">ID: {h.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform secure audit logs */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm max-h-[300px] flex flex-col">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-3">
              <span className="material-symbols-outlined text-brand mr-2">rule</span>
              Node transaction ledger
            </h3>

            <div className="space-y-2.5 overflow-y-auto flex-1 text-[10px] leading-snug">
              {audits.map(log => (
                <div key={log.id} className="p-2 border border-slate-50 dark:border-dark-border/30 rounded bg-slate-50/20 dark:bg-slate-900/5">
                  <div className="flex justify-between text-slate-400 font-semibold">
                    <span>{log.action}</span>
                    <span className="font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{log.details}</p>
                  <span className="text-[8px] text-slate-400 block mt-1">Operator: {log.user}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          
          {/* SUBSCRIPTIONS */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4">
              <span className="material-symbols-outlined text-brand mr-2">payments</span>
              Enterprise Node Subscriptions
            </h3>

            <div className="space-y-3 text-xs">
              {subscriptions.map(sub => (
                <div key={sub.id} className="p-3 border border-slate-100 dark:border-dark-border/40 rounded bg-slate-50/50 dark:bg-slate-900/5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{sub.name}</span>
                    <span className="font-black text-slate-800 dark:text-white font-headline">{sub.mrr}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-medium">
                    <span>{sub.tier}</span>
                    <span>Renewal: {sub.renewal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUPPORT TICKETS QUEUE */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4">
              <span className="material-symbols-outlined text-brand mr-2">support</span>
              Support Ticket queue
            </h3>

            <div className="space-y-2.5 text-xs">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-3 border border-slate-100 dark:border-dark-border/40 rounded bg-slate-50/20 dark:bg-slate-900/5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{ticket.node}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      ticket.severity === 'Critical' ? 'bg-red-500/10 text-danger' : 
                      ticket.severity === 'High' ? 'bg-amber-500/10 text-warning' : 'bg-slate-100 text-slate-400'
                    }`}>{ticket.severity}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">{ticket.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURE FLAGS CONTROL */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4">
              <span className="material-symbols-outlined text-brand mr-2">tune</span>
              Feature Flags Control
            </h3>

            <div className="space-y-4 text-xs">
              {[
                { key: 'emergencyDispatch', label: 'Emergency Dispatch SOS', desc: 'Enables receptionists to trigger pager dispatches.' },
                { key: 'doctorTracking', label: 'Live Doctor GPS Tracking', desc: 'Enables GPS map coordinate calculations.' },
                { key: 'liveStatus', label: 'Presence Status Rotator', desc: 'Allows background simulation to toggle occupancy.' },
                { key: 'aiRanking', label: 'AI Specialist Rationale', desc: 'Forces ranking sort by suitability match ratio.' },
              ].map(flag => (
                <div key={flag.key} className="flex items-center justify-between p-2.5 border border-slate-50 dark:border-dark-border/40 rounded hover:bg-slate-50/50 dark:hover:bg-[#131926] transition-colors">
                  <div className="pr-3 pr-4">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">{flag.label}</span>
                    <span className="text-[10px] text-slate-455 block mt-0.5 leading-normal">{flag.desc}</span>
                  </div>
                  
                  {/* Slider toggle */}
                  <button
                    onClick={() => toggleFeatureFlag(flag.key)}
                    className={`w-9 h-5 rounded-full p-0.5 shrink-0 transition-colors duration-200 ease-in-out relative flex items-center ${
                      featureFlags[flag.key] ? 'bg-brand' : 'bg-slate-250 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                        featureFlags[flag.key] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
