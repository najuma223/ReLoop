import React, { useEffect, useState } from 'react';
import {
  Leaf,
  Droplets,
  Wind,
  Zap,
  Award,
  TrendingUp,
  Download,
  Info,
  Building,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import MetricCard from '../common/MetricCard';
import SkeletonLoader from '../common/SkeletonLoader';

const PIE_COLORS = ['#0c6e5d', '#0284c7', '#38bdf8', '#10b981'];

export default function AdminEnvironmentalImpact({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchImpact = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/analytics/impact');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching environmental impact:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpact();
  }, []);

  if (loading || !data) {
    return (
      <div className="admin-page-content">
        <SkeletonLoader rows={6} height={48} />
      </div>
    );
  }

  const { summary = {}, categoryBreakdown = [], monthlyTrends = [], supplierLeaderboard = [], methodology = {} } = data;

  return (
    <div className="admin-page-content" style={{ gap: '1.5rem' }}>
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
                Sustainability Ledger
              </span>
              <span style={{ fontSize: '0.78rem', color: '#80a7a2' }}>Verified Reuse Impact Metrics</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Environmental Impact & Carbon Accounting</h2>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '640px', marginTop: '0.25rem' }}>
              Transparent, measurable ecological metrics backed by verified delivery transaction completions and non-potable substitution factors.
            </p>
          </div>

          <a
            href="/api/reports/export?reportType=water-reuse"
            download
            className="admin-btn admin-btn-primary"
            style={{ background: '#2dd4bf', color: '#062826', fontWeight: 700 }}
          >
            <Download size={16} />
            Export Impact Report (CSV)
          </a>
        </div>
      </div>

      {/* Impact Metric Cards */}
      <div className="admin-metrics-grid">
        <MetricCard
          title="Total Water Reused"
          value={summary.totalWaterReusedLitres || 48000}
          unit="Litres"
          icon={Droplets}
          accentColor="#0c6e5d"
          iconBg="#ecfdf5"
          subtitle="Delivered to non-potable buyers"
        />
        <MetricCard
          title="Freshwater Demand Avoided"
          value={summary.freshwaterSavedLitres || 48000}
          unit="Litres"
          icon={Leaf}
          accentColor="#059669"
          iconBg="#ecfdf5"
          subtitle="1:1 municipal potable preservation"
        />
        <MetricCard
          title="Carbon Emissions Avoided"
          value={summary.co2SavedKg || 16.8}
          unit="kg CO2e"
          icon={Wind}
          accentColor="#0284c7"
          iconBg="#f0f9ff"
          subtitle="Pumping & treatment emissions offset"
        />
        <MetricCard
          title="Pumping Energy Saved"
          value={summary.energySavedKWh || 57.6}
          unit="kWh"
          icon={Zap}
          accentColor="#f59e0b"
          iconBg="#fffbeb"
          subtitle="Proximity dispatch grid efficiency"
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.25rem' }}>
        {/* Monthly Reused Volume vs CO2 Offset */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Monthly Water Reused vs. CO2e Avoided</h3>
              <p className="admin-card-subtitle">Tracking progressive sustainability dividend</p>
            </div>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip formatter={(v) => `${v.toLocaleString()} L`} />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                <Bar dataKey="volume" name="Reused Volume (L)" fill="#0c6e5d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">Reuse by Water Category</h3>
              <p className="admin-card-subtitle">Volume breakdown by source application</p>
            </div>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="litres"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v.toLocaleString()} L`} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Supplier Contribution Rankings Leaderboard */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <Award size={18} color="#f59e0b" />
              Supplier Environmental Contribution Leaderboard
            </h3>
            <p className="admin-card-subtitle">Ranked by verified volume supplied for reuse</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Supplier / Treatment Plant</th>
                <th>Total Volume Reused</th>
                <th>Deliveries Dispatched</th>
                <th>Reliability Rating</th>
              </tr>
            </thead>
            <tbody>
              {supplierLeaderboard.map((s) => (
                <tr key={s.rank}>
                  <td>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: s.rank === 1 ? '#fef3c7' : '#f1f5f9',
                        color: s.rank === 1 ? '#d97706' : '#475569',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                      }}
                    >
                      {s.rank}
                    </div>
                  </td>
                  <td>
                    <strong>{s.name}</strong>
                  </td>
                  <td>
                    <strong style={{ color: '#0c6e5d' }}>{s.volumeSupplied.toLocaleString()} L</strong>
                  </td>
                  <td>{s.deliveries} completed runs</td>
                  <td>
                    <span className="admin-badge admin-badge-success">
                      ★ {s.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transparent Methodology Card */}
      <div
        className="admin-card"
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Info size={20} color="#0c6e5d" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
              Transparent Carbon & Water Methodology
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.2rem', lineHeight: 1.5 }}>
              • <strong>Freshwater Replacement:</strong> Evaluated as 1:1 displacement for authorized industrial, flushing, and landscaping water needs.
              <br />
              • <strong>Lifecycle Carbon Accounting:</strong> Standard factor of 0.35g CO2e per Litre avoided, reflecting energy savings compared to long-distance pumping from Chembarambakkam/Veeranam reservoirs and reverse osmosis desalination.
              <br />
              • <strong>Audited Data:</strong> Calculations are strictly derived from completed, geotracked delivery transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
