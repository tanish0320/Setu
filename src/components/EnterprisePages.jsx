import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProgressRing } from './SvgCharts';

// 1. SECURITY CENTER PAGE
export const SecurityCenterPage = () => {
  const { role } = useApp();
  
  const activeSessions = [
    { ip: '192.168.1.104', location: 'Apollo Greams Road (Chennai)', device: 'Chrome / Windows 11', duration: '12m active', status: 'Secure' },
    { ip: '10.0.4.56', location: 'Fortis Adyar (Chennai)', device: 'Safari / iPadOS', duration: '45m active', status: 'Secure' },
    { ip: '172.16.85.22', location: 'Max Super Speciality (Delhi)', device: 'Edge / Windows 10', duration: '2h active', status: 'Secure' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Enterprise Security Operations Center (SOC)</h2>
          <p className="text-xs text-slate-400 mt-1">Audit active encryption, regulatory compliances, and secure session credentials.</p>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-success border border-emerald-500/25 px-2.5 py-1 rounded font-bold uppercase animate-pulse">
          SOC Shield Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Compliance checklist */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b pb-2 border-slate-100 dark:border-dark-border/40">Regulatory Compliance</h3>
          <div className="space-y-3 text-xs leading-normal">
            <div className="flex justify-between items-center">
              <span>DPDP Compliance (India)</span>
              <span className="font-bold text-success font-mono">1023 Compliant</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Data Residency</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-500 font-mono">ap-south-1 (Mumbai)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>DISHA Health Standard</span>
              <span className="font-bold text-success">Verified</span>
            </div>
            <div className="flex justify-between items-center">
              <span>HIPAA BAA signed</span>
              <span className="font-bold text-success">Yes</span>
            </div>
          </div>
        </div>

        {/* Security Parameters */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b pb-2 border-slate-100 dark:border-dark-border/40">Encryption & Auth</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span>Database At Rest</span>
              <span className="font-bold text-slate-600 dark:text-slate-200">AES-256-GCM</span>
            </div>
            <div className="flex justify-between items-center">
              <span>TLS Comm Link</span>
              <span className="font-bold text-slate-600 dark:text-slate-200">TLS 1.3 Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Authentication Gateway</span>
              <span className="font-bold text-slate-600 dark:text-slate-200">JWT Refresh Token</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Biometric MFA Required</span>
              <span className="font-bold text-success">Active</span>
            </div>
          </div>
        </div>

        {/* Disaster Recovery */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b pb-2 border-slate-100 dark:border-dark-border/40">Resilience Index</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span>Cross-Region Replication</span>
              <span className="font-bold text-slate-600 dark:text-slate-300">ap-east-1 (Backup)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Disaster RTO Target</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">&lt; 30 seconds</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Weekly Restore Drills</span>
              <span className="font-bold text-success font-mono">100% Success</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Snapshot</span>
              <span className="font-mono text-slate-400">10 mins ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Session Monitoring */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">Active Operations Sessions Monitor</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border/40 text-slate-450 uppercase font-bold">
                <th className="pb-3">Client Endpoint IP</th>
                <th className="pb-3">Node Location</th>
                <th className="pb-3">Browser / Platform Agent</th>
                <th className="pb-3">Session Age</th>
                <th className="pb-3">Security State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-dark-border/30">
              {activeSessions.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                  <td className="py-3 font-mono text-slate-600 dark:text-slate-300">{s.ip}</td>
                  <td className="py-3 font-semibold text-slate-700 dark:text-slate-200">{s.location}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{s.device}</td>
                  <td className="py-3 font-mono text-slate-400">{s.duration}</td>
                  <td className="py-3">
                    <span className="text-[9px] bg-emerald-500/10 text-success border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase">
                      {s.status}
                    </span>
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

// 2. INTERACTIVE API EXPLORER
export const ApiExplorerPage = () => {
  const [activeEndpoint, setActiveEndpoint] = useState('GET_doctors');
  const [latency, setLatency] = useState(14);
  const [isExecuting, setIsExecuting] = useState(false);

  const endpoints = {
    'GET_doctors': {
      method: 'GET',
      path: '/api/v1/doctors',
      desc: 'Retrieve active specialists presence node coordinates',
      auth: 'Bearer JWT_Secret',
      response: [
        { id: 'd1', name: 'Dr. Rajesh Sharma', specialty: 'Cardiology', status: 'Available', currentHospitalId: 'h1' },
        { id: 'd2', name: 'Dr. Priya Sengupta', specialty: 'Neurology', status: 'Consulting', currentHospitalId: 'h2' }
      ]
    },
    'GET_appointments': {
      method: 'GET',
      path: '/api/v1/appointments',
      desc: 'Retrieve active consultation schedules and travel warning flags',
      auth: 'Bearer JWT_Secret',
      response: [
        { id: 'a1', patientName: 'Aarav Mehta', doctorId: 'd1', date: 'Monday', time: '10:00', warning: 'Commute Buffer Overlap' }
      ]
    },
    'POST_emergency': {
      method: 'POST',
      path: '/api/v1/emergency/sos',
      desc: 'Trigger Code Blue ultrasonic pager alerts network-wide',
      auth: 'Bearer JWT_Secret',
      request: { specialty: 'Cardiology', urgency: 'Critical', hospitalId: 'h3' },
      response: { sosId: 'sos-123984', status: 'Dispatched', activePagerPings: 3, meanTransitETA: '5 mins' }
    },
    'PATCH_status': {
      method: 'PATCH',
      path: '/api/v1/doctors/status',
      desc: 'Set doctor occupancy status manually',
      auth: 'Bearer JWT_Secret',
      request: { doctorId: 'd1', status: 'In Transit', nextHospitalId: 'h2' },
      response: { doctorId: 'd1', status: 'In Transit', nextHospitalId: 'h2', progress: 0, trackingToken: 'trk_982b1c' }
    },
    'GET_analytics': {
      method: 'GET',
      path: '/api/v1/analytics/kpis',
      desc: 'Query hospital coordinator metrics',
      auth: 'Bearer JWT_Secret',
      response: { meanEmergencyResponseMinutes: 4.2, averageCommuteDelayMinutes: 6.1, doctorUtilizationPct: 78, noShowsToday: 1 }
    }
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setLatency(Math.round(8 + Math.random() * 20));
      setIsExecuting(false);
    }, 400);
  };

  const current = endpoints[activeEndpoint];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Simulated API Explorer Console</h2>
        <p className="text-xs text-slate-400 mt-1">Interact with SETU REST and Websocket endpoints in real-time. Test request headers, response blocks, and network latency.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side: Endpoints directory */}
        <div className="xl:col-span-1 space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Endpoint Registry</span>
          {Object.keys(endpoints).map(key => {
            const ep = endpoints[key];
            const isSelected = activeEndpoint === key;
            return (
              <button
                key={key}
                onClick={() => setActiveEndpoint(key)}
                className={`w-full text-left p-3.5 border rounded-premium transition-all flex justify-between items-center ${
                  isSelected 
                    ? 'bg-brand/10 border-brand text-brand font-bold shadow-sm' 
                    : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border text-slate-500 hover:border-slate-350 dark:hover:border-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
                      ep.method === 'GET' ? 'bg-emerald-500/10 text-success' :
                      ep.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-warning'
                    }`}>{ep.method}</span>
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-200">{ep.path}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug font-medium">{ep.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Request/Response Terminal */}
        <div className="xl:col-span-2 bg-[#0c101a] border border-slate-800 rounded-premium p-5 text-xs text-slate-350 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">Terminal Exec Console</span>
              <div className="flex items-center space-x-4 font-mono text-[10px] text-slate-400">
                <span>Auth: <span className="text-amber-500">{current.auth}</span></span>
                <span>Latency: <span className="text-emerald-500 font-bold">{latency}ms</span></span>
              </div>
            </div>

            {/* Request Block if Post/Patch */}
            {current.request && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold font-mono text-slate-500 uppercase">Request payload (JSON)</span>
                <pre className="p-3 bg-[#080b12] border border-slate-900 rounded font-mono text-[10.5px] text-slate-300 overflow-x-auto">
                  {JSON.stringify(current.request, null, 2)}
                </pre>
              </div>
            )}

            {/* Response Block */}
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold font-mono text-slate-500 uppercase">Response JSON</span>
                <span className="text-[9px] bg-emerald-500/10 text-success border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">200 OK</span>
              </div>
              <pre className="p-4 bg-[#080b12] border border-slate-900 rounded font-mono text-[10.5px] text-emerald-400 overflow-x-auto min-h-[150px]">
                {isExecuting ? '// Processing secure HTTP connection...' : JSON.stringify(current.response, null, 2)}
              </pre>
            </div>
          </div>

          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="w-full bg-brand hover:bg-brand-600 text-white font-bold text-xs py-2.5 rounded shadow-lg shadow-brand-500/15 transition-all mt-4 font-mono uppercase tracking-wider"
          >
            {isExecuting ? 'Request Sent...' : 'Execute Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. SYSTEM HEALTH PAGE
export const SystemHealthPage = () => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Platform Health Monitor</h2>
        <p className="text-xs text-slate-400 mt-1">Audit active API latencies, CPU core indexes, and memory workloads across the cluster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          { label: 'Uptime', val: '34d 12h 4m', desc: 'No system halts' },
          { label: 'CPU load', val: '24%', desc: '6 Cores online' },
          { label: 'Memory allocation', val: '4.2 GB / 8 GB', desc: 'Garbage Collection: 14ms' },
          { label: 'Network throughput', val: '43.2 MB/s', desc: 'Bandwidth utilization: 18%' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-4 rounded-premium shadow-sm flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
            <div className="mt-3">
              <span className="text-xl font-black text-slate-800 dark:text-white font-headline">{stat.val}</span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Services health logs */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-850 dark:text-slate-100 uppercase tracking-wider border-b pb-2 border-slate-100 dark:border-dark-border/40">Connected Clusters Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-medium">
          {[
            { name: 'WebSocket Event Gateway', status: 'Connected', ping: '12ms', details: 'Socket.IO V4 connection active' },
            { name: 'PostgreSQL Relational DB', status: 'Optimal', ping: '2ms', details: 'Write latency: 1.8ms' },
            { name: 'Redis Cache Layer', status: 'Optimal', ping: '0.8ms', details: 'Hit Rate: 98.4%' },
            { name: 'SMS Pager Dispatcher', status: 'Optimal', ping: '140ms', details: 'Firebase Cloud Messaging active' },
            { name: 'Google Maps Transit Matrix', status: 'Optimal', ping: '98ms', details: 'ETA matrix recalculated successfully' }
          ].map((service, idx) => (
            <div key={idx} className="p-3.5 border border-slate-100 dark:border-dark-border/40 rounded bg-slate-50/50 dark:bg-slate-900/10 flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block">{service.name}</span>
                <span className="text-[10px] text-slate-400 mt-1 block font-semibold">{service.details}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] bg-emerald-500/10 text-success border border-emerald-500/20 px-2 py-0.2 rounded font-bold uppercase block">{service.status}</span>
                <span className="text-[9px] font-mono text-slate-400 block mt-1.5">{service.ping} ping</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. ARCHITECTURE PAGE
export const ArchitecturePage = () => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Technical Architecture Layout</h2>
        <p className="text-xs text-slate-400 mt-1">Audit edge CDNs, NestJS Gateway layers, database replicas, and SMS dispatch connectors.</p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm flex flex-col items-center">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-4 w-full">Edge to Database Tier Schematic</span>
        
        {/* SVG schematic mapping layout */}
        <div className="w-full bg-slate-50 dark:bg-[#0c1220] rounded border p-4 flex items-center justify-center shadow-inner">
          <svg viewBox="0 0 800 450" className="w-full max-w-3xl overflow-visible text-slate-600 dark:text-slate-400">
            {/* Box definition helper */}
            <defs>
              <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Edge client layer */}
            <rect x="50" y="30" width="160" height="60" rx="6" fill="url(#boxGrad)" stroke="#3B82F6" strokeWidth="1.5" />
            <text x="130" y="55" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-100">React Edge Client</text>
            <text x="130" y="75" textAnchor="middle" className="text-[9px] fill-slate-400">Vite / Tailwind CSS (v3)</text>

            <line x1="210" y1="60" x2="290" y2="60" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3,3" />
            <polygon points="290,60 282,56 282,64" fill="#3B82F6" />

            {/* API gateway router layer */}
            <rect x="290" y="30" width="180" height="60" rx="6" fill="url(#boxGrad)" stroke="#3B82F6" strokeWidth="1.5" />
            <text x="380" y="55" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-100">AWS API Gateway</text>
            <text x="380" y="75" textAnchor="middle" className="text-[9px] fill-slate-400">JWT Authenticator router</text>

            {/* NestJS Layer */}
            <rect x="290" y="150" width="180" height="70" rx="6" fill="url(#boxGrad)" stroke="#8B5CF6" strokeWidth="1.5" />
            <text x="380" y="175" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-100">NestJS Core Backend</text>
            <text x="380" y="195" textAnchor="middle" className="text-[9px] fill-slate-450">Socket.IO Gateway channels</text>

            <line x1="380" y1="90" x2="380" y2="150" stroke="#8B5CF6" strokeWidth="1.5" />
            <polygon points="380,150 376,142 384,142" fill="#8B5CF6" />

            {/* Engines cluster (Emergency, Conflict) */}
            <rect x="560" y="150" width="190" height="70" rx="6" fill="url(#boxGrad)" stroke="#EC4899" strokeWidth="1.5" />
            <text x="655" y="175" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-100">AI Coordinator Engine</text>
            <text x="655" y="195" textAnchor="middle" className="text-[9px] fill-slate-450">Conflict Audit & Pager Dispatch</text>

            <line x1="470" y1="185" x2="560" y2="185" stroke="#EC4899" strokeWidth="1.5" />
            <polygon points="560,185 552,181 552,189" fill="#EC4899" />

            {/* Database replicas */}
            <rect x="290" y="290" width="180" height="60" rx="6" fill="url(#boxGrad)" stroke="#10B981" strokeWidth="1.5" />
            <text x="380" y="315" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-100">PostgreSQL Replica</text>
            <text x="380" y="335" textAnchor="middle" className="text-[9px] fill-slate-400">AWS Aurora Multi-AZ</text>

            <line x1="380" y1="220" x2="380" y2="290" stroke="#10B981" strokeWidth="1.5" />
            <polygon points="380,290 376,282 384,282" fill="#10B981" />

            {/* Redis cache */}
            <rect x="60" y="150" width="160" height="70" rx="6" fill="url(#boxGrad)" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="140" y="175" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-100">Redis Cache Stack</text>
            <text x="140" y="195" textAnchor="middle" className="text-[9px] fill-slate-400">Session store & socket rooms</text>

            <line x1="290" y1="185" x2="220" y2="185" stroke="#F59E0B" strokeWidth="1.5" />
            <polygon points="220,185 228,181 228,189" fill="#F59E0B" />

            {/* Firebase integrations */}
            <rect x="560" y="290" width="190" height="60" rx="6" fill="url(#boxGrad)" stroke="#06B6D4" strokeWidth="1.5" />
            <text x="655" y="315" textAnchor="middle" className="text-xs font-bold fill-slate-800 dark:fill-slate-100">Firebase Broadcaster</text>
            <text x="655" y="335" textAnchor="middle" className="text-[9px] fill-slate-400">SMS Ring-outs & FCM pagers</text>

            <line x1="655" y1="220" x2="655" y2="290" stroke="#06B6D4" strokeWidth="1.5" />
            <polygon points="655,290 651,282 659,282" fill="#06B6D4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// 5. PERFORMANCE METRICS PAGE
export const PerformancePage = () => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Simulated Performance Benchmarks</h2>
        <p className="text-xs text-slate-400 mt-1">Audit dashboard compilation speeds, conflict detection engine times, and REST endpoint response latencies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Core Benchmarks List */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-805 dark:text-slate-100 uppercase tracking-wider mb-2">Engine Latency Diagnostics</h3>
          <div className="space-y-3.5 text-xs font-medium">
            {[
              { name: 'Dashboard load compiling', val: '120ms', target: 'under 200ms', pct: 98 },
              { name: 'Conflict detection pass', val: '4ms', target: 'under 10ms', pct: 99 },
              { name: 'AI matching ranking search', val: '12ms', target: 'under 50ms', pct: 96 },
              { name: 'Transit travel ETA update matrix', val: '8ms', target: 'under 25ms', pct: 97 },
              { name: 'REST endpoints mean latency', val: '14ms', target: 'under 40ms', pct: 98 }
            ].map((perf, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 border border-slate-50 dark:border-dark-border/40 rounded bg-slate-50/20 dark:bg-slate-900/5">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-200 block">{perf.name}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Performance target: {perf.target}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-brand text-sm block font-headline">{perf.val}</span>
                  <span className="text-[9px] text-emerald-500 font-semibold uppercase">{perf.pct}% SLA</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load Distribution chart mock */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-805 dark:text-slate-100 uppercase tracking-wider mb-3">WebSocket load concurrency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track concurrency scaling diagnostics of concurrent hospital desks subscribing to live en-route transit updates.
            </p>
          </div>
          <div className="h-40 bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-dark-border/40 rounded flex items-center justify-center text-xs text-slate-400 font-bold uppercase mt-4">
            CONCURRENCY LOAD CHART ACTIVE
          </div>
        </div>

      </div>
    </div>
  );
};

// 6. IMMUTABLE AUDIT TRAIL LEDGER
export const AuditTrailPage = () => {
  const { audits } = useApp();
  const [filterAction, setFilterAction] = useState('All');

  const filtered = filterAction === 'All' 
    ? audits 
    : audits.filter(a => a.action.toLowerCase().includes(filterAction.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in text-left font-sans">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Immutable Cryptographic Audit Trail</h2>
          <p className="text-xs text-slate-400 mt-1">SHA-256 block ledger logging actor signatures, Node checkpoints, previous/new states, IP headers, and browser devices.</p>
        </div>
        <select 
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-xs rounded p-2 focus:outline-none"
        >
          <option value="All">All Operations</option>
          <option value="Role">Role Swaps</option>
          <option value="Status">Doctor Status</option>
          <option value="Emergency">Emergency SOS</option>
          <option value="Appointment">Appointments</option>
          <option value="Handoff">Patient Handoffs</option>
          <option value="Flag">Feature Flags</option>
        </select>
      </div>

      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium shadow-sm overflow-hidden">
        <div className="overflow-x-auto text-[11px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border/40 text-slate-405 font-bold uppercase bg-slate-50/50 dark:bg-slate-900/10">
                <th className="p-3">Time</th>
                <th className="p-3">Actor / Role</th>
                <th className="p-3">Node Location</th>
                <th className="p-3">Action logged</th>
                <th className="p-3">Previous State</th>
                <th className="p-3">New State</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Device Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-dark-border/30">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/15 transition-colors">
                  <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                  <td className="p-3">
                    <span className="font-bold text-slate-700 dark:text-slate-200 block">{log.actor}</span>
                    <span className="text-[9px] text-slate-400 font-semibold uppercase">{log.role}</span>
                  </td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{log.hospital}</td>
                  <td className="p-3 font-bold text-brand">{log.action}</td>
                  <td className="p-3 font-mono text-slate-400 max-w-[120px] truncate" title={log.prevVal}>{log.prevVal}</td>
                  <td className="p-3 font-mono text-slate-650 dark:text-slate-300 max-w-[120px] truncate font-bold" title={log.newVal}>{log.newVal}</td>
                  <td className="p-3 font-mono text-slate-450">{log.ip}</td>
                  <td className="p-3 text-slate-450 truncate max-w-[150px]" title={log.device}>{log.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 7. FEATURE FLAGS MANAGEMENT PAGE
export const FeatureFlagsPage = () => {
  const { featureFlags, toggleFeatureFlag } = useApp();

  const flagsInfo = [
    { key: 'emergencyDispatch', label: 'Emergency Dispatch SOS', desc: 'Allows receptionists to trigger Code Blue ultrasonic pager alerts network-wide.' },
    { key: 'doctorTracking', label: 'Live Doctor GPS Tracking', desc: 'Enables real-time location coordinate updates and moving map markers.' },
    { key: 'liveStatus', label: 'Presence Status Rotator', desc: 'Permits the background simulation to toggle doctor availability periodically.' },
    { key: 'aiRanking', label: 'AI Specialist Rationale ranking', desc: 'Forces the emergency dispatcher to sort matching specialists by suitability score.' },
    { key: 'reliabilityScore', label: 'Punctuality Reliability Score', desc: 'Aggregates overall punctuality history and prints it on analytics cards.' },
    { key: 'analytics', label: 'Platform Executive Analytics', desc: 'Enables analytics calculation and performance trend charts.' },
    { key: 'notifications', label: 'Live Notifications feed', desc: 'Permits toast alerts and system notifications logs to run.' },
    { key: 'maps', label: 'Google Maps Transit Overlay', desc: 'Renders en-route commute lines and vector outlines on the live India map.' }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left font-sans">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Feature Flag Operations Center</h2>
        <p className="text-xs text-slate-400 mt-1">Enable, disable, or roll back workspace operations in real-time. Toggling directly alters active simulation state.</p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {flagsInfo.map(flag => (
            <div key={flag.key} className="p-4 border border-slate-100 dark:border-dark-border/40 rounded-premium hover:bg-slate-50/50 dark:hover:bg-[#131926] transition-colors flex items-center justify-between">
              <div className="pr-4 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm block">{flag.label}</span>
                <span className="text-[10.5px] text-slate-450 dark:text-slate-450 block leading-normal">{flag.desc}</span>
              </div>
              
              {/* Slider Toggle */}
              <button
                onClick={() => toggleFeatureFlag(flag.key)}
                className={`w-10 h-6 rounded-full p-0.5 shrink-0 transition-colors duration-200 ease-in-out relative flex items-center ${
                  featureFlags[flag.key] ? 'bg-brand' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                    featureFlags[flag.key] ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

