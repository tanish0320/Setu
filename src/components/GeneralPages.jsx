import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart } from './SvgCharts';

// 1. Appointments Page
export const AppointmentsPage = () => {
  const { appointments, doctors, hospitals } = useApp();
  
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="border-b border-slate-200 dark:border-dark-border pb-4">
        <h2 className="text-xl font-bold font-headline text-slate-800 dark:text-white">Active Consultation Appointments</h2>
        <p className="text-xs text-slate-400 mt-1">Global schedule overview for registered patients across independent nodes.</p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-premium shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border/40 text-slate-400 font-bold uppercase bg-slate-50/50 dark:bg-slate-900/10">
                <th className="p-3">Patient</th>
                <th className="p-3">Specialist</th>
                <th className="p-3">Hospital Center</th>
                <th className="p-3">Schedule Slot</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-dark-border/30">
              {appointments.map(appt => {
                const doc = doctors.find(d => d.id === appt.doctorId);
                const hosp = hospitals.find(h => h.id === appt.hospitalId);
                return (
                  <tr key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15">
                    <td className="p-3 font-semibold text-slate-700 dark:text-slate-200">
                      {appt.patientName} <span className="text-[10px] text-slate-400 font-normal">({appt.age}y/{appt.gender})</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{doc?.name || 'Specialist'}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{hosp?.shortName || 'Clinic'}</td>
                    <td className="p-3 font-mono text-slate-500">{appt.date} {appt.time}</td>
                    <td className="p-3 text-slate-400">{appt.department}</td>
                    <td className="p-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        appt.status === 'Completed' ? 'bg-emerald-500/10 text-success' : 'bg-brand-500/10 text-brand'
                      }`}>{appt.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
