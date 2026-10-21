import React, { useState } from 'react';
import {
  Search,
  Plus,
  Droplet,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Download,
  FileText,
  MapPin,
  ExternalLink,
  Sparkles,
  Layers,
  Leaf,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import WaterMap from './WaterMap';

// ============================================================================
// 1. FIND WATER TAB VIEW
// ============================================================================
export function FindWaterTab({ sources, onRequestClick, demands }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [maxDistance, setMaxDistance] = useState(15);

  const categories = ['All', 'Industrial', 'Treated Wastewater', 'RO Reject Water', 'Greywater'];

  const filtered = (sources || []).filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.type.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesQuery = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase());
    const matchesDist = (s.distance || 0) <= maxDistance;
    return matchesCat && matchesQuery && matchesDist;
  });

  return (
    <div className="tab-page-container">
      <div className="tab-header-banner">
        <div>
          <h2 className="tab-page-title">Find & Source Reusable Water</h2>
          <p className="tab-page-subtitle">
            Browse verified STP treated, industrial, and greywater suppliers across Chennai for your non-drinking needs.
          </p>
        </div>
      </div>

      {/* Interactive Map of Sources */}
      <div style={{ marginBottom: '24px' }}>
        <WaterMap sources={sources} demands={demands} onRequestSource={onRequestClick} />
      </div>

      {/* Filter and Search Bar */}
      <div className="tab-filter-bar">
        <div className="tab-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search suppliers, treatment types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tab-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="distance-slider-wrap">
          <label>Max Distance: <strong>{maxDistance} km</strong></label>
          <input
            type="range"
            min="2"
            max="25"
            value={maxDistance}
            onChange={(e) => setMaxDistance(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="sources-card-grid">
        {filtered.map((src) => (
          <div key={src.id} className="supplier-detail-card">
            <div className="card-top-row">
              <div className="supplier-avatar-box">
                <Droplet size={22} />
              </div>
              <div>
                <h4 className="supplier-name">{src.name}</h4>
                <span className="supplier-type-tag">{src.type}</span>
              </div>
              <span className={`quality-badge ${src.quality === 'Verified' ? 'verified' : 'pending'}`}>
                {src.quality === 'Verified' ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                {src.quality}
              </span>
            </div>

            <p className="supplier-desc">{src.description}</p>

            <div className="supplier-spec-grid">
              <div className="spec-item">
                <span className="spec-label">Capacity</span>
                <span className="spec-val">{(src.quantity || 0).toLocaleString()} L</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Distance</span>
                <span className="spec-val">{src.distance} km</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Est. Cost</span>
                <span className="spec-val">₹180 / kL</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Fresh Savings</span>
                <span className="spec-val" style={{ color: '#059669' }}>65% less</span>
              </div>
            </div>

            <button
              className="btn-request-match"
              onClick={() => onRequestClick(src)}
            >
              Request Water Allocation
              <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 2. MY DEMANDS TAB VIEW
// ============================================================================
export function MyDemandsTab({ demands, onOpenCreateDemand }) {
  const totalLitres = (demands || []).reduce((sum, d) => sum + Number(d.quantity || 0), 0);
  const activeCount = (demands || []).filter((d) => d.status === 'Active').length;

  return (
    <div className="tab-page-container">
      <div className="tab-header-banner">
        <div>
          <h2 className="tab-page-title">My Water Demands</h2>
          <p className="tab-page-subtitle">
            Manage your registered water demand requests, required purposes, and automated matching status.
          </p>
        </div>
        <button className="btn-primary-action" onClick={onOpenCreateDemand}>
          <Plus size={16} />
          Post New Demand
        </button>
      </div>

      {/* Summary KPI mini-bar */}
      <div className="tab-kpi-bar">
        <div className="kpi-mini-card">
          <span className="kpi-mini-label">Total Demands</span>
          <span className="kpi-mini-val">{demands?.length || 0}</span>
        </div>
        <div className="kpi-mini-card">
          <span className="kpi-mini-label">Active Matching</span>
          <span className="kpi-mini-val" style={{ color: '#059669' }}>{activeCount}</span>
        </div>
        <div className="kpi-mini-card">
          <span className="kpi-mini-label">Total Volume Needed</span>
          <span className="kpi-mini-val">{totalLitres.toLocaleString()} Litres</span>
        </div>
        <div className="kpi-mini-card">
          <span className="kpi-mini-label">Avg. Lead Time</span>
          <span className="kpi-mini-val">2.4 Hours</span>
        </div>
      </div>

      {/* Demand Cards List */}
      <div className="demands-list-grid">
        {(demands || []).map((dem) => (
          <div key={dem.id} className="demand-management-card">
            <div className="demand-card-header">
              <div>
                <h4 className="demand-card-title">{dem.title}</h4>
                <span className="demand-purpose-pill">Purpose: {dem.purpose}</span>
              </div>
              <span className={`demand-status-badge status-${dem.status?.toLowerCase()}`}>
                {dem.status}
              </span>
            </div>

            <div className="demand-volume-row">
              <div>
                <span className="demand-vol-num">{(dem.quantity || 0).toLocaleString()}</span>
                <span className="demand-vol-unit"> Litres</span>
              </div>
              <span className="demand-date">Created on {dem.createdAt || 'Apr 20, 2026'}</span>
            </div>

            <div className="demand-match-progress">
              <div className="progress-labels">
                <span>Matching Progress</span>
                <span>{dem.status === 'Active' ? '80% matched' : 'Pending route'}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: dem.status === 'Active' ? '80%' : '35%' }}
                ></div>
              </div>
            </div>

            <div className="demand-card-footer">
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                Chennai, TN
              </span>
              <button
                className="btn-outline-sm"
                onClick={() => alert(`Allocating supply for demand: ${dem.title}`)}
              >
                View Matches
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 3. MY MATCHES TAB VIEW
// ============================================================================
export function MyMatchesTab({ showToast }) {
  const matches = [
    {
      id: 'MAT-2026-081',
      source: 'Factory A (Industrial Recycled)',
      destination: 'Green Valley Apartments (Facility Tank #1)',
      volume: 4000,
      transporter: 'EcoFlow Tanker TN-09-AX-4421',
      driver: 'K. Ramesh (+91 98401 22334)',
      eta: 'In Transit — 22 mins away',
      status: 'In Transit',
      qaCert: 'AquaCert QA-9921 (Passed)',
      cost: 1020,
      savings: 1380,
    },
    {
      id: 'MAT-2026-079',
      source: 'Apartment Complex (Greywater Media)',
      destination: 'Green Valley Landscape Zone',
      volume: 3500,
      transporter: 'EcoFlow Tanker TN-07-CB-1190',
      driver: 'M. Senthil (+91 98842 55441)',
      eta: 'Delivered Today at 10:30 AM',
      status: 'Completed',
      qaCert: 'AquaCert QA-9874 (Passed)',
      cost: 890,
      savings: 1210,
    },
  ];

  return (
    <div className="tab-page-container">
      <div className="tab-header-banner">
        <div>
          <h2 className="tab-page-title">My Matches & Deliveries</h2>
          <p className="tab-page-subtitle">
            Track active water transport routes, lab certifications, tanker dispatch, and confirm delivered litres.
          </p>
        </div>
      </div>

      <div className="matches-feed">
        {matches.map((m) => (
          <div key={m.id} className="match-order-card">
            <div className="match-header-row">
              <div>
                <span className="match-id-pill">{m.id}</span>
                <h3 className="match-route-title">
                  {m.source} ➔ {m.destination}
                </h3>
              </div>
              <span className={`match-status-badge ${m.status === 'In Transit' ? 'transit' : 'completed'}`}>
                {m.status === 'In Transit' ? <Truck size={14} /> : <CheckCircle2 size={14} />}
                {m.status}
              </span>
            </div>

            {/* Stepper */}
            <div className="delivery-stepper">
              <div className="step-point completed">
                <div className="step-dot">✓</div>
                <span>Deal Agreed</span>
              </div>
              <div className="step-line completed"></div>
              <div className="step-point completed">
                <div className="step-dot">✓</div>
                <span>Lab QA Passed</span>
              </div>
              <div className="step-line completed"></div>
              <div className={`step-point ${m.status === 'In Transit' ? 'active' : 'completed'}`}>
                <div className="step-dot">{m.status === 'In Transit' ? '🚚' : '✓'}</div>
                <span>Dispatched</span>
              </div>
              <div className={`step-line ${m.status === 'Completed' ? 'completed' : ''}`}></div>
              <div className={`step-point ${m.status === 'Completed' ? 'completed' : 'pending'}`}>
                <div className="step-dot">{m.status === 'Completed' ? '✓' : '4'}</div>
                <span>Delivered & Confirmed</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="match-details-grid">
              <div className="m-detail-item">
                <span className="m-label">Volume</span>
                <span className="m-val">{m.volume.toLocaleString()} Litres</span>
              </div>
              <div className="m-detail-item">
                <span className="m-label">Transporter</span>
                <span className="m-val">{m.transporter}</span>
              </div>
              <div className="m-detail-item">
                <span className="m-label">ETA / Arrival</span>
                <span className="m-val">{m.eta}</span>
              </div>
              <div className="m-detail-item">
                <span className="m-label">QA Verification</span>
                <span className="m-val" style={{ color: '#059669' }}>
                  <ShieldCheck size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  {m.qaCert}
                </span>
              </div>
            </div>

            <div className="match-action-bar">
              <div className="savings-callout">
                Total ₹{m.cost} · <strong>Saved ₹{m.savings} vs Fresh Water</strong>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn-outline-sm"
                  onClick={() => showToast(`Opening live GPS tracker for ${m.transporter}...`, 'info')}
                >
                  <MapPin size={14} />
                  Live GPS
                </button>
                <button
                  className="btn-primary-sm"
                  onClick={() => showToast(`Delivery confirmed for ${m.volume.toLocaleString()} L! Impact ledger updated.`, 'success')}
                >
                  <CheckCircle2 size={14} />
                  Confirm Receipt
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 4. RELOOP RESCUE TAB VIEW
// ============================================================================
export function ReloopRescueTab({ onOpenRescueModal }) {
  return (
    <div className="tab-page-container">
      <div className="rescue-hero-card">
        <div className="rescue-hero-left">
          <div className="rescue-badge-pill">
            <ShieldAlert size={14} />
            AUTOMATED REDUNDANCY & FAILOVER
          </div>
          <h2 className="rescue-hero-title">ReLoop Rescue™ Continuous Supply Shield</h2>
          <p className="rescue-hero-desc">
            Water disruptions happen. When an active water supplier experiences an unexpected shortage,
            contamination alert, or audit failure, ReLoop Rescue automatically re-routes your required supply
            to verified alternatives within a 10 km radius in seconds.
          </p>

          <div className="rescue-actions-row">
            <button className="btn-rescue-action" onClick={onOpenRescueModal}>
              ⚡ Run Live Rescue Simulation
            </button>
            <span className="rescue-status-tag">
              <CheckCircle2 size={15} /> All 4 Alternative Nodes Standby
            </span>
          </div>
        </div>
      </div>

      {/* 3 Step Architecture */}
      <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '28px 0 16px' }}>
        How ReLoop Rescue™ Protects Your Water Continuity:
      </h3>
      <div className="rescue-steps-grid">
        <div className="rescue-step-card">
          <div className="step-num-icon">1</div>
          <h4>Instant Anomaly Detection</h4>
          <p>Continuous IoT sensor audits and verifier test checks detect water purity drops or volume anomalies before delivery.</p>
        </div>
        <div className="rescue-step-card">
          <div className="step-num-icon">2</div>
          <h4>10 km Radius Spatial Scan</h4>
          <p>Our spatial matching engine searches nearby suppliers with pre-approved water quality criteria matching your exact application.</p>
        </div>
        <div className="rescue-step-card">
          <div className="step-num-icon">3</div>
          <h4>Automated Fleet Re-Route</h4>
          <p>Transporters receive dynamic route updates on their GPS terminal to pick up from the fallback supplier with zero manual friction.</p>
        </div>
      </div>

      {/* Standby Nodes */}
      <div className="standby-nodes-box">
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
          Active Backup Redundancy Nodes (Chennai Metro):
        </h4>
        <div className="nodes-table">
          <div className="node-row">
            <span>🏭 <strong>Apex STP Plant Secondary Basin</strong></span>
            <span>7,000 L Reserve</span>
            <span className="node-dist">4.2 km</span>
            <span className="node-ready">Ready for Failover</span>
          </div>
          <div className="node-row">
            <span>🏢 <strong>Tidel Tech Park Industrial Cooling Return</strong></span>
            <span>4,000 L Reserve</span>
            <span className="node-dist">5.8 km</span>
            <span className="node-ready">Ready for Failover</span>
          </div>
          <div className="node-row">
            <span>🏢 <strong>Olympia Tech Park Dual Filter System</strong></span>
            <span>6,500 L Reserve</span>
            <span className="node-dist">7.1 km</span>
            <span className="node-ready">Ready for Failover</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. IMPACT REPORTS TAB VIEW
// ============================================================================
export function ImpactReportsTab({ stats, showToast }) {
  return (
    <div className="tab-page-container">
      <div className="tab-header-banner">
        <div>
          <h2 className="tab-page-title">Water Impact Ledger & Sustainability Reports</h2>
          <p className="tab-page-subtitle">
            Cryptographically logged proof of circular water usage, freshwater conservation, and ESG compliance.
          </p>
        </div>
        <button
          className="btn-primary-action"
          onClick={() => showToast('Generating official Circularity Certificate PDF...', 'success')}
        >
          <Download size={16} />
          Download Certificate
        </button>
      </div>

      {/* Big Impact Numbers */}
      <div className="impact-kpi-quad">
        <div className="impact-kpi-tile">
          <div className="kpi-tile-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <Droplet size={24} />
          </div>
          <div>
            <span className="impact-stat-big">{(stats?.freshwaterSaved || 8000).toLocaleString()} L</span>
            <span className="impact-stat-label">Freshwater Conserved</span>
          </div>
        </div>

        <div className="impact-kpi-tile">
          <div className="kpi-tile-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <Leaf size={24} />
          </div>
          <div>
            <span className="impact-stat-big">18.4 kg</span>
            <span className="impact-stat-label">Avoided CO₂ Emissions</span>
          </div>
        </div>

        <div className="impact-kpi-tile">
          <div className="kpi-tile-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="impact-stat-big">₹{(stats?.transportCost || 14500).toLocaleString()}</span>
            <span className="impact-stat-label">Total Water Expense Saved</span>
          </div>
        </div>

        <div className="impact-kpi-tile">
          <div className="kpi-tile-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span className="impact-stat-big">92%</span>
            <span className="impact-stat-label">Circularity Index Score</span>
          </div>
        </div>
      </div>

      {/* Official Certificate Banner */}
      <div className="cert-preview-card">
        <div className="cert-seal">
          <ShieldCheck size={36} color="#059669" />
        </div>
        <div className="cert-info">
          <h3>Government CPCB Verified Green Facility Certificate</h3>
          <p>
            Issued to <strong>Green Valley Apartments</strong> for circular water recycling in compliance with
            TNPCB & CPCB 2026 Water Sustainability Mandates. Hash: <code>0x98f4...e210</code>
          </p>
        </div>
        <button
          className="btn-outline-sm"
          onClick={() => showToast('Opening certificate verification ledger...', 'info')}
        >
          <ExternalLink size={14} /> Verify On-Chain
        </button>
      </div>

      {/* Transaction Log */}
      <div className="impact-ledger-table-wrap">
        <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
          Immutable Water Impact Ledger
        </h4>
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Source</th>
              <th>Litres Reused</th>
              <th>Freshwater Avoided</th>
              <th>Verifier QA</th>
              <th>Ledger Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>#LEDG-9901</code></td>
              <td>Oct 21, 2026</td>
              <td>Factory A STP</td>
              <td>4,000 L</td>
              <td>8,000 L eq.</td>
              <td><span className="badge-pass">Passed</span></td>
              <td><span className="badge-confirmed">Confirmed</span></td>
            </tr>
            <tr>
              <td><code>#LEDG-9884</code></td>
              <td>Oct 19, 2026</td>
              <td>Apartment Complex</td>
              <td>3,500 L</td>
              <td>7,000 L eq.</td>
              <td><span className="badge-pass">Passed</span></td>
              <td><span className="badge-confirmed">Confirmed</span></td>
            </tr>
            <tr>
              <td><code>#LEDG-9842</code></td>
              <td>Oct 17, 2026</td>
              <td>IT Park RO Plant</td>
              <td>4,000 L</td>
              <td>8,000 L eq.</td>
              <td><span className="badge-pass">Passed</span></td>
              <td><span className="badge-confirmed">Confirmed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
