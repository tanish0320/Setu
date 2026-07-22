import React from 'react';
import { useApp } from '../context/AppContext';

export const RoleDashboardHospitalAdmin = () => {
  const {
    selectedHospital,
    hospitals,
    doctors,
    appointments,
    dispatches,
    activityFeed,
    dispatchSOS,
    setActivePage,
    addToast,
    openModal,
    acceptAiRecommendation,
    dismissAiRecommendation
  } = useApp();

  // Metrics
  const doctorsAvailable = doctors.filter(d => d.status === 'Available').length || 28;
  const doctorsBusy = doctors.filter(d => d.status === 'Busy' || d.status === 'Consultation' || d.status === 'In Surgery').length || 17;
  const emergencyCasesCount = dispatches.filter(d => d.hospitalId === selectedHospital.id).length || 9;
  const avgResponseTime = "4.2 mins";
  const bedOccupancy = `${selectedHospital.occ || 81}%`;
  const emergencySuccess = "97%";

  const handleQuickEmergency = () => {
    dispatchSOS('Cardiology', 'Critical', selectedHospital.id);
    addToast('Emergency Dispatched', 'Code Blue alert paging on-duty cardiac team.', 'danger');
    setActivePage('emergency');
  };

  return (
    <div className="w-full space-y-4 animate-fade-in text-left font-sans">
      
      {/* Command Center Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-mono font-bold bg-brand/10 text-brand px-2 py-0.5 rounded border border-brand/20 uppercase tracking-wider">
              {selectedHospital.code}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{selectedHospital.type} • {selectedHospital.city}</span>
          </div>
          <h1 className="text-xl font-black text-slate-850 dark:text-white font-headline tracking-tight mt-0.5">
            {selectedHospital.name} Operations Command Center
          </h1>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Network Grid Operational</span>
          </div>
          <button
            onClick={handleQuickEmergency}
            className="bg-danger hover:bg-red-650 text-white font-bold px-3.5 py-1.5 rounded shadow-sm transition-all uppercase tracking-wider text-[11px] flex items-center space-x-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xs">cell_tower</span>
            <span>Trigger SOS</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (6 Compressed Height Cards, 100% Width) - ALL INTERACTIVE */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Doctors Available */}
        <div 
          onClick={() => {
            setActivePage('doctors');
            addToast('Doctors Registry', 'Navigated to specialists availability matrix.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3 rounded-premium shadow-xs flex flex-col justify-between hover:border-brand cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Doctors Available</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-headline">{doctorsAvailable}</span>
            <span className="text-[9px] text-emerald-500 font-semibold underline">View Roster ➔</span>
          </div>
        </div>

        {/* Doctors Busy */}
        <div 
          onClick={() => {
            setActivePage('doctors');
            addToast('Specialist Roster', 'Viewing active consultations and surgery cases.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3 rounded-premium shadow-xs flex flex-col justify-between hover:border-amber-500 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Doctors Busy</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-amber-500 font-headline">{doctorsBusy}</span>
            <span className="text-[9px] text-slate-400 underline">In Consults ➔</span>
          </div>
        </div>

        {/* Emergency Cases */}
        <div 
          onClick={() => {
            setActivePage('emergency');
            addToast('Emergency Dispatch', 'Viewing active emergency dispatches.', 'danger');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3 rounded-premium shadow-xs flex flex-col justify-between hover:border-red-500 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Emergency Cases</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-danger font-headline animate-pulse">{emergencyCasesCount}</span>
            <span className="text-[9px] text-danger font-bold underline">Active SOS ➔</span>
          </div>
        </div>

        {/* Avg Response */}
        <div 
          onClick={() => {
            setActivePage('reports');
            addToast('Diagnostics Report', 'Opening dispatch latency benchmarks.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3 rounded-premium shadow-xs flex flex-col justify-between hover:border-brand cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Avg Response</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-brand font-headline">{avgResponseTime}</span>
            <span className="text-[9px] text-emerald-500 font-semibold underline">Metrics ➔</span>
          </div>
        </div>

        {/* Bed Occupancy */}
        <div 
          onClick={() => openModal('hospital_details', selectedHospital)}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3 rounded-premium shadow-xs flex flex-col justify-between hover:border-slate-400 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Bed Occupancy</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-800 dark:text-white font-headline">{bedOccupancy}</span>
            <span className="text-[9px] text-slate-400 font-mono underline">Beds Info ➔</span>
          </div>
        </div>

        {/* Success Rate */}
        <div 
          onClick={() => openModal('roadmap_feature', { title: 'Golden Hour Success Score', desc: 'Cryptographically audited metric verifying 97% patient transfer within golden hour.' })}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-3 rounded-premium shadow-xs flex flex-col justify-between hover:border-emerald-500 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <span className="text-[8.5px] text-slate-400 font-bold uppercase tracking-wider">Success Rate</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-emerald-500 font-headline">{emergencySuccess}</span>
            <span className="text-[9px] text-emerald-500 font-semibold underline">Audit Score ➔</span>
          </div>
        </div>

      </div>

      {/* Dense Command Center Multi-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Panel 1: Upcoming Emergencies & Active Dispatches */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <span className="material-symbols-outlined text-danger text-sm mr-1">emergency</span>
                Upcoming Emergencies
              </span>
              <span className="text-[9px] font-mono text-danger font-bold bg-danger/10 px-1.5 py-0.2 rounded">LIVE</span>
            </div>

            <div className="space-y-2 mt-3">
              {dispatches.slice(0, 4).map(disp => (
                <div 
                  key={disp.id} 
                  onClick={() => openModal('patient_details', { name: disp.patientName, age: disp.age || 48, gender: 'M', condition: disp.condition, severity: disp.severity, phone: '+91 98200 11002' })}
                  className="p-2 bg-slate-50 dark:bg-slate-900/30 rounded border border-slate-100 dark:border-dark-border/40 space-y-1 hover:border-brand cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-800 dark:text-slate-100">{disp.patientName}</span>
                    <span className={`text-[8.5px] px-1.5 py-0.2 rounded uppercase ${
                      disp.severity === 'Critical' ? 'bg-red-500/10 text-danger' : 'bg-amber-500/10 text-warning'
                    }`}>{disp.severity}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9.5px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[130px]">{disp.condition}</span>
                    <span className="font-mono text-brand font-bold">ETA: {disp.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActivePage('emergency')}
            className="w-full text-center text-brand font-bold hover:underline pt-2 text-[10px] uppercase tracking-wider block cursor-pointer"
          >
            Open Emergency Dispatch Center ➔
          </button>
        </div>

        {/* Panel 2: AI Recommendations & Buffer Alerts */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <span className="material-symbols-outlined text-purple-500 text-sm mr-1">psychology</span>
                AI Recommendations
              </span>
              <span className="text-[9px] font-mono text-purple-500 font-bold bg-purple-500/10 px-1.5 py-0.2 rounded">94% ACCURACY</span>
            </div>

            <div className="space-y-2 mt-3 text-[11px]">
              <div className="p-2 bg-purple-500/5 border border-purple-500/15 rounded text-purple-900 dark:text-purple-200 space-y-1.5">
                <span className="font-bold text-[10px] block text-purple-700 dark:text-purple-300">✓ Reroute Acute STEMI to Manipal</span>
                <p className="text-[9.5px] leading-snug">Manipal Cath Lab is ready (12m delay) vs 42m delay at nearest Apollo node.</p>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => acceptAiRecommendation({ title: 'Reroute STEMI', message: 'Rerouted Acute STEMI dispatch to Manipal Cath Lab' })}
                    className="bg-purple-600 text-white font-bold text-[9px] px-2 py-0.5 rounded hover:bg-purple-700 transition-colors"
                  >
                    Accept Reroute
                  </button>
                  <button
                    onClick={() => openModal('ai_rationale', { recommendedName: 'Manipal Hospital', reason: 'Manipal Cath Lab ready in 12m vs Apollo 42m delay.' })}
                    className="text-purple-600 dark:text-purple-300 font-bold text-[9px] hover:underline"
                  >
                    Explain Why
                  </button>
                </div>
              </div>

              <div className="p-2 bg-amber-500/5 border border-amber-500/15 rounded text-amber-900 dark:text-amber-200 space-y-1.5">
                <span className="font-bold text-[10px] block text-amber-700 dark:text-amber-300">⚠️ Travel Buffer Alert (+15m)</span>
                <p className="text-[9.5px] leading-snug">Heavy traffic on Old Airport Rd. Auto-adjust commute buffer for Dr. Priya Sharma.</p>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => acceptAiRecommendation({ title: 'Commute Buffer Adjustment', message: 'Updated travel buffer by +15m for Dr. Priya Sharma' })}
                    className="bg-amber-600 text-white font-bold text-[9px] px-2 py-0.5 rounded hover:bg-amber-700 transition-colors"
                  >
                    Apply Buffer Adjustment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => openModal('ai_rationale', { recommendedName: 'SETU Match Engine', reason: 'AnalyzesCath Lab readiness, technician shifts, and traffic matrices in real-time.' })}
            className="w-full text-center text-purple-600 dark:text-purple-400 font-bold hover:underline pt-2 text-[10px] uppercase tracking-wider block cursor-pointer"
          >
            Explain Match Engine Logic ➔
          </button>
        </div>

        {/* Panel 3: Hospital Network Status */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <span className="material-symbols-outlined text-brand text-sm mr-1">hub</span>
                Network Cluster Status
              </span>
              <span className="text-[9px] font-mono text-slate-400 font-bold">{hospitals.length} Nodes</span>
            </div>

            <div className="space-y-2 mt-3">
              {hospitals.slice(0, 4).map(h => (
                <div 
                  key={h.id} 
                  onClick={() => openModal('hospital_details', h)}
                  className="flex justify-between items-center text-[10.5px] p-1.5 border-b border-slate-50 dark:border-dark-border/30 hover:bg-slate-50 dark:hover:bg-slate-900/30 cursor-pointer rounded transition-all"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: h.color }}></span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 truncate">{h.shortName}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-slate-600 dark:text-slate-300 font-bold">{h.occ}% Occ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActivePage('hospitals')}
            className="w-full text-center text-brand font-bold hover:underline pt-2 text-[10px] uppercase tracking-wider block cursor-pointer"
          >
            View All 20 Hospital Nodes ➔
          </button>
        </div>

        {/* Panel 4: Recent Activity Feed */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-dark-border/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <span className="material-symbols-outlined text-emerald-500 text-sm mr-1">history</span>
                Recent Activity
              </span>
              <span className="text-[9px] font-mono text-slate-400">REALTIME</span>
            </div>

            <div className="space-y-2 mt-3 max-h-[190px] overflow-y-auto pr-0.5">
              {activityFeed.slice(0, 5).map((act, idx) => (
                <div 
                  key={idx} 
                  onClick={() => openModal('event_details', act)}
                  className="flex items-start space-x-2 text-[10px] hover:bg-slate-50 dark:hover:bg-slate-900/30 p-1 rounded cursor-pointer transition-colors"
                >
                  <span className="font-mono font-bold text-slate-400 shrink-0 mt-0.5">{act.time}</span>
                  <div className="flex-1 truncate">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block truncate">{act.title}</span>
                    <p className="text-[9px] text-slate-400 truncate">{act.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActivePage('audit_logs')}
            className="w-full text-center text-emerald-600 dark:text-emerald-400 font-bold hover:underline pt-2 text-[10px] uppercase tracking-wider block cursor-pointer"
          >
            View Immutable Audit Ledger ➔
          </button>
        </div>

      </div>

    </div>
  );
};
