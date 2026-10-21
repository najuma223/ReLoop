import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery, onNotificationClick, currentUser }) {
  const userName = currentUser?.fullName || currentUser?.name || 'Green Park';
  const userRole = currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Buyer';
  const initials = userName
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'GP';

  return (
    <header className="reloop-top-header">
      <div className="search-bar-container">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Search water sources, locations, or demands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="header-actions">
        <button 
          className="notification-bell-btn" 
          aria-label="Notifications"
          onClick={onNotificationClick}
        >
          <Bell size={20} />
          <span className="notification-badge-dot"></span>
        </button>

        <div className="header-user-badge">
          <div className="badge-avatar">{initials}</div>
          <div className="badge-text">
            <span className="badge-name">{userName}</span>
            <span className="badge-role">{userRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
