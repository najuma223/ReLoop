import React, { useState } from 'react';
import { 
  X, 
  Droplet, 
  ShieldAlert, 
  ShieldCheck,
  CheckCircle2, 
  MapPin, 
  Zap, 
  AlertCircle,
  FileText
} from 'lucide-react';

export function CreateDemandModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState(3000);
  const [purpose, setPurpose] = useState('Irrigation');
  const [location, setLocation] = useState('Chennai, Tamil Nadu');
  const [needQualityCheck, setNeedQualityCheck] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      quantity: Number(quantity),
      purpose,
      location,
      needQualityCheck
    });
    setTitle('');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge bg-blue-100 text-blue-600">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="modal-title">Create Water Demand</h3>
              <p className="modal-subtitle">Post a new reusable water demand request to the network</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Facility / Destination Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Green Park Sector 4, Sports Arena" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Quantity Needed (Litres)</label>
              <input 
                type="number" 
                step="500" 
                min="500" 
                className="form-input" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reuse Purpose</label>
              <select 
                className="form-select"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                <option value="Irrigation">Irrigation / Landscaping</option>
                <option value="Construction">Construction & Dust Control</option>
                <option value="Industrial">Industrial Cooling Tower</option>
                <option value="Flushing">Toilet Flushing & Utilities</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Location</label>
            <div className="input-with-icon">
              <MapPin size={16} className="input-icon" />
              <input 
                type="text" 
                className="form-input with-icon" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Quality Check Option */}
          <div className="qc-question-section" style={{ marginTop: '12px' }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} className="text-emerald-600" />
              Do you need a Quality Check for this demand?
            </label>
            <div className="quality-check-toggle-row">
              <button
                type="button"
                className={`btn-toggle-qc ${needQualityCheck ? 'active' : ''}`}
                onClick={() => setNeedQualityCheck(true)}
              >
                ✓ Yes, Require Quality Check
              </button>
              <button
                type="button"
                className={`btn-toggle-qc ${!needQualityCheck ? 'active' : ''}`}
                onClick={() => setNeedQualityCheck(false)}
              >
                ✕ No, Direct Supply
              </button>
            </div>
          </div>

          <div className="modal-actions" style={{ marginTop: '20px' }}>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Submit Demand Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function RequestModal({ isOpen, onClose, source, demands, onConfirm }) {
  const [selectedDemandId, setSelectedDemandId] = useState(demands[0]?.id || '');
  const [requestedLiters, setRequestedLiters] = useState(source?.quantity || 4000);
  const [needQualityCheck, setNeedQualityCheck] = useState(true);

  if (!isOpen || !source) return null;

  const handleConfirm = () => {
    onConfirm(source.id, selectedDemandId, requestedLiters, needQualityCheck);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container request-allocation-modal">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge bg-emerald-100 text-emerald-600">
              <Droplet size={20} />
            </div>
            <div>
              <h3 className="modal-title">Request Water Allocation</h3>
              <p className="modal-subtitle">Connect with {source.name} for treated water delivery</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="source-summary-box">
            <div className="summary-row">
              <span className="summary-label">Selected Supplier:</span>
              <strong className="summary-val">{source.name}</strong>
            </div>
            <div className="summary-row">
              <span className="summary-label">Water Category:</span>
              <span className="summary-val">{source.type}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Available Capacity:</span>
              <span className="summary-val">{source.quantity.toLocaleString()} L</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Distance:</span>
              <span className="summary-val">{source.distance} km</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Quality Status:</span>
              <span className={`quality-badge badge-${source.quality.toLowerCase()}`}>
                {source.quality}
              </span>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">Allocate To My Demand Request</label>
            <select 
              className="form-select"
              value={selectedDemandId}
              onChange={(e) => setSelectedDemandId(e.target.value)}
            >
              {demands.map(d => (
                <option key={d.id} value={d.id}>
                  {d.title} — {d.quantity.toLocaleString()} L ({d.purpose})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Requested Volume (Litres)</label>
            <input 
              type="number"
              max={source.quantity}
              className="form-input"
              value={requestedLiters}
              onChange={(e) => setRequestedLiters(e.target.value)}
            />
          </div>

          {/* Quality Check Decision Question */}
          <div className="qc-question-section">
            <div className="qc-question-header">
              <ShieldCheck size={18} className="qc-question-icon" />
              <div>
                <h4 className="qc-question-title">Do you need a Quality Check before delivery?</h4>
                <p className="qc-question-desc">Choose whether an accredited verifier should inspect and certify this batch.</p>
              </div>
            </div>

            <div className="qc-choices-grid">
              <button
                type="button"
                className={`qc-choice-btn ${needQualityCheck === true ? 'selected-yes' : ''}`}
                onClick={() => setNeedQualityCheck(true)}
              >
                <div className="qc-radio-bullet">{needQualityCheck === true ? '✓' : '○'}</div>
                <div className="qc-choice-content">
                  <div className="qc-choice-title">
                    <span>Yes, I need Quality Check</span>
                    <span className="qc-pill-badge">Recommended</span>
                  </div>
                  <p className="qc-choice-sub">
                    Accredited Verifier tests TDS, pH, and BOD levels with digital CPCB certification before tanker dispatch.
                  </p>
                </div>
              </button>

              <button
                type="button"
                className={`qc-choice-btn ${needQualityCheck === false ? 'selected-no' : ''}`}
                onClick={() => setNeedQualityCheck(false)}
              >
                <div className="qc-radio-bullet">{needQualityCheck === false ? '✓' : '○'}</div>
                <div className="qc-choice-content">
                  <div className="qc-choice-title">
                    <span>No Quality Check needed</span>
                  </div>
                  <p className="qc-choice-sub">
                    Direct dispatch based on supplier self-declared specs. Faster turnaround without lab test.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="button" className="btn-primary" onClick={handleConfirm}>
            Confirm Matching & Routing
          </button>
        </div>
      </div>
    </div>
  );
}

export function RescueModal({ isOpen, onClose, onExecuteRescue }) {
  const [status, setStatus] = useState('idle'); // idle | running | success
  const [rescueResult, setRescueResult] = useState(null);

  if (!isOpen) return null;

  const runRescue = async () => {
    setStatus('running');
    setTimeout(async () => {
      const result = await onExecuteRescue();
      setRescueResult(result);
      setStatus('success');
    }, 1200);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container rescue-modal">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge bg-teal-800 text-teal-200">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className="modal-title">ReLoop Rescue™ Emergency Routing</h3>
              <p className="modal-subtitle">Automated fallback algorithm when a primary supplier is offline</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {status === 'idle' && (
            <div className="rescue-step-box">
              <div className="rescue-alert-notice">
                <AlertCircle size={20} className="text-amber-500" />
                <p>
                  Did a water source drop offline or fail quality standards? 
                  ReLoop Rescue automatically scans local verified producers (STP, Greywater, Industrial) 
                  within a 10 km radius and matches an instant backup.
                </p>
              </div>

              <div className="rescue-features-list">
                <div className="rescue-feat-item">
                  <Zap size={16} className="text-teal-600" />
                  <span>Instant geo-distance re-route</span>
                </div>
                <div className="rescue-feat-item">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Only 100% lab-verified backups</span>
                </div>
                <div className="rescue-feat-item">
                  <Droplet size={16} className="text-blue-600" />
                  <span>Zero interruption to ongoing irrigation & construction</span>
                </div>
              </div>
            </div>
          )}

          {status === 'running' && (
            <div className="rescue-loading-state">
              <div className="pulse-spinner"></div>
              <h4>Analyzing Network & Calculating Optimal Alternative...</h4>
              <p>Scanning 4 nearby sources against Green Park demand requirements.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="rescue-success-state">
              <div className="success-icon-wrap">
                <CheckCircle2 size={36} className="text-emerald-500" />
              </div>
              <h4 className="success-title">Emergency Backup Locked In!</h4>
              <p className="success-subtitle">
                Successfully redirected supply from <strong>Apartment Complex</strong> (Greywater, 3,000 L, 4.2 km)
                to fulfill Green Park irrigation.
              </p>
              <div className="stat-pill-summary">
                <span>Distance: 4.2 km</span> · <span>Quality: Verified</span> · <span>Status: Dispatched</span>
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          {status === 'idle' && (
            <>
              <button className="btn-cancel" onClick={onClose}>Close</button>
              <button className="btn-primary btn-rescue-primary" onClick={runRescue}>
                Activate ReLoop Rescue Now
              </button>
            </>
          )}
          {status === 'success' && (
            <button className="btn-primary" onClick={onClose}>Done</button>
          )}
        </div>
      </div>
    </div>
  );
}
