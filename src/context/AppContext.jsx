import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Core static lists for generator
const INDIAN_FIRST_NAMES = [
  'Aarav', 'Aditya', 'Amit', 'Anil', 'Arjun', 'Dev', 'Hari', 'Kabir', 'Karan', 'Manish',
  'Nikhil', 'Pranav', 'Rajesh', 'Rohan', 'Sanjay', 'Suresh', 'Vikram', 'Vijay', 'Vivek', 'Abhishek',
  'Priya', 'Sneha', 'Ananya', 'Deepa', 'Sunita', 'Meera', 'Pooja', 'Divya', 'Neha', 'Ritu',
  'Kiran', 'Shweta', 'Tanvi', 'Anjali', 'Kavita', 'Aditi', 'Preeti', 'Swati', 'Aisha', 'Nisha'
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Patel', 'Verma', 'Reddy', 'Malhotra', 'Sen', 'Gupta', 'Nair', 'Iyer', 'Kapoor',
  'Mehta', 'Joshi', 'Bose', 'Roy', 'Rao', 'Krishnan', 'Deshmukh', 'Dubey', 'Trivedi', 'Pandey',
  'Sinha', 'Choudhury', 'Gill', 'Kulkarni', 'Naidu', 'Menon', 'Bhat', 'Prasad', 'Mishra', 'Saxena'
];

const SPECIALTIES = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Surgery', 'Oncology'];

const CITIES = [
  { name: 'Delhi', x: 150, y: 60 },
  { name: 'Mumbai', x: 100, y: 150 },
  { name: 'Chennai', x: 170, y: 200 },
  { name: 'Bangalore', x: 150, y: 190 },
  { name: 'Hyderabad', x: 160, y: 150 },
  { name: 'Kolkata', x: 240, y: 110 },
  { name: 'Pune', x: 110, y: 160 },
  { name: 'Kochi', x: 140, y: 210 },
  { name: 'Ahmedabad', x: 90, y: 110 },
  { name: 'Jaipur', x: 130, y: 80 },
  { name: 'Lucknow', x: 180, y: 70 },
  { name: 'Patna', x: 220, y: 80 },
  { name: 'Guwahati', x: 280, y: 80 },
  { name: 'Srinagar', x: 130, y: 20 },
  { name: 'Chandigarh', x: 145, y: 45 },
  { name: 'Bhopal', x: 150, y: 110 },
  { name: 'Bhubaneswar', x: 215, y: 130 },
  { name: 'Visakhapatnam', x: 190, y: 155 },
  { name: 'Coimbatore', x: 145, y: 205 },
  { name: 'Indore', x: 135, y: 115 }
];

// Procedural Generators
const generateHospitals = () => {
  const brands = ['Apollo', 'Fortis', 'Max', 'Manipal', 'Narayana Health', 'Tata Memorial', 'Medanta', 'Kokilaben', 'Global', 'Kauvery'];
  return CITIES.map((city, idx) => {
    const brand = brands[idx % brands.length];
    const name = `${brand} Hospital, ${city.name}`;
    const colors = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#14B8A6'];
    return {
      id: `h${idx + 1}`,
      name,
      shortName: `${brand} ${city.name}`,
      city: city.name,
      x: city.x,
      y: city.y,
      color: colors[idx % colors.length],
      distance: parseFloat((2.0 + (idx * 0.4)).toFixed(1)),
      status: 'Active',
      coordinators: (idx % 3) + 2
    };
  });
};

const HOSPITALS = generateHospitals();

const generateDoctors = () => {
  const docs = [];
  for (let i = 1; i <= 200; i++) {
    const fName = INDIAN_FIRST_NAMES[i % INDIAN_FIRST_NAMES.length];
    const lName = INDIAN_LAST_NAMES[(i * 3) % INDIAN_LAST_NAMES.length];
    const specialty = SPECIALTIES[i % SPECIALTIES.length];
    const currentHospIdx = i % HOSPITALS.length;
    const nextHospIdx = (i + 3) % HOSPITALS.length;
    
    // Status distribution
    const statuses = ['Available', 'Consulting', 'In Transit', 'On Break', 'Offline'];
    const status = i === 1 ? 'Consulting' : statuses[i % statuses.length];
    
    docs.push({
      id: `d${i}`,
      name: `Dr. ${fName} ${lName}`,
      specialty,
      avatar: `https://images.unsplash.com/photo-${1550000000000 + (i * 200000)}?w=150` || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
      status,
      currentHospitalId: HOSPITALS[currentHospIdx].id,
      nextHospitalId: HOSPITALS[nextHospIdx].id,
      upcomingAppointmentTime: `${10 + (i % 8)}:00`,
      experience: 8 + (i % 18),
      travelRadius: 5 + (i % 20),
      skills: [`${specialty} Procedures`, 'Clinical Research', 'Critical Care Care'],
      reliability: {
        overall: 80 + (i % 20),
        onTime: 82 + (i % 18),
        emergencyResponse: 85 + (i % 15),
        appointmentCompletion: 88 + (i % 12),
        availabilityAccuracy: 84 + (i % 16),
        history: [80 + (i%15), 82 + (i%15), 85 + (i%12), 87 + (i%12), 89 + (i%10), 90 + (i%10)]
      },
      workload: ['Low', 'Medium', 'High', 'Max'][i % 4],
      utilization: 40 + (i % 55),
      noShows: i % 4,
      phone: `+91 98765 ${String(10000 + i).slice(1)}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}@setu.in`,
      // Map Coordinates tracking
      x: HOSPITALS[currentHospIdx].x,
      y: HOSPITALS[currentHospIdx].y,
      progress: 0 // COMMUTE TRANSIT %
    });
  }
  return docs;
};

const DOCTORS = generateDoctors();

const generatePatients = () => {
  const pats = [];
  for (let i = 1; i <= 1000; i++) {
    const fName = INDIAN_FIRST_NAMES[(i * 2) % INDIAN_FIRST_NAMES.length];
    const lName = INDIAN_LAST_NAMES[(i * 4) % INDIAN_LAST_NAMES.length];
    pats.push({
      id: `p${i}`,
      name: `${fName} ${lName}`,
      age: 18 + (i % 68),
      gender: i % 2 === 0 ? 'M' : 'F',
      phone: `+91 97654 ${String(10000 + i).slice(1)}`
    });
  }
  return pats;
};

const PATIENTS = generatePatients();

const generateAppointments = () => {
  const appts = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  
  for (let i = 1; i <= 5000; i++) {
    const patientIdx = i % PATIENTS.length;
    const doctorIdx = (i * 2) % DOCTORS.length;
    const hospIdx = (i * 3) % HOSPITALS.length;
    const day = days[i % days.length];
    const time = times[i % times.length];
    
    appts.push({
      id: `a${i}`,
      patientName: PATIENTS[patientIdx].name,
      age: PATIENTS[patientIdx].age,
      gender: PATIENTS[patientIdx].gender,
      doctorId: DOCTORS[doctorIdx].id,
      hospitalId: HOSPITALS[hospIdx].id,
      time,
      date: day,
      department: DOCTORS[doctorIdx].specialty,
      status: i % 10 === 0 ? 'Pending' : 'Completed'
    });
  }
  return appts;
};

const APPOINTMENTS = generateAppointments();

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState('Receptionist');
  const [activePage, setActivePage] = useState('dashboard');
  
  const [selectedHospital, setSelectedHospital] = useState(HOSPITALS[0]);
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);
  const [selectedProfileDoctorId, setSelectedProfileDoctorId] = useState(DOCTORS[0].id);
  
  const [doctors, setDoctors] = useState(DOCTORS);
  const [hospitals, setHospitals] = useState(HOSPITALS);
  const [appointments, setAppointments] = useState(APPOINTMENTS);
  const [patients] = useState(PATIENTS);
  
  // Structured handoffs database
  const [handoffs, setHandoffs] = useState([
    {
      id: 'hnd1',
      patientName: 'Aarav Mehta',
      age: 42,
      gender: 'M',
      chiefComplaint: 'Atypical chest tightness, radiating to left shoulder.',
      diagnosis: 'Acute coronary syndrome resolved with angioplasty.',
      treatment: 'Dual antiplatelet loading, coronary angiography.',
      medications: 'Aspirin 75mg QD, Atorvastatin 40mg HS.',
      followUp: 'Stress Echo in 2 weeks.',
      doctorId: 'd1',
      doctorName: DOCTORS[0].name,
      hospitalId: 'h1',
      hospitalName: HOSPITALS[0].name,
      date: '2026-07-12'
    }
  ]);
  
  const [audits, setAudits] = useState([
    { id: 'aud-01', timestamp: '23:01:10', action: 'Auth Token Refreshed', user: 'system', details: 'Session key rotation successful' }
  ]);
  
  const [tickets, setTickets] = useState([
    { id: 'tic-01', title: 'Fortis Pager Sync Latency', severity: 'High', status: 'In Review', node: 'Fortis Chennai', time: '10m ago' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'System Healthy', message: 'All channels operational. SMS gate ping: 24ms.', type: 'info', time: '10m ago', read: false }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Emergency SOS State
  const [activeSOS, setActiveSOS] = useState(null);
  const [sosCountdown, setSosCountdown] = useState(0);
  const [rankedDoctors, setRankedDoctors] = useState([]);
  const [sosStep, setSosStep] = useState(1);

  // Scheduling Overrides Log
  const [overrides, setOverrides] = useState([]);

  // WOW Demo State Layer
  const [judgeModeActive, setJudgeModeActive] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoNarrative, setDemoNarrative] = useState('');
  const [demoSpeed, setDemoSpeed] = useState(1); // Speed multiplier: 1x, 2x, 5x, 10x
  const [demoPaused, setDemoPaused] = useState(false);

  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState({
    emergencyDispatch: true,
    doctorTracking: true,
    liveStatus: true,
    aiRanking: true,
    reliabilityScore: true,
    analytics: true,
    notifications: true,
    maps: true
  });

  // Log audit helper
  const logAudit = (action, actor = 'System', actorRole = 'system', hospital = 'Global Cluster', prevVal = 'N/A', newVal = 'N/A') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const randomIp = `192.168.1.${100 + Math.floor(Math.random() * 50)}`;
    const devices = ['Chrome / Windows 11', 'Safari / iPadOS', 'MacBook Pro / Chrome', 'iPhone / Safari Mobile', 'Edge / Windows 10'];
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];

    const newLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: time,
      action,
      actor,
      role: actorRole,
      hospital,
      prevVal,
      newVal,
      ip: randomIp,
      device: randomDevice
    };

    setAudits(prev => [newLog, ...prev].slice(0, 100));
  };

  const handleSetRole = (newRole) => {
    logAudit('Security Role Swapped', 'User Session', role, selectedHospital?.shortName || 'Global Cluster', role, newRole);
    setRole(newRole);
  };

  const toggleFeatureFlag = (key) => {
    const prev = featureFlags[key] ? 'Enabled' : 'Disabled';
    const next = !featureFlags[key] ? 'Enabled' : 'Disabled';
    setFeatureFlags(curr => ({ ...curr, [key]: !curr[key] }));
    logAudit('Feature Flag Changed', 'Super Admin', role, selectedHospital?.shortName || 'Global Cluster', prev, next);
  };

  // Add Notification helper
  const addNotification = (title, message, type = 'info') => {
    if (!featureFlags.notifications) return;
    setNotifications(prev => [
      { id: `n-${Date.now()}`, title, message, type, time: 'Just now', read: false },
      ...prev
    ].slice(0, 30));
  };

  // Real-Time Simulator Loop (Runs every 4 seconds)
  useEffect(() => {
    if (demoActive) return; // Disable standard simulation when WOW demo is active

    const interval = setInterval(() => {
      // 1. Randomly flip a doctor status
      if (featureFlags.liveStatus) {
        const targetDocIdx = Math.floor(Math.random() * doctors.length);
        const statuses = ['Available', 'Consulting', 'On Break'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        setDoctors(prev => prev.map((d, idx) => {
          if (idx === targetDocIdx && d.status !== 'Emergency') {
            // If state changed, trigger notification
            if (d.status !== newStatus) {
              addNotification(`${d.name} Status Changed`, `Presence set to ${newStatus} at ${HOSPITALS.find(h=>h.id === d.currentHospitalId)?.shortName}.`, 'info');
              logAudit('Doctor Status Swapped', d.name, d.specialty, HOSPITALS.find(h=>h.id === d.currentHospitalId)?.shortName || 'Global', d.status, newStatus);
            }
            return { ...d, status: newStatus };
          }
          return d;
        }));
      }

      // 2. Animate minor transit updates on the map
      if (featureFlags.doctorTracking) {
        setDoctors(prev => prev.map(d => {
          if (d.status === 'In Transit' || d.status === 'Emergency') {
            const nextH = HOSPITALS.find(h => h.id === d.nextHospitalId);
            if (nextH) {
              let nextProgress = d.progress + (5 * demoSpeed);
              if (nextProgress >= 100) {
                // Arrived
                nextProgress = 0;
                const arrivedStatus = d.status === 'Emergency' ? 'Emergency' : 'Available';
                logAudit('Doctor Node Arrived', d.name, d.specialty, nextH.shortName, 'In Transit', arrivedStatus);
                addNotification('Physician Arrived', `${d.name} has completed commute to ${nextH.shortName}.`, 'success');
                return { 
                  ...d, 
                  status: arrivedStatus,
                  currentHospitalId: d.nextHospitalId, 
                  x: nextH.x, 
                  y: nextH.y, 
                  progress: 0 
                };
              } else {
                // Interpolate coordinates
                const currH = HOSPITALS.find(h => h.id === d.currentHospitalId) || HOSPITALS[0];
                const curX = currH.x + ((nextH.x - currH.x) * nextProgress) / 100;
                const curY = currH.y + ((nextH.y - currH.y) * nextProgress) / 100;
                return { ...d, progress: nextProgress, x: curX, y: curY };
              }
            }
          }
          return d;
        }));
      }

    }, 4000);

    return () => clearInterval(interval);
  }, [doctors, demoActive, demoSpeed, featureFlags]);

  // SOS Countdown Timer
  useEffect(() => {
    let interval = null;
    if (activeSOS && activeSOS.status === 'Accepted' && sosCountdown > 0) {
      interval = setInterval(() => {
        setSosCountdown(prev => {
          const stepVal = 1 * demoSpeed;
          if (prev <= stepVal) {
            clearInterval(interval);
            // Complete SOS simulation
            setActiveSOS(current => {
              if (current) {
                const updated = { ...current, status: 'Completed' };
                setDoctors(docs => docs.map(d => d.id === current.doctor.id ? { ...d, status: 'Available', currentHospitalId: current.hospitalId, progress: 0, x: HOSPITALS.find(h=>h.id === current.hospitalId)?.x, y: HOSPITALS.find(h=>h.id === current.hospitalId)?.y } : d));
                setSosStep(7); // Checkpoint arrived
                
                // Compile automatic patient handoff note
                const newNote = {
                  id: `hnd-${Date.now()}`,
                  patientName: 'Aarav Mehta',
                  age: 42,
                  gender: 'M',
                  chiefComplaint: `Urgent Code Blue ${current.specialty} distress`,
                  diagnosis: `${current.specialty} emergency resolved post specialist arrival`,
                  treatment: 'Critical care protocol established',
                  medications: 'Aspirin / Emergency IV lines loader',
                  followUp: '24h ICU monitoring',
                  doctorId: current.doctor.id,
                  doctorName: current.doctor.name,
                  hospitalId: current.hospitalId,
                  hospitalName: HOSPITALS.find(h => h.id === current.hospitalId)?.name || 'Independent Clinic',
                  date: new Date().toISOString().split('T')[0]
                };
                setHandoffs(prevNotes => [newNote, ...prevNotes]);

                addNotification('SOS Arrived Checkpoint', `${current.doctor.name} has checked in. Incident resolved.`, 'success');
                logAudit('SOS Arrived', current.doctor.name, `Arrived at ${HOSPITALS.find(h => h.id === current.hospitalId)?.shortName}. Handoff profile compiled.`);
                
                if (demoActive) {
                  setDemoStep(6); // Progress WOW demo
                }
                return updated;
              }
              return null;
            });
            return 0;
          }
          
          // Animate doctor coordinates along path
          const docRef = current.doctor;
          const targetH = HOSPITALS.find(h => h.id === current.hospitalId);
          const startH = HOSPITALS.find(h => h.id === docRef.currentHospitalId) || HOSPITALS[0];
          
          if (targetH) {
            const elapsed = 45 - (prev - stepVal);
            const prg = Math.min(100, Math.round((elapsed / 45) * 100));
            
            setDoctors(docs => docs.map(d => {
              if (d.id === docRef.id) {
                const cX = startH.x + ((targetH.x - startH.x) * prg) / 100;
                const cY = startH.y + ((targetH.y - startH.y) * prg) / 100;
                return { ...d, progress: prg, x: cX, y: cY };
              }
              return d;
            }));
          }

          return prev - stepVal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSOS, sosCountdown, demoActive, demoSpeed]);

  // WOW Demo Simulation Timeline Engine
  useEffect(() => {
    if (!demoActive || demoPaused) return;

    let timeout = null;
    const duration = 8000 / demoSpeed; // Speed controls duration

    switch (demoStep) {
      case 1:
        setDemoNarrative('Story Phase 1: Dr. Rajesh Sharma is currently busy in consultation in Delhi.');
        setRole('Doctor');
        setActivePage('dashboard');
        // Reset doctor status to Consulting
        setDoctors(prev => prev.map(d => d.id === 'd1' ? { ...d, status: 'Consulting', currentHospitalId: 'h1', x: HOSPITALS[0].x, y: HOSPITALS[0].y, progress: 0 } : d));
        
        timeout = setTimeout(() => {
          setDemoStep(2);
        }, duration);
        break;
      
      case 2:
        setDemoNarrative('Story Phase 2: Code Blue Emergency SOS triggered at Apollo Chennai node. Ringing pagers...');
        setRole('Receptionist');
        setActivePage('emergency');
        dispatchSOS('Cardiology', 'Critical', 'h3'); // trigger Cardiology SOS at Chennai node
        
        timeout = setTimeout(() => {
          setDemoStep(3);
        }, duration);
        break;
      
      case 3:
        setDemoNarrative('Story Phase 3: AI Engine ranks matching doctors. Ringing pagers active...');
        triggerDoctorNotification(); // Starts step 4 pager broadast
        
        timeout = setTimeout(() => {
          setDemoStep(4);
        }, duration);
        break;
      
      case 4:
        setDemoNarrative('Story Phase 4: Dr. Rajesh Sharma accepts the emergency from Delhi node.');
        setRole('Doctor');
        acceptSOS('d1'); // Dr. Rajesh Sharma accepts SOS
        
        timeout = setTimeout(() => {
          setDemoStep(5);
        }, duration);
        break;
      
      case 5:
        setDemoNarrative('Story Phase 5: Commute Transit active. Tracking coordinates on the Live India Map.');
        setRole('Receptionist');
        setActivePage('emergency');
        
        // Let the en-route timer resolve. It triggers Step 6 (arrived) in countdown
        break;

      case 6:
        setDemoNarrative('Story Phase 6: Specialist arrived. Structured Patient Handoff compiled. Coordination resolved!');
        setRole('Hospital Admin');
        setActivePage('dashboard');
        
        timeout = setTimeout(() => {
          setDemoActive(false);
          setDemoStep(0);
          setDemoNarrative('');
          alert('WOW Demo Storyboard completed successfully!');
        }, duration + 3000);
        break;

      default:
        break;
    }

    return () => clearTimeout(timeout);
  }, [demoActive, demoStep, demoSpeed, demoPaused]);

  const startWowDemo = () => {
    cancelSOS();
    setDemoActive(true);
    setDemoStep(1);
    setDemoPaused(false);
  };

  const stopWowDemo = () => {
    setDemoActive(false);
    setDemoStep(0);
    setDemoPaused(false);
    setDemoNarrative('');
    cancelSOS();
  };

  const stepForward = () => {
    if (demoStep < 6) {
      setDemoStep(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    if (demoStep > 1) {
      setDemoStep(prev => prev - 1);
    }
  };

  // Rank Doctors Algorithm
  const rankDoctors = (specialty, reqHospitalId) => {
    const reqHospital = HOSPITALS.find(h => h.id === reqHospitalId);
    if (!reqHospital) return [];

    return doctors
      .filter(doc => doc.specialty.toLowerCase() === specialty.toLowerCase())
      .map(doc => {
        let availabilityScore = 0;
        if (doc.status === 'Available') availabilityScore = 100;
        else if (doc.status === 'In Transit') availabilityScore = 80;
        else if (doc.status === 'Consulting') availabilityScore = 60;
        else if (doc.status === 'On Break') availabilityScore = 40;
        else if (doc.status === 'Emergency') availabilityScore = 20;
        else if (doc.status === 'Offline') availabilityScore = 0;

        let workloadScore = 100;
        if (doc.workload === 'Low') workloadScore = 100;
        else if (doc.workload === 'Medium') workloadScore = 80;
        else if (doc.workload === 'High') workloadScore = 50;
        else if (doc.workload === 'Max') workloadScore = 20;

        const isAtSameHospital = doc.currentHospitalId === reqHospitalId;
        const currentHospital = HOSPITALS.find(h => h.id === doc.currentHospitalId);
        
        // Commute distance weights
        const distance = isAtSameHospital ? 0 : (currentHospital ? Math.abs(currentHospital.distance - reqHospital.distance) : 4.0);
        const distanceScore = Math.max(0, 100 - (distance * 15));
        const estimatedETA = isAtSameHospital ? 2 : Math.round(distance * 3.5 + 4);

        const reliabilityScore = doc.reliability.overall;

        const matchScore = Math.round(
          (availabilityScore * 0.40) +
          (distanceScore * 0.30) +
          (reliabilityScore * 0.20) +
          (workloadScore * 0.10)
        );

        // Explanatory breakdown
        let reason = `Located at same clinic node (${reqHospital.shortName}). Zero transit time.`;
        if (!isAtSameHospital) {
          reason = `Commute transit coordinates gap: ${distance.toFixed(1)} km. Commute ETA: ~${estimatedETA} mins.`;
        }
        if (doc.status !== 'Available') {
          reason += ` Currently ${doc.status}.`;
        }

        return {
          ...doc,
          matchScore,
          distance: parseFloat(distance.toFixed(1)),
          estimatedETA,
          isAtSameHospital,
          rankingExplanation: reason
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  // Dispatch SOS request
  const dispatchSOS = (specialty, urgency, targetHospitalId) => {
    const list = rankDoctors(specialty, targetHospitalId);
    
    const request = {
      id: `sos-${Date.now()}`,
      specialty,
      urgency,
      hospitalId: targetHospitalId,
      status: 'Dispatched',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      escalationTimeline: [
        { time: '0s', label: 'SOS Broadcast Triggered', status: 'completed' },
        { time: '15s', label: 'SMS & Pager Alerts Dispatched', status: 'completed' },
        { time: '1m', label: 'Secondary Ring Out System Active', status: 'pending' },
        { time: '3m', label: 'Clinical Director Escalate Escalation', status: 'pending' }
      ]
    };

    setActiveSOS(request);
    setRankedDoctors(list);
    setSosStep(3);
    
    addNotification(
      `🚨 Critical SOS: ${specialty}`,
      `Emergency dispatch initiated at ${HOSPITALS.find(h => h.id === targetHospitalId)?.name}. Searching for specialists.`,
      'danger'
    );

    logAudit('SOS Broadcast', `receptionist_${targetHospitalId}`, `Dispatched ${urgency} SOS for ${specialty}`);
  };

  // Trigger step 4: Notify Doctors
  const triggerDoctorNotification = () => {
    setSosStep(4);
    addNotification('SOS Broadcaster active', 'Specialist pagers and phone alerts ringing.', 'warning');
    logAudit('SOS Pager Broadcast', 'system', 'Alert pager channels active for matching specialists');
  };

  // Accept SOS
  const acceptSOS = (docId) => {
    if (!activeSOS) return;

    const doctor = doctors.find(d => d.id === docId);
    if (!doctor) return;

    const countdownSecs = 45; 
    
    setDoctors(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'Emergency',
          nextHospitalId: activeSOS.hospitalId,
          progress: 0
        };
      }
      return d;
    }));

    setActiveSOS(prev => ({
      ...prev,
      status: 'Accepted',
      doctor: doctor,
      eta: `${Math.round(countdownSecs / 10) + 1} mins`,
      escalationTimeline: [
        { time: '0s', label: 'SOS Broadcast Triggered', status: 'completed' },
        { time: '12s', label: `Accepted by ${doctor.name}`, status: 'completed' },
        { time: 'In Transit', label: `Doctor en-route (ETA: ~5 mins)`, status: 'active' },
        { time: 'Arrival', label: 'Awaiting checkpoint confirmation', status: 'pending' }
      ]
    }));

    setSosCountdown(countdownSecs);
    setSosStep(5);
    
    setTimeout(() => {
      setSosStep(6);
    }, 1500 / demoSpeed);

    addNotification(
      'SOS Accepted',
      `${doctor.name} has accepted the SOS. ETA: 5 mins.`,
      'success'
    );

    logAudit('SOS Accepted', doctor.name, `En-route to ${HOSPITALS.find(h => h.id === activeSOS.hospitalId)?.name}`);
  };

  // Cancel SOS
  const cancelSOS = () => {
    if (!activeSOS) return;
    
    if (activeSOS.doctor) {
      setDoctors(prev => prev.map(d => d.id === activeSOS.doctor.id ? { ...d, status: 'Available', progress: 0, x: HOSPITALS.find(h=>h.id === d.currentHospitalId)?.x, y: HOSPITALS.find(h=>h.id === d.currentHospitalId)?.y } : d));
    }

    setActiveSOS(null);
    setSosCountdown(0);
    setRankedDoctors([]);
    setSosStep(1);
    
    addNotification('SOS Cancelled', 'Emergency request was retracted.', 'info');
    logAudit('SOS Cancelled', 'receptionist_sys', 'Emergency dispatch retracted manually.');
  };

  // Change Doctor Status
  const changeDoctorStatus = (docId, newStatus) => {
    setDoctors(prev => prev.map(d => {
      if (d.id === docId) {
        logAudit('Status Changed', d.name, `Status updated to ${newStatus}`);
        addNotification(`${d.name} Updated`, `Presence changed to ${newStatus}.`, 'info');
        return { ...d, status: newStatus };
      }
      return d;
    }));
  };

  // Conflict override logger
  const overrideConflict = (appointmentId, reason) => {
    setOverrides(prev => [...prev, { id: `ov-${Date.now()}`, appointmentId, reason, timestamp: new Date().toLocaleTimeString() }]);
    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, warning: null, overridden: true } : a));
    logAudit('Conflict Overridden', 'system', `Appointment ${appointmentId} override approved: ${reason}`);
    addNotification('Scheduling Overridden', `Conflict bypass authorized: ${reason}`, 'warning');
  };

  // Book Appointment
  const bookAppointment = (appointmentData) => {
    const { patientName, age, gender, doctorId, hospitalId, date, time, department } = appointmentData;
    
    const conflictResult = detectScheduleConflict(doctorId, hospitalId, date, time);
    
    const newAppointment = {
      id: `a-${Date.now()}`,
      patientName,
      age: parseInt(age),
      gender,
      doctorId,
      hospitalId,
      time,
      date,
      department,
      status: 'Pending',
      warning: conflictResult.hasConflict ? conflictResult.message : null
    };

    setAppointments(prev => [newAppointment, ...prev]);
    
    const docName = doctors.find(d => d.id === doctorId)?.name || 'Doctor';
    const hospName = hospitals.find(h => h.id === hospitalId)?.name || 'Hospital';

    if (conflictResult.hasConflict) {
      addNotification(
        '⚠️ Appointment Warning',
        `Booked with conflict: ${conflictResult.message}`,
        'warning'
      );
      logAudit('Appt Overlap Warning', 'scheduler_sys', `Booked ${patientName} with ${docName} - Conflict: ${conflictResult.message}`);
    } else {
      addNotification(
        'Appointment Confirmed',
        `Successfully booked ${patientName} with ${docName} at ${hospName}.`,
        'success'
      );
      logAudit('Appt Booked', 'scheduler_sys', `Booked ${patientName} with ${docName} at ${hospName} for ${date} ${time}`);
    }
  };

  // Move Appointment
  const moveAppointment = (apptId, newTime, newDate) => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === apptId) {
        const conflictResult = detectScheduleConflict(appt.doctorId, appt.hospitalId, newDate || appt.date, newTime);
        const docName = doctors.find(d => d.id === appt.doctorId)?.name || 'Doctor';
        
        logAudit('Appt Rescheduled', 'scheduler_sys', `Moved ${appt.patientName} to ${newDate || appt.date} ${newTime}`);
        
        return {
          ...appt,
          time: newTime,
          date: newDate || appt.date,
          warning: conflictResult.hasConflict ? conflictResult.message : null
        };
      }
      return appt;
    }));
  };

  // Conflict detection including travel time buffer
  const detectScheduleConflict = (doctorId, targetHospitalId, date, time) => {
    const parseTimeToMins = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const targetMins = parseTimeToMins(time);
    const targetHosp = HOSPITALS.find(h => h.id === targetHospitalId);

    const doctorAppts = appointments.filter(a => a.doctorId === doctorId && a.date === date && a.status !== 'Cancelled');
    
    for (const appt of doctorAppts) {
      const apptMins = parseTimeToMins(appt.time);
      const diff = Math.abs(targetMins - apptMins);

      if (appt.hospitalId === targetHospitalId) {
        if (diff < 30) {
          return {
            hasConflict: true,
            message: `Overlaps with appointment for ${appt.patientName} at ${appt.time} (Requires 30m slot duration).`
          };
        }
      } else {
        const otherHosp = HOSPITALS.find(h => h.id === appt.hospitalId);
        const distance = Math.abs(targetHosp.distance - otherHosp.distance);
        const travelTimeMinutes = Math.round(distance * 3.5 + 10);

        const requiredGap = 30 + travelTimeMinutes;
        if (diff < requiredGap) {
          return {
            hasConflict: true,
            message: `Commute buffer violation: Commute takes ~${travelTimeMinutes} mins between ${targetHosp.shortName} and ${otherHosp.shortName} (Current gap: ${diff} mins).`
          };
        }
      }
    }

    return { hasConflict: false };
  };

  // Smart suggestions
  const getSmartSlotSuggestions = (doctorId, targetHospitalId, date) => {
    const preferredSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    const suggestions = [];

    for (const slot of preferredSlots) {
      const conflict = detectScheduleConflict(doctorId, targetHospitalId, date, slot);
      if (!conflict.hasConflict) {
        suggestions.push(slot);
      }
      if (suggestions.length >= 3) break;
    }

    if (suggestions.length === 0) {
      const doctorAppts = appointments.filter(a => a.doctorId === doctorId && a.date === date);
      if (doctorAppts.length > 0) {
        const sorted = [...doctorAppts].sort((a, b) => a.time.localeCompare(b.time));
        const lastAppt = sorted[sorted.length - 1];
        const [h, m] = lastAppt.time.split(':').map(Number);
        
        let newH = h;
        let newM = m + 45;
        if (newM >= 60) {
          newH += 1;
          newM -= 60;
        }
        const suggestedTime = `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
        suggestions.push(suggestedTime);
      } else {
        suggestions.push('10:30', '14:15');
      }
    }

    return suggestions;
  };

  const addHandoffNote = (noteData) => {
    const { patientName, age, gender, chiefComplaint, diagnosis, treatment, medications, followUp, doctorId, hospitalId } = noteData;
    
    const doc = doctors.find(d => d.id === doctorId);
    const hosp = HOSPITALS.find(h => h.id === hospitalId);

    const newHandoff = {
      id: `hnd-${Date.now()}`,
      patientName,
      age: parseInt(age),
      gender,
      chiefComplaint,
      diagnosis,
      treatment,
      medications,
      followUp,
      doctorId,
      doctorName: doc ? doc.name : 'Unknown Specialist',
      hospitalId,
      hospitalName: hosp ? hosp.name : 'Independent Clinic',
      date: new Date().toISOString().split('T')[0]
    };

    setHandoffs(prev => [newHandoff, ...prev]);
    addNotification(
      'Handoff Notes Locked',
      `Patient handoff record compiled for ${patientName} by ${doc?.name || 'Specialist'}.`,
      'info'
    );
    logAudit('Handoff Synced', doc?.name || 'system', `Compiled and synced ${patientName}'s clinical profile.`);
  };

  return (
    <AppContext.Provider value={{
      role, setRole: handleSetRole,
      activePage, setActivePage,
      selectedHospital, setSelectedHospital,
      selectedDoctor, setSelectedDoctor,
      selectedProfileDoctorId, setSelectedProfileDoctorId,
      doctors, setDoctors,
      hospitals, setHospitals,
      appointments, setAppointments,
      patients,
      handoffs, setHandoffs,
      notifications, setNotifications,
      audits, logAudit,
      tickets, setTickets,
      overrides, overrideConflict,
      searchQuery, setSearchQuery,
      activeSOS, sosCountdown, rankedDoctors,
      sosStep, setSosStep, triggerDoctorNotification,
      dispatchSOS, acceptSOS, cancelSOS,
      changeDoctorStatus,
      bookAppointment, moveAppointment,
      detectScheduleConflict,
      getSmartSlotSuggestions,
      addHandoffNote,
      // Feature Flags
      featureFlags, toggleFeatureFlag,
      // WOW Demo
      demoActive, demoStep, demoNarrative, demoSpeed, setDemoSpeed,
      demoPaused, setDemoPaused,
      startWowDemo, stopWowDemo, stepForward, stepBackward,
      judgeModeActive, setJudgeModeActive
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
