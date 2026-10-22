import React, { useEffect, useState } from 'react';
import {
  BellRing,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Filter,
  Check,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SkeletonLoader from '../common/SkeletonLoader';

export default function AdminAlertsReports({ onNavigate, showToast }) {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'reports'
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.notifications || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      fetchNotifications();
      if (showToast) showToast({ type: 'success', message: 'All alerts marked as read.' });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (severityFilter !== 'all' && n.severity !== severityFilter) return false;
    return true;
  });

  const reportCards = [
    {
      id: 'water-reuse',
      title: 'Water Reuse & Environmental Impact Summary',
      description: 'Monthly aggregates of litres reused, freshwater saved, and avoided lifecycle emissions.',
      endpoint: '/api/reports/export?reportType=water-reuse',
      filename: 'reloop-water-reuse.csv',
      category: 'Environmental',
    },
    {
      id: 'deliveries',
      title: 'Logistics Fleet & Delivery Operations',
      description: 'Tanker dispatches, road corridors, driver assignments, and transit durations.',
      endpoint: '/api/reports/export?reportType=deliveries',
      filename: 'reloop-deliveries.csv',
      category: 'Logistics',
    },
    {
      id: 'matches',
      title: 'Intelligent Matching Hub Performance',
      description: 'Compatibility scores, approved pairings, overrides, and distance efficiencies.',
      endpoint: '/api/reports/export?reportType=matches',
      filename: 'reloop-matches.csv',
      category: 'Operations',
    },
    {
      id: 'quality',
      title: 'Water Quality Laboratory Verification Ledger',
      description: 'CPCB parameter readings (pH, turbidity, TDS, BOD, COD), verifier approvals, and certificates.',
      endpoint: '/api/reports/export?reportType=quality',
      filename: 'reloop-quality-reports.csv',
      category: 'Compliance',
    },
    {
      id: 'users',
      title: 'Platform User Registry & Verification Status',
      description: 'Audited directory of Suppliers, Buyers, Transporters, Verifiers, and Administrators.',
      endpoint: '/api/reports/export?reportType=users',
      filename: 'reloop-users.csv',
      category: 'Administrative',
    },
  ];

  return (
    <div className="admin-page-content" style={{ gap: '1.25rem' }}>
      {/* Top Banner */}
      <div
        className="admin-card"
        style={{
          background: 'linear-gradient(135deg, #062826 0%, #0c6e5d 100%)',
          color: '#ffffff',
          padding: '1.5rem 1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span
                style={{
                  background: 'rgba(45, 212, 191, 0.25)',
                  color: '#2dd4bf',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                }}
              >
                Actionable Intelligence
              </span>
              <span style={{ fontSize: '0.78rem', color: '#80a7a2' }}>Notifications & Export Engine</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Alerts, Dispatches & Formal Reporting</h2>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '640px', marginTop: '0.25rem' }}>
              Real-time operational alerts for unallocated requests or lab approvals, combined with automated CSV data extraction for municipal audits.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('alerts')}
            style={{
              padding: '0.55rem 1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: activeTab === 'alerts' ? '#0c6e5d' : '#64748b',
              borderBottom: activeTab === 'alerts' ? '2.5px solid #0c6e5d' : 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <BellRing size={16} />
            Actionable Alerts ({unreadCount} unread)
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '0.55rem 1rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: activeTab === 'reports' ? '#0c6e5d' : '#64748b',
              borderBottom: activeTab === 'reports' ? '2.5px solid #0c6e5d' : 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <FileSpreadsheet size={16} />
            Exportable Reports ({reportCards.length})
          </button>
        </div>

        {activeTab === 'alerts' && unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="admin-btn admin-btn-sm admin-btn-secondary"
          >
            <Check size={14} /> Mark All Read
          </button>
        )}
      </div>

      {/* Tab 1: Alerts */}
      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredNotifications.length === 0 ? (
            <div className="admin-card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <CheckCircle2 size={36} color="#0c6e5d" style={{ margin: '0 auto 0.75rem auto' }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>No Unhandled Alerts</h3>
              <p style={{ fontSize: '0.85rem' }}>All platform workflows are running smoothly.</p>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const isWarning = n.severity === 'warning';
              const isSuccess = n.severity === 'success';

              return (
                <div
                  key={n._id}
                  className="admin-card"
                  style={{
                    padding: '1.15rem 1.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    background: n.read ? '#ffffff' : '#f8fafc',
                    borderLeft: `4px solid ${isWarning ? '#f59e0b' : (isSuccess ? '#10b981' : '#0284c7')}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1 }}>
                    <div
                      style={{
                        color: isWarning ? '#f59e0b' : (isSuccess ? '#10b981' : '#0284c7'),
                        marginTop: '2px',
                        flexShrink: 0,
                      }}
                    >
                      {isWarning ? <AlertTriangle size={18} /> : (isSuccess ? <CheckCircle2 size={18} /> : <Info size={18} />)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                          {n.title}
                        </h4>
                        {!n.read && (
                          <span className="admin-badge admin-badge-info" style={{ fontSize: '0.68rem' }}>
                            New
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.2rem' }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {n.link && (
                      <button
                        onClick={() => {
                          const target = n.link.replace('/admin/', '');
                          onNavigate(target);
                        }}
                        className="admin-btn admin-btn-sm admin-btn-primary"
                      >
                        Inspect Record <ExternalLink size={12} />
                      </button>
                    )}
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n._id)}
                        className="admin-btn admin-btn-sm admin-btn-secondary"
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Exportable Reports */}
      {activeTab === 'reports' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {reportCards.map((rep) => (
            <div key={rep.id} className="admin-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="admin-badge admin-badge-neutral">{rep.category}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>CSV Format</span>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{rep.title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.4 }}>
                  {rep.description}
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                <a
                  href={rep.endpoint}
                  download={rep.filename}
                  className="admin-btn admin-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Download size={15} /> Download Export File
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
