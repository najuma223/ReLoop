const API_BASE = 'http://localhost:5000/api';

// Fallback initial data in case backend is starting or offline
const initialMock = {
  user: {
    name: "Green Park",
    role: "Buyer",
    initials: "GP",
    location: "Chennai, Tamil Nadu",
    weather: {
      temp: "32°C",
      condition: "Partly cloudy",
      date: "Tue, 22 Apr 2025"
    }
  },
  stats: {
    totalDemand: 12000,
    matchedQuantity: 7500,
    matchedPercent: 62,
    freshwaterSaved: 7500,
    freshwaterSavedEq: 15000,
    unmetDemand: 4500,
    activeRequestsCount: 3,
    transportCost: 3750,
    sourcesUsed: 2
  },
  sources: [
    {
      id: "src-1",
      name: "Factory A",
      type: "Industrial",
      iconType: "factory",
      quantity: 5000,
      distance: 2.8,
      quality: "Verified",
      coordinates: [13.0878, 80.2785],
      available: true,
      indicativePrice: "₹0.15/L",
      intendedUses: ["Irrigation", "Construction", "Dust Suppression", "Industrial Cooling"],
      description: "Treated cooling tower blowdown, suitable for industrial reuse and irrigation.",
      labReport: {
        id: "LAB-2025-081",
        tester: "AquaCert Labs",
        status: "Verified",
        ph: 7.2,
        turbidity: "1.2 NTU",
        tds: "410 ppm",
        expiryDate: "2025-10-15"
      },
      dataSource: "Simulated Demo Data for Hackathon Showcase"
    },
    {
      id: "src-2",
      name: "STP Plant",
      type: "Treated Wastewater",
      iconType: "leaf-water",
      quantity: 7000,
      distance: 6.5,
      quality: "Pending",
      coordinates: [13.0450, 80.2400],
      available: true,
      indicativePrice: "₹0.08/L",
      intendedUses: ["Landscaping", "Flushing"],
      description: "Tertiary treated municipal wastewater, lab analysis verification in progress.",
      labReport: {
        id: "LAB-2025-099",
        tester: "Metropolitan Testing Facility",
        status: "Pending",
        ph: 6.8,
        turbidity: "3.8 NTU",
        tds: "650 ppm",
        expiryDate: "Awaiting Clearance"
      },
      dataSource: "Simulated Demo Data for Hackathon Showcase"
    },
    {
      id: "src-3",
      name: "IT Park",
      type: "RO Reject Water",
      iconType: "building",
      quantity: 4000,
      distance: 8.1,
      quality: "Verified",
      coordinates: [12.9800, 80.2200],
      available: true,
      indicativePrice: "₹0.10/L",
      intendedUses: ["Toilet Flushing", "Dust Suppression", "Construction"],
      description: "High TDS reverse osmosis reject water, suitable for flushing & dust suppression.",
      labReport: {
        id: "LAB-2025-072",
        tester: "AquaCert Labs",
        status: "Verified",
        ph: 7.6,
        turbidity: "0.8 NTU",
        tds: "1850 ppm",
        expiryDate: "2025-11-20"
      },
      dataSource: "Simulated Demo Data for Hackathon Showcase"
    },
    {
      id: "src-4",
      name: "Apartment Complex",
      type: "Greywater",
      iconType: "apartment",
      quantity: 3000,
      distance: 4.2,
      quality: "Verified",
      coordinates: [13.0100, 80.2600],
      available: true,
      indicativePrice: "₹0.12/L",
      intendedUses: ["Irrigation", "Landscaping"],
      description: "Residential greywater system filtered through sand & carbon media.",
      labReport: {
        id: "LAB-2025-114",
        tester: "State Environmental Lab",
        status: "Verified",
        ph: 7.1,
        turbidity: "1.5 NTU",
        tds: "380 ppm",
        expiryDate: "2025-12-01"
      },
      dataSource: "Simulated Demo Data for Hackathon Showcase"
    }
  ],
  demands: [
    {
      id: "dem-1",
      title: "Green Park",
      quantity: 4000,
      purpose: "Irrigation",
      status: "Active",
      statusColor: "green",
      coordinates: [13.0827, 80.2707],
      indicativeBudget: "₹0.18/L",
      requiredQuality: "Verified",
      createdAt: "2025-04-20",
      dataSource: "Simulated Demo Data for Hackathon Showcase"
    },
    {
      id: "dem-2",
      title: "Sports Complex",
      quantity: 2000,
      purpose: "Construction",
      status: "Pending",
      statusColor: "blue",
      coordinates: [13.0600, 80.2500],
      indicativeBudget: "₹0.12/L",
      requiredQuality: "Standard",
      createdAt: "2025-04-21",
      dataSource: "Simulated Demo Data for Hackathon Showcase"
    },
    {
      id: "dem-3",
      title: "Community Garden",
      quantity: 3000,
      purpose: "Irrigation",
      status: "Matching",
      statusColor: "amber",
      coordinates: [13.0300, 80.2300],
      indicativeBudget: "₹0.15/L",
      requiredQuality: "Verified",
      createdAt: "2025-04-22",
      dataSource: "Simulated Demo Data for Hackathon Showcase"
    }
  ],
  activities: [
    {
      id: "act-1",
      type: "match",
      title: "New match found",
      detail: "Factory A → Green Park",
      time: "2h ago",
      icon: "link"
    },
    {
      id: "act-2",
      type: "approval",
      title: "Demand approved",
      detail: "Green Park - 4,000 L (Irrigation)",
      time: "4h ago",
      icon: "file-text"
    },
    {
      id: "act-3",
      type: "source",
      title: "New source added",
      detail: "STP Plant - 7,000 L",
      time: "5h ago",
      icon: "droplet"
    },
    {
      id: "act-4",
      type: "complete",
      title: "Match completed",
      detail: "Apartment Complex → Sports Center",
      time: "1d ago",
      icon: "check-circle"
    }
  ]
};

export const api = {
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend not reached, using local fallback", e);
    }
    return initialMock.stats;
  },

  async getSources() {
    try {
      const res = await fetch(`${API_BASE}/sources`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend not reached, using local fallback", e);
    }
    return initialMock.sources;
  },

  async getDemands() {
    try {
      const res = await fetch(`${API_BASE}/demands`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend not reached, using local fallback", e);
    }
    return initialMock.demands;
  },

  async createDemand(demand) {
    try {
      const res = await fetch(`${API_BASE}/demands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demand)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend not reached, using local fallback", e);
    }
    return {
      id: `dem-${Date.now()}`,
      ...demand,
      status: "Active",
      statusColor: "green"
    };
  },

  async requestMatch(sourceId, demandId) {
    try {
      const res = await fetch(`${API_BASE}/matches/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId, demandId })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend match request error", e);
    }
    return { success: true };
  },

  async triggerRescue(demandId, failedSourceId) {
    try {
      const res = await fetch(`${API_BASE}/rescue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demandId, failedSourceId })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend rescue error", e);
    }
    return {
      message: "Rescue activated locally",
      rescuedSource: initialMock.sources[3],
      demand: initialMock.demands[0]
    };
  },

  async getActivities() {
    try {
      const res = await fetch(`${API_BASE}/activities`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Backend not reached, using local fallback", e);
    }
    return initialMock.activities;
  }
};
