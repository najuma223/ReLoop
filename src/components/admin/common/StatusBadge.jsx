import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Truck, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function StatusBadge({ status, type = 'general' }) {
  if (!status) return null;

  const normalized = String(status).toLowerCase();

  // Verification & Quality badges
  if (normalized === 'verified' || normalized === 'approved' || normalized === 'passed') {
    return (
      <span className="admin-badge admin-badge-success">
        <CheckCircle2 size={12} />
        {status}
      </span>
    );
  }

  if (normalized === 'pending' || normalized === 'in review' || normalized === 'proposed' || normalized === 'transporter assigned') {
    return (
      <span className="admin-badge admin-badge-warning">
        <Clock size={12} />
        {status}
      </span>
    );
  }

  if (normalized === 'rejected' || normalized === 'failed' || normalized === 'cancelled' || normalized === 'suspended') {
    return (
      <span className="admin-badge admin-badge-danger">
        <XCircle size={12} />
        {status}
      </span>
    );
  }

  if (normalized === 'in transit') {
    return (
      <span className="admin-badge admin-badge-info">
        <Truck size={12} />
        {status}
      </span>
    );
  }

  if (normalized === 'completed' || normalized === 'delivered' || normalized === 'fulfilled') {
    return (
      <span className="admin-badge admin-badge-success">
        <CheckCircle2 size={12} />
        {status}
      </span>
    );
  }

  if (normalized === 'urgent') {
    return (
      <span className="admin-badge admin-badge-danger">
        <AlertTriangle size={12} />
        Urgent
      </span>
    );
  }

  if (normalized === 'high') {
    return (
      <span className="admin-badge admin-badge-warning">
        <AlertTriangle size={12} />
        High
      </span>
    );
  }

  if (normalized === 'overridden') {
    return (
      <span className="admin-badge admin-badge-warning">
        <ShieldAlert size={12} />
        Overridden
      </span>
    );
  }

  return (
    <span className="admin-badge admin-badge-neutral">
      {status}
    </span>
  );
}
