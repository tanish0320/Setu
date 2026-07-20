import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SvgNetworkMap } from './SvgNetworkMap';
import { CalendarPage } from './CalendarPage';
import { EmergencyWorkflowPage } from './EmergencyWorkflowPage';
import { RoleDashboardDoctor } from './RoleDashboardDoctor';
import { RoleDashboardHospitalAdmin } from './RoleDashboardHospitalAdmin';
import { RoleDashboardAmbulance } from './RoleDashboardAmbulance';
import {
  SecurityCenterPage,
  ApiExplorerPage,
  SystemHealthPage,
  ArchitecturePage
} from './EnterprisePages';

export const JudgeMode = ({ onClose }) => {
  const {
    role, setRole,
    activePage, setActivePage,
    selectedDoctor,
    activeSOS, dispatchSOS, acceptSOS, cancelSOS,
    demoActive, startWowDemo, stopWowDemo, setDemoSpeed
  } = useApp();

  const [slide, setSlide] = useState(1);

  const slides = [
    {
      num: 1,
      title: "1. The Specialist Problem",
      desc: "Specialist doctors in India are split across multiple independent hospitals. Coordination is manual, schedules conflict, and critical response times exceed 30–45 minutes during emergencies.",
      stats: ["🚨 Mean Response: 30-45 mins", "❌ Conflicting Schedules", "⚠️ Administrative Chaos"]
    },
    {
      num: 2,
      title: "2. Meet Dr. Rajesh Sharma",
      desc: "Dr. Rajesh is a senior Cardiologist affiliated with multiple nodes. Here we see his active, multi-hospital schedule. Notice the transit warnings highlighted by the conflict engine.",
      stats: ["🏥 Affiliated Hubs: 3 Nodes", "📅 8 Active Consultations", "🚗 Commute Buffers warning active"]
    },
    {
      num: 3,
      title: "3. Critical Emergency SOS",
      desc: "A patient arrives at Apollo Chennai with acute coronary syndrome. The desk receptionist initiates the Emergency SOS pager broadcast with one click.",
      stats: ["🚨 Code Blue Triggered", "🫀 Specialty: Cardiology", "⚡ Destination: Apollo Chennai"]
    },
    {
      num: 4,
      title: "4. Emergency Destination Intelligence",
      desc: "When an ambulance picks up a patient (e.g., 28 y/o Knee Dislocation / ACL Tear), SETU evaluates nearby hospitals by definitive time to care—not just distance. Even though Apollo (5.4 km) is nearest, its MRI technician is offline (42m delay), so SETU directs the paramedic to Manipal (9 km, 17m care start).",
      stats: ["🚑 Paramedic Intake & Live Distance Map", "⏱️ 17m to Care vs 42m at Nearest", "🧠 AI Confidence: 94%"]
    },
    {
      num: 5,
      title: "5. AI Coordination Match",
      desc: "The SETU AI Engine instantly ranks all available network specialists based on distance, occupancy, reliability history, and commute ETAs, showcasing its mathematical breakdown.",
      stats: ["🧠 AI Match Score: 98%", "📍 Travel Distance: 0 km", "⚡ Pagers Ringing Active"]
    },
    {
      num: 6,
      title: "6. Doctor Accepts & Transits",
      desc: "Dr. Rajesh Sharma accepts the alert via his pager. The Live India Map tracks his commute route and ETA coordinates in real-time.",
      stats: ["🚗 Transit Status: En-route", "⏳ Countdown: 45s", "📍 GPS Coordinates: Active"]
    },
    {
      num: 7,
      title: "7. Hospital Desks Sync",
      desc: "The Hospital Admin dashboard updates instantly. Response metrics, OPD queues, and specialist utilization rates refresh in real-time across the cluster.",
      stats: ["📊 Mean Response: 4.2 mins", "💡 Peak Utilization: 81%", "⚡ Cluster Status: Synced"]
    },
    {
      num: 8,
      title: "8. Patient Handoff Compiled",
      desc: "Upon arrival, Dr. Rajesh treats the patient and logs a structured handoff note, immediately broadcasted to the patient's global records ledger.",
      stats: ["📝 Clinical Note Compiled", "🔒 Secure Handoff Blocked", "🏥 Node Check-in: Complete"]
    },
    {
      num: 9,
      title: "9. Reliability Score Updated",
      desc: "The doctor's overall reliability rating updates dynamically based on response time, maintaining trust metrics inside the national registry.",
      stats: ["📈 Reliability Index: +2%", "✓ On-time Check-in: Yes", "🔒 Audit: Cryptographically logged"]
    },
    {
      num: 10,
      title: "10. System Health & SOC",
      desc: "SETU demonstrates enterprise-readiness with the Security Operations Center (SOC), active API Explorers, and cluster health monitors.",
      stats: ["🔒 AES-255-GCM & TLS 1.3", "💡 Latency: 12ms", "✓ DPDP Compliant (India)"]
    },
    {
      num: 11,
      title: "11. Technical Architecture",
      desc: "Our scalable cloud architecture connects clients, AWS Gateways, NestJS engines, and Firebase pagers to handle thousands of operations concurrently.",
      stats: ["🔌 AWS Gateway & JWT", "🗄️ PostgreSQL Aurora replica", "💬 Redis Cache active"]
    },
    {
      num: 12,
      title: "SETU (सेतु)",
      desc: "Connecting Hospitals. Empowering Doctors. Saving Lives.",
      stats: [
        "✓ Under 5-minute emergency coordination",
        "✓ Emergency destination intelligence & fast treatment routing",
        "✓ Multi-hospital physician scheduling",
        "✓ Secure, scalable, enterprise-ready architecture"
      ]
    }
  ];

  // Intercept slide changes to configure context page states
  useEffect(() => {
    switch (slide) {
      case 1:
        setActivePage('dashboard');
        setRole('Hospital Admin');
        cancelSOS();
        break;
      case 2:
        setActivePage('calendar');
        setRole('Doctor');
        break;
      case 3:
        setActivePage('emergency');
        setRole('Receptionist');
        cancelSOS();
        break;
      case 4:
        setActivePage('dashboard');
        setRole('Ambulance User');
        cancelSOS();
        break;
      case 5:
        setActivePage('emergency');
        setRole('Receptionist');
        // trigger cardiology SOS at Apollo Chennai (h3)
        dispatchSOS('Cardiology', 'Critical', 'h3');
        break;
      case 6:
        setActivePage('emergency');
        setRole('Receptionist');
        // Simulate doctor d1 (Rajesh Sharma) accepting SOS
        acceptSOS('d1');
        break;
      case 7:
        setActivePage('dashboard');
        setRole('Hospital Admin');
        break;
      case 8:
        setActivePage('dashboard');
        setRole('Doctor');
        break;
      case 9:
        setActivePage('reliability');
        setRole('Doctor');
        break;
      case 10:
        setActivePage('security');
        setRole('Super Admin');
        break;
      case 11:
        setActivePage('architecture');
        setRole('Super Admin');
        break;
      case 12:
        setActivePage('dashboard');
        setRole('Super Admin');
        break;
      default:
        break;
    }
  }, [slide]);

  const handleNext = () => {
    if (slide < 12) setSlide(slide + 1);
  };

  const handlePrev = () => {
    if (slide > 1) setSlide(slide - 1);
  };

  const handleRestart = () => {
    setSlide(1);
  };

  const currentSlide = slides[slide - 1];

  // Helper to render the live page panel corresponding to the active slide
  const renderLivePanel = () => {
    switch (slide) {
      case 1:
        return <RoleDashboardHospitalAdmin />;
      case 2:
        return <CalendarPage />;
      case 3:
        return <EmergencyWorkflowPage />;
      case 4:
        return <RoleDashboardAmbulance activeSubTab="dashboard" />;
      case 5:
      case 6:
        return <EmergencyWorkflowPage />;
      case 7:
        return <RoleDashboardHospitalAdmin />;
      case 8:
        return <RoleDashboardDoctor />;
      case 9:
        return (
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Specialist Reliability Diagnostics</h3>
            <p className="text-xs text-slate-400">Dr. Rajesh Sharma's overall response rating history has been verified by coordinate arrival check-in.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded bg-slate-50 dark:bg-slate-900/10 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Punctuality Score</span>
                <span className="text-3xl font-black text-brand font-headline mt-2 block">98%</span>
              </div>
              <div className="p-4 border rounded bg-slate-50 dark:bg-slate-900/10 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Emergency response score</span>
                <span className="text-3xl font-black text-emerald-500 font-headline mt-2 block">99%</span>
              </div>
            </div>
          </div>
        );
      case 10:
        return <SecurityCenterPage />;
      case 11:
        return <ArchitecturePage />;
      case 12:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-6">
            <span className="material-symbols-outlined text-brand text-7xl animate-pulse">cell_tower</span>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-800 dark:text-white font-headline tracking-tight">SETU (सेतु)</h1>
              <p className="text-md text-slate-405 dark:text-slate-400 italic">"Connecting Hospitals. Empowering Doctors. Saving Lives."</p>
            </div>
            <div className="max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-premium text-left text-xs space-y-2.5 shadow-md">
              {currentSlide.stats.map((s, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-slate-650 dark:text-slate-305">
                  <span className="material-symbols-outlined text-emerald-500 text-sm font-bold">check_circle</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-100 dark:bg-[#080c14] flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Left Panel: The Live Application Dashboard View */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0b0f18] p-6 relative">
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
          <span className="w-2 h-2 bg-brand rounded-full animate-ping"></span>
          <span className="text-[10px] text-slate-450 dark:text-slate-400 font-black tracking-wider uppercase font-mono bg-white/80 dark:bg-dark-card/85 px-2 py-0.5 border rounded">Live Workspace Sandbox</span>
        </div>

        <div className="flex-1 overflow-y-auto mt-6">
          <div className="max-w-[1100px] mx-auto h-full border border-slate-200 dark:border-dark-border/40 bg-white dark:bg-dark-card rounded-premium p-6 shadow-sm overflow-y-auto">
            {renderLivePanel()}
          </div>
        </div>
      </div>

      {/* Right Panel: Storyboard Presentation Console (Dark Theme always) */}
      <div className="w-full md:w-[350px] bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 text-slate-300 p-5 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <span className="text-xs font-black text-brand uppercase tracking-wider font-headline">SETU Presentation</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded">Slide {slide}/12</span>
          </div>

          {/* Narration */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white font-headline leading-snug">{currentSlide.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">{currentSlide.desc}</p>
          </div>

          {/* Metrics */}
          {slide < 12 && (
            <div className="space-y-2 bg-[#121927] border border-slate-800 p-3.5 rounded-premium text-xs">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Key Performance Diagnostics</span>
              {currentSlide.stats.map((s, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Presentation Controls */}
        <div className="space-y-3 pt-6 border-t border-slate-800 mt-6">
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={slide === 1}
              className="flex-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-white font-bold text-xs py-2 rounded-premium transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={slide === 12}
              className="flex-1 bg-brand hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-xs py-2 rounded-premium transition-colors"
            >
              Next
            </button>
          </div>

          <div className="flex gap-2 text-xs">
            <button
              onClick={handleRestart}
              className="flex-1 text-slate-400 hover:text-white font-bold text-center py-1"
            >
              Restart
            </button>
            <button
              onClick={onClose}
              className="flex-1 text-red-400 hover:text-danger font-bold text-center py-1"
            >
              Exit Judge Mode
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
