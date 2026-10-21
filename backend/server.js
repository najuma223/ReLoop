import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory & JSON backed data store (MongoDB schema structure)
const DB_FILE = path.join(__dirname, 'data_store.json');

const initialData = {
  user: {
    name: "Green Park",
    role: "Buyer",
    initials: "GP",
    location: "Chennai, Tamil Nadu",
    coordinates: [13.0827, 80.2707],
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
      description: "Treated cooling tower blowdown, suitable for industrial reuse and irrigation."
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
      description: "Tertiary treated municipal wastewater, lab analysis verification in progress."
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
      description: "High TDS reverse osmosis reject water, suitable for flushing & dust suppression."
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
      description: "Residential greywater system filtered through sand & carbon media."
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
      createdAt: "2025-04-20"
    },
    {
      id: "dem-2",
      title: "Sports Complex",
      quantity: 2000,
      purpose: "Construction",
      status: "Pending",
      statusColor: "blue",
      coordinates: [13.0600, 80.2500],
      createdAt: "2025-04-21"
    },
    {
      id: "dem-3",
      title: "Community Garden",
      quantity: 3000,
      purpose: "Irrigation",
      status: "Matching",
      statusColor: "amber",
      coordinates: [13.0300, 80.2300],
      createdAt: "2025-04-22"
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

// Initialize DB file if not exists
function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.error("Error reading DB file, using initial data", e);
    }
  }
  saveDB(initialData);
  return initialData;
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error("Error writing DB file", e);
  }
}

let db = loadDB();

// Helper to recalculate stats
function recalculateStats() {
  const total = db.demands.reduce((sum, d) => sum + Number(d.quantity || 0), 0);
  const matched = db.matches.reduce((sum, m) => sum + Number(m.quantity || 0), 0);
  const unmet = Math.max(0, total - matched);
  const percent = total > 0 ? Math.round((matched / total) * 100) : 0;
  
  db.stats.totalDemand = total;
  db.stats.matchedQuantity = matched;
  db.stats.matchedPercent = percent;
  db.stats.freshwaterSaved = matched;
  db.stats.freshwaterSavedEq = matched * 2;
  db.stats.unmetDemand = unmet;
  db.stats.activeRequestsCount = db.demands.filter(d => d.status === 'Active').length;
  db.stats.sourcesUsed = new Set(db.matches.map(m => m.sourceId)).size || 1;
  saveDB(db);
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ReLoop Water Reuse API', timestamp: new Date() });
});

app.get('/api/user', (req, res) => {
  res.json(db.user);
});

app.get('/api/stats', (req, res) => {
  res.json(db.stats);
});

app.get('/api/sources', (req, res) => {
  res.json(db.sources);
});

app.post('/api/sources', (req, res) => {
  const { name, type, quantity, distance, quality, coordinates, description } = req.body;
  const newSource = {
    id: `src-${Date.now()}`,
    name: name || "New Water Source",
    type: type || "Treated Wastewater",
    iconType: "factory",
    quantity: Number(quantity) || 5000,
    distance: Number(distance) || 3.5,
    quality: quality || "Verified",
    coordinates: coordinates || [13.0700 + (Math.random() - 0.5) * 0.05, 80.2500 + (Math.random() - 0.5) * 0.05],
    available: true,
    description: description || "Freshly registered water reuse source."
  };
  db.sources.unshift(newSource);
  db.activities.unshift({
    id: `act-${Date.now()}`,
    type: "source",
    title: "New source added",
    detail: `${newSource.name} - ${newSource.quantity.toLocaleString()} L`,
    time: "Just now",
    icon: "droplet"
  });
  saveDB(db);
  res.status(201).json(newSource);
});

app.get('/api/demands', (req, res) => {
  res.json(db.demands);
});

app.post('/api/demands', (req, res) => {
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
  db.demands.push(newDemand);
  db.activities.unshift({
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

app.get('/api/matches', (req, res) => {
  res.json(db.matches);
});

app.post('/api/matches/request', (req, res) => {
  const { sourceId, demandId } = req.body;
  const source = db.sources.find(s => s.id === sourceId) || db.sources[0];
  const demand = db.demands.find(d => d.id === demandId) || db.demands[0];

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

  db.matches.unshift(match);
  db.activities.unshift({
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

// ReLoop Rescue: Autonomous backup sourcing
app.post('/api/rescue', (req, res) => {
  const { demandId, failedSourceId } = req.body;
  const targetDemand = db.demands.find(d => d.id === demandId) || db.demands.find(d => d.status === 'Active') || db.demands[0];
  
  // Find alternative verified sources not equal to failed source
  const alternatives = db.sources.filter(s => s.id !== failedSourceId && s.available);
  
  if (alternatives.length === 0) {
    return res.status(404).json({ message: "No emergency backup sources available in immediate range." });
  }

  // Sort by closest distance and verified quality
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

  db.matches.unshift(newMatch);
  db.activities.unshift({
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

app.get('/api/activities', (req, res) => {
  res.json(db.activities);
});

app.listen(PORT, () => {
  console.log(`ReLoop Backend API running on http://localhost:${PORT}`);
});
