import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RoleDashboardAmbulance = ({ activeSubTab }) => {
  const { addNotification, logAudit } = useApp();

  // Selected hospital for right-side drawer
  const [selectedHospitalDetails, setSelectedHospitalDetails] = useState(null);

  // New Emergency Case Intake Modal State
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepText, setAnalysisStepText] = useState('');
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Inline Map Visibility Toggle
  const [showInlineMap, setShowInlineMap] = useState(true);
  const [selectedMapPin, setSelectedMapPin] = useState(null);

  // Map Modal State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  // Contact Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Active Case Intake Form Data (Interactive Paramedic Entry)
  const [caseData, setCaseData] = useState({
    patientName: 'Aarav Mehta',
    patientAge: '28',
    gender: 'M',
    injuryType: 'Knee Dislocation / ACL Tear',
    vitalBP: '118/78 mmHg',
    vitalHR: '92 bpm',
    vitalSpO2: '98%',
    severity: 'Critical',
    location: 'Indiranagar 100ft Rd, Sector 4 (Bangalore)',
    requiredFacilities: ['MRI', 'MRI Technician', 'Orthopedic Surgeon', 'Emergency Department', 'Operating Theater (OT)']
  });

  // Condition preset database for dynamic AI adaptation
  const conditionPresets = {
    'Knee Dislocation / ACL Tear': {
      facilities: ['MRI', 'MRI Technician', 'Orthopedic Surgeon', 'Emergency Department', 'Operating Theater (OT)'],
      recommendedId: 'manipal',
      recommendedReason: 'Definitive orthopedic care start in 17 mins. Apollo MRI technician is offline (42m delay).'
    },
    'Acute STEMI / Cardiac Arrest': {
      facilities: ['Cardiac Cath Lab', 'Interventional Cardiologist', 'ICU Bed', 'Ventilator', 'Emergency Bay'],
      recommendedId: 'manipal',
      recommendedReason: 'Cath Lab open & ready in 12 mins. Apollo Cath Lab currently occupied.'
    },
    'Acute Ischemic Stroke': {
      facilities: ['CT Scanner', 'CT Technician', 'Neurologist', 'tPA Thrombolysis Unit', 'ICU Bed'],
      recommendedId: 'fortis',
      recommendedReason: 'CT Scanner & On-Call Neuro Team prepped. ETA 17 mins.'
    },
    'Severe Road Accident / Multi-Trauma': {
      facilities: ['Trauma Bay', 'General Surgeon', 'Anesthetist', 'Blood Bank', 'CT', 'OT'],
      recommendedId: 'manipal',
      recommendedReason: 'Level 1 Trauma Center active with Blood Bank reserve & OT Bay 2 open.'
    }
  };

  // Smart Hospital Recommendations Data
  const [hospitalsData, setHospitalsData] = useState([
    {
      id: 'manipal',
      name: 'Manipal Hospital',
      location: 'HAL Old Airport Road, Indiranagar',
      distance: '9.0 km',
      distanceNum: 9.0,
      eta: '15 mins',
      etaNum: 15,
      treatmentReadiness: 95,
      isRecommended: true,
      statusBadge: '🟢 Recommended Destination',
      statusColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      waitMinutes: 2,
      treatmentStartMins: 17,
      mapColor: '#10B981',
      coords: { x: '75%', y: '65%' },
      reasons: [
        '✓ MRI Equipment Operational',
        '✓ MRI Technician On-Duty & Ready',
        '✓ Orthopedic Surgeon On-Site',
        '✓ Operating Theater (OT) Reserved',
        '✓ ICU Bed Reserved'
      ],
      warnings: [],
      phone: '+91 80 2502 4444',
      resources: {
        'MRI': 'Available',
        'MRI Technician': 'Available',
        'CT': 'Available',
        'CT Technician': 'Available',
        'Ultrasound': 'Available',
        'X-Ray': 'Available',
        'OT': 'Available',
        'ICU Beds': 'Available',
        'Ventilators': 'Available',
        'Blood Bank': 'Available',
        'Emergency Beds': 'Available',
        'Orthopedic Surgeon': 'Available',
        'Radiologist': 'Available',
        'Neurosurgeon': 'Busy',
        'Anesthetist': 'Available'
      },
      resourceCounts: {
        'ICU Beds': '6 Free',
        'Emergency Beds': '4 Free',
        'Ventilators': '8 Ready',
        'OT': 'Bay 2 Ready'
      },
      queueCount: 3,
      traumaOccupancy: '35%'
    },
    {
      id: 'apollo',
      name: 'Apollo Hospital',
      location: 'Bannerghatta Rd / Indiranagar Hub',
      distance: '5.4 km',
      distanceNum: 5.4,
      eta: '11 mins',
      etaNum: 11,
      treatmentReadiness: 63,
      isRecommended: false,
      statusBadge: '🔴 MRI Tech Offline (42m Delay)',
      statusColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      waitMinutes: 31,
      treatmentStartMins: 42,
      mapColor: '#EF4444',
      coords: { x: '45%', y: '35%' },
      reasons: [
        '✓ Nearest Physical Distance (5.4 km)',
        '✓ Emergency Department Active'
      ],
      warnings: [
        '✕ MRI Unit Maintenance / Offline',
        '✕ On-Duty MRI Technician Unavailable until 16:30',
        '✕ Estimated 42 min delay before definitive care start'
      ],
      phone: '+91 80 2630 4050',
      resources: {
        'MRI': 'Maintenance',
        'MRI Technician': 'Unavailable',
        'CT': 'Available',
        'CT Technician': 'Available',
        'Ultrasound': 'Available',
        'X-Ray': 'Available',
        'OT': 'Busy',
        'ICU Beds': 'Busy',
        'Ventilators': 'Available',
        'Blood Bank': 'Available',
        'Emergency Beds': 'Available',
        'Orthopedic Surgeon': 'Available',
        'Radiologist': 'On Break',
        'Neurosurgeon': 'Available',
        'Anesthetist': 'Available'
      },
      resourceCounts: {
        'ICU Beds': '1 Free',
        'Emergency Beds': '2 Free',
        'Ventilators': '3 Ready',
        'OT': 'All Busy'
      },
      queueCount: 14,
      traumaOccupancy: '88%'
    },
    {
      id: 'fortis',
      name: 'Fortis Hospital',
      location: 'Cunningham Road',
      distance: '7.5 km',
      distanceNum: 7.5,
      eta: '17 mins',
      etaNum: 17,
      treatmentReadiness: 82,
      isRecommended: false,
      statusBadge: '🟡 Tech Delayed (45m Wait)',
      statusColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      waitMinutes: 28,
      treatmentStartMins: 45,
      mapColor: '#F59E0B',
      coords: { x: '30%', y: '70%' },
      reasons: [
        '✓ MRI Equipment Operational',
        '✓ Orthopedic On-Call Doctor Ready'
      ],
      warnings: [
        '✕ MRI Technician assisting emergency scan (28 min queue)',
        '✕ Estimated 45 min delay to definitive treatment'
      ],
      phone: '+91 80 4199 4444',
      resources: {
        'MRI': 'Available',
        'MRI Technician': 'Busy',
        'CT': 'Available',
        'CT Technician': 'Available',
        'Ultrasound': 'Available',
        'X-Ray': 'Available',
        'OT': 'Available',
        'ICU Beds': 'Available',
        'Ventilators': 'Available',
        'Blood Bank': 'Available',
        'Emergency Beds': 'Busy',
        'Orthopedic Surgeon': 'Available',
        'Radiologist': 'Available',
        'Neurosurgeon': 'Off Duty',
        'Anesthetist': 'Available'
      },
      resourceCounts: {
        'ICU Beds': '3 Free',
        'Emergency Beds': '1 Free',
        'Ventilators': '5 Ready',
        'OT': 'Bay 1 Ready'
      },
      queueCount: 8,
      traumaOccupancy: '70%'
    },
    {
      id: 'max',
      name: 'Max Healthcare',
      location: 'Outer Ring Road, Marathahalli',
      distance: '12.2 km',
      distanceNum: 12.2,
      eta: '22 mins',
      etaNum: 22,
      treatmentReadiness: 78,
      isRecommended: false,
      statusBadge: '🟡 Ortho Surgeon Busy',
      statusColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      waitMinutes: 35,
      treatmentStartMins: 57,
      mapColor: '#8B5CF6',
      coords: { x: '85%', y: '25%' },
      reasons: [
        '✓ Full Diagnostic Suite Available'
      ],
      warnings: [
        '✕ Orthopedic Specialist currently in OT case (35 min remaining)'
      ],
      phone: '+91 80 6600 1111',
      resources: {
        'MRI': 'Available',
        'MRI Technician': 'Available',
        'CT': 'Available',
        'CT Technician': 'Available',
        'Ultrasound': 'Available',
        'X-Ray': 'Available',
        'OT': 'Busy',
        'ICU Beds': 'Available',
        'Ventilators': 'Available',
        'Blood Bank': 'Available',
        'Emergency Beds': 'Available',
        'Orthopedic Surgeon': 'Busy',
        'Radiologist': 'Available',
        'Neurosurgeon': 'Available',
        'Anesthetist': 'Busy'
      },
      resourceCounts: {
        'ICU Beds': '5 Free',
        'Emergency Beds': '7 Free',
        'Ventilators': '10 Ready',
        'OT': 'Occupied'
      },
      queueCount: 4,
      traumaOccupancy: '40%'
    }
  ]);

  // Helper for status badge rendering
  const getResourceStatusBadge = (status) => {
    switch (status) {
      case 'Available':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">🟢 Available</span>;
      case 'Busy':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">🟡 Busy</span>;
      case 'Unavailable':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">🔴 Unavailable</span>;
      case 'Maintenance':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">🔵 Maintenance</span>;
      case 'Off Duty':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">⚫ Off Duty</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">Unknown</span>;
    }
  };

  // Preset Selector Handler
  const handlePresetSelect = (presetName) => {
    const preset = conditionPresets[presetName];
    if (!preset) return;

    setCaseData(prev => ({
      ...prev,
      injuryType: presetName,
      requiredFacilities: preset.facilities
    }));

    // Update recommendation highlight dynamically based on condition
    setHospitalsData(prev => prev.map(h => ({
      ...h,
      isRecommended: h.id === preset.recommendedId
    })));
  };

  // Run the 2.5s WOW Intake Analysis Animation
  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisStepText(`Analyzing patient condition (${caseData.injuryType}) & vitals...`);
    setAnalysisComplete(false);

    setTimeout(() => {
      setAnalysisProgress(45);
      setAnalysisStepText('Connecting to regional PACS & hospital diagnostic telemetries...');
    }, 700);

    setTimeout(() => {
      setAnalysisProgress(80);
      setAnalysisStepText('Querying on-duty staff, operating theaters & definitive care queues...');
    }, 1400);

    setTimeout(() => {
      setAnalysisProgress(100);
      setAnalysisStepText('SETU has identified the optimal destination!');
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      logAudit('Emergency Intake Analyzed', 'Ambulance Unit 104', `Dispatched destination intelligence scan for ${caseData.patientName} (${caseData.injuryType})`);
      addNotification('Optimal Destination Identified', `SETU recommends Manipal Hospital for ${caseData.injuryType} (Definitive treatment start: 17m vs 42m at nearest Apollo)`, 'success');
    }, 2200);
  };

  const handleDispatchPatient = (hospName) => {
    addNotification('Patient En-Route Dispatched', `Ambulance Unit 104 dispatched to ${hospName}. Emergency Room team alerted.`, 'success');
    logAudit('Ambulance Dispatched', 'Ambulance Unit 104', `En-route to ${hospName} carrying ${caseData.patientName} (${caseData.injuryType})`);
    alert(`🚑 Dispatch Confirmed! ${hospName} Emergency Trauma Team has received patient details (${caseData.patientName}, ${caseData.injuryType}) and reserved the diagnostic suite.`);
  };

  const recommendedHospital = hospitalsData.find(h => h.isRecommended) || hospitalsData[0];

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6 animate-fade-in text-left font-sans">
      
      {/* Top Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-premium shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              Emergency Coordination Hub
            </span>
            <span className="text-[10px] font-mono text-slate-400">AMBULANCE UNIT #104</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-850 dark:text-white font-headline tracking-tight mt-1">
            Emergency Coordination Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Find the best hospital for the patient—not just the nearest one.
          </p>
        </div>

        {/* Paramedic Active Patient Case Card */}
        <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-dark-border p-3.5 rounded-xl flex items-center space-x-3.5 text-xs shadow-sm">
          <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xl">
            🚑
          </div>
          <div>
            <div className="font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
              <span>Patient: {caseData.patientName} ({caseData.patientAge}y/{caseData.gender})</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Condition: <span className="font-semibold text-rose-600 dark:text-rose-400">{caseData.injuryType}</span> • Vitals: <span className="font-mono text-slate-700 dark:text-slate-300">{caseData.vitalBP}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCaseModalOpen(true);
              setAnalysisComplete(false);
            }}
            className="bg-brand text-white text-[11px] font-bold px-2.5 py-1.5 rounded hover:bg-brand-600 transition-all ml-auto"
          >
            Edit Case
          </button>
        </div>
      </div>

      {/* KPI Cards Row (5 Cards) - ALL INTERACTIVE */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Active Dispatches */}
        <div 
          onClick={() => {
            addToast('Emergency Dispatches', 'Viewing 7 en-route ambulance dispatches.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between cursor-pointer hover:border-brand transition-all hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider">Active Dispatches</span>
            <span className="material-symbols-outlined text-brand text-lg">local_shipping</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-brand font-headline">7</span>
            <span className="text-[10px] text-brand block font-semibold mt-0.5 underline">En-route units ➔</span>
          </div>
        </div>

        {/* KPI 2: Patients Transported */}
        <div 
          onClick={() => {
            addToast('Transports Summary', '5 emergency transfers safely checked in today.', 'success');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between cursor-pointer hover:border-emerald-500 transition-all hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider">Patients Transported</span>
            <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-headline">5</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5 underline">Check-ins ➔</span>
          </div>
        </div>

        {/* KPI 3: Average ETA */}
        <div 
          onClick={() => {
            addToast('Commute ETA Matrix', 'Average transit delay: 11 mins.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between cursor-pointer hover:border-rose-500 transition-all hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider">Average ETA</span>
            <span className="material-symbols-outlined text-rose-500 text-lg animate-pulse">timer</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline">11 mins</span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5 underline">ETA Matrix ➔</span>
          </div>
        </div>

        {/* KPI 4: Hospitals Contacted */}
        <div 
          onClick={() => {
            addToast('Hospital Network', '4 regional trauma centers connected.', 'info');
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between cursor-pointer hover:border-amber-500 transition-all hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider">Hospitals Contacted</span>
            <span className="material-symbols-outlined text-amber-500 text-lg">domain</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-800 dark:text-white font-headline">4</span>
            <span className="text-[10px] text-slate-400 block font-medium mt-0.5 underline">Trauma Nodes ➔</span>
          </div>
        </div>

        {/* KPI 5: AI Recommendation Score */}
        <div 
          onClick={() => {
            openModal('ai_rationale', { recommendedName: 'SETU Ambulance Dispatch AI', reason: 'Calculates definitive care start times considering Cath Lab readiness, MRI technician shifts, and live traffic.' });
          }}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between cursor-pointer hover:border-purple-500 transition-all hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider">AI Match Score</span>
            <span className="material-symbols-outlined text-purple-500 text-lg">auto_awesome</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-purple-600 dark:purple-400 font-headline">94%</span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold block mt-0.5 underline">Accuracy ➔</span>
          </div>
        </div>

      </div>

      {/* Quick Action Buttons Row */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-3">Paramedic Emergency Controls</span>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Action 1: 🚨 New Emergency Case */}
          <button
            onClick={() => {
              setIsCaseModalOpen(true);
              setAnalysisComplete(false);
            }}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-base">🚨</span>
            <span>New Emergency Case</span>
          </button>

          {/* Action 2: 📍 Find Best Hospital */}
          <button
            onClick={() => {
              setIsCaseModalOpen(true);
              handleStartAnalysis();
            }}
            className="w-full bg-brand hover:bg-brand-600 text-white font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-base">📍</span>
            <span>Find Best Hospital</span>
          </button>

          {/* Action 3: 🗺 View Hospital Map */}
          <button
            onClick={() => setShowInlineMap(!showInlineMap)}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all border border-slate-200 dark:border-dark-border"
          >
            <span className="text-base">🗺</span>
            <span>{showInlineMap ? 'Hide Live Map' : 'View Hospital Map'}</span>
          </button>

          {/* Action 4: 📞 Contact Hospital */}
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all border border-slate-200 dark:border-dark-border"
          >
            <span className="text-base">📞</span>
            <span>Contact Hospital</span>
          </button>
        </div>
      </div>

      {/* PARAMEDIC INLINE DISTANCE MAP WIDGET */}
      {showInlineMap && (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-dark-border pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base">🗺</span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-headline uppercase tracking-wider">
                  Live Distance & Traffic Map (Paramedic View)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400">
                Current Ambulance Location: <span className="font-semibold text-slate-700 dark:text-slate-200">{caseData.location}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2 text-[10px] font-semibold text-slate-500">
              <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                🟢 Optimal: Manipal (9km / 15m)
              </span>
              <span className="bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded border border-rose-500/20 font-bold">
                🔴 Nearest: Apollo (5.4km / 11m - MRI Offline)
              </span>
            </div>
          </div>

          {/* Interactive Map Visual Box */}
          <div className="relative bg-slate-950 h-72 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
            
            {/* Grid & Map Texture background */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
            
            {/* Simulated Road Connections (Lines) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Route to Apollo (Rose/Red dashed) */}
              <line x1="20%" y1="50%" x2="45%" y2="35%" stroke="#EF4444" strokeWidth="2" strokeDasharray="4,4" className="opacity-70" />
              {/* Route to Manipal (Emerald/Green Solid Glowing) */}
              <line x1="20%" y1="50%" x2="75%" y2="65%" stroke="#10B981" strokeWidth="3.5" className="animate-pulse" />
              {/* Route to Fortis (Amber dashed) */}
              <line x1="20%" y1="50%" x2="30%" y2="70%" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4,4" className="opacity-70" />
              {/* Route to Max (Purple dashed) */}
              <line x1="20%" y1="50%" x2="85%" y2="25%" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" className="opacity-70" />
            </svg>

            {/* Paramedic Ambulance Pin (Origin) */}
            <div className="absolute left-[20%] top-[50%] transform -translate-x-1/2 -translate-y-1/2 z-20 text-center animate-bounce">
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl border-2 border-white text-lg font-bold">
                🚑
              </div>
              <span className="bg-slate-900/90 text-white text-[9.5px] font-bold px-2 py-0.5 rounded shadow mt-1 block border border-slate-700 whitespace-nowrap">
                You Are Here (Unit #104)
              </span>
            </div>

            {/* Hospital Map Pins */}
            {hospitalsData.map((hosp) => {
              const isSelected = selectedMapPin === hosp.id;
              return (
                <div
                  key={hosp.id}
                  onClick={() => {
                    setSelectedMapPin(hosp.id);
                    setSelectedHospitalDetails(hosp);
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 z-10 text-center ${
                    hosp.isRecommended ? 'z-30' : ''
                  }`}
                  style={{ left: hosp.coords.x, top: hosp.coords.y }}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black shadow-lg border-2 border-white text-xs ${
                      hosp.isRecommended ? 'ring-4 ring-emerald-500/50 scale-110' : ''
                    }`}
                    style={{ backgroundColor: hosp.mapColor }}
                  >
                    🏥
                  </div>
                  <div className={`mt-1 px-2 py-0.5 rounded text-[9.5px] font-bold shadow whitespace-nowrap ${
                    hosp.isRecommended
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-700'
                  }`}>
                    {hosp.name} ({hosp.distance})
                    <span className="block text-[8.5px] text-slate-400 font-mono">ETA: {hosp.eta}</span>
                  </div>
                </div>
              );
            })}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-[9.5px] space-y-1 text-slate-300 backdrop-blur">
              <div className="font-bold text-white uppercase text-[8.5px] tracking-wider mb-0.5">Map Distance Legend</div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Manipal: 9.0 km (Optimal care ETA 15m)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Apollo: 5.4 km (Nearest, MRI Offline)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Recommendation Card (Top Spotlight) */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-brand-500/5 to-purple-500/10 dark:from-emerald-950/30 dark:via-slate-900 dark:to-purple-950/20 border-2 border-emerald-500/40 rounded-premium p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg shadow-sm flex items-center gap-1 tracking-wider">
          <span className="material-symbols-outlined text-xs">verified</span>
          <span>SETU AI DESTINATION ENGINE</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Main Hospital Callout */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span>Recommended Destination for {caseData.patientName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-headline">
              {recommendedHospital.name}
            </h2>

            {/* Time to Treatment Highlight Box */}
            <div className="inline-flex flex-wrap items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-emerald-500/30 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm">
              <span className="text-slate-600 dark:text-slate-300">Definitive treatment begins in</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-headline bg-emerald-500/10 px-2.5 py-0.5 rounded">
                17 minutes
              </span>
              <span className="text-slate-400">instead of</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">Apollo Hospital</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded line-through">
                42 minutes
              </span>
            </div>

            {/* Decision Reason Checklist */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Readiness Breakdown for {caseData.injuryType}:
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-base mr-1">check_circle</span>
                  <span>MRI Equipment Ready</span>
                </div>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-base mr-1">check_circle</span>
                  <span>MRI Tech On-Duty</span>
                </div>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-base mr-1">check_circle</span>
                  <span>Specialist Surgeon Ready</span>
                </div>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-base mr-1">check_circle</span>
                  <span>OT Bay Reserved</span>
                </div>
                <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-base mr-1">check_circle</span>
                  <span>ICU Bed Reserved</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Confidence & Dispatch Actions */}
          <div className="flex flex-col items-center lg:items-end justify-center border-t lg:border-t-0 lg:border-l border-emerald-500/20 pt-4 lg:pt-0 lg:pl-6 space-y-4 text-center lg:text-right">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Confidence Score</div>
              <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-headline mt-0.5">
                94%
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Recommendation Accuracy</span>
            </div>

            <div className="space-y-2 w-full">
              <button
                onClick={() => handleDispatchPatient(recommendedHospital.name)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <span className="material-symbols-outlined text-base">near_me</span>
                <span>Dispatch to {recommendedHospital.name}</span>
              </button>

              <button
                onClick={() => setSelectedHospitalDetails(recommendedHospital)}
                className="w-full bg-white dark:bg-dark-card hover:bg-slate-50 text-slate-800 dark:text-slate-100 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-dark-border transition-all flex items-center justify-center space-x-1"
              >
                <span>View Full Details</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Section: Smart Hospital Recommendations List */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-dark-border pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-headline uppercase tracking-wider">
              Evaluated Hospital Options (Nearest to Fastest)
            </h3>
            <p className="text-[11px] text-slate-400">
              Evaluated for {caseData.patientName}'s condition ({caseData.injuryType}) by travel time, diagnostic readiness & specialist roster.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-semibold text-slate-500">
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Sorted by: Definitive Care Speed</span>
          </div>
        </div>

        {/* Hospital Cards List */}
        <div className="space-y-3.5">
          {hospitalsData.map((hosp) => (
            <div
              key={hosp.id}
              className={`p-4 rounded-xl border transition-all ${
                hosp.isRecommended
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-500/40 shadow-sm'
                  : 'bg-white dark:bg-slate-900/30 border-slate-200 dark:border-dark-border/60 hover:border-slate-300'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Hospital Basic Info */}
                <div className="md:col-span-4 space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-850 dark:text-white font-headline">
                      {hosp.name}
                    </h4>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${hosp.statusColor}`}>
                      {hosp.isRecommended ? '✓ RECOMMENDED' : hosp.statusBadge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">{hosp.location}</div>
                  
                  <div className="flex items-center space-x-3 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1">
                    <span className="flex items-center">
                      <span className="material-symbols-outlined text-sm text-slate-400 mr-1">near_me</span>
                      {hosp.distance}
                    </span>
                    <span className="flex items-center">
                      <span className="material-symbols-outlined text-sm text-slate-400 mr-1">schedule</span>
                      ETA: {hosp.eta}
                    </span>
                  </div>
                </div>

                {/* Treatment Readiness Meter */}
                <div className="md:col-span-3 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Treatment Readiness</span>
                    <span className={`font-bold ${hosp.treatmentReadiness >= 90 ? 'text-emerald-600 dark:text-emerald-400' : hosp.treatmentReadiness >= 75 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {hosp.treatmentReadiness}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        hosp.treatmentReadiness >= 90
                          ? 'bg-emerald-500'
                          : hosp.treatmentReadiness >= 75
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${hosp.treatmentReadiness}%` }}
                    ></div>
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Treatment Starts: <span className="font-bold text-slate-800 dark:text-slate-200">~{hosp.treatmentStartMins} mins</span>
                  </div>
                </div>

                {/* Status & Key Factors */}
                <div className="md:col-span-3 space-y-1 text-xs">
                  {hosp.reasons.slice(0, 3).map((r, i) => (
                    <div key={i} className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium truncate">
                      {r}
                    </div>
                  ))}
                  {hosp.warnings.slice(0, 2).map((w, i) => (
                    <div key={i} className="text-rose-600 dark:text-rose-400 text-[11px] font-medium truncate">
                      {w}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="md:col-span-2 flex flex-col justify-center items-end space-y-2">
                  <button
                    onClick={() => setSelectedHospitalDetails(hosp)}
                    className="w-full md:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-dark-border transition-all flex items-center justify-center space-x-1"
                  >
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>

                  {hosp.isRecommended && (
                    <button
                      onClick={() => handleDispatchPatient(hosp.name)}
                      className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg shadow transition-all"
                    >
                      Dispatch Now
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT-SIDE HOSPITAL DETAILS DRAWER */}
      {selectedHospitalDetails && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-[#0f172a] h-full shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-dark-border p-6 flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-dark-border pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-brand uppercase tracking-widest font-bold">HOSPITAL TELEMETRY DRAWER</span>
                    {selectedHospitalDetails.isRecommended && (
                      <span className="bg-emerald-500/10 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-slate-850 dark:text-white font-headline mt-1">
                    {selectedHospitalDetails.name}
                  </h2>
                  <p className="text-xs text-slate-400">{selectedHospitalDetails.location}</p>
                </div>
                <button
                  onClick={() => setSelectedHospitalDetails(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Hospital Overview Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-dark-border text-center">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Distance & ETA</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-headline mt-1 block">
                    {selectedHospitalDetails.distance} ({selectedHospitalDetails.eta})
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-dark-border text-center">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">ER Queue Wait</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-headline mt-1 block">
                    {selectedHospitalDetails.waitMinutes} mins
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-dark-border text-center">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">Definitive Care Start</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-headline mt-1 block">
                    ~{selectedHospitalDetails.treatmentStartMins} mins
                  </span>
                </div>
              </div>

              {/* Legend of Resource Badges */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-dark-border text-[10px] space-y-1.5">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">Resource Status Legend:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-semibold">🟢 Available</span>
                  <span className="bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-semibold">🟡 Busy</span>
                  <span className="bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded font-semibold">🔴 Unavailable</span>
                  <span className="bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded font-semibold">🔵 Maintenance</span>
                  <span className="bg-slate-500/10 text-slate-600 px-1.5 py-0.5 rounded font-semibold">⚫ Off Duty</span>
                </div>
              </div>

              {/* Facilities & Equipment Status */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Facilities & Equipment Status
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['MRI', 'CT', 'Ultrasound', 'X-Ray', 'OT', 'ICU Beds', 'Ventilators', 'Blood Bank', 'Emergency Beds'].map(res => (
                    <div key={res} className="p-2.5 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-200 block text-xs">{res}</span>
                        {selectedHospitalDetails.resourceCounts[res] && (
                          <span className="text-[9.5px] text-slate-400 block">{selectedHospitalDetails.resourceCounts[res]}</span>
                        )}
                      </div>
                      {getResourceStatusBadge(selectedHospitalDetails.resources[res])}
                    </div>
                  ))}
                </div>
              </div>

              {/* Technician & Doctor Staffing Status */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Staff & Specialist On-Duty Roster
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['MRI Technician', 'CT Technician', 'Orthopedic Surgeon', 'Radiologist', 'Neurosurgeon', 'Anesthetist'].map(staff => (
                    <div key={staff} className="p-2.5 rounded-lg border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card flex justify-between items-center">
                      <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">{staff}</span>
                      {getResourceStatusBadge(selectedHospitalDetails.resources[staff])}
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Queue & Occupancy */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-dark-border text-xs space-y-2">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Current ER Patients Waiting:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedHospitalDetails.queueCount} patients</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Trauma Bay Occupancy:</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedHospitalDetails.traumaOccupancy}</span>
                </div>
              </div>

            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-dark-border flex items-center space-x-3">
              <button
                onClick={() => {
                  handleDispatchPatient(selectedHospitalDetails.name);
                  setSelectedHospitalDetails(null);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-lg shadow transition-all flex items-center justify-center space-x-1"
              >
                <span className="material-symbols-outlined text-base">near_me</span>
                <span>Dispatch Patient Here</span>
              </button>
              
              <a
                href={`tel:${selectedHospitalDetails.phone}`}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs py-3 px-4 rounded-lg border border-slate-200 dark:border-dark-border transition-all flex items-center space-x-1"
              >
                <span className="material-symbols-outlined text-base">phone</span>
                <span>Call Desk</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* PARAMEDIC INTAKE MODAL (INTERACTIVE CASE ENTRY & AI ANALYSIS) */}
      {isCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border w-full max-w-xl rounded-premium shadow-2xl p-6 relative animate-fade-in text-left">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-dark-border pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base">🚨</span>
                  <h3 className="text-base font-bold text-slate-850 dark:text-white font-headline">
                    Paramedic Patient Intake & Destination Engine
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter patient condition & vitals to calculate closest and best hospital destinations.
                </p>
              </div>
              <button
                onClick={() => setIsCaseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body / Scanning View */}
            {isAnalyzing ? (
              <div className="py-12 px-4 text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-500/20 border-t-brand animate-spin"></div>
                  <span className="material-symbols-outlined text-3xl text-brand animate-pulse">psychology</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-headline">
                    Evaluating Regional Hospitals for {caseData.patientName}...
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    {analysisStepText}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand h-full transition-all duration-500 rounded-full"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : analysisComplete ? (
              <div className="py-6 space-y-5 text-center">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <span className="material-symbols-outlined text-3xl font-bold">verified</span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white font-headline">
                    SETU has identified the optimal destination.
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Calculated for <strong>{caseData.patientName}</strong> ({caseData.injuryType}).
                  </p>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl text-left space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Top Suggested Hospital</div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white font-headline">{recommendedHospital.name}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    Definitive treatment starts in <strong>17 minutes</strong> (vs 42 minutes at nearest Apollo Hospital).
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => {
                      setIsCaseModalOpen(false);
                      handleDispatchPatient(recommendedHospital.name);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-lg shadow"
                  >
                    Confirm & Dispatch
                  </button>
                  <button
                    onClick={() => setIsCaseModalOpen(false)}
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs py-2.5 px-4 rounded-lg"
                  >
                    View Recommendations Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-4 text-xs">
                
                {/* Condition Presets */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Quick Condition Presets</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.keys(conditionPresets).map(presetKey => (
                      <button
                        key={presetKey}
                        type="button"
                        onClick={() => handlePresetSelect(presetKey)}
                        className={`px-2.5 py-1.5 rounded text-[11px] font-semibold text-left border transition-all ${
                          caseData.injuryType === presetKey
                            ? 'bg-brand-50/80 dark:bg-brand-900/30 text-brand border-brand-500/50 font-bold'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-dark-border hover:bg-slate-100'
                        }`}
                      >
                        {presetKey}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Patient Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded p-2 text-slate-800 dark:text-slate-100 font-semibold"
                      value={caseData.patientName}
                      onChange={(e) => setCaseData({ ...caseData, patientName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Age / Gender</label>
                    <div className="flex space-x-1">
                      <input
                        type="text"
                        className="w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded p-2 text-slate-800 dark:text-slate-100 font-semibold"
                        value={caseData.patientAge}
                        onChange={(e) => setCaseData({ ...caseData, patientAge: e.target.value })}
                      />
                      <select
                        className="w-1/2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded p-2 text-slate-800 dark:text-slate-100 font-semibold"
                        value={caseData.gender}
                        onChange={(e) => setCaseData({ ...caseData, gender: e.target.value })}
                      >
                        <option value="M">M</option>
                        <option value="F">F</option>
                        <option value="O">O</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Severity</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded p-2 text-slate-800 dark:text-slate-100 font-bold text-rose-600"
                      value={caseData.severity}
                      onChange={(e) => setCaseData({ ...caseData, severity: e.target.value })}
                    >
                      <option value="Critical">Critical</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Minor">Minor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Injury / Clinical Condition</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded p-2 text-slate-800 dark:text-slate-100 font-semibold"
                      value={caseData.injuryType}
                      onChange={(e) => setCaseData({ ...caseData, injuryType: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Ambulance Location</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-dark-border rounded p-2 text-slate-800 dark:text-slate-100 font-medium"
                      value={caseData.location}
                      onChange={(e) => setCaseData({ ...caseData, location: e.target.value })}
                    />
                  </div>
                </div>

                {/* Vitals Input Row */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-200 dark:border-dark-border">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block">Blood Pressure</label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded p-1 text-[11px] font-mono text-slate-800 dark:text-slate-200"
                      value={caseData.vitalBP}
                      onChange={(e) => setCaseData({ ...caseData, vitalBP: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block">Heart Rate</label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded p-1 text-[11px] font-mono text-slate-800 dark:text-slate-200"
                      value={caseData.vitalHR}
                      onChange={(e) => setCaseData({ ...caseData, vitalHR: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block">SpO2 Oxygen</label>
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded p-1 text-[11px] font-mono text-slate-800 dark:text-slate-200"
                      value={caseData.vitalSpO2}
                      onChange={(e) => setCaseData({ ...caseData, vitalSpO2: e.target.value })}
                    />
                  </div>
                </div>

                {/* Auto-suggested Facilities Tags */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Required Facilities & Staff</label>
                  <div className="flex flex-wrap gap-1.5">
                    {caseData.requiredFacilities.map(f => (
                      <span key={f} className="bg-brand-50/60 dark:bg-brand-900/20 border border-brand-500/30 text-brand px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="pt-3 border-t border-slate-100 dark:border-dark-border">
                  <button
                    onClick={handleStartAnalysis}
                    className="w-full bg-brand hover:bg-brand-600 text-white font-bold text-xs py-3 rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 font-headline"
                  >
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    <span>Analyze & Suggest Best Hospital</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* CONTACT MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border w-full max-w-md rounded-premium shadow-2xl p-6 relative animate-fade-in text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-850 dark:text-white font-headline">
                📞 Emergency Desk Hotline Directory
              </h3>
              <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {hospitalsData.map(h => (
                <div key={h.id} className="p-3 rounded-lg border border-slate-200 dark:border-dark-border flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">{h.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{h.phone}</span>
                  </div>
                  <a
                    href={`tel:${h.phone}`}
                    className="bg-brand text-white font-bold text-[11px] px-3 py-1.5 rounded flex items-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-xs">call</span>
                    <span>Call</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
