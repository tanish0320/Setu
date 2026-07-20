import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart } from './SvgCharts';

// 1. New Consultation Wizard Page (V3 Redesign)
export const AppointmentsPage = () => {
  const {
    doctors,
    hospitals,
    selectedHospital,
    bookAppointment,
    dispatchSOS,
    setActivePage,
    logAudit
  } = useApp();

  const [step, setStep] = useState(1);
  
  // Wizard form state (Simulates auto-saving by preserving local state)
  const [form, setForm] = useState({
    uhid: 'UHID-' + Math.floor(100000 + Math.random() * 900000),
    patientName: '',
    age: '',
    gender: 'M',
    chiefComplaint: '',
    presentIllness: '',
    history: '',
    vitalBP: '120/80',
    vitalHR: '80',
    vitalSPO2: '98',
    vitalTemp: '98.6',
    condition: 'Stable',
    specialty: 'Cardiology',
    priority: 'Routine',
    mode: 'Either',
    time: '14:00',
    date: 'Monday',
    duration: '30 mins'
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const specialties = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Surgery'];

  // Match calculations
  const calculateRecommendations = () => {
    return doctors
      .filter(doc => doc.specialty.toLowerCase() === form.specialty.toLowerCase())
      .map(doc => {
        const isAtSameHosp = doc.currentHospitalId === selectedHospital.id;
        const currentHosp = hospitals.find(h => h.id === doc.currentHospitalId);
        const distance = isAtSameHosp ? 0 : (currentHosp ? Math.abs(currentHosp.distance - selectedHospital.distance) : 4.0);
        const estimatedETA = isAtSameHosp ? 2 : Math.round(distance * 3.5 + 4);

        let availabilityScore = doc.status === 'Available' ? 100 : doc.status === 'Consulting' ? 65 : 30;
        let distanceScore = Math.max(0, 100 - (distance * 15));
        let reliabilityScore = doc.reliability.overall;
        
        const matchScore = Math.round(
          (availabilityScore * 0.40) +
          (distanceScore * 0.30) +
          (reliabilityScore * 0.20) +
          (doc.workload === 'Low' ? 10 : 5)
        );

        return {
          ...doc,
          matchScore,
          distance: parseFloat(distance.toFixed(1)),
          estimatedETA,
          isAtSameHosp
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  const handleNext = () => {
    if (step === 1 && (!form.patientName || !form.chiefComplaint)) {
      alert('Please fill out Patient Name and Chief Complaint.');
      return;
    }
    if (step === 4 && !selectedDoc && form.priority !== 'Emergency') {
      alert('Please select a doctor to proceed.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (form.priority === 'Emergency') {
      // Trigger emergency dispatch SOS immediately
      dispatchSOS(form.specialty, 'Critical', selectedHospital.id);
      setActivePage('emergency');
      alert('🚨 Critical SOS Dispatched! Tracking en-route specialist.');
    } else {
      // Book standard consultation session
      bookAppointment({
        patientName: form.patientName,
        age: form.age,
        gender: form.gender,
        doctorId: selectedDoc.id,
        hospitalId: selectedHospital.id,
        date: form.date,
        time: form.time,
        department: form.specialty
      });
      setActivePage('emergency');
      alert('Consultation Dispatch request successfully sent.');
    }
  };

  const rankedDocs = calculateRecommendations();

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6 text-left animate-fade-in">
      
      {/* Title */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-black font-headline text-slate-850 dark:text-white">New Consultation Request</h2>
        <p className="text-xs text-slate-450 mt-1">Simple wizard. Autosaves step inputs.</p>
      </div>

      {/* Progress HUD bar */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <span>Step {step} of 5</span>
        <span>{
          step === 1 ? 'Patient Details' :
          step === 2 ? 'Upload Reports' :
          step === 3 ? 'AI Synthesis Summary' :
          step === 4 ? 'Doctor Recommendation' : 'Review & Submit'
        }</span>
      </div>
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
        <div className="bg-brand h-full transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
      </div>

      <div className="bg-white dark:bg-dark-card border border-slate-205 dark:border-dark-border rounded-premium p-6 shadow-sm min-h-[320px] flex flex-col justify-between">
        
        {/* STEP 1: PATIENT DETAILS */}
        {step === 1 && (
          <div className="space-y-4 text-xs animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Patient Name</label>
                <input
                  type="text" required placeholder="e.g. Anil Kumar"
                  className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded focus:outline-none"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">UHID</label>
                <input
                  type="text" className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded focus:outline-none font-mono"
                  value={form.uhid}
                  onChange={(e) => setForm({ ...form, uhid: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Age</label>
                <input
                  type="number" required placeholder="52"
                  className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded focus:outline-none"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Gender</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded focus:outline-none"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Vitals Condition</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded focus:outline-none"
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                >
                  <option value="Stable">Stable</option>
                  <option value="Guarded">Guarded</option>
                  <option value="Critical">Critical (SOS)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Required Specialty</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded focus:outline-none"
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                >
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Urgency Priority</label>
                <select
                  className="w-full bg-slate-50 dark:bg-slate-900 border p-2 rounded focus:outline-none font-bold"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">🚨 Emergency (Code Blue)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Chief Complaint</label>
              <textarea
                placeholder="Symptoms summary..."
                className="w-full h-14 bg-slate-50 dark:bg-slate-900 border p-2 rounded focus:outline-none"
                value={form.chiefComplaint}
                onChange={(e) => setForm({ ...form, chiefComplaint: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* STEP 2: UPLOAD REPORTS */}
        {step === 2 && (
          <div className="space-y-4 text-xs animate-fade-in text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block text-left">Drag & Drop Scan files</span>
            
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-200 dark:border-dark-border bg-slate-50/40 dark:bg-slate-900/5 p-8 rounded-premium flex flex-col items-center justify-center space-y-1.5 cursor-pointer hover:border-brand transition-colors"
            >
              <span className="material-symbols-outlined text-slate-400 text-3xl">cloud_upload</span>
              <span className="font-bold text-slate-650">Drag lab PDFs or ECG images here</span>
              <span className="text-[9px] text-slate-400">Supports PDF, JPG, DICOM</span>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-start">
                {uploadedFiles.map((fn, idx) => (
                  <span key={idx} className="bg-slate-105 border px-2 py-0.5 rounded text-[9.5px] flex items-center space-x-1">
                    <span className="material-symbols-outlined text-[10px]">description</span>
                    <span>{fn}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: AI PATIENT SUMMARY */}
        {step === 3 && (
          <div className="space-y-4 text-xs animate-fade-in text-left">
            <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider block">Synthesized AI Clinical Insight</span>
            
            <div className="bg-brand-500/5 dark:bg-brand-900/10 border border-brand-500/20 p-4 rounded-premium space-y-3 leading-relaxed text-slate-600 dark:text-slate-350">
              <p><span className="font-bold text-slate-700 dark:text-slate-200 block">Executive Summary:</span> Patient {form.patientName || 'Anil'} presents with complains of {form.chiefComplaint || 'symptoms'}. Stable vital condition.</p>
              <p><span className="font-bold text-slate-700 dark:text-slate-200 block">Suspected Specialty Match:</span> {form.specialty} Specialists pool. Recommended Urgency level: {form.priority}.</p>
              <p><span className="font-bold text-slate-700 dark:text-slate-200 block">AI Next-step Action:</span> CAT angiogram protocol if emergency; establish vascular lines.</p>
            </div>
          </div>
        )}

        {/* STEP 4: DOCTOR RECOMMENDATION */}
        {step === 4 && (
          <div className="space-y-4 text-xs animate-fade-in text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI Doctor Suitability ranks</span>
            
            {form.priority === 'Emergency' ? (
              <div className="p-4 border border-dashed rounded text-center text-slate-450 bg-red-500/5 border-red-500/20">
                <span className="material-symbols-outlined text-danger text-2xl animate-bounce">cell_tower</span>
                <p className="font-bold text-danger mt-1">🚨 Emergency SOS Mode Active</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Bypasses normal selection. SETU AI will automatically alert the closest matching available specialist on dispatch submit.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {rankedDocs.slice(0, 3).map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3 border rounded-premium cursor-pointer transition-all flex justify-between items-center ${
                      selectedDoc?.id === doc.id ? 'border-brand bg-brand-50/20 dark:bg-brand-900/10' : 'border-slate-200 dark:border-dark-border hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-slate-750 dark:text-slate-100 block">{doc.name}</span>
                        <span className="text-[9px] text-slate-400">ETA: ~{doc.estimatedETA}m • Reliability: {doc.reliability.overall}%</span>
                      </div>
                    </div>
                    <span className="font-black text-brand text-xs font-headline">{doc.matchScore}% Match</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: REVIEW & SUBMIT */}
        {step === 5 && (
          <div className="space-y-4 text-xs animate-fade-in text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Confirm Consultation Dispatch details</span>
            
            <div className="border border-slate-200 dark:border-dark-border rounded-premium p-4 space-y-2 bg-slate-50/30 dark:bg-slate-900/5 text-slate-650 dark:text-slate-300">
              <div>Patient: <span className="font-bold text-slate-800 dark:text-white">{form.patientName} ({form.age}y/{form.gender})</span></div>
              <div>Urgency Priority: <span className="font-bold uppercase text-brand">{form.priority}</span></div>
              <div>Required Specialty: <span className="font-semibold">{form.specialty}</span></div>
              {form.priority !== 'Emergency' && (
                <div>Selected Specialist: <span className="font-bold text-slate-800 dark:text-white">{selectedDoc?.name || 'Any Available'}</span></div>
              )}
              {uploadedFiles.length > 0 && (
                <div>Attachments: <span className="font-mono">{uploadedFiles.length} files</span></div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Button controls */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-dark-border/40 mt-6">
          <button
            type="button"
            disabled={step === 1}
            onClick={handlePrev}
            className="text-xs text-slate-450 disabled:opacity-40 font-bold hover:underline"
          >
            Back
          </button>
          
          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-brand text-white font-bold text-xs py-1.5 px-4 rounded shadow-sm hover:bg-brand-650 transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-1.5 px-5 rounded shadow-sm transition-colors"
            >
              Dispatch Request
            </button>
          )}
        </div>

      </div>

    </div>
  );
};


// 2. Settings Page
export const SettingsPage = () => {
  const { role, logAudit } = useApp();
  
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Workspace Node Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Configure profile settings and coordinator node routing parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">Node Configurations</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-600 dark:text-slate-300 block">Session Duration</span>
                <span className="text-[10px] text-slate-400">Rotates authentication token every 2 hours</span>
              </div>
              <span className="font-mono text-slate-500">120 mins</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-600 dark:text-slate-300 block">Pager Volume Threshold</span>
                <span className="text-[10px] text-slate-400">Override system ringouts during dark mode hours</span>
              </div>
              <span className="font-mono text-slate-500">Max Intensity</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">Role Authorization Level</h3>
          <div className="p-3 bg-brand-50/20 dark:bg-brand-900/10 border border-brand-500/20 text-brand rounded text-xs leading-relaxed">
            <span className="font-bold block mb-1">Active Credentials</span>
            You are operating under **{role}** credentials. Feature configurations are bounded by system-level role scopes.
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Audit Logs Page
export const AuditLogsPage = () => {
  const { audits } = useApp();
  
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Secure Audit Ledger</h2>
        <p className="text-xs text-slate-400 mt-1">SHA-256 block hash logs auditing coordinator pings, slot updates, and SOS triggers.</p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border/40 text-slate-400 font-bold uppercase bg-slate-50/50 dark:bg-slate-900/10">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action logged</th>
                <th className="p-3">Operator</th>
                <th className="p-3">Details</th>
                <th className="p-3">Block Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-dark-border/30">
              {audits.map((log, idx) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15">
                  <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">{log.action}</td>
                  <td className="p-3 text-brand font-semibold">{log.user}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{log.details}</td>
                  <td className="p-3 font-mono text-[9px] text-slate-400">
                    {idx === 0 ? '0x8f2c7a9...' : '0xef90b23...'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 4. Reports Page
export const ReportsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Clinical Performance Reports</h2>
        <p className="text-xs text-slate-400 mt-1">Exportable summaries, commute analytics, and emergency response performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">Commute Buffer Diagnostics</h3>
          <p className="text-xs text-slate-550 dark:text-slate-400">Monthly analysis of travel delays, traffic trends, and recommendations to adjust scheduling buffers between regional hospital clusters.</p>
          <div className="space-y-2 text-[11px] leading-relaxed">
            <div className="flex justify-between items-center p-2 border border-slate-100 dark:border-dark-border/40 rounded bg-slate-50/50 dark:bg-slate-900/10">
              <span className="font-semibold text-slate-700 dark:text-slate-250">Apollo Greams Road ↔ MGM Healthcare</span>
              <span className="font-mono text-danger font-bold">+18 min delay (Add 20m buffer)</span>
            </div>
            <div className="flex justify-between items-center p-2 border border-slate-100 dark:border-dark-border/40 rounded bg-slate-50/50 dark:bg-slate-900/10">
              <span className="font-semibold text-slate-700 dark:text-slate-250">Fortis Adyar ↔ Global Hospital Perumbakkam</span>
              <span className="font-mono text-warning font-bold">+12 min delay (Add 15m buffer)</span>
            </div>
            <div className="flex justify-between items-center p-2 border border-slate-100 dark:border-dark-border/40 rounded bg-slate-50/50 dark:bg-slate-900/10">
              <span className="font-semibold text-slate-700 dark:text-slate-250">SIMS Hospital Vadapalani ↔ Apollo Chennai</span>
              <span className="font-mono text-success font-bold">+4 min delay (Optimal 5m buffer)</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">Export Report Briefs</h3>
            <p className="text-xs text-slate-500 mt-1">Compile PDF diagnostics for medical node auditing board reviews.</p>
          </div>
          <button 
            onClick={() => alert('Demo Mode: Report export is mocked.')}
            className="w-full bg-brand hover:bg-brand-600 text-white font-bold text-xs py-2 rounded-premium mt-4 transition-colors"
          >
            COMPILE & EXPORT EXECUTIVE PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Users Page
export const UsersPage = () => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Operator Accounts Manager</h2>
        <p className="text-xs text-slate-400 mt-1">Manage receptionist desks, coordinator accounts, and hospital administrator accounts.</p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-dark-border/40 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Operators List</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-dark-border/30 text-xs">
          {[
            { name: 'Aditi Nair', role: 'Receptionist Desk', node: 'Apollo Hospital Node', email: 'aditi.n@setu.in' },
            { name: 'Kunal Kapoor', role: 'Hospital Administrator', node: 'Fortis Healthcare Node', email: 'kunal.k@setu.in' },
            { name: 'Rohan Sharma', role: 'Clinical Supervisor', node: 'Max Speciality Node', email: 'rohan.s@setu.in' },
          ].map(user => (
            <div key={user.email} className="p-4 flex justify-between items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/15 transition-colors">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">{user.name}</span>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{user.email} • {user.node}</p>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 rounded">{user.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 6. Roles Matrix Page
export const RolesPage = () => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Role-Based Access Scope Matrix</h2>
        <p className="text-xs text-slate-400 mt-1">Configure user role scope gates and page layout access restrictions.</p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border/40 text-slate-400 font-bold uppercase bg-slate-50/50 dark:bg-slate-900/10">
                <th className="p-3">Workspace Section</th>
                <th className="p-3">Super Admin</th>
                <th className="p-3">Hospital Admin</th>
                <th className="p-3">Receptionist</th>
                <th className="p-3">Doctor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-dark-border/30">
              {[
                { sec: 'SOS Dispatcher', super: true, hAdmin: true, receptionist: true, doctor: true },
                { sec: 'Calendar Rescheduling', super: true, hAdmin: true, receptionist: true, doctor: true },
                { sec: 'Platform Revenue Log', super: true, hAdmin: false, receptionist: false, doctor: false },
                { sec: 'Node Audit ledger', super: true, hAdmin: true, receptionist: false, doctor: false },
                { sec: 'Structured Handoff Log', super: true, hAdmin: true, receptionist: true, doctor: true },
                { sec: 'Feature Flags Switch', super: true, hAdmin: false, receptionist: false, doctor: false },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15">
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">{row.sec}</td>
                  <td className="p-3">{row.super ? '✓ Allowed' : '✗ Locked'}</td>
                  <td className="p-3">{row.hAdmin ? '✓ Allowed' : '✗ Locked'}</td>
                  <td className="p-3">{row.receptionist ? '✓ Allowed' : '✗ Locked'}</td>
                  <td className="p-3">{row.doctor ? '✓ Allowed' : '✗ Locked'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 7. Support Tickets Page
export const TicketsPage = () => {
  const { tickets } = useApp();
  
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Platform Support & Issues Registry</h2>
        <p className="text-xs text-slate-400 mt-1">Super Admin support queue auditing coordinator sync exceptions and gateway alerts.</p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border/40 text-slate-400 font-bold uppercase bg-slate-50/50 dark:bg-slate-900/10">
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Node Location</th>
                <th className="p-3">Issue Title</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Status</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-dark-border/30">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15">
                  <td className="p-3 font-mono text-slate-500">{ticket.id}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">{ticket.node}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{ticket.title}</td>
                  <td className="p-3">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      ticket.severity === 'Critical' ? 'bg-red-500/10 text-danger' : 
                      ticket.severity === 'High' ? 'bg-amber-500/10 text-warning' : 'bg-slate-100 text-slate-400'
                    }`}>{ticket.severity}</span>
                  </td>
                  <td className="p-3 font-semibold">{ticket.status}</td>
                  <td className="p-3 text-slate-400 font-medium">{ticket.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 8. Departments Page
export const DepartmentsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Node Clinical Departments</h2>
        <p className="text-xs text-slate-400 mt-1">Audit active clinical departments performance indexes and coordinator channels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Cardiothoracic Surgery', docs: 4, response: '4.2m', health: 'Optimal' },
          { name: 'Neurosurgery Specialist group', docs: 2, response: '5.0m', health: 'Optimal' },
          { name: 'Pediatric Medical Group', docs: 3, response: '3.8m', health: 'Optimal' },
          { name: 'Orthopedic & Joint Surgery', docs: 3, response: '6.1m', health: 'Optimal' }
        ].map(dept => (
          <div key={dept.name} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-4 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Clinical Unit</span>
              <h3 className="text-xs font-black text-slate-700 dark:text-slate-100 mt-1 leading-snug">{dept.name}</h3>
            </div>
            <div className="mt-4 border-t border-slate-100 dark:border-dark-border/40 pt-3 text-[10px] text-slate-400 font-medium space-y-1">
              <div className="flex justify-between">
                <span>Active Specialists:</span>
                <span className="font-bold text-slate-600 dark:text-slate-200">{dept.docs} Doctors</span>
              </div>
              <div className="flex justify-between">
                <span>Mean response:</span>
                <span className="font-bold text-brand">{dept.response}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
