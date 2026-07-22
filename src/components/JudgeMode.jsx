import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SvgNetworkMap } from './SvgNetworkMap';
import { CalendarPage } from './CalendarPage';
import { EmergencyWorkflowPage } from './EmergencyWorkflowPage';
import { RoleDashboardDoctor } from './RoleDashboardDoctor';
import { RoleDashboardHospitalAdmin } from './RoleDashboardHospitalAdmin';
import { RoleDashboardAmbulance } from './RoleDashboardAmbulance';
import { HospitalsPage } from './HospitalsPage';
import { DoctorsPage } from './DoctorsPage';
import { PatientsPage } from './PatientsPage';
import {
  SecurityCenterPage,
  ApiExplorerPage,
  SystemHealthPage,
  ArchitecturePage,
  AuditTrailPage
} from './EnterprisePages';

export const JudgeMode = ({ onClose }) => {
  const {
    role, setRole,
    activePage, setActivePage,
    selectedDoctor,
    activeSOS, dispatchSOS, acceptSOS, cancelSOS,
    addToast, openModal
  } = useApp();

  const [slide, setSlide] = useState(1);

  const slides = [
    {
      num: 1,
      title: "1. 20-Hospital Real Cluster Network",
      desc: "SETU coordinates 20 prominent Indian apex medical centers (Apollo Delhi, Fortis Mumbai, Manipal Bengaluru, Narayana Health, AIIMS, Medanta, etc.) with real hospital codes, ICU capacities, and capability tags.",
      stats: ["🏥 20 Real Regional Hospital Nodes", "📍 Real Metro Mappings (Delhi, Mumbai, BLR)", "⚡ Level-1 Trauma & Cath Lab Telemetry"]
    },
    {
      num: 2,
      title: "2. Unified 7-Day Network Calendar & Buffers",
      desc: "Physicians manage multi-hospital schedules across Monday through Sunday. Sunday is styled as a designated Off-Duty/On-Call column. Selecting any slot slides open a contextual rescheduling drawer with AI slot suggestions.",
      stats: ["📅 Full 7-Day Grid (Mon – Sun)", "🚗 Automatic Travel Buffer Alerts", "🗂️ Contextual Slide-Over Rescheduling Drawer"]
    },
    {
      num: 3,
      title: "3. Paramedic Destination Intelligence",
      desc: "When an ambulance picks up a critical patient (e.g., 28 y/o Knee Dislocation), SETU ranks destination hospitals by definitive time-to-care start. Even though Apollo (5.4 km) is nearest, its MRI technician is offline (42m delay), so SETU directs the unit to Manipal (9 km, 17m treatment start).",
      stats: ["🚑 17m to Definitive Care vs 42m Delay", "🧠 94% AI Destination Suitability Score", "📍 Real-Time Commute & Emergency Room Status"]
    },
    {
      num: 4,
      title: "4. Code Blue Emergency Pager Broadcast",
      desc: "Hospital receptionists trigger Code Blue SOS broadcasts in 1 click. SETU's AI match engine evaluates doctor availability, travel distance, and reliability index, ringing specialist pagers instantly.",
      stats: ["🚨 Instant 1-Click Code Blue Pager", "🫀 Cardiology & Neuro Specialist Match", "⚡ Target Response: Under 5 Mins"]
    },
    {
      num: 5,
      title: "5. Doctor Pager Accept & En-Route Commute",
      desc: "The specialist accepts the emergency alert via their pager. Their status updates to 'Emergency Response', triggering a live commute countdown timer and broadcasting GPS coordinates across all dashboards.",
      stats: ["🚗 Presence: Emergency Response", "⏳ Live Transit Countdown Timer", "🔔 Real-Time Multi-Dashboard Sync"]
    },
    {
      num: 6,
      title: "6. Dense Command Center Operations Hub",
      desc: "Hospital Admin, Doctor, and Ambulance dashboards utilize high-density 1800px layouts. Compressed KPI cards, Upcoming Emergencies, AI Recommendations, and Live Activity feeds deliver instant operational visibility.",
      stats: ["💻 1800px Workstation Optimized", "📊 6 Compressed KPI Stat Cards", "⚡ 100% Interactive Triggers & Drawers"]
    },
    {
      num: 7,
      title: "7. 150+ Patient EMR Registry & Age Brackets",
      desc: "Comprehensive patient registry spanning Infants (0-2y), Children, Teenagers, Adults, and Seniors. Includes MRN codes (MRN-104928), blood groups, emergency histories, and clinical handoffs.",
      stats: ["📂 150+ Unique EMR Patient Profiles", "🩸 Age Brackets & Blood Group Filters", "📝 Compiled Clinical Handoff Notes"]
    },
    {
      num: 8,
      title: "8. 85+ Verified Specialist Roster",
      desc: "85 unique specialist profiles across 25 medical specialties (Cardiology, Neurology, Orthopedics, Pediatrics, Neurosurgery, etc.) with randomized real-time presence statuses.",
      stats: ["👨‍⚕️ 85+ Non-Repeating Specialist Names", "🩺 25 Medical Specialties Supported", "📈 Dynamic Reliability Index Score"]
    },
    {
      num: 9,
      title: "9. Cryptographic SHA-256 Immutable Ledger",
      desc: "Every emergency dispatch, schedule shift, and status change is written to an immutable audit ledger stamped with SHA-256 hashes for 100% DPDP India compliance.",
      stats: ["🔒 SHA-256 Signed Audit Ledger", "🛡️ AES-256-GCM & TLS 1.3 Security", "🇮🇳 100% DPDP Act Compliant"]
    },
    {
      num: 10,
      title: "10. System Health & Socket Telemetry",
      desc: "Enterprise-grade infrastructure monitoring displaying 14 ms Socket.IO gateway latency, Redis cache hits, PostgreSQL Aurora replica health, and active feature flags.",
      stats: ["⚡ 14 ms Real-Time Socket Latency", "🗄️ PostgreSQL & Redis Cluster", "🎛️ Live Feature Flags Control"]
    },
    {
      num: 11,
      title: "11. Zero Dead-Ends & Toast Feedback",
      desc: "Every button, card, row, dropdown, and recommendation button triggers visual toast feedback or opens rich detail drawers. Unimplemented features display polished roadmap modals.",
      stats: ["🔔 Instant Toast Feedback System", "🪟 Interactive Detail Drawers & Modals", "⭐ Production Roadmap Overlay"]
    },
    {
      num: 12,
      title: "SETU (सेतु) Platform Complete",
      desc: "Connecting Hospitals. Empowering Doctors. Saving Lives.",
      stats: [
        "✓ Under 5-minute emergency coordination",
        "✓ Destination intelligence & fast treatment routing",
        "✓ Multi-hospital 7-day physician calendar",
        "✓ Secure, DPDP-compliant enterprise architecture"
      ]
    }
  ];

  // Intercept slide changes to configure live workspace state
  useEffect(() => {
    switch (slide) {
      case 1:
        setActivePage('hospitals');
        setRole('Hospital Admin');
        cancelSOS();
        break;
      case 2:
        setActivePage('calendar');
        setRole('Doctor');
        break;
      case 3:
        setActivePage('dashboard');
        setRole('Ambulance User');
        cancelSOS();
        break;
      case 4:
        setActivePage('emergency');
        setRole('Receptionist');
        cancelSOS();
        break;
      case 5:
        setActivePage('emergency');
        setRole('Receptionist');
        dispatchSOS('Cardiology', 'Critical', 'h3');
        setTimeout(() => acceptSOS('d1'), 600);
        break;
      case 6:
        setActivePage('dashboard');
        setRole('Hospital Admin');
        break;
      case 7:
        setActivePage('patients');
        setRole('Hospital Admin');
        break;
      case 8:
        setActivePage('doctors');
        setRole('Hospital Admin');
        break;
      case 9:
        setActivePage('audit_logs');
        setRole('Super Admin');
        break;
      case 10:
        setActivePage('system_health');
        setRole('Super Admin');
        break;
      case 11:
        setActivePage('dashboard');
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

  // Render live panel view corresponding to current slide
  const renderLivePanel = () => {
    switch (slide) {
      case 1:
        return <HospitalsPage />;
      case 2:
        return <CalendarPage />;
      case 3:
        return <RoleDashboardAmbulance activeSubTab="dashboard" />;
      case 4:
      case 5:
        return <EmergencyWorkflowPage />;
      case 6:
        return <RoleDashboardHospitalAdmin />;
      case 7:
        return <PatientsPage />;
      case 8:
        return <DoctorsPage />;
      case 9:
        return <AuditTrailPage />;
      case 10:
        return <SystemHealthPage />;
      case 11:
        return <RoleDashboardSuperAdmin />;
      case 12:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-6">
            <span className="material-symbols-outlined text-brand text-7xl animate-pulse">cell_tower</span>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-800 dark:text-white font-headline tracking-tight">SETU (सेतु)</h1>
              <p className="text-md text-slate-500 dark:text-slate-400 italic">"Connecting Hospitals. Empowering Doctors. Saving Lives."</p>
            </div>
            <div className="max-w-md bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-5 rounded-premium text-left text-xs space-y-2.5 shadow-md">
              {currentSlide.stats.map((s, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-slate-700 dark:text-slate-200">
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
      
      {/* Left Panel: High-Density Live Application Sandbox */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0b0f18] p-4 md:p-6 relative">
        <div className="absolute top-3 left-4 z-10 flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-brand rounded-full animate-ping"></span>
          <span className="text-[10px] text-slate-500 dark:text-slate-300 font-black tracking-wider uppercase font-mono bg-white/90 dark:bg-dark-card/90 px-2.5 py-1 border rounded shadow-xs">
            Live Workspace Sandbox (Slide {slide}/12)
          </span>
        </div>

        <div className="flex-1 overflow-y-auto mt-7">
          <div className="max-w-[1700px] mx-auto min-h-full border border-slate-200 dark:border-dark-border/40 bg-white dark:bg-dark-card rounded-premium p-6 shadow-sm overflow-y-auto">
            {renderLivePanel()}
          </div>
        </div>
      </div>

      {/* Right Panel: Storyboard Console */}
      <div className="w-full md:w-[380px] bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 text-slate-300 p-5 flex flex-col justify-between overflow-y-auto shrink-0 select-none">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <span className="text-xs font-black text-brand uppercase tracking-wider font-headline">SETU Interactive Walkthrough</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2.5 py-0.5 rounded font-bold">Step {slide} of 12</span>
          </div>

          {/* Narration */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-white font-headline leading-snug">{currentSlide.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{currentSlide.desc}</p>
          </div>

          {/* Metrics & Features Checklist */}
          {slide < 12 && (
            <div className="space-y-2.5 bg-[#121927] border border-slate-800 p-4 rounded-premium text-xs">
              <span className="text-[9.5px] text-brand font-bold uppercase tracking-wider block font-headline">Demonstrated Capabilities</span>
              {currentSlide.stats.map((s, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-slate-200 text-[11px]">
                  <span className="w-1.5 h-1.5 bg-brand rounded-full mt-1.5 shrink-0"></span>
                  <span className="leading-snug">{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3 pt-5 border-t border-slate-800 mt-6">
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={slide === 1}
              className="flex-1 bg-slate-800 hover:bg-slate-750 disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-premium transition-colors cursor-pointer"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={slide === 12}
              className="flex-1 bg-brand hover:bg-brand-600 disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-premium transition-colors cursor-pointer"
            >
              Next Step →
            </button>
          </div>

          <div className="flex gap-2 text-xs">
            <button
              onClick={handleRestart}
              className="flex-1 text-slate-400 hover:text-white font-bold text-center py-1 cursor-pointer"
            >
              Restart Demo
            </button>
            <button
              onClick={onClose}
              className="flex-1 text-red-400 hover:text-danger font-bold text-center py-1 cursor-pointer"
            >
              Exit Walkthrough
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
