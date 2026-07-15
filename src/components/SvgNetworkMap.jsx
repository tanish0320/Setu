import React from 'react';
import { useApp } from '../context/AppContext';

export const SvgNetworkMap = () => {
  const { activeSOS, hospitals, doctors } = useApp();

  // Schematic polygon path approximating the map boundary of India
  const indiaMapPath = "M 150 20 L 175 15 L 180 35 L 165 45 L 175 60 L 195 70 L 225 65 L 245 75 L 275 65 L 285 85 L 265 95 L 235 95 L 225 105 L 235 120 L 250 120 L 240 135 L 205 125 L 195 135 L 175 135 L 165 160 L 150 180 L 155 205 L 148 200 L 140 180 L 132 160 L 115 150 L 105 130 L 110 115 L 95 115 L 85 100 L 105 90 Z";

  // Filter doctors that are active and online (to avoid clutter, we show doctors in transit, consulting, and available)
  const activeSpecialists = doctors.filter(d => 
    d.status === 'In Transit' || 
    d.status === 'Emergency' || 
    d.status === 'Available'
  );

  return (
    <div className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 flex flex-col items-center shadow-sm">
      <div className="w-full flex justify-between items-center mb-4">
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <span className="material-symbols-outlined text-brand mr-1.5 text-lg">explore</span>
            SETU Live Network Commute Map
          </h4>
          <span className="text-[10px] text-slate-400 mt-0.5 block">National coordination grid tracing 20 hospital clusters</span>
        </div>
        <span className="text-[9px] bg-emerald-500/10 text-success border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase animate-pulse">
          Live Tracking
        </span>
      </div>

      <div className="relative w-full aspect-[4/3] bg-slate-50 dark:bg-[#0c1220] rounded border border-slate-200 dark:border-dark-border/40 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Radar concentric circular grid */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] dark:opacity-[0.08] pointer-events-none">
          <div className="w-[80%] aspect-square rounded-full border border-brand"></div>
          <div className="w-[60%] aspect-square rounded-full border border-brand absolute"></div>
          <div className="w-[40%] aspect-square rounded-full border border-brand absolute"></div>
        </div>

        <svg viewBox="0 0 350 250" className="w-full h-full overflow-visible">
          {/* India Boundary Schematic */}
          <path 
            d={indiaMapPath} 
            fill="none" 
            stroke="currentColor" 
            className="text-slate-200 dark:text-slate-800/80 transition-colors" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Active emergency transit path (glowing red line) */}
          {activeSOS && activeSOS.status === 'Accepted' && activeSOS.doctor && (
            (() => {
              const docRef = doctors.find(d => d.id === activeSOS.doctor.id);
              const targetH = hospitals.find(h => h.id === activeSOS.hospitalId);
              const startH = hospitals.find(h => h.id === docRef?.currentHospitalId) || hospitals[0];
              
              if (targetH && startH) {
                return (
                  <g>
                    {/* Glowing background line */}
                    <line 
                      x1={startH.x} y1={startH.y} 
                      x2={targetH.x} y2={targetH.y} 
                      stroke="#EF4444" 
                      strokeWidth="3" 
                      className="opacity-20 blur-sm" 
                    />
                    {/* Commute route path line */}
                    <line 
                      x1={startH.x} y1={startH.y} 
                      x2={targetH.x} y2={targetH.y} 
                      stroke="#EF4444" 
                      strokeWidth="1.5" 
                      strokeDasharray="4,4" 
                      className="opacity-75" 
                    />
                  </g>
                );
              }
              return null;
            })()
          )}

          {/* Hospital Nodes (20 points) */}
          {hospitals.map(hosp => (
            <g key={hosp.id} transform={`translate(${hosp.x}, ${hosp.y})`} className="cursor-pointer group">
              <circle r="7.5" fill={hosp.color} fillOpacity="0.2" className="group-hover:scale-150 transition-transform" />
              <circle r="3.5" fill={hosp.color} />
              
              {/* Tooltip on hover */}
              <title>{`${hosp.name}\n${hosp.city} Node`}</title>
            </g>
          ))}

          {/* Doctor Presence coordinates (tiny glowing dots) */}
          {activeSpecialists.map(doc => {
            let color = '#10B981'; // green for available
            if (doc.status === 'Emergency') color = '#EF4444'; // red for emergency
            if (doc.status === 'In Transit') color = '#F59E0B'; // orange for transit
            if (doc.status === 'Consulting') color = '#3B82F6'; // blue for consulting

            return (
              <g key={doc.id} className="cursor-pointer group">
                <circle 
                  cx={doc.x} 
                  cy={doc.y} 
                  r="5" 
                  fill={color} 
                  fillOpacity="0.3" 
                  className={doc.status === 'Emergency' ? 'animate-ping' : 'group-hover:scale-150 transition-all'} 
                />
                <circle 
                  cx={doc.x} 
                  cy={doc.y} 
                  r="2.5" 
                  fill={color} 
                  stroke="#ffffff"
                  strokeWidth="0.5"
                />
                
                <title>{`${doc.name} (${doc.specialty})\nStatus: ${doc.status}\nLocation: ${doc.x.toFixed(0)}, ${doc.y.toFixed(0)}`}</title>
              </g>
            );
          })}
        </svg>

        {/* Floating Legend */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-2.5 bg-white/80 dark:bg-slate-900/80 px-2 py-1.5 rounded text-[8px] font-bold border border-slate-200 dark:border-dark-border/40 select-none shadow-sm">
          <span className="flex items-center text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span> Available
          </span>
          <span className="flex items-center text-blue-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1"></span> Consulting
          </span>
          <span className="flex items-center text-amber-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span> Commuting
          </span>
          <span className="flex items-center text-red-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse"></span> SOS Pager
          </span>
        </div>
      </div>
    </div>
  );
};
