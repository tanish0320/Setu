import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SvgNetworkMap } from './SvgNetworkMap';

export const EmergencyWorkflowPage = () => {
  const {
    selectedHospital,
    doctors,
    activeSOS, sosCountdown, rankedDoctors,
    sosStep, setSosStep, triggerDoctorNotification,
    dispatchSOS, acceptSOS, cancelSOS
  } = useApp();

  const [specialty, setSpecialty] = useState('Cardiology');
  const [urgency, setUrgency] = useState('Critical');

  const [pagerTime, setPagerTime] = useState(15);
  
  React.useEffect(() => {
    let timer = null;
    if (activeSOS && activeSOS.status === 'Dispatched' && sosStep === 4 && pagerTime > 0) {
      timer = setInterval(() => {
        setPagerTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto accept the top ranked doctor to simulate auto-escalation!
            if (rankedDoctors.length > 0) {
              acceptSOS(rankedDoctors[0].id);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (sosStep !== 4) {
      setPagerTime(15); // Reset
    }
    return () => clearInterval(timer);
  }, [activeSOS, sosStep, pagerTime, rankedDoctors]);

  const stepsList = [
    { num: 1, name: 'Select Specialty', desc: 'Identify specialist cohort' },
    { num: 2, name: 'Set Priority', desc: 'Clinical urgency level' },
    { num: 3, name: 'AI Ranking', desc: 'Weighted matching score' },
    { num: 4, name: 'Broadcaster Ring', desc: 'SMS & pager dispatch' },
    { num: 5, name: 'Specialist Accept', desc: 'Response confirmation' },
    { num: 6, name: 'Commute ETA', desc: 'Live transit coordinate updates' },
    { num: 7, name: 'Arrival Track', desc: 'Clinical reception checkpoint' }
  ];

  const handleLaunchSOS = (e) => {
    e.preventDefault();
    dispatchSOS(specialty, urgency, selectedHospital.id);
  };

  const getStepStatus = (stepNum) => {
    if (!activeSOS) return 'pending';
    if (sosStep > stepNum) return 'completed';
    if (sosStep === stepNum) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-dark-border pb-4">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white flex items-center">
            <span className="material-symbols-outlined text-danger mr-2 animate-pulse text-2xl">cell_tower</span>
            Emergency SOS Control Room
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualizing the 7-step intelligent specialist matching and dispatch process.
          </p>
        </div>
        {activeSOS && (
          <button
            onClick={cancelSOS}
            className="text-xs bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-danger font-bold px-3 py-1.5 rounded-premium flex items-center space-x-1.5"
          >
            <span className="material-symbols-outlined text-sm">cancel</span>
            <span>Retract Dispatch</span>
          </button>
        )}
      </div>

      {/* 7-Step Progress Timeline Card */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0 md:space-x-2">
          {stepsList.map(step => {
            const status = getStepStatus(step.num);
            return (
              <div key={step.num} className="flex-1 flex flex-row md:flex-col items-center md:text-center relative">
                
                {/* Connector Line (Horizontal on desktop) */}
                {step.num < 7 && (
                  <div className={`hidden md:block absolute top-4 left-1/2 w-full h-0.5 z-0 ${
                    status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`}></div>
                )}

                {/* Circle Icon Badge */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 border transition-all ${
                  status === 'completed' ? 'bg-success border-success text-white' :
                  status === 'active' ? 'bg-danger border-danger text-white shadow-glow-red animate-pulse font-black' :
                  'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-dark-border text-slate-400'
                }`}>
                  {status === 'completed' ? (
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  ) : step.num}
                </div>

                <div className="ml-3 md:ml-0 md:mt-2.5">
                  <span className={`text-[10px] font-bold block uppercase ${
                    status === 'active' ? 'text-danger' : 
                    status === 'completed' ? 'text-success' : 'text-slate-400'
                  }`}>{step.name}</span>
                  <span className="text-[9px] text-slate-400 leading-none hidden md:block mt-0.5">{step.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workflow Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Step-by-Step execution details */}
        <div className="xl:col-span-2 space-y-6">
          
          {!activeSOS ? (
            // Form for Step 1 & 2
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center mb-4 pb-2 border-b border-slate-100 dark:border-dark-border/40">
                <span className="material-symbols-outlined text-danger mr-2">cell_tower</span>
                Step 1 & 2: Set SOS Parameters
              </h3>

              <form onSubmit={handleLaunchSOS} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Required Specialty (Step 1)</label>
                    <select
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-danger focus:outline-none"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    >
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="General Surgery">General Surgery</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Urgency Priority (Step 2)</label>
                    <select
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded p-2 focus:ring-1 focus:ring-danger focus:outline-none"
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                    >
                      <option value="Critical">Critical (Immediate Code Blue)</option>
                      <option value="Urgent">Urgent (Commute Required)</option>
                      <option value="Standard">Standard Advice Page</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-danger hover:bg-red-600 text-white font-bold text-xs py-2.5 rounded-premium transition-all shadow-md shadow-red-500/10 flex items-center justify-center space-x-1.5"
                >
                  <span className="material-symbols-outlined text-sm font-bold">cell_tower</span>
                  <span>TRIGGER DISPATCH SYSTEM</span>
                </button>
              </form>
            </div>
          ) : (
            // Active Step execution states
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 shadow-sm space-y-6">
              
              {/* Step 3: AI Specialist Ranking */}
              {sosStep >= 3 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-dark-border/40">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
                      <span className="material-symbols-outlined text-brand mr-2 text-sm">psychology</span>
                      Step 3: Match Results (Specialty Ranks)
                    </h4>
                    <span className="text-[9px] bg-brand-500/10 text-brand font-semibold px-2 py-0.5 rounded border border-brand-500/20">AI Weighted Index</span>
                  </div>

                  <div className="space-y-3">
                    {rankedDoctors.slice(0, 3).map((doc, idx) => (
                      <div key={doc.id} className="border border-slate-100 dark:border-dark-border/40 p-4 rounded text-xs bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-200 transition-colors space-y-2.5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2.5">
                            <span className="font-bold text-slate-400 w-4">#{idx+1}</span>
                            <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-200 block">{doc.name}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Commute Distance: {doc.distance} km • ETA: ~{doc.estimatedETA} mins</span>
                            </div>
                          </div>
                          <div className="text-right flex items-center space-x-4">
                            <div>
                              <span className="text-[9px] text-slate-400 uppercase block font-bold">Match rating</span>
                              <span className="font-black text-brand text-sm font-headline">{doc.matchScore}%</span>
                            </div>
                            
                            {sosStep === 4 && (
                              <button
                                onClick={() => acceptSOS(doc.id)}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] py-1.5 px-3 rounded shadow-sm"
                              >
                                Mock Accept
                              </button>
                            )}
                          </div>
                        </div>

                        {/* AI Calculation & Explanation Breakdown */}
                        <div className="p-3 bg-white dark:bg-[#151d30] border border-slate-100 dark:border-dark-border/30 rounded text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 space-y-1.5">
                          <div className="font-bold text-slate-600 dark:text-slate-300">AI Match Index Parameters:</div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[9.5px] font-mono">
                            <div>Availability (40%): <span className="font-bold text-brand">{doc.status === 'Available' ? 40 : 24}%</span></div>
                            <div>Distance (30%): <span className="font-bold text-brand">{Math.round((Math.max(0, 100 - doc.distance * 15)) * 0.3)}%</span></div>
                            <div>Reliability (20%): <span className="font-bold text-brand">{Math.round(doc.reliability.overall * 0.2)}%</span></div>
                            <div>Workload (10%): <span className="font-bold text-brand">{doc.workload === 'Low' ? 10 : 5}%</span></div>
                          </div>
                          <div className="text-[10px] italic mt-1.5 text-slate-500 dark:text-slate-400 leading-normal">
                            <span className="font-bold uppercase text-[9px] not-italic mr-1.5 text-brand">Decision Rationale:</span>
                            {doc.rankingExplanation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Notification Broadcaster trigger */}
              {sosStep === 3 && (
                <div className="bg-brand-50/20 dark:bg-brand-900/10 border border-brand-500/20 p-4 rounded-premium flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-brand-300">Step 4: Broadcaster Ready</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Click dispatch notifications to send SMS, Pager ringers, and phone rings to the listed specialists.</p>
                  </div>
                  <button
                    onClick={triggerDoctorNotification}
                    className="bg-brand hover:bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-premium shadow-md shadow-brand-500/10 flex items-center space-x-1"
                  >
                    <span className="material-symbols-outlined text-sm font-bold">cell_tower</span>
                    <span>BROADCAST NOTIFICATIONS</span>
                  </button>
                </div>
              )}

              {/* Step 4 Pagers active - show escalation timer progress */}
              {sosStep === 4 && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-premium space-y-2 animate-fade-in text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-amber-700 dark:text-amber-300">Step 4: Pagers Active & Ringing...</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Alerting ranked specialists in sequence. If no acceptance occurs before timeout, pager escalates automatically.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Escalation Timer</span>
                      <span className="text-xs font-black text-amber-600 font-mono animate-pulse">{pagerTime}s left</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{
                      width: `${(pagerTime / 15) * 100}%`
                    }}></div>
                  </div>
                </div>
              )}

              {/* Step 5 & 6: Commute ETA Tracking */}
              {sosStep >= 5 && activeSOS.doctor && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-dark-border/40">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center">
                      <span className="material-symbols-outlined text-danger mr-2 text-sm">directions_car</span>
                      Step 5 & 6: Live Commute ETA Tracking
                    </h4>
                    <span className="text-[9px] bg-red-500/10 text-danger font-semibold px-2 py-0.5 rounded border border-red-500/20 animate-pulse">Live Transit</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-dark-border/40 p-4 rounded-premium">
                    <div className="flex items-center space-x-3">
                      <img src={activeSOS.doctor.avatar} alt={activeSOS.doctor.name} className="w-12 h-12 rounded-full object-cover border-2 border-red-500/20" />
                      <div>
                        <h5 className="text-xs font-black text-slate-700 dark:text-slate-200">{activeSOS.doctor.name}</h5>
                        <p className="text-[10px] text-brand font-semibold">{activeSOS.doctor.specialty} Specialist</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">Reliability overall score: {activeSOS.doctor.reliability.overall}%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-center">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Remaining Distance</span>
                        <span className="text-md font-bold text-slate-700 dark:text-slate-200">1.8 km</span>
                      </div>
                      <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Arrival ETA</span>
                        <span className="text-md font-black text-danger font-mono animate-pulse">
                          {sosCountdown > 0 ? `${Math.floor(sosCountdown / 60)}m ${sosCountdown % 60}s` : 'ARRIVED'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Arrival confirmation */}
              {sosStep === 7 && (
                <div className="bg-emerald-500/15 border border-emerald-500/30 p-4 rounded-premium flex items-center space-x-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-700 dark:text-emerald-300">Step 7: Specialist Node Arrived</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Specialist has checked in at Apollo emergency node checkpoint. Coordination commission resolved successfully.</p>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Commute route map */}
        <div>
          <SvgNetworkMap />
        </div>

      </div>

    </div>
  );
};
