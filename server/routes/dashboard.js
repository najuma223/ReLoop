import express from 'express';

const router = express.Router();

let store = {
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
  matches: [
    {
      id: "mat-1",
      sourceId: "src-1",
      sourceName: "Factory A",
      demandId: "dem-1",
      destinationName: "Green Park",
      quantity: 4000,
      distance: 2.8,
      status: "Matched",
      matchedAt: "2h ago"
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

function recalculateStats() {
  const total = store.demands.reduce((sum, d) => sum + Number(d.quantity || 0), 0);
  const matched = store.matches.reduce((sum, m) => sum + Number(m.quantity || 0), 0);
  const unmet = Math.max(0, total - matched);
  const percent = total > 0 ? Math.round((matched / total) * 100) : 0;
  
  store.stats.totalDemand = total;
  store.stats.matchedQuantity = matched;
  store.stats.matchedPercent = percent;
  store.stats.freshwaterSaved = matched;
  store.stats.freshwaterSavedEq = matched * 2;
  store.stats.unmetDemand = unmet;
  store.stats.activeRequestsCount = store.demands.filter(d => d.status === 'Active').length;
  store.stats.sourcesUsed = new Set(store.matches.map(m => m.sourceId)).size || 1;
}

router.get('/stats', (req, res) => res.json(store.stats));
router.get('/sources', (req, res) => res.json(store.sources));
router.get('/demands', (req, res) => res.json(store.demands));
router.get('/matches', (req, res) => res.json(store.matches));
router.get('/activities', (req, res) => res.json(store.activities));

router.post('/demands', (req, res) => {
  const { title, quantity, purpose, coordinates } = req.body;
  const newDemand = {
    id: `dem-${Date.now()}`,
    title: title || "New Demand Request",
    quantity: Number(quantity) || 3000,
    purpose: purpose || "Irrigation",
    status: "Active",
    statusColor: "green",
    coordinates: coordinates || [13.0827, 80.2707],
    createdAt: new Date().toISOString().split('T')[0]
  };
  store.demands.push(newDemand);
  store.activities.unshift({
    id: `act-${Date.now()}`,
    type: "approval",
    title: "Demand created",
    detail: `${newDemand.title} - ${newDemand.quantity.toLocaleString()} L (${newDemand.purpose})`,
    time: "Just now",
    icon: "file-text"
  });
  recalculateStats();
  res.status(201).json(newDemand);
});

router.post('/matches/request', (req, res) => {
  const { sourceId, demandId } = req.body;
  const source = store.sources.find(s => s.id === sourceId) || store.sources[0];
  const demand = store.demands.find(d => d.id === demandId) || store.demands[0];

  const matchedQty = Math.min(source.quantity, demand.quantity);
  const match = {
    id: `mat-${Date.now()}`,
    sourceId: source.id,
    sourceName: source.name,
    demandId: demand.id,
    destinationName: demand.title,
    quantity: matchedQty,
    distance: source.distance,
    status: "Matched",
    matchedAt: "Just now"
  };

  store.matches.unshift(match);
  store.activities.unshift({
    id: `act-${Date.now()}`,
    type: "match",
    title: "New match confirmed",
    detail: `${source.name} → ${demand.title}`,
    time: "Just now",
    icon: "link"
  });
  recalculateStats();
  res.status(201).json(match);
});

router.post('/rescue', (req, res) => {
  const { demandId, failedSourceId } = req.body;
  const targetDemand = store.demands.find(d => d.id === demandId) || store.demands[0];
  const alternatives = store.sources.filter(s => s.id !== failedSourceId && s.available);
  
  if (alternatives.length === 0) {
    return res.status(404).json({ message: "No emergency backup sources available in immediate range." });
  }

  alternatives.sort((a, b) => {
    if (a.quality === 'Verified' && b.quality !== 'Verified') return -1;
    if (b.quality === 'Verified' && a.quality !== 'Verified') return 1;
    return a.distance - b.distance;
  });

  const bestRescue = alternatives[0];
  const rescueQty = Math.min(bestRescue.quantity, targetDemand.quantity);

  const newMatch = {
    id: `rescue-${Date.now()}`,
    sourceId: bestRescue.id,
    sourceName: bestRescue.name + " (Rescue Alt)",
    demandId: targetDemand.id,
    destinationName: targetDemand.title,
    quantity: rescueQty,
    distance: bestRescue.distance,
    status: "Rescued",
    matchedAt: "Just now",
    isRescue: true
  };

  store.matches.unshift(newMatch);
  store.activities.unshift({
    id: `act-${Date.now()}`,
    type: "rescue",
    title: "ReLoop Rescue activated",
    detail: `Backup routed from ${bestRescue.name} to ${targetDemand.title}`,
    time: "Just now",
    icon: "shield"
  });

  recalculateStats();
  res.json({
    message: "ReLoop Rescue successfully matched alternative source!",
    match: newMatch,
    rescuedSource: bestRescue,
    demand: targetDemand
  });
});

export default router;
