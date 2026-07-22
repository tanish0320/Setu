import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// ==========================================
// 1. MASTER REALISTIC DATA CONSTANTS & ARRAYS
// ==========================================

export const ALL_SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'General Surgery',
  'Plastic Surgery',
  'Emergency Medicine',
  'Internal Medicine',
  'Pediatrics',
  'ENT',
  'Urology',
  'Nephrology',
  'Oncology',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Anesthesiology',
  'Critical Care',
  'Obstetrics',
  'Gynecology',
  'Dermatology',
  'Ophthalmology',
  'Gastroenterology',
  'Endocrinology',
  'Neurosurgery',
  'Cardiothoracic Surgery'
];

export const DOCTOR_STATUSES = [
  'Available',
  'Busy',
  'In Surgery',
  'On Call',
  'Travelling',
  'Emergency Response',
  'Consultation',
  'Off Duty',
  'Break'
];

export const CONSULTATION_TYPES = [
  'Physical',
  'Virtual',
  'Emergency',
  'Follow-up',
  'Post-op Review',
  'Pre-op Assessment',
  'Second Opinion',
  'Ward Round',
  'ICU Review',
  'Teleconsultation'
];

export const CONSULTATION_DURATIONS = ['20 min', '30 min', '45 min', '60 min', '90 min'];
export const COMMUTE_TIMES = [5, 8, 12, 17, 25, 35, 45];

export const EMERGENCY_CONDITIONS = [
  'Road Traffic Accident',
  'Acute MI',
  'Stroke',
  'Polytrauma',
  'Fracture Femur',
  'Pediatric Seizure',
  'Burn Injury',
  'Poisoning',
  'Respiratory Distress',
  'Head Injury',
  'Cardiac Arrest',
  'Snake Bite',
  'Pregnancy Emergency',
  'Renal Failure',
  'Appendicitis',
  'GI Bleed'
];

export const EMERGENCY_SEVERITIES = ['Critical', 'High', 'Moderate', 'Low', 'Stable'];
export const DISPATCH_STATUSES = ['Closed', 'Preparing', 'Incoming', 'Doctor Assigned', 'Patient Arrived'];

export const REAL_HOSPITALS_CONFIG = [
  { id: 'h1', name: 'Apollo Hospital, Delhi', code: 'APL-DEL', shortName: 'Apollo Delhi', city: 'Delhi', type: 'Private Super Speciality', color: '#2563EB', x: 150, y: 60, dist: 2.1, cap: 'Trauma Center Level 1 & Comprehensive Cardiac', beds: 450, icu: 90, occ: 88, phone: '+91 11 2692 5858' },
  { id: 'h2', name: 'Fortis Hospital, Mumbai', code: 'FRT-MUM', shortName: 'Fortis Mumbai', city: 'Mumbai', type: 'Private Multi-Speciality', color: '#10B981', x: 100, y: 150, dist: 3.4, cap: 'Neuro & Cardiac Emergency Care', beds: 380, icu: 75, occ: 82, phone: '+91 22 6799 4444' },
  { id: 'h3', name: 'Manipal Hospital, Bengaluru', code: 'MAN-BLR', shortName: 'Manipal Bengaluru', city: 'Bengaluru', type: 'Private Quaternary Care', color: '#8B5CF6', x: 150, y: 190, dist: 4.0, cap: 'Comprehensive Organ Transplant & Emergency', beds: 600, icu: 120, occ: 91, phone: '+91 80 2502 4444' },
  { id: 'h4', name: 'Narayana Health, Bengaluru', code: 'NH-BLR', shortName: 'Narayana Health', city: 'Bengaluru', type: 'Specialty Cardiac & Care', color: '#F59E0B', x: 155, y: 195, dist: 5.2, cap: 'Advanced Cardiac & Vascular Surgery', beds: 1000, icu: 200, occ: 85, phone: '+91 80 7122 2222' },
  { id: 'h5', name: 'Aster CMI Hospital, Bengaluru', code: 'AST-BLR', shortName: 'Aster CMI', city: 'Bengaluru', type: 'Private Quaternary Care', color: '#06B6D4', x: 145, y: 185, dist: 6.1, cap: 'Pediatric ICU & Polytrauma Care', beds: 500, icu: 85, occ: 79, phone: '+91 80 4342 0100' },
  { id: 'h6', name: 'Max Super Speciality Hospital, Delhi', code: 'MAX-DEL', shortName: 'Max Delhi', city: 'Delhi', type: 'Private Super Speciality', color: '#EC4899', x: 155, y: 65, dist: 2.8, cap: 'Stroke Unit & Oncology Emergency', beds: 520, icu: 110, occ: 89, phone: '+91 11 2651 5050' },
  { id: 'h7', name: 'Medanta - The Medicity, Gurugram', code: 'MED-GUR', shortName: 'Medanta Gurugram', city: 'Gurugram', type: 'Private Multi-Super Speciality', color: '#EF4444', x: 145, y: 68, dist: 7.5, cap: 'Multi-Organ Transplant & Level 1 Trauma', beds: 1250, icu: 300, occ: 93, phone: '+91 124 414 1414' },
  { id: 'h8', name: 'AIIMS, New Delhi', code: 'AIIMS-DEL', shortName: 'AIIMS Delhi', city: 'Delhi', type: 'Government Apex Institute', color: '#14B8A6', x: 150, y: 62, dist: 1.5, cap: 'Apex National Emergency & Medical Research', beds: 2400, icu: 450, occ: 98, phone: '+91 11 2658 8500' },
  { id: 'h9', name: 'KIMS Hospital, Hyderabad', code: 'KIMS-HYD', shortName: 'KIMS Hyderabad', city: 'Hyderabad', type: 'Private Super Speciality', color: '#6366F1', x: 160, y: 150, dist: 4.8, cap: 'Cardiothoracic & Gastro Emergency', beds: 750, icu: 140, occ: 86, phone: '+91 40 4488 5000' },
  { id: 'h10', name: 'Yashoda Hospital, Hyderabad', code: 'YSH-HYD', shortName: 'Yashoda Hyderabad', city: 'Hyderabad', type: 'Private Multi-Speciality', color: '#D97706', x: 165, y: 155, dist: 5.9, cap: 'Neuro-Critical Care & Emergency Surgery', beds: 650, icu: 115, occ: 84, phone: '+91 40 4567 4567' },
  { id: 'h11', name: 'Kauvery Hospital, Chennai', code: 'KVR-MAA', shortName: 'Kauvery Chennai', city: 'Chennai', type: 'Private Tertiary Care', color: '#059669', x: 170, y: 200, dist: 3.9, cap: 'Geriatric & Cardiac Rapid Response', beds: 350, icu: 65, occ: 78, phone: '+91 44 4000 6000' },
  { id: 'h12', name: 'Sri Ramachandra Medical Centre, Chennai', code: 'SRMC-MAA', shortName: 'Sri Ramachandra', city: 'Chennai', type: 'Private Academic Center', color: '#7C3AED', x: 175, y: 205, dist: 8.2, cap: 'Academic Medical Emergency Unit', beds: 800, icu: 160, occ: 87, phone: '+91 44 4592 8500' },
  { id: 'h13', name: 'Ruby Hall Clinic, Pune', code: 'RHC-PUN', shortName: 'Ruby Hall Pune', city: 'Pune', type: 'Private Multi-Speciality', color: '#DC2626', x: 110, y: 160, dist: 4.1, cap: 'Advanced Burn Care & Trauma Unit', beds: 550, icu: 95, occ: 81, phone: '+91 20 6645 5100' },
  { id: 'h14', name: 'Lilavati Hospital, Mumbai', code: 'LVT-MUM', shortName: 'Lilavati Mumbai', city: 'Mumbai', type: 'Private Multi-Speciality', color: '#0284C7', x: 102, y: 152, dist: 2.9, cap: 'Polytrauma & Neonatal ICU', beds: 320, icu: 60, occ: 89, phone: '+91 22 2675 1000' },
  { id: 'h15', name: 'Jaslok Hospital, Mumbai', code: 'JSL-MUM', shortName: 'Jaslok Mumbai', city: 'Mumbai', type: 'Private Ultra-Speciality', color: '#9333EA', x: 98, y: 148, dist: 3.1, cap: 'Oncology & Radiation Emergency', beds: 360, icu: 70, occ: 83, phone: '+91 22 6657 3010' },
  { id: 'h16', name: "Rainbow Children's Hospital, Hyderabad", code: 'RCH-HYD', shortName: "Rainbow Children's", city: 'Hyderabad', type: 'Specialty Pediatric & Perinatal', color: '#F43F5E', x: 162, y: 152, dist: 6.4, cap: 'Dedicated Pediatric & Perinatal ICU', beds: 250, icu: 80, occ: 76, phone: '+91 40 4242 0000' },
  { id: 'h17', name: "St. John's Medical College Hospital, Bengaluru", code: 'STJ-BLR', shortName: "St. John's Bengaluru", city: 'Bengaluru', type: 'Charitable Medical Institute', color: '#0D9488', x: 148, y: 192, dist: 4.5, cap: 'Community Trauma & Infectious Emergency', beds: 1350, icu: 210, occ: 90, phone: '+91 80 2206 5000' },
  { id: 'h18', name: 'CMC, Vellore', code: 'CMC-VEL', shortName: 'CMC Vellore', city: 'Vellore', type: 'Non-Profit Quaternary Care', color: '#B45309', x: 165, y: 195, dist: 12.0, cap: 'National Referral Apex Trauma Center', beds: 3000, icu: 500, occ: 96, phone: '+91 416 228 1000' },
  { id: 'h19', name: 'NIMHANS, Bengaluru', code: 'NIMH-BLR', shortName: 'NIMHANS Bengaluru', city: 'Bengaluru', type: 'Government Apex Neuroscience', color: '#4F46E5', x: 152, y: 188, dist: 3.8, cap: 'National Apex Neuro-Trauma & Psychiatry', beds: 1000, icu: 180, occ: 94, phone: '+91 80 2699 5000' },
  { id: 'h20', name: 'Sakra World Hospital, Bengaluru', code: 'SKR-BLR', shortName: 'Sakra World', city: 'Bengaluru', type: 'Indo-Japanese Super Speciality', color: '#E11D48', x: 154, y: 194, dist: 5.8, cap: 'Robotic Surgery & Advanced Spine Care', beds: 350, icu: 70, occ: 80, phone: '+91 80 4969 4969' }
];

export const UNIQUE_DOCTOR_NAMES = [
  'Dr. Priya Sharma', 'Dr. Arjun Menon', 'Dr. Rahul Desai', 'Dr. Sneha Kulkarni', 'Dr. Vikram Iyer',
  'Dr. Ananya Rao', 'Dr. Meera Kapoor', 'Dr. Karan Singh', 'Dr. Ishita Verma', 'Dr. Aditya Nair',
  'Dr. Nidhi Joshi', 'Dr. Rohit Gupta', 'Dr. Kavya Reddy', 'Dr. Rohan Patil', 'Dr. Pooja Thomas',
  'Dr. Sanjay Bhatt', 'Dr. Ritu Saxena', 'Dr. Abhay Kulkarni', 'Dr. Deepa Trivedi', 'Dr. Manish Joshi',
  'Dr. Swati Deshmukh', 'Dr. Tanvi Hegde', 'Dr. Siddharth Sengupta', 'Dr. Neha Pillai', 'Dr. Vivek Choudhury',
  'Dr. Sunita Bannerjee', 'Dr. Nikhil Agarwal', 'Dr. Aisha Siddiqui', 'Dr. Rajesh Sharma', 'Dr. Vijay Anand',
  'Dr. Anjali Mehta', 'Dr. Divya Chawla', 'Dr. Preeti Gill', 'Dr. Suresh Prasad', 'Dr. Pranav Rao',
  'Dr. Kiran Nambiar', 'Dr. Abhishek Bose', 'Dr. Priyanka Das', 'Dr. Harish Malhotra', 'Dr. Fatima Begum',
  'Dr. Gurpreet Kaur', 'Dr. Venkatesh Iyer', 'Dr. Ramesh Chandra', 'Dr. Subhashini Rao', 'Dr. Lakshmi Narayan',
  'Dr. Savitri Devi', 'Dr. Mohammad Owais', 'Dr. Varun Sundaram', 'Dr. Smita Saxena', 'Dr. Alok Mukhopadhyay',
  'Dr. Vandana Hegde', 'Dr. Chetan Nambiar', 'Dr. Swetha Narayanan', 'Dr. Gaurav Solanki', 'Dr. Shweta Pandian',
  'Dr. Nitin Kaushik', 'Dr. Radhika Subhash', 'Dr. Utkarsh Mishra', 'Dr. Jyoti Swaroop', 'Dr. Hemant Kadam',
  'Dr. Shruti Gokhale', 'Dr. Tarun Sen', 'Dr. Archana Pillai', 'Dr. Sameer Wagle', 'Dr. Bina Kak',
  'Dr. Devendra Somani', 'Dr. Sonali Phadke', 'Dr. Rajiv Nanda', 'Dr. Shalini Unnikrishnan', 'Dr. Sandeep Parikh',
  'Dr. Upasana Dutt', 'Dr. Bhaskar Roy', 'Dr. Pallavi Godbole', 'Dr. Madhav Acharya', 'Dr. Leena Varkey',
  'Dr. Tushar Merchant', 'Dr. Gauri Shinde', 'Dr. Sumeet Ahuja', 'Dr. Farhan Rizvi', 'Dr. Namrata Chhabra',
  'Dr. Chirag Thacker', 'Dr. Indrani Sen', 'Dr. Vasudev Namboodiri', 'Dr. Kirti Singhania', 'Dr. Ashish Parekh'
];

export const UNIQUE_PATIENT_NAMES = [
  'Aarav Shah', 'Vihaan Mehta', 'Meera Nair', 'Anjali Singh', 'Riya Kapoor',
  'Kabir Rao', 'Zoya Khan', 'Ayaan Sheikh', 'Dev Patel', 'Nisha Menon',
  'Arnav Gupta', 'Tanvi Kulkarni', 'Reyansh Verma', 'Ishaan Thomas', 'Siddharth Roy',
  'Diya Joshi', 'Samar Bhatia', 'Avani Pillai', 'Kabir Chawla', 'Tarun Sengupta',
  'Priyanka Das', 'Harish Malhotra', 'Fatima Begum', 'Gurpreet Kaur', 'Venkatesh Iyer',
  'Ramesh Chandra', 'Subhashini Rao', 'Lakshmi Narayan', 'Savitri Devi', 'Mohammad Owais',
  'Varun Sundaram', 'Smita Saxena', 'Alok Mukhopadhyay', 'Vandana Hegde', 'Chetan Nambiar',
  'Swetha Narayanan', 'Gaurav Solanki', 'Shweta Pandian', 'Nitin Kaushik', 'Radhika Subhash',
  'Utkarsh Mishra', 'Jyoti Swaroop', 'Hemant Kadam', 'Shruti Gokhale', 'Tarun Sen',
  'Archana Pillai', 'Sameer Wagle', 'Bina Kak', 'Devendra Somani', 'Sonali Phadke',
  'Rajiv Nanda', 'Shalini Unnikrishnan', 'Sandeep Parikh', 'Upasana Dutt', 'Bhaskar Roy',
  'Pallavi Godbole', 'Madhav Acharya', 'Leena Varkey', 'Tushar Merchant', 'Gauri Shinde',
  'Sumeet Ahuja', 'Farhan Rizvi', 'Namrata Chhabra', 'Chirag Thacker', 'Indrani Sen',
  'Vasudev Namboodiri', 'Kirti Singhania', 'Ashish Parekh', 'Navya Shrinivas', 'Pradeep Shenoy',
  'Chitra Mohan', 'Ranganathan Pillai', 'Sulochana Rao', 'Karthik Subbaraman', 'Deepak Mazumdar',
  'Anuradha Bose', 'Gautam Singhal', 'Preeti Bhalla', 'Vikas Mahajan', 'Sudhir Kulkarni',
  'Sowmya Krishnan', 'Jiten Solanki', 'Richa Malhotra', 'Bhavna Parekh', 'Manohar Shetty',
  'Girish Nambiar', 'Shubhangi Deshpande', 'Suresh Gopinath', 'Kamal Jeet', 'Nalini Sundaram',
  'Pankaj Tripathi', 'Rashmi Devadiga', 'Sunil Kumar', 'Manju Bala', 'Satish Kamat',
  'Savita Joshi', 'Anand Kulkarni', 'Latha Venkatesh', 'Mahesh Hegde', 'Padma Iyer',
  'Raghavendra Rao', 'Usha Sharma', 'Vishnu Nair', 'Yashwant Patil', 'Zeenat Parveen',
  'Amrita Roy', 'Brijesh Pandey', 'Chaitanya Prabhu', 'Dhananjay Phadke', 'Ekta Mittal',
  'Ganesh Shinde', 'Himanshu Saxena', 'Ira Singhania', 'Jayant Thapar', 'Kavita Subramanian',
  'Lokesh Agarwal', 'Minakshi Trivedi', 'Narendra Chawla', 'Om Prakash', 'Parul Rastogi',
  'Quasim Ali', 'Rachna Merchant', 'Suraj Bhan', 'Trupti Salunkhe', 'Uma Shankar',
  'Vandana Nair', 'Wasim Akram', 'Yamini Sen', 'Zakir Hussain', 'Aadhya Varma',
  'Bhavin Shah', 'Charu Lata', 'Divyansh Jha', 'Elango Sethupathi', 'Falguni Pathak',
  'Giridhar Gopal', 'Hema Malini', 'Inderjeet Singh', 'Jainish Mehta', 'Komal Preet',
  'Lavanya Pillai', 'Mihir Merchant', 'Nirupama Sen', 'Ojasvi Kulkarni', 'Prashant Shetty'
];

export const AMBULANCE_UNITS = [
  { id: 'amb-1', name: 'ALS-12', type: 'Advanced Life Support', crew: 'Paramedic Ramesh Kumar & Driver Satish Patil', location: 'Indiranagar Hub, Bengaluru', eta: '6 mins', status: 'Available', phone: '+91 98450 11223' },
  { id: 'amb-2', name: 'ALS-08', type: 'Advanced Life Support', crew: 'Paramedic Divya Nair & Driver Suresh B.', location: 'HAL Old Airport Rd, Bengaluru', eta: '8 mins', status: 'Dispatched', phone: '+91 98450 22334' },
  { id: 'amb-3', name: 'BLS-03', type: 'Basic Life Support', crew: 'Paramedic Amit V. & Driver Ganesh P.', location: 'Koramanagla 8th Block, Bengaluru', eta: '12 mins', status: 'Available', phone: '+91 98450 33445' },
  { id: 'amb-4', name: 'Medic-21', type: 'Cardiac Intensive Unit', crew: 'Dr. Arjun M. & Paramedic Sneha R.', location: 'Richmond Circle, Bengaluru', eta: '5 mins', status: 'Patient Arrived', phone: '+91 98450 44556' },
  { id: 'amb-5', name: 'Rescue-07', type: 'Neonatal & Pediatric Care', crew: 'Paramedic Kavita S. & Driver Rajesh K.', location: 'Whitefield Main Rd, Bengaluru', eta: '15 mins', status: 'Incoming', phone: '+91 98450 55667' },
  { id: 'amb-6', name: 'EMS-14', type: 'Trauma Response Ambulance', crew: 'Paramedic Chetan S. & Driver Mahesh G.', location: 'Hebbal Flyover, Bengaluru', eta: '9 mins', status: 'Preparing', phone: '+91 98450 66778' },
  { id: 'amb-7', name: 'CityCare-09', type: 'Advanced Life Support', crew: 'Paramedic Meera D. & Driver Prakash N.', location: 'MG Road, Bengaluru', eta: '7 mins', status: 'Available', phone: '+91 98450 77889' },
  { id: 'amb-8', name: '108 Unit-24', type: 'State Emergency Services', crew: 'Paramedic Vijay K. & Driver Sunil M.', location: 'Electronic City Phase 1, Bengaluru', eta: '11 mins', status: 'Closed', phone: '+91 98450 88990' }
];

// ==========================================
// 2. PROCEDURAL GENERATOR UTILITIES
// ==========================================

const generateHospitals = () => REAL_HOSPITALS_CONFIG;

const generateDoctors = () => {
  const docs = [];
  const total = UNIQUE_DOCTOR_NAMES.length; // 85 doctors

  for (let i = 0; i < total; i++) {
    const name = UNIQUE_DOCTOR_NAMES[i];
    const specialty = ALL_SPECIALTIES[i % ALL_SPECIALTIES.length];
    const hospital = REAL_HOSPITALS_CONFIG[i % REAL_HOSPITALS_CONFIG.length];
    const nextHospital = REAL_HOSPITALS_CONFIG[(i + 3) % REAL_HOSPITALS_CONFIG.length];
    
    // Status distribution
    const status = i === 0 ? 'Consultation' : DOCTOR_STATUSES[i % DOCTOR_STATUSES.length];
    
    const workloads = ['Low', 'Medium', 'High', 'Max'];
    const workload = workloads[i % workloads.length];
    
    docs.push({
      id: `d${i + 1}`,
      name,
      specialty,
      avatar: `https://images.unsplash.com/photo-${1550000000000 + (i * 180000)}?w=150` || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150',
      status,
      currentHospitalId: hospital.id,
      nextHospitalId: nextHospital.id,
      upcomingAppointmentTime: `${8 + (i % 10)}:${(i % 2 === 0 ? '15' : '45')}`,
      experience: 6 + (i % 24),
      travelRadius: 10 + (i % 25),
      skills: [`${specialty} Procedures`, 'Emergency Triage', 'Critical Care Protocols'],
      reliability: {
        overall: 82 + (i % 18),
        onTime: 80 + (i % 19),
        emergencyResponse: 85 + (i % 15),
        appointmentCompletion: 88 + (i % 12),
        availabilityAccuracy: 84 + (i % 16),
        history: [80 + (i%15), 83 + (i%15), 86 + (i%12), 88 + (i%12), 90 + (i%9), 92 + (i%8)]
      },
      workload,
      utilization: 45 + (i % 50),
      noShows: i % 3,
      phone: `+91 98765 ${String(10000 + i).slice(1)}`,
      email: `${name.replace('Dr. ', '').toLowerCase().replace(/\s+/g, '.')}@setu.health.in`,
      x: hospital.x,
      y: hospital.y,
      progress: 0
    });
  }
  return docs;
};

const generatePatients = () => {
  const pats = [];
  const total = UNIQUE_PATIENT_NAMES.length; // 150+ patients
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  for (let i = 0; i < total; i++) {
    const name = UNIQUE_PATIENT_NAMES[i];
    
    // Age distribution: infants (0-2), children (3-12), teens (13-19), adults (20-59), seniors (60-90)
    let age;
    if (i % 10 === 0) age = 1 + (i % 2);
    else if (i % 10 === 1) age = 4 + (i % 8);
    else if (i % 10 === 2) age = 14 + (i % 5);
    else if (i % 2 === 0) age = 22 + (i % 36);
    else age = 60 + (i % 30);

    const gender = i % 2 === 0 ? 'M' : 'F';
    const mrn = `MRN-${100000 + i * 37}`;
    const blood = bloodGroups[i % bloodGroups.length];
    const condition = EMERGENCY_CONDITIONS[i % EMERGENCY_CONDITIONS.length];
    const severity = EMERGENCY_SEVERITIES[i % EMERGENCY_SEVERITIES.length];

    pats.push({
      id: `p${i + 1}`,
      name,
      age,
      gender,
      mrn,
      bloodGroup: blood,
      phone: `+91 97654 ${String(10000 + i).slice(1)}`,
      emergencyContact: `+91 98111 ${String(20000 + i).slice(1)}`,
      condition,
      severity,
      hospitalId: REAL_HOSPITALS_CONFIG[i % REAL_HOSPITALS_CONFIG.length].id
    });
  }
  return pats;
};

const generateAppointments = (doctors, hospitals, patients) => {
  const appts = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['08:15', '09:00', '09:30', '10:45', '11:20', '13:00', '14:15', '15:40', '17:30', '18:00'];
  
  let apptCounter = 1;
  
  // Generate 800+ realistic consultations across Monday-Saturday
  for (let dIdx = 0; dIdx < doctors.length; dIdx++) {
    const doc = doctors[dIdx];
    
    for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
      const day = days[dayIdx];
      // Random number of appointments per day: between 2 and 8
      const countForDay = 2 + ((dIdx * 3 + dayIdx * 7) % 7); 
      
      for (let slotIdx = 0; slotIdx < countForDay; slotIdx++) {
        const time = timeSlots[(slotIdx + dIdx) % timeSlots.length];
        const pat = patients[(apptCounter * 5) % patients.length];
        const hosp = hospitals[(dIdx + slotIdx) % hospitals.length];
        const type = CONSULTATION_TYPES[apptCounter % CONSULTATION_TYPES.length];
        const duration = CONSULTATION_DURATIONS[apptCounter % CONSULTATION_DURATIONS.length];
        const commute = COMMUTE_TIMES[apptCounter % COMMUTE_TIMES.length];

        const hasConflict = (slotIdx === 1 && dIdx % 4 === 0);

        appts.push({
          id: `a${apptCounter}`,
          patientName: pat.name,
          age: pat.age,
          gender: pat.gender,
          doctorId: doc.id,
          doctorName: doc.name,
          hospitalId: hosp.id,
          hospitalName: hosp.shortName,
          time,
          date: day,
          department: doc.specialty,
          type,
          duration,
          commuteTime: `${commute} mins`,
          status: apptCounter % 8 === 0 ? 'Pending' : 'Completed',
          warning: hasConflict ? `Commute buffer alert: Requires ~${commute}m transit gap from ${hosp.shortName}.` : null
        });

        apptCounter++;
      }
    }
  }

  return appts;
};

const generateEmergencyDispatches = (hospitals, doctors, patients) => {
  const dispatches = [];
  for (let i = 1; i <= 24; i++) {
    const hosp = hospitals[i % hospitals.length];
    const doc = doctors[i % doctors.length];
    const pat = patients[i % patients.length];
    const condition = EMERGENCY_CONDITIONS[i % EMERGENCY_CONDITIONS.length];
    const severity = EMERGENCY_SEVERITIES[i % EMERGENCY_SEVERITIES.length];
    const status = DISPATCH_STATUSES[i % DISPATCH_STATUSES.length];
    const amb = AMBULANCE_UNITS[i % AMBULANCE_UNITS.length];

    dispatches.push({
      id: `sos-${1000 + i}`,
      patientName: pat.name,
      age: pat.age,
      gender: pat.gender,
      condition,
      severity,
      hospitalId: hosp.id,
      hospitalName: hosp.shortName,
      doctorId: doc.id,
      doctorName: doc.name,
      ambulance: amb.name,
      ambulanceCrew: amb.crew,
      status,
      eta: `${4 + (i % 18)} mins`,
      timestamp: `${8 + (i % 10)}:${10 + (i % 45)}`
    });
  }
  return dispatches;
};

const generateInitialNotifications = () => [
  { id: 'n1', title: 'Emergency Accepted', message: 'Dr. Priya Sharma accepted Code Blue SOS for Acute MI at Apollo Delhi.', type: 'danger', time: '09:12', read: false },
  { id: 'n2', title: 'Patient Admitted', message: 'Patient Vihaan Mehta admitted to Trauma Bay 2 at Max Super Speciality Delhi.', type: 'info', time: '09:16', read: false },
  { id: 'n3', title: 'Consultation Completed', message: 'Dr. Arjun Menon completed Orthopedic review for Patient Meera Nair.', type: 'success', time: '09:21', read: true },
  { id: 'n4', title: 'Neurologist Assigned', message: 'Dr. Rahul Desai assigned to Acute Stroke SOS at Fortis Mumbai.', type: 'warning', time: '09:30', read: true },
  { id: 'n5', title: 'Doctor En-Route', message: 'Dr. Sneha Kulkarni travelling to Manipal Bengaluru (ETA: 12 mins).', type: 'info', time: '09:42', read: true },
  { id: 'n6', title: 'ICU Transfer Complete', message: 'Patient Aarav Shah transferred to ICU Bed 4 at Medanta Gurugram.', type: 'success', time: '10:05', read: true },
  { id: 'n7', title: 'MRI Diagnostic Ready', message: 'Brain MRI Scan results uploaded for Patient Zoya Khan at NIMHANS.', type: 'info', time: '10:22', read: true },
  { id: 'n8', title: 'Hospital Node Ready', message: 'AIIMS Delhi marked Trauma-Ready with 4 free resuscitation bays.', type: 'success', time: '10:45', read: true },
  { id: 'n9', title: 'Specialist Check-In', message: 'Dr. Vikram Iyer checked in at Kauvery Hospital, Chennai.', type: 'info', time: '11:02', read: true },
  { id: 'n10', title: 'Consultation Rescheduled', message: 'Shift slot for Patient Dev Patel moved to 14:15 at Lilavati Mumbai.', type: 'warning', time: '11:18', read: true },
  { id: 'n11', title: 'Doctor Reassigned', message: 'Dr. Karan Singh accepted Cardiac SOS reassignment from Dr. Ananya Rao.', type: 'danger', time: '11:35', read: true }
];

const generateActivityFeed = () => [
  { time: '09:12', title: 'Emergency Accepted', text: 'Emergency accepted by Dr. Priya Sharma (Apollo Delhi)', icon: 'vital_signs', type: 'danger' },
  { time: '09:16', title: 'Patient Admitted', text: 'Patient Vihaan Mehta admitted at Apollo Delhi ICU', icon: 'local_hospital', type: 'info' },
  { time: '09:21', title: 'Consultation Done', text: 'Orthopedic consultation completed by Dr. Arjun Menon', icon: 'check_circle', type: 'success' },
  { time: '09:30', title: 'Specialist Assigned', text: 'Neurologist assigned to Stroke Emergency at Fortis Mumbai', icon: 'person_add', type: 'warning' },
  { time: '09:42', title: 'Doctor Commute', text: 'Dr. Sneha Kulkarni travelling to Manipal Bengaluru (ETA: 12 mins)', icon: 'directions_car', type: 'info' },
  { time: '10:05', title: 'ICU Transfer', text: 'Patient transferred to ICU Bed 4 at Medanta Gurugram', icon: 'bed', type: 'success' },
  { time: '10:22', title: 'MRI Scans Ready', text: 'Brain MRI diagnostic uploaded for Patient Zoya Khan at NIMHANS', icon: 'biomedical', type: 'info' },
  { time: '10:45', title: 'Trauma Bay Ready', text: 'Hospital marked Trauma-Ready at AIIMS Delhi', icon: 'verified', type: 'success' },
  { time: '11:02', title: 'Doctor Arrived', text: 'Dr. Vikram Iyer checked in at Kauvery Chennai', icon: 'location_on', type: 'info' },
  { time: '11:18', title: 'Slot Rescheduled', text: 'Consultation rescheduled to 14:15 for Patient Dev Patel', icon: 'schedule', type: 'warning' },
  { time: '11:35', title: 'SOS Reassigned', text: 'Doctor declined SOS - Reassigned to Dr. Karan Singh', icon: 'swap_horiz', type: 'danger' }
];

const generateInitialAudits = () => {
  const audits = [];
  const actions = ['Auth Token Refreshed', 'Doctor Status Swapped', 'SOS Broadcast Triggered', 'Conflict Overridden', 'Patient Handoff Synced', 'Feature Flag Updated', 'Session Rotated'];
  const actors = ['Dr. Priya Sharma', 'Dr. Arjun Menon', 'Aditi Nair (Receptionist)', 'Kunal Kapoor (Admin)', 'System Core', 'Paramedic Ramesh'];
  const devices = ['Chrome / Windows 11', 'Safari / iPadOS', 'Edge / Windows 10', 'MacBook Pro / Chrome'];

  for (let i = 1; i <= 40; i++) {
    audits.push({
      id: `aud-${100 + i}`,
      timestamp: `${8 + (i % 12)}:${10 + (i % 45)}:${12 + (i % 40)}`,
      action: actions[i % actions.length],
      actor: actors[i % actors.length],
      role: i % 2 === 0 ? 'doctor' : 'receptionist',
      hospital: REAL_HOSPITALS_CONFIG[i % REAL_HOSPITALS_CONFIG.length].shortName,
      prevVal: `State_${i}`,
      newVal: `State_${i + 1}`,
      ip: `192.168.1.${100 + i}`,
      device: devices[i % devices.length]
    });
  }
  return audits;
};

const generateInitialHandoffs = (doctors, hospitals, patients) => {
  const handoffs = [];
  for (let i = 1; i <= 20; i++) {
    const doc = doctors[i % doctors.length];
    const hosp = hospitals[i % hospitals.length];
    const pat = patients[i % patients.length];
    const cond = EMERGENCY_CONDITIONS[i % EMERGENCY_CONDITIONS.length];

    handoffs.push({
      id: `hnd-${100 + i}`,
      patientName: pat.name,
      age: pat.age,
      gender: pat.gender,
      chiefComplaint: `Urgent ${cond} distress and acute pain.`,
      diagnosis: `${cond} successfully stabilized. Hemodynamics guarded.`,
      treatment: 'Emergency resuscitation, IV loading, serial lab monitoring.',
      medications: 'Aspirin 75mg QD, Atorvastatin 40mg HS, IV Saline.',
      followUp: '24h ICU observation and specialist review.',
      doctorId: doc.id,
      doctorName: doc.name,
      hospitalId: hosp.id,
      hospitalName: hosp.name,
      date: `2026-07-${10 + (i % 10)}`
    });
  }
  return handoffs;
};

// ==========================================
// 3. APP PROVIDER CONTEXT COMPONENT
// ==========================================

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState('Receptionist');
  const [activePage, setActivePage] = useState('dashboard');
  
  // Data State
  const [hospitals, setHospitals] = useState(generateHospitals());
  const [doctors, setDoctors] = useState(generateDoctors());
  const [patients] = useState(generatePatients());
  const [appointments, setAppointments] = useState(() => generateAppointments(generateDoctors(), generateHospitals(), generatePatients()));
  const [dispatches, setDispatches] = useState(() => generateEmergencyDispatches(generateHospitals(), generateDoctors(), generatePatients()));
  const [handoffs, setHandoffs] = useState(() => generateInitialHandoffs(generateDoctors(), generateHospitals(), generatePatients()));
  const [notifications, setNotifications] = useState(generateInitialNotifications());
  const [activityFeed, setActivityFeed] = useState(generateActivityFeed());
  const [audits, setAudits] = useState(generateInitialAudits());

  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [selectedProfileDoctorId, setSelectedProfileDoctorId] = useState(doctors[0].id);

  // Auto-sync selectedDoctor with doctors master array when doctor status or node changes
  useEffect(() => {
    if (selectedDoctor && doctors && doctors.length > 0) {
      const latest = doctors.find(d => d.id === selectedDoctor.id);
      if (latest && (latest.status !== selectedDoctor.status || latest.currentHospitalId !== selectedDoctor.currentHospitalId)) {
        setSelectedDoctor(latest);
      }
    }
  }, [doctors]);

  const [tickets, setTickets] = useState([
    { id: 'tic-01', title: 'Fortis Pager Sync Latency', severity: 'High', status: 'In Review', node: 'Fortis Mumbai', time: '10m ago' },
    { id: 'tic-02', title: 'AIIMS Delhi Cath Lab Queue Delay', severity: 'Critical', status: 'Investigating', node: 'AIIMS Delhi', time: '25m ago' },
    { id: 'tic-03', title: 'Apollo Delhi Commute Buffer Alert', severity: 'Moderate', status: 'Resolved', node: 'Apollo Delhi', time: '1h ago' }
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
  const [demoSpeed, setDemoSpeed] = useState(1);
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
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotifications(prev => [
      { id: `n-${Date.now()}`, title, message, type, time: timeStr, read: false },
      ...prev
    ].slice(0, 40));
  };

  // Real-Time Simulator Loop (Runs every 5 seconds)
  useEffect(() => {
    if (demoActive) return;

    const interval = setInterval(() => {
      // 1. Randomly flip a doctor status
      if (featureFlags.liveStatus) {
        const targetDocIdx = Math.floor(Math.random() * doctors.length);
        const statuses = ['Available', 'Consultation', 'Busy', 'On Break'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        setDoctors(prev => prev.map((d, idx) => {
          if (idx === targetDocIdx && d.status !== 'Emergency Response' && d.status !== 'In Surgery') {
            if (d.status !== newStatus) {
              const hospName = hospitals.find(h => h.id === d.currentHospitalId)?.shortName || 'Network Node';
              addNotification(`${d.name} Status Changed`, `Presence set to ${newStatus} at ${hospName}.`, 'info');
              logAudit('Doctor Status Swapped', d.name, d.specialty, hospName, d.status, newStatus);
            }
            return { ...d, status: newStatus };
          }
          return d;
        }));
      }

      // 2. Animate minor transit updates on the map
      if (featureFlags.doctorTracking) {
        setDoctors(prev => prev.map(d => {
          if (d.status === 'Travelling' || d.status === 'Emergency Response') {
            const nextH = hospitals.find(h => h.id === d.nextHospitalId);
            if (nextH) {
              let nextProgress = d.progress + (5 * demoSpeed);
              if (nextProgress >= 100) {
                nextProgress = 0;
                const arrivedStatus = d.status === 'Emergency Response' ? 'Emergency Response' : 'Available';
                logAudit('Doctor Node Arrived', d.name, d.specialty, nextH.shortName, 'Travelling', arrivedStatus);
                addNotification('Physician Arrived', `${d.name} completed commute to ${nextH.shortName}.`, 'success');
                return { 
                  ...d, 
                  status: arrivedStatus,
                  currentHospitalId: d.nextHospitalId, 
                  x: nextH.x, 
                  y: nextH.y, 
                  progress: 0 
                };
              } else {
                const currH = hospitals.find(h => h.id === d.currentHospitalId) || hospitals[0];
                const curX = currH.x + ((nextH.x - currH.x) * nextProgress) / 100;
                const curY = currH.y + ((nextH.y - currH.y) * nextProgress) / 100;
                return { ...d, progress: nextProgress, x: curX, y: curY };
              }
            }
          }
          return d;
        }));
      }

    }, 5000);

    return () => clearInterval(interval);
  }, [doctors, demoActive, demoSpeed, featureFlags, hospitals]);

  // SOS Countdown Timer
  useEffect(() => {
    let interval = null;
    if (activeSOS && activeSOS.status === 'Accepted' && sosCountdown > 0) {
      interval = setInterval(() => {
        setSosCountdown(prev => {
          const stepVal = 1 * demoSpeed;
          if (prev <= stepVal) {
            clearInterval(interval);
            setActiveSOS(current => {
              if (current) {
                const updated = { ...current, status: 'Completed' };
                const targetHosp = hospitals.find(h => h.id === current.hospitalId);
                
                setDoctors(docs => docs.map(d => d.id === current.doctor.id ? { ...d, status: 'Available', currentHospitalId: current.hospitalId, progress: 0, x: targetHosp?.x || d.x, y: targetHosp?.y || d.y } : d));
                setSosStep(7);
                
                const newNote = {
                  id: `hnd-${Date.now()}`,
                  patientName: 'Aarav Mehta',
                  age: 28,
                  gender: 'M',
                  chiefComplaint: `Urgent Code Blue ${current.specialty} distress`,
                  diagnosis: `${current.specialty} emergency resolved post specialist arrival`,
                  treatment: 'Critical care protocol established',
                  medications: 'Aspirin / Emergency IV lines loader',
                  followUp: '24h ICU monitoring',
                  doctorId: current.doctor.id,
                  doctorName: current.doctor.name,
                  hospitalId: current.hospitalId,
                  hospitalName: targetHosp?.name || 'Independent Clinic',
                  date: new Date().toISOString().split('T')[0]
                };
                setHandoffs(prevNotes => [newNote, ...prevNotes]);

                addNotification('SOS Arrived Checkpoint', `${current.doctor.name} checked in. Incident resolved.`, 'success');
                logAudit('SOS Arrived', current.doctor.name, `Arrived at ${targetHosp?.shortName}. Handoff profile compiled.`);
                
                if (demoActive) {
                  setDemoStep(6);
                }
                return updated;
              }
              return null;
            });
            return 0;
          }
          
          const docRef = activeSOS.doctor;
          const targetH = hospitals.find(h => h.id === activeSOS.hospitalId);
          const startH = hospitals.find(h => h.id === docRef.currentHospitalId) || hospitals[0];
          
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
  }, [activeSOS, sosCountdown, demoActive, demoSpeed, hospitals]);

  // Rank Doctors Algorithm
  const rankDoctors = (specialty, reqHospitalId) => {
    const reqHospital = hospitals.find(h => h.id === reqHospitalId);
    if (!reqHospital) return [];

    return doctors
      .filter(doc => doc.specialty.toLowerCase() === specialty.toLowerCase())
      .map(doc => {
        let availabilityScore = 0;
        if (doc.status === 'Available') availabilityScore = 100;
        else if (doc.status === 'Travelling') availabilityScore = 80;
        else if (doc.status === 'Consultation') availabilityScore = 60;
        else if (doc.status === 'On Break') availabilityScore = 40;
        else if (doc.status === 'Emergency Response') availabilityScore = 20;
        else availabilityScore = 10;

        let workloadScore = 100;
        if (doc.workload === 'Low') workloadScore = 100;
        else if (doc.workload === 'Medium') workloadScore = 80;
        else if (doc.workload === 'High') workloadScore = 50;
        else workloadScore = 20;

        const isAtSameHospital = doc.currentHospitalId === reqHospitalId;
        const currentHospital = hospitals.find(h => h.id === doc.currentHospitalId);
        
        const distance = isAtSameHospital ? 0 : (currentHospital ? Math.abs(currentHospital.dist - reqHospital.dist) : 4.0);
        const distanceScore = Math.max(0, 100 - (distance * 15));
        const estimatedETA = isAtSameHospital ? 2 : Math.round(distance * 3.5 + 4);

        const reliabilityScore = doc.reliability.overall;

        const matchScore = Math.round(
          (availabilityScore * 0.40) +
          (distanceScore * 0.30) +
          (reliabilityScore * 0.20) +
          (workloadScore * 0.10)
        );

        let reason = `Located at same clinic node (${reqHospital.shortName}). Zero transit time.`;
        if (!isAtSameHospital) {
          reason = `Commute transit gap: ${distance.toFixed(1)} km. Commute ETA: ~${estimatedETA} mins.`;
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
    const targetHosp = hospitals.find(h => h.id === targetHospitalId);
    
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
        { time: '3m', label: 'Clinical Director Escalation', status: 'pending' }
      ]
    };

    setActiveSOS(request);
    setRankedDoctors(list);
    setSosStep(3);
    
    addNotification(
      `🚨 Critical SOS: ${specialty}`,
      `Emergency dispatch initiated at ${targetHosp?.name || 'Hospital'}. Searching for specialists.`,
      'danger'
    );

    logAudit('SOS Broadcast', `receptionist_${targetHospitalId}`, `Dispatched ${urgency} SOS for ${specialty}`);
  };

  const triggerDoctorNotification = () => {
    setSosStep(4);
    addNotification('SOS Broadcaster active', 'Specialist pagers and phone alerts ringing network-wide.', 'warning');
    logAudit('SOS Pager Broadcast', 'system', 'Alert pager channels active for matching specialists');
  };

  const acceptSOS = (docId) => {
    if (!activeSOS) return;

    const doctor = doctors.find(d => d.id === docId);
    if (!doctor) return;

    const countdownSecs = 45; 
    
    setDoctors(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: 'Emergency Response',
          nextHospitalId: activeSOS.hospitalId,
          progress: 0
        };
      }
      return d;
    }));

    const targetHosp = hospitals.find(h => h.id === activeSOS.hospitalId);

    setActiveSOS(prev => ({
      ...prev,
      status: 'Accepted',
      doctor,
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
      `${doctor.name} accepted the SOS for ${targetHosp?.shortName}. ETA: 5 mins.`,
      'success'
    );

    logAudit('SOS Accepted', doctor.name, `En-route to ${targetHosp?.name}`);
  };

  const cancelSOS = () => {
    if (!activeSOS) return;
    
    if (activeSOS.doctor) {
      setDoctors(prev => prev.map(d => d.id === activeSOS.doctor.id ? { ...d, status: 'Available', progress: 0, x: hospitals.find(h=>h.id === d.currentHospitalId)?.x, y: hospitals.find(h=>h.id === d.currentHospitalId)?.y } : d));
    }

    setActiveSOS(null);
    setSosCountdown(0);
    setRankedDoctors([]);
    setSosStep(1);
    
    addNotification('SOS Cancelled', 'Emergency request was retracted.', 'info');
    logAudit('SOS Cancelled', 'receptionist_sys', 'Emergency dispatch retracted manually.');
  };

  const changeDoctorStatus = (docId, newStatus) => {
    let docName = 'Specialist';
    setDoctors(prev => prev.map(d => {
      if (d.id === docId) {
        docName = d.name;
        logAudit('Status Changed', d.name, `Status updated to ${newStatus}`);
        addNotification(`${d.name} Updated`, `Presence changed to ${newStatus}.`, 'info');
        return { ...d, status: newStatus };
      }
      return d;
    }));
    addToast(`${docName} Status Updated`, `Presence status set to ${newStatus}.`, 'success');
  };

  const overrideConflict = (appointmentId, reason) => {
    setOverrides(prev => [...prev, { id: `ov-${Date.now()}`, appointmentId, reason, timestamp: new Date().toLocaleTimeString() }]);
    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, warning: null, overridden: true } : a));
    logAudit('Conflict Overridden', 'system', `Appointment ${appointmentId} override approved: ${reason}`);
    addNotification('Scheduling Overridden', `Conflict bypass authorized: ${reason}`, 'warning');
  };

  const bookAppointment = (appointmentData) => {
    const { patientName, age, gender, doctorId, hospitalId, date, time, department, type = 'Physical' } = appointmentData;
    
    const conflictResult = detectScheduleConflict(doctorId, hospitalId, date, time);
    const doc = doctors.find(d => d.id === doctorId);
    const hosp = hospitals.find(h => h.id === hospitalId);
    
    const newAppointment = {
      id: `a-${Date.now()}`,
      patientName,
      age: parseInt(age),
      gender,
      doctorId,
      doctorName: doc ? doc.name : 'Specialist',
      hospitalId,
      hospitalName: hosp ? hosp.shortName : 'Hospital',
      time,
      date,
      department,
      type,
      duration: '30 min',
      commuteTime: '12 mins',
      status: 'Pending',
      warning: conflictResult.hasConflict ? conflictResult.message : null
    };

    setAppointments(prev => [newAppointment, ...prev]);

    if (conflictResult.hasConflict) {
      addNotification('⚠️ Appointment Warning', `Booked with conflict: ${conflictResult.message}`, 'warning');
      logAudit('Appt Overlap Warning', 'scheduler_sys', `Booked ${patientName} with ${doc?.name} - Conflict: ${conflictResult.message}`);
    } else {
      addNotification('Appointment Confirmed', `Successfully booked ${patientName} with ${doc?.name} at ${hosp?.shortName}.`, 'success');
      logAudit('Appt Booked', 'scheduler_sys', `Booked ${patientName} with ${doc?.name} at ${hosp?.shortName} for ${date} ${time}`);
    }
  };

  const moveAppointment = (apptId, newTime, newDate) => {
    setAppointments(prev => prev.map(appt => {
      if (appt.id === apptId) {
        const conflictResult = detectScheduleConflict(appt.doctorId, appt.hospitalId, newDate || appt.date, newTime);
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

  const detectScheduleConflict = (doctorId, targetHospitalId, date, time) => {
    const parseTimeToMins = (t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };

    const targetMins = parseTimeToMins(time);
    const targetHosp = hospitals.find(h => h.id === targetHospitalId);

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
        const otherHosp = hospitals.find(h => h.id === appt.hospitalId);
        const distance = Math.abs(targetHosp.dist - (otherHosp?.dist || 4.0));
        const travelTimeMinutes = Math.round(distance * 3.5 + 10);

        const requiredGap = 30 + travelTimeMinutes;
        if (diff < requiredGap) {
          return {
            hasConflict: true,
            message: `Commute buffer violation: Commute takes ~${travelTimeMinutes} mins between ${targetHosp.shortName} and ${otherHosp?.shortName || 'Node'} (Current gap: ${diff} mins).`
          };
        }
      }
    }

    return { hasConflict: false };
  };

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
      suggestions.push('10:30', '14:15');
    }

    return suggestions;
  };

  const addHandoffNote = (noteData) => {
    const { patientName, age, gender, chiefComplaint, diagnosis, treatment, medications, followUp, doctorId, hospitalId } = noteData;
    
    const doc = doctors.find(d => d.id === doctorId);
    const hosp = hospitals.find(h => h.id === hospitalId);

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
      doctorName: doc ? doc.name : 'Specialist',
      hospitalId,
      hospitalName: hosp ? hosp.name : 'Hospital Node',
      date: new Date().toISOString().split('T')[0]
    };

    setHandoffs(prev => [newHandoff, ...prev]);
    addNotification('Handoff Notes Locked', `Patient handoff record compiled for ${patientName} by ${doc?.name || 'Specialist'}.`, 'info');
    logAudit('Handoff Synced', doc?.name || 'system', `Compiled and synced ${patientName}'s clinical profile.`);
  };

  // Toast State & Helpers
  const [toasts, setToasts] = useState([]);
  const addToast = (title, message, type = 'info') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Global Modal & Drawer Manager
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  const openModal = (modalType, data = null) => {
    setActiveModal(modalType);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  // AI Recommendation Handlers
  const acceptAiRecommendation = (rec) => {
    addToast('AI Recommendation Accepted', rec.message || 'Optimized routing & scheduling applied network-wide.', 'success');
    logAudit('AI Recommendation Accepted', 'Coordinator', 'system', 'Global Grid', 'Pending', rec.title || 'Optimal Routing');
    
    // Add to activity feed
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivityFeed(prev => [
      { time: timeStr, title: 'AI Match Accepted', text: rec.message || 'AI routing accepted.', icon: 'auto_awesome', type: 'success' },
      ...prev
    ]);
  };

  const dismissAiRecommendation = (recId) => {
    addToast('Recommendation Dismissed', 'Recommendation removed from active queue.', 'info');
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
      dispatches, setDispatches,
      handoffs, setHandoffs,
      notifications, setNotifications,
      activityFeed, setActivityFeed,
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
      // Toast & Modal Managers
      toasts, addToast, removeToast,
      activeModal, modalData, openModal, closeModal,
      acceptAiRecommendation, dismissAiRecommendation,
      // Feature Flags
      featureFlags, toggleFeatureFlag,
      // WOW Demo
      demoActive, demoStep, demoNarrative, demoSpeed, setDemoSpeed,
      demoPaused, setDemoPaused,
      startWowDemo: () => {}, stopWowDemo: () => {}, stepForward: () => {}, stepBackward: () => {},
      judgeModeActive, setJudgeModeActive
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
