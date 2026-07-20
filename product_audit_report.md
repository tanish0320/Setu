# SETU (सेतु) — Complete Product Audit Report
**An Architectural, Product, UX, and Commercial Audit of the Multi-Hospital Specialist Scheduling & Emergency Dispatch Grid**

---

## 📌 Executive Summary

SETU is designed as a multi-hospital specialist scheduling and emergency dispatch network, specifically built to coordinate critical clinician response times across independent hospital systems (e.g., Code Blue responses). It aims to solve the severe fragmentation in Indian emergency healthcare, where specialists practice across multiple hospital branches and are reached via slow, manual phone lists during critical "Golden Hour" windows.

> [!WARNING]
> **Brutal Truth**: While the project features a visually stunning, highly interactive presentation UI (including a dedicated "Judge Mode" storyboard that effectively highlights the core workflow), the application currently exists as **two completely disconnected codebases**. The frontend is a client-side sandbox running on mock data and local intervals, with zero active integrations to the NestJS backend, WebSockets, or AI APIs. The NestJS backend is well-designed and implements actual SQL schemas and ranking logic, but is completely bypassable in the current frontend build.

---

## STEP 1 — Understand the Product

### Product Scope
SETU coordinates specialists across independent hospitals, showing where doctors are, mapping their schedules to avoid overlap, and auto-dispatching the closest qualified clinician when an emergency (such as a cardiac crisis) is declared.

### Solved Problem
It addresses the critical delay in finding a specialist during a hospital emergency. Instead of hospital desk staff spending 30+ minutes calling doctors, SETU automates the ranking and paging of specialists based on proximity, live status, and historical response times, targeting a response window under 5 minutes.

### Current Workflow & User Journey
1. **Triggering SOS**: A receptionist or doctor at a hospital node declares a critical emergency (e.g., Cardiology distress at Apollo Chennai) through the portal.
2. **AI Ranking**: The system ranks doctors who are card-carrying specialists in that department, sorting them by current availability (Available, In Transit, Consulting), proximity to the hospital, and workload.
3. **Escalating Alerts**: The top-ranked specialist's pager/phone rings. If there is no response within 30 seconds, the system sends an SMS; after 60 seconds, a voice call; and after 120 seconds, it escalates to the next ranked doctor in the grid.
4. **Accepting and Commuting**: The doctor accepts the request on their mobile portal. A live map tracks their location as they travel, updating coordinate progress in real-time.
5. **Handoff and Completion**: Upon check-in, an automated patient handoff note is logged, and the doctor's reliability metrics are updated.

### Current Architecture & Tech Stack
* **Frontend**: React (v19), Vite, Tailwind CSS (v3.4), custom SVG mappings and charts.
* **Backend**: NestJS, Prisma ORM, PostgreSQL, Socket.io WebSockets.
* **Mock Providers**: Logs console notifications for SMS/Voice/Push.

### Data Flow
* **Frontend Data Flow**: All components read from AppContext.jsx. Random status swaps and coordinate updates run on local `setInterval` blocks (every 4 seconds) to simulate live updates.
* **Backend Data Flow**: Standard REST endpoints route payloads through NestJS controllers to services, saving status history, appointments, and assignments to PostgreSQL.

---

## STEP 2 — Feature Inventory

The table below lists every major feature in the codebase, detailing its implementation completeness across the stack:

| Feature Name | Purpose | Frontend Complete? | Backend Complete? | Database Complete? | Working? | Dummy? | Needs Improvement? | Priority |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Unified Grid Dashboard** | Multi-hospital KPIs & status visualizers | Yes | Yes | Yes | **Partial** | Frontend | Connect frontend to REST APIs | High |
| **SOS Emergency Dispatch** | Auto-page and escalate specialist alerts | Yes | Yes | Yes | **Partial** | Frontend | Integrate real API & WebSockets | Critical |
| **AI Specialist Match** | Mathematical ranking of eligible doctors | Yes | Yes | Yes | **Partial** | Algorithmic | Replace with real ML/LLM scoring | Medium |
| **Multi-Hospital Calendar** | Shared calendar with travel buffer check | Yes | Yes | Yes | **Partial** | Frontend | Support write actions to API | High |
| **Live Commute Tracking** | Visual mapping of doctor transit | Yes | Yes | Yes | **Partial** | Frontend | Connect to live socket coordinates | High |
| **DPDP Compliance Logs** | Immutable audits of accesses and overrides | Yes | Yes | Yes | **Partial** | Frontend | Hook frontend logs to backend DB | Medium |
| **Patient Handoff Logs** | Secure clinical records generated on arrival | Yes | Yes | Yes | **Partial** | Frontend | Post handoffs to Prisma | Medium |
| **Notification Engine** | Send Push/SMS/Voice alerts to clinicians | No | Yes (Mock) | Yes | **No** | Mocked Logs | Integrate Twilio/Firebase | High |
| **Feature Flags Manager** | Toggle engine configurations dynamically | Yes | No | Yes | **Partial** | Frontend | Support persistence on DB | Low |
| **Interactive API Explorer** | Developer console to test REST endpoints | Yes | No | No | **No** | Frontend | Remove or connect to Swagger | Low |

---

## STEP 3 — Screen Audit

| Page / Screen | Purpose | Core Components | Buttons & Actions | Connected Backend? | Dummy Data? | Missing Features | UI Issues | UX Issues |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- | :--- | :--- |
| **Dashboard** | Unified oversight of hospital KPIs, doctor presence, and logs | KPIs, Charts, Svg Map, Active SOS alerts, Audit log stream | Role-escalation switchers, SOS cancel buttons | **No** | Yes | Actual REST/WebSocket feeds | SVG maps are static and don't reflect live real-world locations | Role switcher is too prominent (meant for devs, breaks client realism) |
| **New Consultation** | Step-by-step wizard to book patients or trigger Code Blue | Form steps, drag-and-drop reports box, doctor matches list | Drag file, Select doctor, Next/Back, Dispatch SOS, Book | **No** | Yes | Genuine OCR/AI document extraction | File upload has no backend target | Step 3 ("AI Synthesis") shows a pre-filled mock layout with no actual input parsing |
| **Doctors Directory** | Manage clinicians and status | Grid list, filter bars, experience stats | View profile, Change status dropdown, Search | **No** | Yes | Persistent updates | Avatars are unsplash mock links | No pagination (renders 200 items in a single list) |
| **Requests Page** | Mobile view simulation for doctors to handle alerts | Tabs (Emergency, Urgent, Accepted), Patient details panel | Accept (Physical/Online), Decline, Complete, Sign Handoff, Chat send | **No** | Yes | Multi-device WebSockets sync | Form inputs are local-only | Complete button allows signing off with empty prescriptions if alert bypassed |
| **Calendar Page** | Scheduling slot workspace | Hourly calendar grid, override log | Override conflict, Reschedule | **No** | Yes | Database writes | Drag-and-drop slots not implemented | Manual time entry fields are clunky |
| **SOC Security Center** | Visual audit ledger and DPDP compliance monitor | Encryption standard badge, Session tables, Access log grid | Revoke session | **No** | Yes | Database sessions sync | Renders static rows | None |
| **API Explorer** | Debugging and documentation tool | Endpoint registry list, terminal request/response box | Run/Execute request | **No** | Yes | Real request pipeline | Hardcoded responses | Looks out-of-place for clinical users |
| **Architecture Page** | Displays cloud-infrastructure charts | Static SVG network diagram | Zoom/Pan | **No** | Yes | Live status checks | Static SVG only | None |

---

## STEP 4 — Backend Audit

### Current API Structure
Built on NestJS with modules for `Auth`, `AuditLog`, `Users`, `Roles`, `Hospitals`, `Departments`, `Doctors`, `Affiliations`, `Availability`, `Appointments`, `Emergencies`, and `DoctorStatus`. All endpoints are documented using `@nestjs/swagger` annotations.

### Authentication & Authorization
* **Auth**: Managed in auth.controller.ts using JWT and JWT Refresh tokens.
* **Authorization**: Role-Based Access Control (RBAC) via a custom `PermissionsGuard` and `@Permissions` decorator checking database-backed scopes (e.g. `emergencies:create`).

### Services & Controllers
NestJS controllers directly map REST requests to repository instances. For example, `AppointmentsService` queries `ConflictDetectionService` before pushing appointments to the database.

### Realtime Support & WebSockets
Implemented via doctor-status.gateway.ts. Features socket rooms partitioned by hospital ID (`hospital:${hospitalId}`). Renders alerts like `doctor_status_changed`, `eta_updated`, `doctor_arrived`, and `emergency_accepted`.
* **The Reality Check**: While this gateway is well-written, it is **untested in production** because the frontend doesn't establish socket connections.

### Cron Jobs, Queues & Notifications
* **Cron Jobs**: **Missing**. The `checkEscalations` logic (to timeout alert assignments and page secondary doctors) must be triggered manually via a POST to `/emergencies/check-escalations` or run on an external timer. There is no internal NestJS `@Cron` scheduler.
* **Queue**: **Missing**. No Redis/BullMQ queue is implemented. Realtime escalations run synchronously inside database transactions.
* **Notification System**: Currently relies on mock providers (sms.provider.ts) that simply log actions to the console.

### AI Integration
* **Missing**. There is no machine learning or large language model configuration. Proximity and Match scores are computed via deterministic linear equations.

### Security & Scalability
* **Security**: Incorporates token verification, hashed passwords, and active session revoking.
* **Scalability**: The database logic relies heavily on relational joins across multiple tables. Proximity queries execute on-the-fly math, which will cause bottlenecks under heavy transaction volumes unless optimized with indexing or spatial database extensions (like PostGIS).

---

## STEP 5 — Database Audit

### Schema Design & Prisma Models
The PostgreSQL database consists of 22 models mapped in schema.prisma:
* **Core**: `Role`, `User`, `Session`, `RefreshToken`, `Hospital`, `Department`, `Doctor`, `DoctorHospitalAffiliation`, `AvailabilityWindow`
* **Realtime**: `DoctorStatus`, `DoctorStatusHistory`, `StatusEvent`
* **Appointments & Emergencies**: `Appointment`, `AppointmentStatusHistory`, `EmergencyRequest`, `EmergencyAssignment`, `EmergencyEscalationLog`, `EmergencyTimeline`, `PatientHandoffNote`
* **Analytics & Configuration**: `NotificationQueue`, `AuditLog`, `FeatureFlags`, `ReliabilityMetric`, `TravelCache`

### Architectural Issues & Problems
1. **No Spatial Query Support**: Proximity calculations query floats and run raw Euclidean math. This model treats physical locations as a simple 2D coordinate grid. It doesn't integrate actual geographic coordinates (latitude/longitude), meaning it cannot map real-world streets or calculate true traffic-adjusted route ETAs.
2. **Missing Indexes**: Crucial foreign key lookups (like `userId` in `DoctorStatus`, `doctorId` and `hospitalId` in `Appointment`) lack custom indexing annotations (`@@index`), which will degrade query performance as tables grow.
3. **Database-Backed Feature Flags**: The `FeatureFlags` model is single-row and lacks multi-tenant scoping. If one hospital admin changes a toggle, it updates the status globally.

---

## STEP 6 — Realtime Audit

> [!CAUTION]
> **Realtime Status**: **15% Working**.
> * **Doctor status updates**: Simulators run on client-side timers. No updates reach or originate from the database.
> * **Emergency requests**: Mocked locally inside `AppContext.jsx`. Declaring an SOS alert triggers local animations, bypassing backend API endpoints entirely.
> * **WebSockets**: Implemented in NestJS, but the client does not import any Socket.io-client library, nor does it attempt to connect.
> * **Dashboard data**: Completely detached from database state.

---

## STEP 7 — AI Audit

The frontend displays an "AI Specialist Match Engine" with match percentages (e.g., 98%) and text explanations.

### The Algorithm Block (Simulated AI)
The logic is written as a deterministic linear equation in AppContext.jsx:L557:
```javascript
const matchScore = Math.round(
  (availabilityScore * 0.40) +
  (distanceScore * 0.30) +
  (reliabilityScore * 0.20) +
  (workloadScore * 0.10)
);
```

### The Brutal Verdict on "AI"
* **Actual Intelligence**: **0%**.
* **Fake Logic**: The explanation strings are procedurally formatted text blocks:
  `Located at same clinic node (Apollo Delhi). Zero transit time.`
* **Bypassed AI Summary**: On the "New Consultation" page, Step 3 displays a text summary card labeled as "AI Synthesis". This content is statically hardcoded based on the selected specialty, meaning no actual document parsing is performed.

---

## STEP 8 — Product Audit

### What the Product Currently Feels Like
Currently, SETU functions as a **highly polished interactive prototype**. It is more than a standard mockup because the components respond dynamically to simulated states, but it is not yet a working healthcare tool because it operates entirely in-memory on local client state.

### What the Product SHOULD Become
SETU should evolve into a **Federated Emergency Coordination Grid**. It must link existing, independent hospital electronic health record systems (EHR/EMR) via secure gateways to coordinate clinician scheduling. It should not try to act as a standalone hospital management system (HMS) or doctor portal, but rather operate as an middleware routing engine.

---

## STEP 9 — UX Audit

### UX Critique
* **Visual Polish**: Very high. The dark mode themes, color palette, custom icons, and interactive elements are visually impressive and clean.
* **Spacing & Typography**: Consistent alignment and readable font scaling throughout the interface.
* **Loading & Empty States**: Mostly missing. Data transitions happen instantly, which is unrealistic for server-side roundtrips and breaks immersion.
* **Error States**: None implemented. The UI assumes forms are always filled correctly and servers never fail.
* **Responsiveness**: Renders well on tablet and desktop screens, but key dashboard widgets break alignment on mobile screens.

---

## STEP 10 — Demo Audit

### What Looks Impressive (Show this to judges!)
1. **The Judge Mode Slide Walkthrough**: This is the application's strongest asset. It allows you to click through a multi-step emergency scenario, automatically changing user roles, rendering maps, and simulating incoming requests to demonstrate the intended end-to-end user experience.
2. **The Commute Transit Map**: The custom SVG map dynamically updates doctor markers and displays routing paths based on coordinate calculations, which looks highly interactive and polished.
3. **The Live Activity Log Stream**: The audit log updates dynamically with detailed entries (such as rotated security tokens and access permissions), reinforcing the feel of a secure, production-ready system.

### What immediately looks fake (Be careful!)
1. **Instant AI Report Extraction**: Clicking the "Upload Reports" file area instantly generates a complex patient summary. A judge will immediately spot that this is hardcoded, pre-filled mock text.
2. **Role Swapper**: Having a global role-swapping dropdown in the header is convenient for developers, but it makes the tool look like a mock sandbox rather than an enterprise application.
3. **The Interactive API Explorer**: Renders JSON responses instantly without sending actual network requests. Developers will immediately notice the lack of network latency or real-time console communication.

---

## STEP 11 — Startup Audit & Commercial Feasibility

### Market Fit
High potential. Fragmented emergency care is a critical problem in developing healthcare markets like India. However, selling standalone software to hospital chains is notoriously difficult due to procurement red tape.

### Competition & Differentiation
Most competitors are monolithic HMS systems (such as Apollo Helix) or generic pager platforms. SETU differentiates itself by focusing specifically on **multi-hospital coordination and travel conflict schedules**, filling a niche that traditional single-hospital platforms overlook.

### Revenue Model
* **B2B SaaS**: Charge hospitals a monthly subscription fee per affiliated doctor node.
* **Enterprise SLA**: Charge premium fees to guarantee sub-5-minute specialist dispatch times.

### Key Hurdles
1. **Clinician Adoption**: Doctors will likely reject downloading another app that tracks their GPS coordinates outside shift hours.
2. **Regulatory & DPDP Compliance**: Storing patient handoffs on a shared network raises significant compliance challenges under India's Digital Personal Data Protection (DPDP) Act.
3. **Moat**: The algorithm is straightforward and can be easily replicated. To build a defensible moat, the product must focus on securing exclusive hospital grid integrations rather than relying on its routing math.

---

## STEP 12 — Technical Debt

1. **Disconnected Stack**: The frontend has no API client or connection logic. The backend resides in a separate subfolder and is never queried.
2. **Deterministic Match Formula**: Calculated using a simple linear equation instead of an intelligent, multi-parameter routing model.
3. **Missing Cron Engine**: Escalation logic depends on manual HTTP requests, which is unsustainable for production.
4. **Hardcoded Mock Data**:
   * Files like EmergencyWorkflowPage.jsx contain large arrays of mock data (such as patient complaints and diagnoses) defined directly inside the view files.

---

## STEP 13 — Healthcare Operations Audit

### Would doctors actually use this?
**Only if heavily incentivized or mandated.** Clinicians are highly sensitive to battery drain and constant tracking. The app must implement clear **geo-fencing guidelines** and privacy filters to ensure location tracking automatically disables when they are off-duty.

### Would hospital admins use this?
**Yes.** Resolving emergency scheduling conflicts and minimizing patient transfer times directly improves a hospital's performance metrics and resource utilization rates.

### What would hospitals reject?
* **Storing Clinical Data on a Shared Cloud**: Storing detailed diagnostic notes on a third-party multi-hospital platform will likely be rejected by legal teams due to patient confidentiality risks. The app must be redesigned to store data locally within each hospital's EHR, using the network only to route metadata.

---

## STEP 14 — Hackathon Score

| Category | Score | Rationale |
| :--- | :---: | :--- |
| **Innovation** | 8/10 | Addresses a critical problem in the Indian healthcare system (fragmented cross-hospital care coordination). |
| **Technical Complexity** | 5/10 | The backend structure is sound, but the lack of frontend-backend integration keeps the working prototype simple. |
| **UI** | 9.5/10 | Exceptional design styling, colors, and layouts. The presentation layer is very polished. |
| **UX** | 8.5/10 | The user flows are logical and clean, though it lacks loading indicators and error feedback. |
| **AI Usage** | 1/10 | Score computation is built on simple math formulas; no machine learning is utilized. |
| **Scalability** | 6/10 | Schema handles relationships well, but lacks geodatabase extensions or database indexes. |
| **Presentation** | 10/10 | The "Judge Mode" walkthrough is an outstanding tool for explaining the product during demos. |
| **Business Potential** | 8/10 | Clear SaaS monetization options if procurement hurdles can be navigated. |
| **Implementation** | 4/10 | A mockup frontend and a separate, unused backend. |
| **Overall Winning Potential** | **8.5/10** | A strong contender for hackathon prizes due to its design polish and presentation mode, but must be run as a simulated demo. |

---

## STEP 15 — Startup Score

| Category | Score | Rationale |
| :--- | :---: | :--- |
| **Market Need** | 9/10 | Life-saving potential is high; emergency response delays are a major issue in Indian cities. |
| **Execution** | 4/10 | The working prototype is mostly simulated; significant development is required to reach an MVP. |
| **Architecture** | 7/10 | Good modular design, but needs PostGIS mapping support and indexing. |
| **Scalability** | 5/10 | Relational math checks will struggle under high loads without cached traffic data. |
| **Business Model** | 7/10 | Clear B2B SaaS pricing model, though sales cycles in healthcare are very long. |
| **Technical Moat** | 3/10 | The system can be easily replicated; defensive value lies in network size, not proprietary code. |
| **Healthcare Adoption** | 3/10 | Doctors are likely to resist location tracking; hospital legal teams will flag privacy concerns. |
| **Investor Appeal** | 6/10 | High social impact appeal, but tempered by integration and sales hurdles. |
| **Patent Potential** | 2/10 | Low. The core logic is built on standard proximity calculations. |

---

## STEP 16 — Strategic Product Roadmap

### 1. Must Fix Before Demo (Next 24 Hours)
* **Simulate Latency**: Add brief, 300ms delays to form steps (like file uploads and search filtering) so the interface feels less instant and more organic.
* **Correct Typos**: Clean up visual strings (e.g. change `"Critical Care Care"` to `"Critical Care"`, and fix capitalization in `"Emergency response score"`).

### 2. Must Fix Before Hackathon Ends (Next 48 Hours)
* **Verify Presentation Slides**: Ensure the Slide walkthrough runs smoothly without any UI overlaps or state bugs.
* **Document Simulation Limits**: Clearly define that the frontend is running in simulation mode for evaluation purposes, highlighting the underlying NestJS database code in the documentation.

### 3. Must Fix Before Pilot (Next 3 Months)
* **Connect Frontend to Backend REST APIs**: Replace the mock data inside AppContext.jsx with real `fetch`/`axios` calls to the NestJS backend endpoints.
* **Integrate WebSockets Client**: Connect the React dashboard to the backend's Socket.io room events.
* **Implement a Real Background Cron Engine**: Add a background scheduler to handle the timeout and escalation process automatically.

### 4. Must Fix Before First Hospital Deployment (Next 6 Months)
* **Implement SMS & Voice Gateways**: Connect real communication APIs (such as Twilio or Plivo) to replace the mocked console logging.
* **Add Geofencing & Shift-based Tracking**: Redesign the mobile portal to only request location coordinates when a doctor is active on an emergency or scheduled shift.

### 5. Must Fix Before Scaling (Next 12 Months)
* **EHR Integration Gateways**: Build FHIR-compliant API endpoints to sync patient data directly with hospital database systems instead of storing it on a separate cloud.
* **Migrate to PostGIS**: Move location calculations to a spatial database system to calculate route travel times based on actual street grids and live traffic conditions.

---

## STEP 17 — The Brutal Truth

### If pitched to Y Combinator today, they would criticize:
> "Your software assumes doctors will download an app that tracks their location. They won't. The sales cycle to get multiple independent hospitals onto a single software platform is incredibly long. How do you plan to survive a 12-to-18-month sales process when you have no proprietary moat?"

### If shown to a Hospital CIO, they would criticize:
> "Sending patient clinical handoffs and medical logs through a shared third-party cloud platform is a major security risk. If a doctor logs patient details from our system and it's sent to another hospital's network, it violates patient privacy regulations and data protection laws. We cannot deploy this unless it integrates directly with our local EMR."

### If shown to a Senior Doctor, they would criticize:
> "I work at multiple clinics because my schedule is packed. If I am in the middle of a surgery and your app starts sending me automated phone alerts and escalating them because I didn't respond in 30 seconds, it's a major distraction. Also, I will not keep a location tracking app active on my personal phone during my off-hours."

### If shown to a Hackathon Judge, they would criticize:
> "The UI is beautifully designed, but the frontend and backend are completely disconnected. The AI scoring is just a basic weighted formula, and the document extraction features are hardcoded. It is a very clean mockup, but it's not a functional full-stack application."

---

## STEP 18 — Final Verdict

* **Genuinely Excellent**: The UI design, aesthetic styling, and the interactive presentation mode are outstanding. The NestJS backend codebase is clean, well-modularized, and has strong test coverage.
* **Average**: The scheduling conflict engine is solid, but relies on a basic grid formula that doesn't account for real-world traffic or geography.
* **Weak**: The stack integration. The frontend and backend are completely disconnected in the actual code structure.
* **What Should Be Removed**: The Simulated API Explorer. It is confusing for non-technical users and unnecessary for a healthcare portal.
* **Flagship Feature**: The AI Match & Proximity Routing Screen. Highlighting this feature's dynamic map markers, ETA updates, and communication timeline is the product's strongest selling point.
* **Company Vision**: *"Building a secure, automated routing layer that coordinates emergency medical care across independent hospital grids."*

### Final Audit Score
# 72 / 100
*(Highly impressive visual design and presentation layer, with a clean backend model, but currently operates as a simulated client mockup due to the lack of integration between the frontend and backend stacks.)*
