import React from 'react';
import { 
  Droplet, 
  CheckCircle2, 
  Inbox, 
  Award, 
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function SellerMetricsCards({ stats, onNavigateTab }) {
  const formatLiters = (num) => {
    return Number(num || 0).toLocaleString() + ' L';
  };

  const cards = [
    {
      id: 'total-water-listed',
      title: 'Total Water Listed',
      value: formatLiters(stats?.totalWaterListed || 0),
      subtitle: `Across ${stats?.activeSourcesCount || 0} active water sources`,
      linkText: 'Manage sources →',
      actionKey: 'my-sources',
      icon: Droplet,
      variant: 'blue',
      watermarkSvg: (
        <svg viewBox="0 0 100 60" fill="none" className="card-watermark-svg">
          <path d="M0 40 Q 25 15 50 35 T 100 20 L 100 60 L 0 60 Z" fill="#38bdf8" fillOpacity="0.2" />
          <path d="M0 48 Q 30 25 60 42 T 100 30 L 100 60 L 0 60 Z" fill="#0284c7" fillOpacity="0.1" />
        </svg>
      )
    },
    {
      id: 'available-water',
      title: 'Available Water',
      value: formatLiters(stats?.availableWater || 0),
      subtitle: 'Available for immediate matching',
      linkText: 'Update inventory →',
      actionKey: 'my-sources',
      icon: CheckCircle2,
      variant: 'teal',
      watermarkSvg: (
        <svg viewBox="0 0 100 60" fill="none" className="card-watermark-svg">
          <path d="M0 42 Q 30 20 60 40 T 100 25 L 100 60 L 0 60 Z" fill="#2dd4bf" fillOpacity="0.2" />
        </svg>
      )
    },
    {
      id: 'pending-requests',
      title: 'Pending Requests',
      value: String(stats?.pendingRequests !== undefined ? stats.pendingRequests : 0),
      subtitle: 'Buyer requests awaiting response',
      linkText: 'Review requests →',
      actionKey: 'incoming-requests',
      filterParam: 'Pending',
      icon: Inbox,
      variant: 'amber',
      watermarkSvg: (
        <svg viewBox="0 0 100 60" fill="none" className="card-watermark-svg">
          <polygon points="80,15 95,45 65,45" fill="#f59e0b" fillOpacity="0.18" />
        </svg>
      )
    },
    {
      id: 'successful-matches',
      title: 'Successful Matches',
      value: String(stats?.successfulMatches !== undefined ? stats.successfulMatches : 0),
      subtitle: `${formatLiters(stats?.totalWaterReusedDelivered || 0)} reused to date`,
      linkText: 'View deliveries →',
      actionKey: 'my-matches',
      icon: Award,
      variant: 'emerald',
      watermarkSvg: (
        <svg viewBox="0 0 100 60" fill="none" className="card-watermark-svg">
          <path d="M70 10 C 85 20 95 40 90 60 C 75 55 60 45 65 25 Z" fill="#10b981" fillOpacity="0.15" />
          <path d="M85 30 C 95 40 100 50 95 60 C 85 58 78 50 82 38 Z" fill="#059669" fillOpacity="0.1" />
        </svg>
      )
    }
  ];

  return (
    <div className="metrics-cards-grid seller-metrics-grid">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div 
            key={c.id} 
            className={`metric-card card-${c.variant} clickable-metric-card`}
            onClick={() => onNavigateTab && onNavigateTab(c.actionKey, c.filterParam)}
            role="button"
            tabIndex={0}
            title={`Click to open ${c.title}`}
          >
            {c.watermarkSvg}
            <div className="metric-card-content">
              <div className="metric-header-row">
                <div className={`metric-icon-bubble bubble-${c.variant}`}>
                  <Icon size={18} strokeWidth={2.4} />
                </div>
                <span className="metric-title">{c.title}</span>
              </div>

              <div className="metric-value-row">
                <span className="metric-number">{c.value}</span>
              </div>

              <div className="metric-footer-row">
                <span className="metric-sub">{c.subtitle}</span>
                <button 
                  className={`metric-link link-${c.variant}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNavigateTab) onNavigateTab(c.actionKey, c.filterParam);
                  }}
                >
                  {c.linkText}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
