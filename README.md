# ReLoop 2.0 — Sustainable Water Reuse Platform 💧🌱

An intelligent, transparent, and scalable water-reuse matching and safety-verification platform connecting **Suppliers**, **Buyers**, **Transporters**, and **Verifiers** to reduce freshwater dependency and eliminate water wastage.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, modern Vanilla CSS, Lucide icons
- **Runtime:** Node.js
- **Backend:** Express.js (REST API, JWT Authentication, ReLoop Rescue™ failover)
- **Database:** MongoDB (Mongoose with persistent data store)
- **Mapping:** Leaflet Maps (interactive spatial map tracking suppliers, buyers, and delivery tankers)

---

## 🌟 Key Platform Modules & Dashboards

1. **Role-Based Authentication & Portal Switcher**:
   - Split-screen design with secure role matching across *Buyer*, *Supplier*, *Verifier*, and *Transporter*.
   - Strict 10-digit mobile number validation and JWT authentication.

2. **Buyer Dashboard**:
   - Total Demand, Matched Quantity, Freshwater Saved, and Unmet Demand metrics.
   - Interactive Leaflet Map tracking suppliers and delivery routes.
   - Real-time filterable available water sources (*Verified* vs *Pending*).
   - **ReLoop Rescue™**: Automated backup water source allocation within a 10 km radius if a primary supplier becomes unavailable.
   - Environmental Impact Ledger.

3. **Supplier / Seller Dashboard**:
   - Listing STP treated water supply, scheduling quality audits, and monitoring payouts.

4. **Verifier Dashboard**:
   - Water quality certificate approvals and lab safety validation gates.

5. **Transporter Portal**:
   - Real-time tanker delivery jobs, GPS routes, and volume confirmation.

---

## 🚀 How to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Both Backend & Frontend Simultaneously
```bash
npm run dev:all
```
- **Express Backend:** `http://localhost:5000`
- **React Frontend:** `http://localhost:5173`

---

## 🔑 Demo Test Accounts

| Role | Email | Password | Name / Organization |
| :--- | :--- | :--- | :--- |
| **Buyer** | `buyer@reloop.org` | `Password123!` | Green Valley Apartments |
| **Supplier** | `supplier@reloop.org` | `Password123!` | Apex Tech Park STP |
| **Transporter** | `transporter@reloop.org` | `Password123!` | EcoFlow Logistics Fleet |
| **Verifier** | `verifier@reloop.org` | `Password123!` | AquaCert Labs Quality Assurance |

---

## 📂 Project Structure

```
ReLoop/
├── index.html            # Main HTML entry
├── package.json          # Root dependencies & scripts
├── vite.config.js        # Vite config with API proxy to port 5000
├── src/                  # React Frontend (Login & Portal Hub)
├── server/               # Express Backend & MongoDB Models
├── frontend/             # Buyer Dashboard React components & Leaflet Map
└── backend/              # Water matching & ReLoop Rescue APIs
```
