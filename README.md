# ReLoop 2.0 — Sustainable Water Reuse Platform

An intelligent, transparent, and scalable water-reuse matching and safety-verification platform connecting **Suppliers**, **Buyers**, **Transporters**, and **Verifiers** to reduce freshwater dependency and eliminate water wastage.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, modern CSS, Lucide icons
- **Runtime:** Node.js
- **Backend:** Express.js (REST API, JWT Authentication)
- **Database:** MongoDB (Mongoose with in-memory resilient fallback)
- **Mapping:** Leaflet Maps (for tracking supply routes & tankers)

---

## 🚀 How to Run the Project

### 1. Install Dependencies (first time only)
```bash
npm install
```

### 2. Run Both Backend & Frontend Simultaneously (Recommended)
```bash
npm run dev:all
```
This single command runs:
- **Express Backend:** `http://localhost:5000`
- **React Frontend:** `http://localhost:5173`

---

### Alternative: Run Separately in Two Terminals

#### Terminal 1 — Backend:
```bash
npm run server
```
*(Starts Express server on `http://localhost:5000` & connects to MongoDB)*

#### Terminal 2 — Frontend:
```bash
npm run dev
```
*(Starts Vite React dev server on `http://localhost:5173`)*

---

## 🌐 Accessing the Application

Open your browser and navigate to:
**[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Demo Test Accounts

You can test logging in or registering with any of the 4 roles:

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
├── index.html            # Main HTML entry with Inter fonts
├── package.json          # Dependencies & npm scripts
├── vite.config.js        # Vite config with API proxy to port 5000
├── src/
│   ├── main.jsx          # React DOM entry
│   ├── App.jsx           # ReLoop 2.0 Auth & Dashboard Hub
│   ├── App.css           # Pixel-accurate component styles
│   └── index.css         # Global design system & variables
└── server/
    ├── index.js          # Express server entry point
    ├── db.js             # MongoDB connection with resilient fallback
    ├── models/
    │   └── User.js       # User Mongoose schema (roles: buyer, supplier, transporter, verifier)
    └── routes/
        └── auth.js       # Register, login, and profile JWT endpoints
```
