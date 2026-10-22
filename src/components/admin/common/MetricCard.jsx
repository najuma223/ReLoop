import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  unit = '',
  icon: Icon,
  accentColor = '#0c6e5d',
  iconBg = '#ecfdf5',
  trend = null,
  trendLabel = '',
  subtitle = null,
  onClick,
}) {
  return (
    <div
      className="admin-metric-card"
      style={{ '--card-accent': accentColor, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className="admin-metric-header">
        <span className="admin-metric-title">{title}</span>
        {Icon && (
          <div
            className="admin-metric-icon-box"
            style={{ backgroundColor: iconBg, color: accentColor }}
          >
            <Icon size={18} strokeWidth={2.2} />
          </div>
        )}
      </div>

      <div className="admin-metric-value-row">
        <span className="admin-metric-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="admin-metric-unit">{unit}</span>}
      </div>

      {(trend !== null || subtitle) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          {trend !== null && (
            <div className={`admin-metric-trend ${trend >= 0 ? 'up' : 'neutral'}`}>
              {trend >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              <span>{trend > 0 ? `+${trend}%` : `${trend}%`}</span>
              {trendLabel && <span style={{ color: '#64748b', fontWeight: 400 }}>{trendLabel}</span>}
            </div>
          )}
          {subtitle && (
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
