import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SvgNetworkMap } from './SvgNetworkMap';

// Simple ECG visualizer
const MinimalEcg = () => (
  <div className="bg-slate-900 border border-slate-800 rounded p-3 h-16 flex items-center justify-center relative overflow-hidden">
    <div className="absolute top-1 left-2 text-[8px] font-mono text-emerald-400">ECG TRACE</div>
    <svg viewBox="0 0 300 40" className="w-full h-10 stroke-emerald-400 fill-none" strokeWidth="1.5">
      <path d="M 0 20 L 40 20 L 45 10 L 50 30 L 55 20 L 100 20 L 105 5 L 110 35 L 115 20 L 160 20 L 165 15 L 170 25 L 175 20 L 220 20 L 225 5 L 230 35 L 235 20 L 300 20" />
    </svg>
  </div>
);

export const EmergencyWorkflowPage = () => {
  const {
    role,
    selectedHospital,
    doctors,
    activeSOS, sosCountdown, rankedDoctors,
    sosStep, setSosStep, triggerDoctorNotification,
    dispatchSOS, acceptSOS, cancelSOS,
    handoffs, addHandoffNote,
    logAudit
  } = useApp();

  // DOCTOR WORKSPACE STATES
  const [docTab, setDocTab] = useState('emergency'); // emergency, urgent, routine, accepted, completed, archived
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({
    patient: true,
    vitals: true,
    history: true,
    reports: true,
    summary: true
  });
  
  // ETA values
  const [inputEtas, setInputEtas] = useState({});

  // Chat message simulator in accepted workspace
  const [chatInputs, setChatInputs] = useState({});
  const [chatHistory, setChatHistory] = useState({
    'active-sos': [
      { sender: 'coordinator', text: 'Dr. Sharma, Code Blue patient is prepped in ICU Bed 1. Vitals look guarded.' }
    ]
  });

  // Doctor completion forms
  const [completionForms, setCompletionForms] = useState({});

  // Active accepted consultations list (Doctor Portal state)
  const [acceptedConsults, setAcceptedConsults] = useState([]);
  const [completedConsults, setCompletedConsults] = useState([]);

  // Filter requests lists
  // Hardcoded v3 requests matching specs
  const [incomingRequests, setIncomingRequests] = useState([
    {
      id: 'req-201',
      hospitalName: 'Apollo Hospital, Delhi',
      hospitalId: 'h1',
      patientName: 'Ramesh Sen',
      age: 62,
      gender: 'M',
      uhid: 'UHID-892019',
      chiefComplaint: 'Acute chest pain radiating to left arm. Dyspnea.',
      vitals: 'BP 148/92, HR 98, Temp 98.4, SPO2 92%',
      history: 'Prior myocardial infarction (2022). Diabetic.',
      medications: 'Metformin 500mg BID, Clopidogrel 75mg QD.',
      reports: 'Troponin-I positive (0.35 ng/mL). Chest X-ray clear.',
      priority: 'Emergency',
      mode: 'Physical',
      timeRequested: '10 mins ago',
      aiSummary: 'High probability of NSTEMI. Troponin positive. Requires cardiac angiogram match.'
    },
    {
      id: 'req-202',
      hospitalName: 'Manipal Hospital, Bangalore',
      hospitalId: 'h4',
      patientName: 'Kavita Joshi',
      age: 45,
      gender: 'F',
      uhid: 'UHID-223409',
      chiefComplaint: 'Severe retrosternal pressure with diaphoresis.',
      vitals: 'BP 132/88, HR 88, Temp 98.6, SPO2 95%',
      history: 'No cardiac history. Mild asthma.',
      medications: 'Albuterol PRN.',
      reports: 'ECG shows minor ST-segment depression in lateral leads.',
      priority: 'Urgent',
      mode: 'Either',
      timeRequested: '35 mins ago',
      aiSummary: 'Ischemic suspect. Review serial ECG trace. Establish immediate IV line access.'
    },
    {
      id: 'req-203',
      hospitalName: 'Fortis Hospital, Noida',
      hospitalId: 'h2',
      patientName: 'Anil Sharma',
      age: 55,
      gender: 'M',
      uhid: 'UHID-492018',
      chiefComplaint: 'Post-op cardiac check. Check compliance.',
      vitals: 'BP 122/80, HR 72, Temp 98.6, SPO2 98%',
      history: 'Post-coronary angio (March 2026). Stable.',
      medications: 'Aspirin 75mg QD, Atorvastatin 40mg HS.',
      reports: 'Routine check. Lab reports normal.',
      priority: 'Routine',
      mode: 'Online',
      timeRequested: '1 hour ago',
      aiSummary: 'Routine post-op follow-up. Hemodynamic parameters stable.'
    }
  ]);

  const toggleSection = (sec) => {
    setCollapsedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleDoctorAccept = (req, chosenMode) => {
    const mode = chosenMode || req.mode;
    const eta = mode === 'Physical' ? `${inputEtas[req.id] || '15'} mins` : 'Immediate';
    
    const acceptedItem = {
      ...req,
      acceptedMode: mode,
      eta,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAcceptedConsults(prev => [acceptedItem, ...prev]);
    setIncomingRequests(prev => prev.filter(r => r.id !== req.id));
    setDocTab('accepted');
    setSelectedCaseId(null);
    logAudit('Consultation Accepted', 'Specialist Doctor', 'doctor', req.hospitalName, 'Pending', `Accepted (${mode}, ETA: ${eta})`);
  };

  const handleDoctorDecline = (reqId) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== reqId));
    setSelectedCaseId(null);
    logAudit('Consultation Declined', 'Specialist Doctor', 'doctor', 'N/A', 'Pending', 'Declined');
  };

  const handleSendChat = (reqId) => {
    const txt = chatInputs[reqId];
    if (!txt?.trim()) return;

    const newMsg = {
      sender: 'doctor',
      text: txt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => ({
      ...prev,
      [reqId]: [...(prev[reqId] || []), newMsg]
    }));
    
    setChatInputs(prev => ({ ...prev, [reqId]: '' }));

    // Simulate coordinator reply after 2 seconds
    setTimeout(() => {
      setChatHistory(prev => ({
        ...prev,
        [reqId]: [...(prev[reqId] || []), {
          sender: 'coordinator',
          text: 'Acknowledged. Prepping patient chart for review.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
      }));
    }, 2000);
  };

  const handleDoctorComplete = (reqId) => {
    const form = completionForms[reqId] || {};
    if (!form.diagnosis || !form.recommendations) {
      alert('Please fill out Diagnosis and Recommendations before signing off.');
      return;
    }

    const consult = acceptedConsults.find(c => c.id === reqId);
    if (!consult) return;

    // Add handoff note
    addHandoffNote({
      patientName: consult.patientName,
      age: consult.age,
      gender: consult.gender,
      chiefComplaint: consult.chiefComplaint,
      diagnosis: form.diagnosis,
      treatment: form.recommendations,
      medications: form.prescription || 'N/A',
      followUp: form.followUp || 'N/A',
      doctorId: 'd1',
      hospitalId: consult.hospitalId
    });

    const completedItem = {
      ...consult,
      ...form,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCompletedConsults(prev => [completedItem, ...prev]);
    setAcceptedConsults(prev => prev.filter(c => c.id !== reqId));
    setDocTab('completed');
    logAudit('Consultation Completed', 'Specialist Doctor', 'doctor', consult.hospitalName, 'Active', 'Handoff Compiled');
    alert('Handoff locked. Session completed.');
  };

  // Sync state if global SOS is active
  useEffect(() => {
    if (activeSOS && activeSOS.status === 'Accepted' && activeSOS.doctor?.id === 'd1') {
      const activeSOSRequest = {
        id: 'active-sos',
        hospitalName: 'Apollo Hospital, Chennai',
        hospitalId: 'h3',
        patientName: 'Aarav Mehta',
        age: 42,
        gender: 'M',
        uhid: 'UHID-100293',
        chiefComplaint: 'Urgent Code Blue cardiology crisis. Sinus tachycardia.',
        vitals: 'BP 160/100, HR 122, Temp 98.6, SPO2 90%',
        history: 'Known coronary heart disease.',
        medications: 'Aspirin 75mg QD.',
        reports: 'Elevated Troponin-I. ST elevation in Lead II.',
        priority: 'Emergency',
        mode: 'Physical',
        timeRequested: 'Just now',
        aiSummary: 'Critical Code Blue. ST elevation detected. Immediate catheterization indicated.'
      };
      
      // Auto add to accepted if not there
      setAcceptedConsults(prev => {
        if (prev.some(c => c.id === 'active-sos')) return prev;
        return [activeSOSRequest, ...prev];
      });
      setDocTab('accepted');
    }
  }, [activeSOS]);

  // ==========================================
  // RENDER 1: DOCTOR PORTAL REQUESTS PAGE
  // ==========================================
  if (role === 'Doctor') {
    const activeList = 
      docTab === 'emergency' ? incomingRequests.filter(r => r.priority === 'Emergency') :
      docTab === 'urgent' ? incomingRequests.filter(r => r.priority === 'Urgent') :
      docTab === 'routine' ? incomingRequests.filter(r => r.priority === 'Routine') :
      docTab === 'accepted' ? acceptedConsults :
      docTab === 'completed' ? completedConsults : []; // Archived empty initially

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in text-left">
        
        {/* Title */}
        <div className="border-b pb-3.5 border-slate-200 dark:border-dark-border">
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white flex items-center">
            <span className="material-symbols-outlined text-brand mr-2">notifications_active</span>
            Consultation Requests Workspace
          </h2>
          <p className="text-xs text-slate-450 mt-1">
            Review incoming hospital consultation requests and manage active treating sessions.
          </p>
        </div>

        {/* Requests Filter Tabs */}
        <div className="flex border-b border-slate-200 dark:border-dark-border overflow-x-auto">
          {[
            { id: 'emergency', label: 'Emergency', badge: incomingRequests.filter(r => r.priority === 'Emergency').length, color: 'bg-red-500 text-white' },
            { id: 'urgent', label: 'Urgent', badge: incomingRequests.filter(r => r.priority === 'Urgent').length, color: 'bg-amber-500 text-white' },
            { id: 'routine', label: 'Routine', badge: incomingRequests.filter(r => r.priority === 'Routine').length, color: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-350' },
            { id: 'accepted', label: 'Accepted Workspace', badge: acceptedConsults.length, color: 'bg-brand text-white' },
            { id: 'completed', label: 'Completed', badge: completedConsults.length, color: 'bg-emerald-500 text-white' },
            { id: 'archived', label: 'Archived', badge: 0 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setDocTab(tab.id);
                setSelectedCaseId(null);
              }}
              className={`flex items-center space-x-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all ${
                docTab === tab.id 
                  ? 'border-brand text-brand font-bold' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-250'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${tab.color}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Request cards list */}
        <div className="grid grid-cols-1 gap-4">
          {activeList.length === 0 ? (
            <div className="bg-white dark:bg-dark-card border rounded-premium p-12 text-center text-slate-450 text-xs">
              <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">notifications</span>
              <p>No active requests in this category.</p>
            </div>
          ) : (
            activeList.map(req => {
              const isSelected = selectedCaseId === req.id;
              
              return (
                <div key={req.id} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
                  
                  {/* Card basic header */}
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{req.hospitalName}</span>
                      <h3 className="font-headline font-black text-slate-850 dark:text-white mt-1.5 text-sm">{req.patientName}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">{req.age}y/{req.gender} • Chief: {req.chiefComplaint}</p>
                    </div>

                    <div className="text-right">
                      <span className={`text-[8.5px] px-2 py-0.5 rounded font-black uppercase ${
                        req.priority === 'Emergency' ? 'bg-red-500/10 text-danger animate-pulse' :
                        req.priority === 'Urgent' ? 'bg-amber-500/10 text-warning' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}>{req.priority}</span>
                      <span className="text-[10px] text-slate-450 block font-mono mt-2">{req.timeRequested}</span>
                    </div>
                  </div>

                  {/* AI Clinical Summary (Progressive Disclosure) */}
                  <div className="p-3 bg-brand-500/5 dark:bg-brand-900/5 border border-brand-500/15 rounded text-[11px] text-slate-600 dark:text-slate-350 leading-relaxed text-left">
                    <span className="font-bold text-brand uppercase text-[9px] block mb-0.5">AI Clinical Synthesis Suggestion</span>
                    {req.aiSummary}
                  </div>

                  {/* BUTTONS FOR PENDING REQUESTS */}
                  {docTab !== 'accepted' && docTab !== 'completed' && (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-dark-border/40">
                      
                      {/* View Case trigger */}
                      <button
                        type="button"
                        onClick={() => setSelectedCaseId(isSelected ? null : req.id)}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand font-bold flex items-center space-x-1"
                      >
                        <span className="material-symbols-outlined text-base">expand_more</span>
                        <span>{isSelected ? 'Collapse Case File' : 'View Full Case File'}</span>
                      </button>

                      {/* Accept / Decline triggers */}
                      <div className="flex gap-2 text-xs">
                        <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-900 border rounded px-2 mr-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mr-1">ETA:</span>
                          <input
                            type="number"
                            placeholder="15"
                            className="w-10 bg-transparent border-0 text-center font-mono p-0 focus:ring-0 text-xs font-bold text-slate-800 dark:text-slate-200"
                            value={inputEtas[req.id] || '15'}
                            onChange={(e) => setInputEtas({ ...inputEtas, [req.id]: e.target.value })}
                          />
                          <span className="text-[9px] text-slate-400">m</span>
                        </div>

                        <button
                          onClick={() => handleDoctorAccept(req, 'Physical')}
                          className="bg-brand hover:bg-brand-600 text-white font-bold px-3 py-1.5 rounded shadow-sm transition-colors"
                        >
                          Accept Physical
                        </button>
                        <button
                          onClick={() => handleDoctorAccept(req, 'Online')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded shadow-sm transition-colors"
                        >
                          Accept Online
                        </button>
                        <button
                          onClick={() => handleDoctorDecline(req.id)}
                          className="text-slate-400 hover:text-danger font-semibold px-2"
                        >
                          Decline
                        </button>
                      </div>

                    </div>
                  )}

                  {/* COLLAPSIBLE CASE DETAIL FILE PANEL */}
                  {isSelected && docTab !== 'accepted' && docTab !== 'completed' && (
                    <div className="pt-4 border-t border-slate-100 dark:border-dark-border/40 text-xs space-y-4 animate-fade-in text-left">
                      
                      {/* Section 1: Patient Information */}
                      <div className="border border-slate-200 dark:border-dark-border rounded">
                        <button type="button" onClick={() => toggleSection('patient')} className="w-full flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/50 font-bold text-[10.5px] text-slate-650 dark:text-slate-200 border-b">
                          <span>1. Patient Demographics & UHID</span>
                          <span className="material-symbols-outlined text-sm">{collapsedSections.patient ? 'expand_more' : 'expand_less'}</span>
                        </button>
                        {!collapsedSections.patient && (
                          <div className="p-3 space-y-1">
                            <div>UHID: <span className="font-mono font-bold">{req.uhid}</span></div>
                            <div>Demographics: {req.age} years / {req.gender === 'M' ? 'Male' : 'Female'}</div>
                          </div>
                        )}
                      </div>

                      {/* Section 2: Chief Complaint & Vitals */}
                      <div className="border border-slate-200 dark:border-dark-border rounded">
                        <button type="button" onClick={() => toggleSection('vitals')} className="w-full flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/50 font-bold text-[10.5px] text-slate-650 dark:text-slate-200 border-b">
                          <span>2. Chief Complaint & Clinical Vitals</span>
                          <span className="material-symbols-outlined text-sm">{collapsedSections.vitals ? 'expand_more' : 'expand_less'}</span>
                        </button>
                        {!collapsedSections.vitals && (
                          <div className="p-3 space-y-2">
                            <p><span className="font-semibold text-slate-450 block">Chief Complaint:</span> {req.chiefComplaint}</p>
                            <p><span className="font-semibold text-slate-455 block">Vitals Signs:</span> {req.vitals}</p>
                          </div>
                        )}
                      </div>

                      {/* Section 3: Medical History & Medications */}
                      <div className="border border-slate-200 dark:border-dark-border rounded">
                        <button type="button" onClick={() => toggleSection('history')} className="w-full flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/50 font-bold text-[10.5px] text-slate-650 dark:text-slate-200 border-b">
                          <span>3. Medical History & Current Medications</span>
                          <span className="material-symbols-outlined text-sm">{collapsedSections.history ? 'expand_more' : 'expand_less'}</span>
                        </button>
                        {!collapsedSections.history && (
                          <div className="p-3 space-y-2">
                            <p><span className="font-semibold text-slate-455 block">Medical History:</span> {req.history}</p>
                            <p><span className="font-semibold text-slate-455 block">Current Medications:</span> <span className="font-mono">{req.medications}</span></p>
                          </div>
                        )}
                      </div>

                      {/* Section 4: Lab Reports & ECG waveform */}
                      <div className="border border-slate-200 dark:border-dark-border rounded">
                        <button type="button" onClick={() => toggleSection('reports')} className="w-full flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-900/50 font-bold text-[10.5px] text-slate-650 dark:text-slate-200 border-b">
                          <span>4. Lab Reports, ECG trace & Scans</span>
                          <span className="material-symbols-outlined text-sm">{collapsedSections.reports ? 'expand_more' : 'expand_less'}</span>
                        </button>
                        {!collapsedSections.reports && (
                          <div className="p-3 space-y-3">
                            <p><span className="font-semibold text-slate-450 block">Lab Findings:</span> {req.reports}</p>
                            <MinimalEcg />
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* ACTIVE WORKSPACE (ACCEPTED TAB ONLY) */}
                  {docTab === 'accepted' && (
                    <div className="pt-4 border-t border-slate-100 dark:border-dark-border/40 text-xs space-y-5 animate-fade-in text-left">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Video pane if online / Chat channel if physical */}
                        <div className="space-y-3">
                          {req.acceptedMode === 'Online' ? (
                            <div className="bg-slate-950 border border-slate-800 rounded p-4 h-48 flex flex-col justify-between text-white relative">
                              <span className="text-[8px] bg-red-500 text-white font-bold px-1.5 py-0.2 rounded absolute top-2 left-2 animate-pulse">LIVE TELECONSULTATION ACTIVE</span>
                              <div className="flex-1 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-slate-700 animate-bounce">account_circle</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono text-center block">Patient Feed Connected</span>
                            </div>
                          ) : (
                            <div className="bg-slate-50 dark:bg-slate-900/20 border rounded p-3 h-48 flex flex-col justify-between">
                              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide border-b pb-1">Secure Hospital Chat Channel</div>
                              
                              <div className="flex-1 overflow-y-auto space-y-2 py-2 text-[10.5px]">
                                {(chatHistory[req.id] || chatHistory['active-sos'] || []).map((msg, mIdx) => (
                                  <div key={mIdx} className={`p-1.5 rounded max-w-[85%] ${
                                    msg.sender === 'doctor' ? 'bg-brand text-white ml-auto' : 'bg-slate-150 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}>
                                    {msg.text}
                                  </div>
                                ))}
                              </div>

                              <div className="flex gap-1.5 border-t pt-1.5">
                                <input
                                  type="text" placeholder="Type message..."
                                  className="flex-1 text-[11px] bg-white dark:bg-dark-card border p-1 rounded focus:outline-none"
                                  value={chatInputs[req.id] || ''}
                                  onChange={(e) => setChatInputs({ ...chatInputs, [req.id]: e.target.value })}
                                />
                                <button type="button" onClick={() => handleSendChat(req.id)} className="bg-brand text-white font-bold text-[10px] px-2 rounded">Send</button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Physician clinical Scribble Notes */}
                        <div className="flex flex-col justify-between border rounded p-3 bg-slate-50/20 dark:bg-slate-900/5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide border-b pb-1 mb-2">Physician Scribble Pad</span>
                          <textarea
                            placeholder="Enter immediate clinical instructions..."
                            className="w-full flex-1 bg-transparent border-0 p-0 text-xs focus:ring-0 focus:outline-none font-mono resize-none leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Consultation Completion Form (Diagnosis, Recommendations, follow-ups) */}
                      <div className="bg-slate-50/50 dark:bg-slate-900/5 border rounded p-4 space-y-4">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block border-b pb-1.5">Compile Handoff Record & Sign-off</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] font-bold text-slate-450 uppercase block mb-1">Clinical Diagnosis</label>
                            <input
                              type="text" required
                              className="w-full bg-white dark:bg-dark-card border p-2 rounded focus:outline-none"
                              placeholder="e.g. Acute Coronary Syndrome"
                              value={completionForms[req.id]?.diagnosis || ''}
                              onChange={(e) => setCompletionForms({
                                ...completionForms,
                                [req.id]: { ...(completionForms[req.id] || {}), diagnosis: e.target.value }
                              })}
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-bold text-slate-450 uppercase block mb-1">Follow-up Plan</label>
                            <input
                              type="text"
                              className="w-full bg-white dark:bg-dark-card border p-2 rounded focus:outline-none"
                              placeholder="e.g. Stress Echo review in 7 days"
                              value={completionForms[req.id]?.followUp || ''}
                              onChange={(e) => setCompletionForms({
                                ...completionForms,
                                [req.id]: { ...(completionForms[req.id] || {}), followUp: e.target.value }
                              })}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-bold text-slate-450 uppercase block mb-1">Treatment Strategy / Recommendations</label>
                          <textarea
                            required
                            className="w-full h-12 bg-white dark:bg-dark-card border p-2 rounded focus:outline-none"
                            placeholder="e.g. Aspirin 75mg QD loading..."
                            value={completionForms[req.id]?.recommendations || ''}
                            onChange={(e) => setCompletionForms({
                              ...completionForms,
                              [req.id]: { ...(completionForms[req.id] || {}), recommendations: e.target.value }
                            })}
                          />
                        </div>

                        <div className="flex justify-end pt-2 border-t">
                          <button
                            type="button"
                            onClick={() => handleDoctorComplete(req.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] py-1.5 px-4 rounded shadow-sm transition-colors"
                          >
                            SIGN-OFF & LOCK LEDGER
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* COMPLETED TAB DETAILS */}
                  {docTab === 'completed' && (
                    <div className="pt-3 border-t border-slate-100 dark:border-dark-border/40 text-[11px] text-slate-500 dark:text-slate-400 space-y-2 text-left leading-relaxed">
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-700 dark:text-slate-200">Clinical Diagnosis:</span>
                        <span className="font-mono text-emerald-500 font-bold">Signed Off at {req.completedAt || '10:30'}</span>
                      </div>
                      <p className="bg-slate-50 dark:bg-slate-900/30 p-2.5 rounded border border-slate-100 dark:border-dark-border/30 text-slate-755 dark:text-slate-250 font-semibold">{req.diagnosis}</p>
                      
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-200 block">Treatment & Recommendations:</span>
                        <p>{req.recommendations}</p>
                      </div>

                      <div className="flex justify-between text-[10px] pt-1.5 border-t">
                        <span>DPDP Compliance Status: <span className="text-emerald-500 font-bold uppercase">Locked</span></span>
                        <span>Archived Ledger: <span className="font-mono">Block #{Math.floor(1000 + Math.random() * 9000)}</span></span>
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    );
  }

  // ==========================================
  // RENDER 2: HOSPITAL PORTAL REQUESTS PAGE
  // ==========================================
  // Shows chronological live timeline for active dispatches
  const isEmergencySOSActive = activeSOS && activeSOS.status !== 'Completed';

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in text-left">
      
      {/* Title */}
      <div className="border-b pb-3.5 border-slate-200 dark:border-dark-border">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white flex items-center">
          <span className="material-symbols-outlined text-brand mr-2">track_changes</span>
          Consultation Dispatches Tracker
        </h2>
        <p className="text-xs text-slate-450 mt-1">
          Tracking chronological stages of specialist responses and commutes in real-time.
        </p>
      </div>

      {!isEmergencySOSActive ? (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-12 text-center text-slate-450 text-xs">
          <span className="material-symbols-outlined text-3xl mb-1 text-slate-300">track_changes</span>
          <p className="font-semibold">No active specialist dispatches are currently being tracked.</p>
          <p className="text-[10px] text-slate-400 mt-1">Submit a new consultation request or trigger SOS emergency mode to monitor.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 shadow-sm space-y-6">
          
          {/* Dispatch HUD Header */}
          <div className="flex justify-between items-center border-b pb-4">
            <div className="text-xs">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Specialty Paged</span>
              <span className="text-sm font-black text-slate-800 dark:text-white">{activeSOS.specialty} Specialist</span>
            </div>
            <div className="text-right text-xs">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Commute Countdown</span>
              <span className="text-sm font-black text-danger font-mono animate-pulse">
                {sosCountdown > 0 ? `${Math.floor(sosCountdown / 60)}m ${sosCountdown % 60}s` : 'ARRIVED'}
              </span>
            </div>
          </div>

          {/* Chronological 6-Stage Vertical Timeline */}
          <div className="relative border-l border-slate-100 dark:border-dark-border pl-6 space-y-6 text-xs">
            {[
              { stepVal: 1, label: 'Created', desc: 'Consultation request filed with patient details.' },
              { stepVal: 3, label: 'Viewed', desc: 'Specialist doctors notified; matching ranks calculated.' },
              { stepVal: 4, label: 'Accepted', desc: 'Dr. Rajesh Sharma accepted emergency page.' },
              { stepVal: 5, label: 'Travelling', desc: 'GPS commute mapping en-route coordinates active.' },
              { stepVal: 6, label: 'Started', desc: 'Specialist checked in on-site; ICU session started.' },
              { stepVal: 7, label: 'Completed', desc: 'Handoff note signed off and logged.' }
            ].map(stage => {
              const isCompleted = sosStep >= stage.stepVal;
              const isActive = sosStep === stage.stepVal || (stage.stepVal === 5 && (sosStep === 5 || sosStep === 6));
              
              return (
                <div key={stage.stepVal} className="relative">
                  {/* Indicator Dot */}
                  <span className={`absolute -left-[30px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-dark-card ${
                    isCompleted ? 'bg-emerald-500' : isActive ? 'bg-brand animate-pulse' : 'bg-slate-200 dark:bg-slate-800'
                  }`}></span>

                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-bold ${isCompleted ? 'text-slate-800 dark:text-slate-200' : isActive ? 'text-brand font-black' : 'text-slate-400'}`}>{stage.label}</h4>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">{stage.desc}</p>
                    </div>
                    {isCompleted && (
                      <span className="material-symbols-outlined text-emerald-500 text-sm font-bold">check_circle</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Preview coordinates */}
          <div>
            <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block mb-2">GPS Route Telemetry Map</span>
            <SvgNetworkMap />
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-dark-border/40">
            <button
              onClick={() => {
                cancelSOS();
              }}
              className="text-xs text-slate-400 hover:text-danger hover:underline font-bold"
            >
              Cancel Track / RetractSOS
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
