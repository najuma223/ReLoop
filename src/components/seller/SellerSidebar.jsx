import React from 'react';
import { 
  LayoutDashboard, 
  Droplets, 
  PlusCircle, 
  Inbox, 
  Link2, 
  ShieldCheck, 
  Truck, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut,
  ChevronDown,
  X
} from 'lucide-react';

export default function SellerSidebar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout,
  onSwitchPortal,
  unreadCount = 0,
  pendingRequestsCount = 0,
  isMobileOpen = false,
  onCloseMobile
}) {
  const orgName = currentUser?.fullName || currentUser?.organization || "Apex Tech Park STP";
  const initials = currentUser?.initials || (orgName ? orgName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : "AT");

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-sources', label: 'My Water Sources', icon: Droplets },
    { id: 'add-source', label: 'Add Water Source', icon: PlusCircle },
    { 
      id: 'incoming-requests', 
      label: 'Incoming Requests', 
      icon: Inbox,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
      badgeColor: 'amber'
    },
    { id: 'my-matches', label: 'My Matches', icon: Link2 },
    { id: 'quality-verification', label: 'Quality & Verification', icon: ShieldCheck },
    { id: 'delivery-tracking', label: 'Delivery Tracking', icon: Truck },
    { id: 'impact-reports', label: 'Impact Reports', icon: BarChart3 },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
      badgeColor: 'emerald'
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div className="mobile-sidebar-backdrop" onClick={onCloseMobile}></div>
      )}

      <aside className={`reloop-sidebar seller-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Mobile Close Button */}
        {isMobileOpen && (
          <button className="mobile-sidebar-close" onClick={onCloseMobile}>
            <X size={20} />
          </button>
        )}

        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-logo-wrap">
            <svg className="brand-logo-svg" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4C20 4 11 15 11 23C11 28 15 32 20 32C25 32 29 28 29 23C29 15 20 4 20 4Z" fill="url(#seller-drop-grad)" />
              <path d="M20 10C20 10 14 17 14 22.5C14 26 16.7 28.8 20 28.8C23.3 28.8 26 26 26 22.5C26 17 20 10 20 10Z" fill="#082b27" />
              <path d="M20 13C20 13 24 17 24 21C24 23.5 22 25.5 20 25.5C18 25.5 16 23.5 16 21C16 17 20 13 20 13Z" fill="url(#seller-leaf-grad)" />
              <defs>
                <linearGradient id="seller-drop-grad" x1="11" y1="4" x2="29" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2dd4bf" />
                  <stop offset="1" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="seller-leaf-grad" x1="16" y1="13" x2="24" y2="25.5" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34d399" />
                  <stop offset="1" stopColor="#0d9488" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">ReLoop</span>
            <span className="brand-tagline">Reuse Today, Sustain Tomorrow</span>
          </div>
        </div>

        {/* Seller Role Badge */}
        <div className="seller-role-pill">
          <span className="seller-role-indicator-dot"></span>
          <span>Supplier Portal</span>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-link-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-icon-wrap">
                  <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
                </span>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className={`nav-badge-pill badge-${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Water Art & Slogan */}
        <div className="sidebar-art-container">
          <div className="sidebar-drop-art">
            <svg className="water-art-svg" viewBox="0 0 240 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="art-s-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#065f46" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="art-s-grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path d="M-10 100 Q 50 40 120 90 T 260 70 L 260 170 L -10 170 Z" fill="url(#art-s-grad1)" />
              <path d="M-10 120 Q 60 70 140 110 T 260 90 L 260 170 L -10 170 Z" fill="url(#art-s-grad2)" />
              <circle cx="65" cy="50" r="4.5" fill="#38bdf8" fillOpacity="0.75" />
              <circle cx="105" cy="30" r="6" fill="#34d399" fillOpacity="0.65" />
              <circle cx="170" cy="55" r="5" fill="#2dd4bf" fillOpacity="0.7" />
              <circle cx="195" cy="35" r="3" fill="#a7f3d0" fillOpacity="0.8" />
            </svg>
          </div>
          <p className="sidebar-slogan">
            Empowering circular<br />water stewardship.
          </p>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="sidebar-footer">
          <div 
            className="sidebar-user-row" 
            onClick={onSwitchPortal} 
            style={{ cursor: onSwitchPortal ? 'pointer' : 'default' }}
            title={onSwitchPortal ? "Switch Portal View" : orgName}
          >
            <div className="user-avatar-gp seller-avatar">{initials}</div>
            <div className="user-info-text">
              <div className="user-name" title={orgName}>{orgName}</div>
              <div className="user-role">Water Supplier</div>
            </div>
            {onSwitchPortal && <ChevronDown size={15} className="user-chevron" />}
          </div>

          <div className="sidebar-quick-links">
            <button className="footer-link-btn" title="Log out of account" onClick={onLogout}>
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
