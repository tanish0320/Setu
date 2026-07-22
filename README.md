# SETU (सेतु)

### The real-time coordination layer for modern healthcare grids.

SETU is an AI-powered physician coordination platform that bridges the gap between independent hospitals, ambulance networks, and on-call specialists. By automating routing, dispatch, and scheduling, SETU reduces critical emergency specialist response times from 30–45 minutes to **under 5 minutes**.

<br />

<div align="center">

[![Active Development](https://img.shields.io/badge/Status-Active_Development-059669?style=flat-square)](https://github.com/tanish0320/Setu)
[![MIT License](https://img.shields.io/badge/License-MIT-000000?style=flat-square)](file:///C:/Claude_projects/SETU/LICENSE)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)

</div>

---

## 📊 Project Status

| Status | Value |
|--------|-------|
| 🚀 Stage | MVP Development |
| 📦 Version | Pre-Release |
| 🏥 Product | AI-Powered Multi-Hospital Physician Coordination Platform |
| 🌍 Region | India |
| 🩺 Focus | Healthcare Coordination |
| ⚡ Emergency Response Goal | Under 5 Minutes |

---

## 🌐 What is SETU?

SETU (Sanskrit for "bridge") is **not** another medical records system or admin dashboard. It is the real-time operational layer sitting between care nodes.

| What SETU Is | What SETU is NOT |
| :--- | :--- |
| **A coordination layer** for cross-hospital routing | ❌ An EMR (Electronic Medical Record) |
| **An AI-powered dispatch network** for specialists | ❌ An EHR (Electronic Health Record) |
| **A real-time availability engine** for acute care | ❌ A Hospital Information System (HIS) |
| **A routing dashboard** for emergency ambulances | ❌ Appointment booking software for patients |

> [!IMPORTANT]
> SETU is built to operate *alongside* existing systems of record (EMR/EHR/HIS). It doesn't replace them; it connects them. It translates static rosters and fragmented messaging chains into a real-time, high-fidelity routing network.

---

## 🩸 Why We Build

Healthcare does not have a treatment problem. It has a coordination problem.

We have the world’s most advanced medical equipment. We have brilliant, dedicated doctors. We have state-of-the-art hospitals. Yet, during an emergency (like a Code Blue or an acute trauma admission), the system breaks down because these parts do not talk to each other.

Right now, when an emergency happens:
1. A hospital coordinator manually scrolls through a roster or phone book.
2. They call 5 different specialists, waiting for replies, while the patient's critical "Golden Hour" ticks away.
3. On-call doctors are left in the dark, commuting between multiple hospitals with zero visibility into traffic, overlapping bookings, or double-allocations.
4. Ambulance drivers rush patients to the nearest hospital, only to find out upon arrival that the ICU is full, the CT scanner is down, or the on-call specialist is stuck in transit elsewhere.

Patients do not lose lives because the medicine is unavailable. **They lose lives because systems do not cooperate.**

SETU is the bridge. We link independent hospitals and doctors into a single unified emergency routing grid. We synchronize availability, compute transit logistics, and page the right clinician instantly.

We build SETU because in an emergency, every second is a heartbeat.

---

## ✨ Platform Capabilities

### ⚡ Emergency SOS Dispatch
Instantly mobilize the right specialist in high-urgency scenarios.
* **AI Match Engine:** Ranks nearby specialists instantly using real-time GPS proximity, verified specialty matches, current schedule availability, and historical emergency response punctuality.
* **Instant Pager Routing:** Dispatches push notifications to on-call doctors' mobile devices via low-latency secure channels.
* **Real-Time Dispatch Visibility:** Once accepted, the hospital sees the assigned physician's live ETA, current transit coordinates, and status updates on a live dashboard.

### 📅 Unified Physician Calendar
Eliminate coordination conflicts for specialists practicing across multiple nodes.
* **Cross-Hospital Synchronization:** Aggregates schedules across independent networks into a single, secure view.
* **Conflict Prevention:** Automatically flags overlapping appointments, impossible travel distances between different facilities, and double bookings.
* **Intelligent Recommendations:** Suggests optimal, fatigue-aware slots for consultations and elective procedures.

### 🟢 Live Clinician Status
Real-time status updates without intrusive phone calls.
* **Status States:** Broadcasters classify doctors into clean states: `Available`, `In Consultation`, `In Transit`, `On Break`, or `Unavailable`.
* **Zero-Contact Integration:** Automatically updates based on calendar entries, active dispatches, and geographical check-ins, eliminating manual check-in overhead.

### 🚗 Smart Scheduling & Travel Routing
Dynamic booking powered by physical logistics.
* **Travel-Time Aware:** Computes optimal buffer times between hospital visits using live traffic conditions.
* **Intelligent Buffering:** Automatically pads consultations based on past delays and patient case complexity.

### 📝 Cross-Hospital Patient Handoff Notes
Maintain clinical continuity as doctors move between independent facilities.
* **Structured Snippets:** Standardized, lightweight handoff notes that follow the doctor's workflow.
* **Non-Invasive Architecture:** Sits on top of existing EMRs. Focuses entirely on care transitions, ensuring critical patient data is accessible at the point of care.

### 🏆 Coordination Reliability Score
Data-driven performance evaluation to improve network trust.
* **Empanelment Metrics:** Computes a running score for specialists based on punctuality, emergency dispatch acceptance rates, appointment completions, and status accuracy.
* **Quality Assurance:** Helps hospitals maintain high SLA standards for their on-call panels.

### 🚑 Real-Time Ambulance Dashboard (NEW)
Intelligent emergency routing for ambulance operators.
* **Live Capacity Tracking:** Instead of blindly driving to the nearest facility, ambulance crews view real-time capacities:
  * **Critical Infrastructure:** ICU beds, Operation Theatres (OT), MRI/CT scanners, Cath Labs, Ventilators, and Blood Bank reserves.
  * **Human Resources:** Real-time presence of specialists and key technicians (e.g., cardiologists, radiographers).
  * **Queue Logistics:** Current queue length and estimated wait times.
* **Optimal Routing:** Ensures trauma cases are directed to the hospital best equipped to treat them *right now*.

---

## 🏗️ System Architecture

SETU operates as a hub-and-spoke real-time routing engine, linking edge dashboard terminals with a centralized coordination backend.

```mermaid
flowchart TD
    classDef main fill:#111,stroke:#333,stroke-width:1px,color:#fff;
    classDef external fill:#222,stroke:#444,stroke-width:1px,color:#aaa,stroke-dasharray: 5 5;

    Patient([🤕 Patient Emergency]) --> Hospital[🏥 Hospital Reception / Dashboard]
    Ambulance([🚑 Ambulance Crew]) --> Hospital
    
    Hospital -->|1. SOS Request / Query| SETU[⚡ SETU Core Platform]
    
    subgraph SETU_PLATFORM [SETU Infrastructure Layer]
        SETU -->|2. Route & Match| Engine[🧠 AI Coordination Engine]
        Engine -->|Check Availability| Cache[(Redis Cache)]
        Engine -->|Persist Data| DB[(PostgreSQL DB via Prisma)]
        
        SETU -->|WebSocket State Sync| WS[🔌 Socket.io Server]
        SETU -->|Auth & Session| Auth[🔒 JWT / Auth Service]
    end

    subgraph CLOUD_SERVICES [Cloud Integrations]
        Engine -->|3. Proximity & ETA| Maps[🗺️ Google Maps API]
        Engine -->|4. Push Notification| FCM[🔔 Firebase Notifications]
    end
    
    FCM -->|5. Notify Alert| Doctors[👨‍⚕️ Doctors - Mobile App]
    WS <-->|Real-Time Status & Location| Doctors
    WS <-->|Real-Time Status Sync| Hospital
    WS <-->|Real-Time Status Sync| AmbulanceDash[📟 Ambulance Dashboard]
    
    class SETU_PLATFORM,CLOUD_SERVICES main;
```

### Technical Stack

| Layer | Technology | Primary Use Case |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS | High-performance, low-latency interfaces for hospitals and doctors |
| **Backend** | NestJS (TypeScript) | Scalable, modular API Gateway and match engine orchestration |
| **Database** | PostgreSQL, Prisma ORM | Relational data persistence, robust schema modeling |
| **Caching & Pub/Sub** | Redis | Session state, real-time doctor coordinate caching, and queue management |
| **Real-time Comm** | WebSockets (Socket.io) | Bidirectional live coordinate tracking, status updates, and chat channels |
| **Authentication** | JWT (Stateless tokens) | Secure cross-node hospital and physician sessions |
| **Maps & Routing** | Google Maps API | Doctor routing, ETA estimation, and ambulance navigation |
| **Notifications** | Firebase (FCM) | High-priority push notifications and emergency pager alerts |
| **Cloud / Infra** | AWS (EC2, RDS) | Secure, HIPAA-compliant host nodes and infrastructure |

---

## 📂 Repository Structure

The SETU codebase is structured as a monorepo, keeping the core engines, shared UI, and platform clients co-located.

```text
setu/
├── apps/                        # Platform Clients (Target Monorepo Structure)
│   ├── doctor-app/              # React Native / Web app for on-call specialists
│   ├── hospital-app/            # High-fidelity dashboard for hospital operators
│   └── ambulance-app/           # Real-time triage and routing app for EMT crews
├── packages/                    # Shared Workspace Packages
│   ├── ui/                      # Design system tokens and shared Tailwind components
│   ├── api/                     # Shared SDK, REST types, and WebSocket client contracts
│   └── database/                # Prisma schemas, migration files, and seed scripts
├── backend/                     # NestJS Backend API Engine
├── src/                         # React Frontend Client Source (current MVP)
├── public/                      # Static assets and media files
├── docs/                        # API specifications and system documentation
├── architecture/                # System architecture drafts and decision logs (ADRs)
└── assets/                      # Graphic assets and design resources
```

> [!NOTE]
> The active codebase holds the React web frontend in the root directory [src](file:///C:/Claude_projects/SETU/src) and the NestJS REST/WebSocket server under the [backend/](file:///C:/Claude_projects/SETU/backend) folder. Shared monorepo separation is scheduled for the Phase 2 roadmap.

---

## 🖼️ Screenshots

<details>
<summary>📸 Expand to View App Interface Placeholders</summary>
<br>

#### Doctor Dashboard
![Doctor Dashboard](docs/images/doctor-dashboard.png)

#### Hospital Dashboard
![Hospital Dashboard](docs/images/hospital-dashboard.png)

#### Emergency SOS Screen
![SOS](docs/images/sos.png)

#### Unified Calendar
![Calendar](docs/images/calendar.png)

#### Ambulance Dashboard
![Ambulance](docs/images/ambulance.png)

</details>

---

## 🗺️ Product Roadmap

### Phase 1: Foundation (Completed / Current MVP)
- [x] **Unified Calendar:** Synchronize clinician calendars across independent hospital nodes.
- [x] **Live Status:** Zero-touch availability states (`Available`, `In Transit`, `In Consultation`).
- [x] **Emergency SOS:** Instant pager alerts and AI-driven match ranking.
- [x] **Smart Scheduling:** Travel-time buffers and traffic-aware booking suggestions.
- [x] **Reliability Score:** Accountability scores based on SLA response metrics.
- [x] **Ambulance Dashboard:** Real-time visibility into hospital ICU/OT resources and specialist queues.

### Phase 2: Scale & Integrations (In Progress)
- [ ] **ABDM Integration:** Full alignment with India's Ayushman Bharat Digital Mission (M1/M2/M3 compliance).
- [ ] **HIS Connectors:** Pre-built adaptors for major Hospital Information Systems (e.g., WebCIS, EHR systems).
- [ ] **Telemedicine Bridge:** High-fidelity audio/video handover channels during doctor transit.

### Phase 3: Intelligence & Network Expansion (Planned)
- [ ] **Predictive Scheduling:** Pre-allocation of specialists based on historical emergency admission cycles.
- [ ] **AI Assistant:** Real-time voice-to-text handoff notes generation for commuting physicians.
- [ ] **National Emergency Grid:** Unified cross-city emergency routing network.

---

## 🚀 Getting Started

Follow these steps to run the SETU platform locally.

### 📋 Prerequisites
Ensure you have the following installed:
* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)
* **PostgreSQL** (v14 or higher)
* **Redis** (v6 or higher)

### 📥 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tanish0320/Setu.git
   cd Setu
   ```

2. Install root dependencies (Frontend):
   ```bash
   npm install
   ```

3. Install [backend](file:///C:/Claude_projects/SETU/backend) dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```

### 🔑 Environment Variables

The backend requires configuring environment variables. Create a `.env` file in the [backend/](file:///C:/Claude_projects/SETU/backend) directory:

```env
# Database Settings
DATABASE_URL="postgresql://postgres:password@localhost:5432/setu_db?schema=public"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key"
JWT_REFRESH_SECRET="your-super-secure-jwt-refresh-key"

# Integrations
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
FIREBASE_CREDENTIALS_JSON='{"project_id": "...", ...}'
REDIS_URL="redis://localhost:6379"
```

### 💻 Running Development Servers

To run the full stack concurrently:

#### 1. Spin up the Database & Redis
Ensure your PostgreSQL and Redis services are running locally, then initialize the Prisma client and database schemas:
```bash
cd backend
npx prisma db push
npx prisma generate
cd ..
```

#### 2. Start the Backend API
```bash
cd backend
npm run start:dev
```
The API will be live on `http://localhost:3000`. Swagger documentation will be available at `http://localhost:3000/api/docs`.

#### 3. Start the Frontend client
In a new terminal window at the repository root:
```bash
npm run dev
```
The client will be live on `http://localhost:5173`.

### 🏗️ Build, Lint, and Test

#### Build
Compile production bundles for both components:
```bash
# Frontend
npm run build

# Backend
cd backend && npm run build
```

#### Lint
Enforce code quality and formatting guidelines:
```bash
# Frontend (using oxlint)
npm run lint

# Backend (using ESLint & Prettier)
cd backend && npm run lint
```

#### Test
Execute test suites to verify integrity:
```bash
# Backend (using Jest)
cd backend && npm run test
```

---

## 🔮 The Future Vision: The OS for Physician Coordination

Today, SETU is an emergency routing bridge between independent hospital nodes. Tomorrow, SETU aims to become the foundational operating system for physician coordination across India and global healthcare markets.

Our long-term roadmap expands beyond routing to optimize the flow of critical clinical talent:
* **ABDM Compliance:** Native integration with India's Ayushman Bharat Digital Mission, establishing clinical registries and secure consent-based health data exchange.
* **Universal HIS Connectors:** Out-of-the-box integrations with legacy Hospital Information Systems (HIS) and EHRs, ensuring zero onboarding friction for hospitals.
* **Predictive AI Scheduling:** Analyzing historical emergency, trauma, and acute care patterns to preemptively dispatch specialists *before* the crisis call occurs.
* **Resource Forecasting:** Predicting ICU and OT bed constraints at regional levels to advise ambulance grids on optimal routing before capacity thresholds are breached.
* **National Emergency Network:** A unified, low-latency, sovereign emergency communication mesh connecting every primary, secondary, and tertiary hospital node.
* **International Expansion:** Adapting the coordination layer for global markets struggling with specialist shortages, high wait times, and emergency service fragmentation.

---

## 🤝 Contributing

We welcome contributions from developers, designers, healthcare experts, and security researchers.

1. **Fork** the repository.
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`.
3. **Commit** your changes with clear, structured commits: `git commit -m 'feat: add real-time ETA calculation'`.
4. **Push** to the branch: `git push origin feature/amazing-feature`.
5. **Open a Pull Request** explaining your implementation details and context.

For security concerns or vulnerability reports, please reach out directly to the maintainers at `maintainers@setu.network`.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <sub>Built with ❤️ by Team SETU. Connect the grid, save a life.</sub>
</div>
