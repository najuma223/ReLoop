# ReLoop 2.0 — Sustainable Water Reuse Management Platform 💧🌱

A modern, production-oriented, full-stack water reuse management platform bridging the gap between non-potable water supply and demand. ReLoop connects suppliers (STPs, industrial effluent plants, greywater recyclers) with commercial and residential buyers, oversees verified logistics, validates laboratory water quality, and tracks transparent carbon and freshwater savings.

---

## 🛠️ Mandatory Technology Stack

- **Frontend:** React.js, Tailwind CSS / Vanilla CSS Design Tokens, Lucide React Icons
- **Charting & Analytics:** Recharts (Responsive Line, Bar, and Donut charts)
- **Mapping & Spatial Corridors:** Leaflet.js with OpenStreetMap
- **Backend:** Node.js with Express.js (Modular REST API with RBAC & Transactional Allocation)
- **Database:** MongoDB with Mongoose (with high-fidelity resilient in-memory fallback)
- **Authentication:** Secure JWT (JSON Web Tokens) with 7-day persistence and bcrypt password hashing
- **Environment:** Node.js, Vite build tool

---

## 🛡️ Comprehensive Admin Operations Dashboard

The Admin Dashboard provides full operational oversight for platform administrators:

### 1. Overview Analytics
- **8 Key Live Metric Cards:** Total Water Reused (L), Water Reused Today (L), Active Suppliers, Pending Buyer Requests, Pending Quality Approvals, Active Deliveries In Transit, Successful Matches, and Backend/MongoDB Health Telemetry.
- **5 Responsive Charts:** Monthly volume trends, Supply vs Demand comparisons, Reuse by water category, and Tanker delivery lifecycle breakdown.

### 2. Interactive Logistics & Corridors Map
- High-fidelity **Leaflet + OpenStreetMap** map centered across Chennai metropolitan reuse corridors.
- Distinct color-coded pins for **Suppliers** (teal/green), **Buyers** (amber/orange), and **Active Tankers** (sky blue).
- Interactive marker popups, dashed polyline transit corridors connecting facilities, and an interactive Location Details Drawer.

### 3. Smart Matching Hub (AI Multi-Criteria Decision System)
- ReLoop's core differentiator: identifies compatible pairings between eligible listings and unmatched buyer demands.
- Calculates an explainable **Match Score (0–100%)** based on:
  - Geographic road distance (Haversine corridor analysis in km).
  - Available vs requested quantity (preventing over-allocation).
  - Water category & intended reuse suitability matrix.
  - Accredited laboratory quality clearance status.
  - Demand priority and urgency.
- Provides transparent, human-readable recommendation reasons.
- **Administrative Controls:** Approve & Schedule Delivery, Reject with mandatory reason, or Manual Override (enforcing strict safety rules: rejected toxic water cannot be overridden).

### 4. Water Supply Listings & Buyer Demands
- Synchronized tabbed management for **Supplier Listings** and **Buyer Requests**.
- Table filters for water category, volume progress bars, pricing, and moderation actions (Activate / Suspend with audit justification).

### 5. Tanker Fleet & Delivery Tracking
- Enforces a 7-stage water delivery lifecycle:
  `Requested` ➔ `Matched` ➔ `Quality Cleared` ➔ `Transporter Assigned` ➔ `In Transit` ➔ `Delivered` ➔ `Completed`.
- Real-time tanker driver tracking, vehicle license plates (`TN-09-CW-8492`), payload volume, and complete chronological event logs.

### 6. Quality Verification & Lab Control
- Dedicated oversight for reports submitted by accredited laboratories (AquaCert Labs, Metro Testing).
- Parameter threshold grid checking **pH**, **Turbidity (NTU)**, **TDS (ppm)**, **BOD (mg/L)**, **COD (mg/L)**, and **E. coli (CFU/100mL)** against Central Pollution Control Board (CPCB Class IV) non-potable reuse standards.
- One-click review with approval certificates and audit tracking.

### 7. Comprehensive User Management
- Full role-based access control supporting all **5 platform roles**:
  - `Admin` (Platform Authority)
  - `Supplier` (STPs & Effluent Treatment Facilities)
  - `Buyer` (Apartments, Commercial Complexes, Metro Works)
  - `Transporter` (Tanker Fleets)
  - `Verifier` (Accredited Testing Laboratories)
- Features: Account suspension/activation, role inspection, and privilege escalation protection.

### 8. Environmental Impact & Carbon Accounting
- Transparent sustainability metrics:
  - **Freshwater Demand Avoided:** 1:1 replacement ratio.
  - **Carbon Emissions Avoided:** Standardized 0.35g CO2e per Litre avoided pumping lifecycle emissions.
  - **Pumping Energy Saved:** 1.2 Wh / Litre efficiency dividend from local proximity dispatch.
  - **Supplier Contribution Leaderboard:** Top facilities ranked by verified volume.

### 9. Operational Alerts & Exportable Reports
- Actionable alert notifications with direct deep-links to affected records.
- One-click **CSV data exports** for:
  - Water Reuse Summaries
  - Logistics Fleet Operations
  - Matching Hub Performance
  - Quality Laboratory Certificates
  - User Registry Directory

### 10. Immutable Settings & Audit Logs
- Non-repudiable audit recording of every critical administrative operation: actor identity, action type, entity type, target ID, justification reason, IP address, and timestamp.

---

## 🔑 Demo Test Accounts

| Role | Email | Password | Organization |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@reloop.org` | `Password123!` | ReLoop Water Authority |
| **Buyer** | `buyer@reloop.org` | `Password123!` | Green Valley Apartments |
| **Supplier** | `supplier@reloop.org` | `Password123!` | Apex Tech Park STP |
| **Transporter** | `transporter@reloop.org` | `Password123!` | EcoFlow Logistics Fleet |
| **Verifier** | `verifier@reloop.org` | `Password123!` | AquaCert Labs Quality Assurance |

> **Pro Tip:** The authentication screen features **Demo Quick Fill** buttons (`🛡️ Admin`, `Buyer`, `Supplier`, etc.) that auto-fill test credentials and select the matching account type with a single click.

---

## 🚀 How to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/reloop
JWT_SECRET=reloop-sustainable-water-secret-2026
```

### 3. Run Both Backend & Frontend Simultaneously
```bash
npm run dev:all
```
- **Backend API:** `http://localhost:5000`
- **React Frontend:** `http://localhost:5173` (or `http://localhost:5174`)

---

## 📂 Project Architecture

```
ReLoop/
├── server/
│   ├── index.js                  # Express application & route mounter
│   ├── db.js                     # MongoDB Mongoose connection & resilient fallback
│   ├── seed.js                   # Demo records initializer (Suppliers, Demands, Labs, Deliveries)
│   ├── models/                   # Mongoose schemas:
│   │   ├── User.js               # 5 platform roles, account status, location
│   │   ├── SupplierListing.js    # Water category, volume, price, quality status
│   │   ├── BuyerRequest.js       # Required quantity, purpose, priority
│   │   ├── Match.js              # Proximity, match scores, approval state
│   │   ├── QualityReport.js      # pH, turbidity, TDS, BOD, COD parameters
│   │   ├── Delivery.js           # 7-stage state machine, driver, vehicle plate
│   │   ├── Notification.js       # Actionable platform alerts
│   │   └── AuditLog.js           # Immutable audit ledger
│   ├── routes/
│   │   ├── auth.js               # Registration & JWT authentication
│   │   └── adminRoutes.js        # Admin APIs for overview, matching, map, quality, etc.
│   ├── services/
│   │   └── matchingService.js    # Haversine distance & AI compatibility scoring
│   └── middleware/
│       └── auth.js               # JWT verification & role authorization (RBAC)
├── src/
│   ├── components/
│   │   └── admin/
│   │       ├── admin.css         # ReLoop brand design system for Admin Portal
│   │       ├── AdminLayout.jsx   # Shell containing Sidebar, Topbar, Toasts
│   │       ├── AdminSidebar.jsx  # 11 navigation sections with collapsible drawer
│   │       ├── AdminTopbar.jsx   # Global search, notifications popover, admin profile
│   │       ├── pages/            # 10 dedicated operational sub-pages:
│   │       │   ├── AdminOverview.jsx
│   │       │   ├── AdminLogisticsMap.jsx
│   │       │   ├── AdminMatchingHub.jsx
│   │       │   ├── AdminSupplyRequests.jsx
│   │       │   ├── AdminDeliveries.jsx
│   │       │   ├── AdminQualityVerification.jsx
│   │       │   ├── AdminUserManagement.jsx
│   │       │   ├── AdminEnvironmentalImpact.jsx
│   │       │   ├── AdminAlertsReports.jsx
│   │       │   └── AdminAuditLogs.jsx
│   │       └── common/           # StatusBadge, MetricCard, ConfirmationDialog, etc.
│   ├── App.jsx                   # Main React entry & role-based portal switcher
│   └── index.css                 # Core design tokens
└── package.json
```
