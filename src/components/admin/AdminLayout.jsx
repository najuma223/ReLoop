import React, { useState, useEffect } from 'react';
import './admin.css';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminOverview from './pages/AdminOverview';
import AdminLogisticsMap from './pages/AdminLogisticsMap';
import AdminMatchingHub from './pages/AdminMatchingHub';
import AdminSupplyRequests from './pages/AdminSupplyRequests';
import AdminDeliveries from './pages/AdminDeliveries';
import AdminQualityVerification from './pages/AdminQualityVerification';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminEnvironmentalImpact from './pages/AdminEnvironmentalImpact';
import AdminAlertsReports from './pages/AdminAlertsReports';
import AdminAuditLogs from './pages/AdminAuditLogs';
import ToastNotification from './common/ToastNotification';

const SECTION_TITLES = {
  overview: 'Overview',
  map: 'Logistics Map',
  matching: 'Smart Matching Hub',
  'supply-requests': 'Water Supply & Requests',
  deliveries: 'Delivery Tracking',
  quality: 'Quality Verification',
  users: 'User Management',
  impact: 'Environmental Impact',
  'alerts-reports': 'Alerts & Reports',
  'audit-logs': 'Settings & Audit Logs',
};

export default function AdminLayout({ currentUser, onLogout }) {
  const [currentSection, setCurrentSection] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll or load notifications for Topbar & Sidebar
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.notifications || []);
        setUnreadCount(json.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // refresh alerts periodically
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      fetchNotifications();
      setToast({ type: 'success', message: 'All notifications marked as read.' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-root-container">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentSection={currentSection}
        onSelectSection={(sec) => {
          setCurrentSection(sec);
          setGlobalSearch('');
        }}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        currentUser={currentUser}
        onLogout={onLogout}
        unreadAlertCount={unreadCount}
      />

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        <AdminTopbar
          currentSection={currentSection}
          sectionTitle={SECTION_TITLES[currentSection] || 'Operations Dashboard'}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={handleMarkAllRead}
          currentUser={currentUser}
          onLogout={onLogout}
          onNavigateSection={setCurrentSection}
        />

        {/* Dynamic Section View */}
        {currentSection === 'overview' && (
          <AdminOverview onNavigate={setCurrentSection} globalSearch={globalSearch} />
        )}
        {currentSection === 'map' && (
          <AdminLogisticsMap onNavigate={setCurrentSection} globalSearch={globalSearch} />
        )}
        {currentSection === 'matching' && (
          <AdminMatchingHub onNavigate={setCurrentSection} showToast={setToast} />
        )}
        {currentSection === 'supply-requests' && (
          <AdminSupplyRequests onNavigate={setCurrentSection} showToast={setToast} globalSearch={globalSearch} />
        )}
        {currentSection === 'deliveries' && (
          <AdminDeliveries onNavigate={setCurrentSection} showToast={setToast} globalSearch={globalSearch} />
        )}
        {currentSection === 'quality' && (
          <AdminQualityVerification onNavigate={setCurrentSection} showToast={setToast} globalSearch={globalSearch} />
        )}
        {currentSection === 'users' && (
          <AdminUserManagement onNavigate={setCurrentSection} showToast={setToast} globalSearch={globalSearch} />
        )}
        {currentSection === 'impact' && (
          <AdminEnvironmentalImpact onNavigate={setCurrentSection} />
        )}
        {currentSection === 'alerts-reports' && (
          <AdminAlertsReports onNavigate={setCurrentSection} showToast={setToast} />
        )}
        {currentSection === 'audit-logs' && (
          <AdminAuditLogs onNavigate={setCurrentSection} globalSearch={globalSearch} />
        )}
      </div>

      {/* Toast Feedback */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
