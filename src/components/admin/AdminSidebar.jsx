import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Cpu,
  Droplets,
  Truck,
  ShieldCheck,
  Users,
  Leaf,
  BellRing,
  FileSpreadsheet,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export default function AdminSidebar({
  currentSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  currentUser,
  onLogout,
  unreadAlertCount = 0,
}) {
  const navSections = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Logistics Map', icon: Compass },
    { id: 'matching', label: 'Smart Matching Hub', icon: Cpu, badge: 'AI' },
    { id: 'supply-requests', label: 'Water Supply & Requests', icon: Droplets },
    { id: 'deliveries', label: 'Delivery Tracking', icon: Truck },
    { id: 'quality', label: 'Quality Verification', icon: ShieldCheck },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'impact', label: 'Environmental Impact', icon: Leaf },
    {
      id: 'alerts-reports',
      label: 'Alerts & Reports',
      icon: BellRing,
      unreadCount: unreadAlertCount,
    },
    { id: 'audit-logs', label: 'Settings & Audit Logs', icon: FileSpreadsheet },
  ];

  const rawName = currentUser?.fullName || currentUser?.name || 'Admin';
  const adminName = (rawName === 'System Administrator' || !rawName) ? 'Admin' : rawName;
  const initials = adminName === 'Admin' ? 'A' : (adminName.slice(0, 2).toUpperCase() || 'A');

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="admin-sidebar-header">
        <div className="admin-brand-link">
          <svg className="admin-brand-logo" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 4C20 4 11 15 11 23C11 28 15 32 20 32C25 32 29 28 29 23C29 15 20 4 20 4Z"
              fill="url(#admin-drop-grad)"
            />
            <path
              d="M20 10C20 10 14 17 14 22.5C14 26 16.7 28.8 20 28.8C23.3 28.8 26 26 26 22.5C26 17 20 10 20 10Z"
              fill="#062826"
            />
            <path
              d="M20 13C20 13 24 17 24 21C24 23.5 22 25.5 20 25.5C18 25.5 16 23.5 16 21C16 17 20 13 20 13Z"
              fill="url(#admin-leaf-grad)"
            />
            <defs>
              <linearGradient id="admin-drop-grad" x1="11" y1="4" x2="29" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2dd4bf" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="admin-leaf-grad" x1="16" y1="13" x2="24" y2="25.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34d399" />
                <stop offset="1" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </svg>
          {!collapsed && (
            <div className="admin-brand-info">
              <span className="admin-brand-title">ReLoop Admin</span>
              <span className="admin-brand-subtitle">Operations Portal</span>
            </div>
          )}
        </div>

        <button
          className="admin-sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="admin-sidebar-nav">
        {navSections.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectSection(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <span className="admin-nav-icon">
                <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} />
              </span>
              {!collapsed && (
                <>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                  {item.unreadCount > 0 && (
                    <span className="admin-nav-badge">{item.unreadCount}</span>
                  )}
                  {item.badge && !item.unreadCount && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        background: 'rgba(45, 212, 191, 0.18)',
                        color: '#2dd4bf',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.4rem',
                        borderRadius: '4px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer & Logout */}
      <div className="admin-sidebar-footer">
        {!collapsed && (
          <div className="admin-user-pill">
            <div className="admin-user-avatar">{initials}</div>
            <div className="admin-user-details">
              <span className="admin-user-name">{adminName}</span>
              {adminName.toLowerCase() !== 'admin' && <span className="admin-user-role-tag">Admin</span>}
            </div>
          </div>
        )}

        <button className="admin-logout-btn" onClick={onLogout} title="Log Out">
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
