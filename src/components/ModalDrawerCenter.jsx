import React from 'react';
import { useApp } from '../context/AppContext';

export const ModalDrawerCenter = () => {
  const { 
    activeModal, modalData, closeModal, 
    addToast, logAudit, setActivePage,
    notifications, setNotifications
  } = useApp();

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in font-sans">
      
      {/* 1. PRODUCTION ROADMAP FEATURE MODAL */}
      {activeModal === 'roadmap_feature' && (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2 text-brand">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              <h3 className="font-bold font-headline text-slate-800 dark:text-white text-base">Production Roadmap Feature</h3>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm">✕</button>
          </div>

          <div className="p-3 bg-brand/5 border border-brand/15 rounded text-xs space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
            <p className="font-bold text-brand">{modalData?.title || 'Feature Simulated in MVP'}</p>
            <p>{modalData?.desc || 'This capability is part of the full SETU platform production roadmap and is intentionally simulated in this live demonstration environment.'}</p>
          </div>

          <div className="text-[10px] font-mono text-slate-400 space-y-1">
            <div>Target Release: <span className="text-slate-600 dark:text-slate-300 font-bold">Sprint 2 Production Candidate</span></div>
            <div>DPDP Security Compliance: <span className="text-emerald-500 font-bold">100% Certified</span></div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                closeModal();
                addToast('Acknowledged', 'Feature roadmap acknowledged.', 'info');
              }}
              className="bg-brand text-white font-bold text-xs py-2 px-5 rounded shadow-sm hover:bg-brand-600 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* 2. HOSPITAL DETAILS DRAWER */}
      {activeModal === 'hospital_details' && modalData && (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
          <div className="flex justify-between items-start border-b pb-3 border-slate-200 dark:border-dark-border">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: modalData.color || '#2563EB' }}></span>
                <h3 className="font-bold font-headline text-slate-800 dark:text-white text-lg">{modalData.name}</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{modalData.code} • {modalData.city} • {modalData.type}</span>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-dark-border/40">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Bed Occupancy</span>
              <span className="text-lg font-black text-amber-500 font-headline">{modalData.occ || 82}%</span>
              <span className="text-[9px] text-slate-400 block">{modalData.beds || 450} Total Beds</span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-dark-border/40">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">ICU Beds Free</span>
              <span className="text-lg font-black text-emerald-500 font-headline">{modalData.icu || 85} Beds</span>
              <span className="text-[9px] text-emerald-500 font-semibold block">Resuscitation Bays Open</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded border border-slate-100 dark:border-dark-border/40 text-xs space-y-1">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Emergency Capability</span>
            <p className="font-bold text-slate-800 dark:text-slate-100">{modalData.cap}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Helpline: {modalData.phone}</p>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                closeModal();
                setActivePage('emergency');
                addToast('Emergency Dispatch', `Opening dispatch center for ${modalData.shortName}`, 'info');
              }}
              className="text-danger font-bold hover:underline"
            >
              🚨 Dispatch Emergency Here
            </button>

            <button
              onClick={closeModal}
              className="bg-brand text-white font-bold text-xs py-1.5 px-4 rounded shadow-sm hover:bg-brand-600 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. PATIENT CLINICAL DRAWER */}
      {activeModal === 'patient_details' && modalData && (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
          <div className="flex justify-between items-start border-b pb-3 border-slate-200 dark:border-dark-border">
            <div>
              <h3 className="font-bold font-headline text-slate-800 dark:text-white text-lg">
                {modalData.name} <span className="text-xs text-slate-400 font-normal">({modalData.age}y / {modalData.gender})</span>
              </h3>
              <span className="text-[10px] text-brand font-mono font-bold mt-0.5 block">{modalData.mrn || 'MRN-104928'} • Blood Group: {modalData.bloodGroup || 'O+'}</span>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-dark-border/40">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Condition Status</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 block mt-0.5">{modalData.condition || 'Acute Distress'}</span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-dark-border/40">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Severity Flag</span>
              <span className={`font-bold uppercase text-[9.5px] block mt-0.5 ${
                modalData.severity === 'Critical' ? 'text-danger' : 'text-amber-500'
              }`}>{modalData.severity || 'Moderate'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded border border-slate-100 dark:border-dark-border/40 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between text-[10.5px]">
              <span className="text-slate-400">Phone Contact:</span>
              <span className="text-slate-700 dark:text-slate-200 font-bold">{modalData.phone}</span>
            </div>
            <div className="flex justify-between text-[10.5px]">
              <span className="text-slate-400">Emergency Contact:</span>
              <span className="text-slate-700 dark:text-slate-200 font-bold">{modalData.emergencyContact || '+91 98111 20042'}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                closeModal();
                setActivePage('emergency');
                addToast('Intake File Loaded', `Loaded ${modalData.name}'s chart into Consultation Wizard`, 'success');
              }}
              className="text-brand font-bold hover:underline"
            >
              File New Consultation Request ➔
            </button>

            <button
              onClick={closeModal}
              className="bg-brand text-white font-bold text-xs py-1.5 px-4 rounded shadow-sm hover:bg-brand-600 transition-colors"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

      {/* 4. EVENT ACTIVITY DETAILS MODAL */}
      {activeModal === 'event_details' && modalData && (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 max-w-md w-full shadow-2xl space-y-4 text-left">
          <div className="flex justify-between items-start border-b pb-3 border-slate-200 dark:border-dark-border">
            <div>
              <span className="text-[9px] font-mono font-bold text-brand uppercase tracking-wider block">Activity Event Log</span>
              <h3 className="font-bold font-headline text-slate-800 dark:text-white text-base">{modalData.title}</h3>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm">✕</button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-dark-border/40 text-slate-700 dark:text-slate-200 leading-relaxed">
              <span className="font-bold block text-slate-800 dark:text-slate-100">Event Description:</span>
              {modalData.text}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono">
              <div className="p-2 border rounded bg-slate-50/50 dark:bg-slate-900/20">
                <span className="text-[8.5px] text-slate-400 block uppercase">Timestamp</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">{modalData.time || '09:12'}</span>
              </div>
              <div className="p-2 border rounded bg-slate-50/50 dark:bg-slate-900/20">
                <span className="text-[8.5px] text-slate-400 block uppercase">Security Hash</span>
                <span className="font-bold text-emerald-500">0x8f2c7a9...</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={closeModal}
              className="bg-brand text-white font-bold text-xs py-1.5 px-4 rounded shadow-sm hover:bg-brand-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 5. NOTIFICATION CENTER MODAL */}
      {activeModal === 'notification_center' && (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
          <div className="flex justify-between items-center border-b pb-3 border-slate-200 dark:border-dark-border">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-brand text-xl">notifications</span>
              <h3 className="font-bold font-headline text-slate-800 dark:text-white text-base">Notification Center</h3>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm">✕</button>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 text-xs">
            {notifications.length === 0 ? (
              <p className="text-slate-400 py-8 text-center italic">No active notifications in your queue.</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => {
                    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                    closeModal();
                    setActivePage('emergency');
                    addToast('Navigated', `Opening related event workspace for ${n.title}`, 'info');
                  }}
                  className={`p-3 rounded-premium border transition-all cursor-pointer flex justify-between items-start ${
                    n.read 
                      ? 'bg-slate-50/50 dark:bg-slate-900/10 border-slate-150 dark:border-dark-border/40 opacity-75' 
                      : 'bg-brand/5 dark:bg-brand-900/10 border-brand/20 shadow-xs'
                  }`}
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{n.title}</span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{n.message}</p>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">{n.time}</span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                addToast('Cleared', 'All notifications marked as read.', 'success');
              }}
              className="text-brand font-bold hover:underline"
            >
              Mark All as Read
            </button>

            <button
              onClick={closeModal}
              className="bg-brand text-white font-bold text-xs py-1.5 px-4 rounded shadow-sm hover:bg-brand-600 transition-colors"
            >
              Close Center
            </button>
          </div>
        </div>
      )}

      {/* 6. AI RATIONALE BREAKDOWN MODAL */}
      {activeModal === 'ai_rationale' && modalData && (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 max-w-lg w-full shadow-2xl space-y-4 text-left">
          <div className="flex justify-between items-start border-b pb-3 border-slate-200 dark:border-dark-border">
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              <div>
                <h3 className="font-bold font-headline text-slate-800 dark:text-white text-base">AI Suitability Rationale Breakdown</h3>
                <span className="text-[9.5px] font-mono text-slate-400 block">SETU Match Engine v3.2</span>
              </div>
            </div>
            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm">✕</button>
          </div>

          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-premium space-y-1">
              <span className="font-bold text-purple-700 dark:text-purple-300 text-xs block">Optimal Recommendation: {modalData.recommendedName || 'Manipal Hospital'}</span>
              <p className="text-[11px] leading-relaxed">{modalData.reason || 'Definitive care start in 17m. Nearest Apollo MRI technician is offline (42m delay).'}</p>
            </div>

            <div className="space-y-2 text-[11px]">
              <span className="font-bold text-slate-800 dark:text-slate-100 uppercase text-[9.5px] tracking-wider block">Decision Vector Weights:</span>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between p-2 border rounded bg-slate-50/50 dark:bg-slate-900/20">
                  <span>Diagnostic Equipment Readiness:</span>
                  <span className="font-bold text-emerald-500">40% Weight (100/100)</span>
                </div>
                <div className="flex justify-between p-2 border rounded bg-slate-50/50 dark:bg-slate-900/20">
                  <span>On-Duty Technician & Surgeon:</span>
                  <span className="font-bold text-emerald-500">30% Weight (95/100)</span>
                </div>
                <div className="flex justify-between p-2 border rounded bg-slate-50/50 dark:bg-slate-900/20">
                  <span>Real-time Transit Latency:</span>
                  <span className="font-bold text-amber-500">20% Weight (80/100)</span>
                </div>
                <div className="flex justify-between p-2 border rounded bg-slate-50/50 dark:bg-slate-900/20">
                  <span>Historical Punctuality Score:</span>
                  <span className="font-bold text-emerald-500">10% Weight (92/100)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={closeModal}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 px-5 rounded shadow-sm transition-colors font-headline uppercase tracking-wider"
            >
              Understood
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
