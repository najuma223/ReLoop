import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import GreetingBanner from './GreetingBanner';
import MetricsCards from './MetricsCards';
import WaterMap from './WaterMap';
import SourcesTable from './SourcesTable';
import ImpactGlance from './ImpactGlance';
import RightSidebar from './RightSidebar';
import { CreateDemandModal, RequestModal, RescueModal } from './Modals';
import { 
  FindWaterTab, 
  MyDemandsTab, 
  MyMatchesTab, 
  ReloopRescueTab, 
  ImpactReportsTab 
} from './BuyerTabs';
import { api } from '../../services/buyerApi';
import { CheckCircle2, Info } from 'lucide-react';
import ReLoopChatbot from '../common/ReLoopChatbot';
import './BuyerDashboard.css';

export default function BuyerDashboard({ currentUser, onLogout, onSwitchPortal }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data state
  const [user, setUser] = useState({
    name: currentUser?.fullName || "Nivi world",
    role: "Buyer",
    initials: "NW",
    location: "Chennai, Tamil Nadu",
    weather: {
      temp: "32°C",
      condition: "Partly cloudy",
      date: new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    }
  });

  const [stats, setStats] = useState(null);
  const [sources, setSources] = useState([]);
  const [demands, setDemands] = useState([]);
  const [activities, setActivities] = useState([]);

  // Modals state
  const [isDemandModalOpen, setIsDemandModalOpen] = useState(false);
  const [isRescueModalOpen, setIsRescueModalOpen] = useState(false);
  const [selectedSourceForRequest, setSelectedSourceForRequest] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Initial data load
  const loadData = async () => {
    try {
      const [statsData, sourcesData, demandsData, actsData] = await Promise.all([
        api.getStats(),
        api.getSources(),
        api.getDemands(),
        api.getActivities()
      ]);
      setStats(statsData);
      setSources(sourcesData);
      setDemands(demandsData);
      setActivities(actsData);
    } catch (err) {
      console.error("Error loading dashboard data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter sources based on search bar query
  const filteredSources = (sources || []).filter(src => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      src.name?.toLowerCase().includes(q) ||
      src.type?.toLowerCase().includes(q) ||
      src.quality?.toLowerCase().includes(q)
    );
  });

  // Action handlers
  const handleCreateDemand = async (newDemand) => {
    const created = await api.createDemand(newDemand);
    await loadData();
    const qcText = newDemand.needQualityCheck ? " (Quality Check Required)" : " (Standard Supply)";
    showToast(`Demand created for ${created.title} (${created.quantity.toLocaleString()} L)${qcText}!`);
  };

  const handleRequestClick = (source) => {
    setSelectedSourceForRequest(source);
  };

  const handleConfirmMatch = async (sourceId, demandId, qty, needQualityCheck) => {
    await api.requestMatch(sourceId, demandId);
    await loadData();
    if (needQualityCheck) {
      showToast(`Match requested with ${selectedSourceForRequest?.name || 'supplier'}! Quality Check requested — Lab Verifier assigned.`, 'success');
    } else {
      showToast(`Match requested with ${selectedSourceForRequest?.name || 'supplier'}! Direct delivery scheduled without Quality Check.`, 'info');
    }
    setSelectedSourceForRequest(null);
  };

  const handleExecuteRescue = async () => {
    const res = await api.triggerRescue();
    await loadData();
    showToast("ReLoop Rescue activated! Alternative supply dispatched.");
    return res;
  };

  return (
    <div className="reloop-app-layout">
      {/* Toast Alert */}
      {toast && (
        <div className={`reloop-toast toast-${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="toast-icon text-emerald-500" />
          ) : (
            <Info size={18} className="toast-icon text-blue-500" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Left Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenRescue={() => setIsRescueModalOpen(true)}
        currentUser={currentUser}
        onLogout={onLogout}
        onSwitchPortal={onSwitchPortal}
      />

      {/* Center Layout Area */}
      <div className="reloop-main-wrapper">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onOpenDemandModal={() => setIsDemandModalOpen(true)}
          onOpenRescueModal={() => setIsRescueModalOpen(true)}
          onNotificationClick={() => showToast("All system alerts are up to date! 3 active demands matched.", "info")}
        />

        <main className="reloop-dashboard-body">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <>
              {/* Top Greeting & Weather Banner */}
              <GreetingBanner 
                user={user} 
                onOpenDemandModal={() => setIsDemandModalOpen(true)}
                onOpenRescueModal={() => setIsRescueModalOpen(true)}
              />

              {/* 4 Interactive KPI Metric Cards */}
              <MetricsCards 
                stats={stats} 
                onActionClick={(tabKey) => {
                  if (tabKey === 'demands') setActiveTab('my-demands');
                  else if (tabKey === 'matches') setActiveTab('my-matches');
                  else if (tabKey === 'reports') setActiveTab('impact-reports');
                  else if (tabKey === 'find-water') setActiveTab('find-water');
                }}
              />

              {/* 2-Column Split: Center Main & Right Sidebar */}
              <div className="dashboard-grid-content">
                {/* Center Area: Map, Sources Table, Impact */}
                <div className="content-center-column">
                  {/* Leaflet Interactive Map */}
                  <WaterMap 
                    sources={sources} 
                    demands={demands} 
                    onRequestSource={handleRequestClick}
                  />

                  {/* Available Water Sources Table */}
                  <SourcesTable 
                    sources={filteredSources} 
                    onRequestClick={handleRequestClick}
                    onViewAll={() => setActiveTab('find-water')}
                  />

                  {/* Real-time Environmental Impact Glance */}
                  <ImpactGlance stats={stats} />
                </div>

                {/* Right Column: Quick Actions, Demands, Activity, Rescue */}
                <RightSidebar 
                  demands={demands} 
                  activities={activities}
                  onQuickAction={(actionId) => {
                    if (actionId === 'find-water') setActiveTab('find-water');
                    else if (actionId === 'my-demands') setActiveTab('my-demands');
                    else if (actionId === 'my-matches') setActiveTab('my-matches');
                    else if (actionId === 'reloop-rescue') setActiveTab('reloop-rescue');
                  }}
                  onOpenDemandModal={() => setIsDemandModalOpen(true)}
                  onOpenRescueModal={() => setIsRescueModalOpen(true)}
                />
              </div>
            </>
          )}

          {/* TAB 2: FIND WATER */}
          {activeTab === 'find-water' && (
            <FindWaterTab 
              sources={sources} 
              demands={demands} 
              onRequestClick={handleRequestClick} 
            />
          )}

          {/* TAB 3: MY DEMANDS */}
          {activeTab === 'my-demands' && (
            <MyDemandsTab 
              demands={demands} 
              onOpenCreateDemand={() => setIsDemandModalOpen(true)} 
            />
          )}

          {/* TAB 4: MY MATCHES */}
          {activeTab === 'my-matches' && (
            <MyMatchesTab showToast={showToast} />
          )}

          {/* TAB 5: RELOOP RESCUE */}
          {activeTab === 'reloop-rescue' && (
            <ReloopRescueTab onOpenRescueModal={() => setIsRescueModalOpen(true)} />
          )}

          {/* TAB 6: IMPACT REPORTS */}
          {activeTab === 'impact-reports' && (
            <ImpactReportsTab stats={stats} showToast={showToast} />
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateDemandModal 
        isOpen={isDemandModalOpen}
        onClose={() => setIsDemandModalOpen(false)}
        onSubmit={handleCreateDemand}
      />

      <RequestModal 
        isOpen={Boolean(selectedSourceForRequest)}
        source={selectedSourceForRequest}
        demands={demands}
        onClose={() => setSelectedSourceForRequest(null)}
        onConfirm={handleConfirmMatch}
      />

      <RescueModal 
        isOpen={isRescueModalOpen}
        onClose={() => setIsRescueModalOpen(false)}
        onExecuteRescue={handleExecuteRescue}
      />

      {/* 24/7 AI Water Copilot Chatbot */}
      <ReLoopChatbot onNavigateTab={(tab) => setActiveTab(tab)} />
    </div>
  );
}
