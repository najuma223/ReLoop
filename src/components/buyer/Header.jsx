import React from 'react';
import { Search, Bell, Receipt } from 'lucide-react';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  onNotificationClick,
  onOpenOrders,
  orderCount = 3 
}) {
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
        {/* Persistent Order History Trigger in Top Header */}
        <button 
          type="button"
          className="header-order-history-btn flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95 cursor-pointer"
          onClick={onOpenOrders}
          title="Open Order History & Transactions"
        >
          <Receipt size={16} className="text-emerald-600" />
          <span>Orders</span>
          <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-extrabold">
            {orderCount}
          </span>
        </button>

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
