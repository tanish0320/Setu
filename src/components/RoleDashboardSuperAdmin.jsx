import React from 'react';
import { useApp } from '../context/AppContext';

export const RoleDashboardSuperAdmin = () => {
  const {
    hospitals,
    doctors,
    tickets,
    audits,
    featureFlags,
    toggleFeatureFlag,
    setActivePage,
    openModal,
    addToast
  } = useApp();

  const subscriptions = [
    { id: 'sub-01', name: 'Apollo Health Group', tier: 'Enterprise Tier', mrr: '$2,450', status: 'Active', renewal: '2026-08-01' },
    { id: 'sub-02', name: 'Fortis Group Solutions', tier: 'Enterprise Tier', mrr: '$2,450', status: 'Active', renewal: '2026-08-15' },
    { id: 'sub-03', name: 'Max Group Speciality', tier: 'Pro Tier', mrr: '$1,200', status: 'Active', renewal: '2026-07-28' },
    { id: 'sub-04', name: 'Manipal Clinics', tier: 'Pro Tier', mrr: '$1,200', status: 'Active', renewal: '2026-08-05' },
  ];

  return (
    <div className="w-full space-y-4 animate-fade-in text-left font-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-850 dark:text-white font-headline tracking-tight">
            SETU Global Platform Command Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Network-wide telemetry, 20 hospital cluster nodes, recurring subscriptions, and system health.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            System Core 99.98% Uptime
          </span>
        </div>
      </div>

      {/* Platform Health KPIs (Compressed 4 Cards Row) - ALL INTERACTIVE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div 
          onClick={() => {
            setActivePage('hospitals');
            addToast('Hospital Nodes', 'Navigated to 20 hospital clusters registry.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3.5 rounded-premium shadow-xs flex items-center justify-between cursor-pointer hover:border-brand transition-all hover:scale-[1.02]"
        >
          <div>
            <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block">Global Hospital Nodes</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline mt-1">{hospitals.length}</span>
            <span className="text-[9.5px] text-brand font-semibold block mt-0.5 underline">20 Active Centers ➔</span>
          </div>
          <span className="material-symbols-outlined text-3xl text-brand/30 bg-brand/10 p-2 rounded-lg">domain</span>
        </div>

        <div 
          onClick={() => {
            setActivePage('doctors');
            addToast('Specialist Roster', 'Viewing 85+ verified specialist profiles.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3.5 rounded-premium shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all hover:scale-[1.02]"
        >
          <div>
            <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block">Registered Specialists</span>
            <span className="text-2xl font-black text-brand font-headline mt-1">{doctors.length}</span>
            <span className="text-[9.5px] text-emerald-500 font-semibold block mt-0.5 underline">Verified Roster ➔</span>
          </div>
          <span className="material-symbols-outlined text-3xl text-brand/30 bg-brand/10 p-2 rounded-lg">medical_services</span>
        </div>

        <div 
          onClick={() => {
            openModal('roadmap_feature', { title: 'Enterprise Billing & MRR Telemetry', desc: 'Real-time billing synchronization across hospital group enterprise accounts.' });
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3.5 rounded-premium shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all hover:scale-[1.02]"
        >
          <div>
            <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block">Recurring Revenue</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-headline mt-1">$7,300/mo</span>
            <span className="text-[9.5px] text-emerald-500 font-semibold flex items-center mt-0.5 underline">
              Billing Ledger ➔
            </span>
          </div>
          <span className="material-symbols-outlined text-3xl text-emerald-500/30 bg-emerald-500/10 p-2 rounded-lg">payments</span>
        </div>

        <div 
          onClick={() => {
            setActivePage('system_health');
            addToast('System Telemetry', 'Opening core server latency & websocket health.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3.5 rounded-premium shadow-xs flex items-center justify-between cursor-pointer hover:border-purple-500 transition-all hover:scale-[1.02]"
        >
          <div>
            <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider block">Server Cluster Latency</span>
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-headline mt-1">14 ms</span>
            <span className="text-[9.5px] text-purple-500 font-semibold block mt-0.5 underline">Cluster Health ➔</span>
          </div>
          <span className="material-symbols-outlined text-3xl text-purple-400/30 bg-purple-500/10 p-2 rounded-lg">dns</span>
        </div>

      </div>

      {/* Command Center Multi-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
        
        {/* Column 1 & 2: Hospital Nodes & Audit Trail (Spans 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* HOSPITAL NODES GRID */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <span className="material-symbols-outlined text-brand text-sm mr-1.5">domain</span>
                Hospital Node Registry (20 Clusters)
              </h3>
              <span className="text-[9.5px] text-slate-400 font-mono">20 / 20 Online</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {hospitals.slice(0, 8).map(h => (
                <div 
                  key={h.id} 
                  onClick={() => openModal('hospital_details', h)}
                  className="p-2.5 border border-slate-100 dark:border-dark-border/60 rounded bg-slate-50/40 dark:bg-slate-900/10 flex justify-between items-center hover:border-brand cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: h.color }}></span>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{h.name}</h4>
                      <p className="text-[9.5px] text-slate-400 font-semibold">{h.city} • {h.beds} Beds</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[9.5px] font-mono font-bold text-brand">{h.occ}% Occ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NODE TRANSACTION AUDIT LEDGER */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <span className="material-symbols-outlined text-brand text-sm mr-1.5">rule</span>
                Cryptographic Node Transaction Ledger
              </h3>
              <span className="text-[9.5px] text-emerald-500 font-mono font-bold">SHA-256 Verified</span>
            </div>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-0.5 text-[10px]">
              {audits.slice(0, 6).map(log => (
                <div 
                  key={log.id} 
                  onClick={() => openModal('event_details', { title: log.action, text: `${log.details} by ${log.actor}`, time: log.timestamp })}
                  className="p-2 border border-slate-50 dark:border-dark-border/30 rounded bg-slate-50/20 dark:bg-slate-900/5 flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-900/40 cursor-pointer transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">{log.action}</span>
                    <span className="text-[9px] text-slate-400">Actor: {log.actor} ({log.hospital})</span>
                  </div>
                  <span className="font-mono text-slate-400 font-bold text-[9px]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Column 3: Subscriptions, Support Queue & Feature Flags */}
        <div className="space-y-4">
          
          {/* SUBSCRIPTIONS */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <span className="material-symbols-outlined text-brand text-sm mr-1.5">payments</span>
                Enterprise Subscriptions
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {subscriptions.map(sub => (
                <div 
                  key={sub.id} 
                  onClick={() => openModal('roadmap_feature', { title: `${sub.name} Enterprise Account`, desc: `Active ${sub.tier} subscription generating ${sub.mrr}/month. Auto-renewal date: ${sub.renewal}` })}
                  className="p-2 border border-slate-100 dark:border-dark-border/40 rounded bg-slate-50/40 dark:bg-slate-900/10 flex justify-between items-center hover:border-emerald-500 cursor-pointer transition-all"
                >
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-200 block text-[11px]">{sub.name}</span>
                    <span className="text-[9px] text-slate-400">{sub.tier}</span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white font-headline text-xs">{sub.mrr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SUPPORT TICKETS QUEUE */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <span className="material-symbols-outlined text-brand text-sm mr-1.5">support</span>
                Support Ticket Queue
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {tickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  onClick={() => openModal('roadmap_feature', { title: `Support Ticket #${ticket.id}`, desc: `${ticket.title} submitted by ${ticket.node}. Severity: ${ticket.severity}` })}
                  className="p-2 border border-slate-100 dark:border-dark-border/40 rounded bg-slate-50/20 dark:bg-slate-900/5 space-y-1 hover:border-amber-500 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{ticket.node}</span>
                    <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      ticket.severity === 'Critical' ? 'bg-red-500/10 text-danger' : 
                      ticket.severity === 'High' ? 'bg-amber-500/10 text-warning' : 'bg-slate-100 text-slate-400'
                    }`}>{ticket.severity}</span>
                  </div>
                  <p className="text-[10px] text-slate-450 truncate">{ticket.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FEATURE FLAGS CONTROL */}
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <span className="material-symbols-outlined text-brand text-sm mr-1.5">tune</span>
                Feature Flags Toggle
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: 'emergencyDispatch', label: 'Emergency Dispatch SOS' },
                { key: 'doctorTracking', label: 'Live Doctor GPS Tracking' },
                { key: 'liveStatus', label: 'Presence Status Rotator' },
                { key: 'aiRanking', label: 'AI Specialist Rationale' },
              ].map(flag => (
                <div key={flag.key} className="flex items-center justify-between p-1.5 border border-slate-100 dark:border-dark-border/40 rounded">
                  <span className="font-bold text-slate-700 dark:text-slate-200 text-[10.5px]">{flag.label}</span>
                  
                  <button
                    onClick={() => {
                      toggleFeatureFlag(flag.key);
                      addToast('Feature Flag Toggled', `${flag.label} updated.`, 'info');
                    }}
                    className={`w-8 h-4.5 rounded-full p-0.5 shrink-0 transition-colors duration-200 relative flex items-center ${
                      featureFlags[flag.key] ? 'bg-brand' : 'bg-slate-250 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
                        featureFlags[flag.key] ? 'translate-x-3.5' : 'translate-x-0'
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
