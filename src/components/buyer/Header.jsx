import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Header({ searchQuery, setSearchQuery, onNotificationClick }) {
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
          <div className="badge-avatar">GP</div>
          <div className="badge-text">
            <span className="badge-name">Green Park</span>
            <span className="badge-role">Buyer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
