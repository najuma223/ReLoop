# ReLoop — Reuse Today, Sustain Tomorrow 💧🌱

A modern, full-stack water reuse management platform built according to the recommended technology stack:

- **React.js (Frontend)**: Interactive Buyer dashboard with dynamic metrics, real-time filtering, demand forms, and allocation modals.
- **Leaflet (Map Engine)**: Interactive spatial map centered in Chennai showing suppliers, buyers, active delivery routes, and custom popups.
- **Node.js (Runtime)**: High-performance JavaScript server runtime.
- **Express.js (Backend)**: RESTful API managing water sources, demand requests, matching logic, and **ReLoop Rescue™** emergency failover.
- **MongoDB Structure (Database / Persistence Layer)**: Data store tracking accounts, water records, quality certifications, and transactions.

---

## 🚀 Quick Start

### 1. Backend Server
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🌟 Key Features

1. **Dashboard Overview**:
   - Total Demand, Matched Quantity, Freshwater Saved, and Unmet Demand cards with wavy gradients.
   - Dynamic greetings, Chennai weather widget, and live system notifications.

2. **Interactive Leaflet Map**:
   - Pins for suppliers (Factory A, STP Plant, IT Park, Apartment Complex) and buyer destination (Green Park).
   - Animated recommended route polyline and floating info cards.

3. **Available Water Sources Table**:
   - Filterable water sources by category and certification status (*Verified* vs *Pending*).
   - Instant "Request" button to trigger water allocation with chosen demands.

4. **ReLoop Rescue™**:
   - Automated routing algorithm that locates verified backup water sources within a 10 km radius if a primary supplier becomes unavailable.

5. **Impact at a Glance**:
   - Real-time calculations of water reused, avoided freshwater, estimated transport costs, and active sources.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
