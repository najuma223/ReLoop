/**
 * Fix all confirmation/matching bugs:
 *
 * Bug 1: BuyerDashboard.jsx calls api.patchMatchStatus() — doesn't exist in buyerApi.js
 *         → rename to api.updateMatchStatus()
 *
 * Bug 2: buyerApi.confirmDelivery() calls POST /api/matches/:id/deliver — no route exists
 *         → add route to buyer.js
 *
 * Bug 3: buyerApi.findMatchesForDemand() calls GET /api/demands/:id/matches — no route exists
 *         → add route to dashboard.js
 */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// ─── Bug 1: BuyerDashboard.jsx — api.patchMatchStatus → api.updateMatchStatus ───
const dashPath = path.join(ROOT, 'src', 'components', 'buyer', 'BuyerDashboard.jsx');
let dash = fs.readFileSync(dashPath, 'utf8').replace(/\r\n/g, '\n');

const oldPatch = `      await api.patchMatchStatus(identifier, 'In Transit', {
        driverName: "Senthil Kumar (TN-09-CV-8841)",
        driverPhone: "+91 97890 44556",
        instructions: "Tanker dispatched from loading dock. GPS route tracking active."
      });`;

const newPatch = `      await api.updateMatchStatus(identifier, 'In Transit');`;

if (!dash.includes(oldPatch)) {
  console.error('Bug 1: patchMatchStatus target not found in BuyerDashboard.jsx');
  console.error('Searching for patchMatchStatus...');
  const idx = dash.indexOf('patchMatchStatus');
  if (idx > -1) {
    console.error('Found at char', idx, ':', dash.slice(idx - 20, idx + 100));
  }
  process.exit(1);
}
dash = dash.replace(oldPatch, newPatch);
fs.writeFileSync(dashPath, dash, 'utf8');
console.log('✅ Bug 1 fixed: api.patchMatchStatus → api.updateMatchStatus in BuyerDashboard.jsx');

// ─── Bug 2: buyer.js — add POST /matches/:id/deliver route ───────────────────
const buyerPath = path.join(ROOT, 'server', 'routes', 'buyer.js');
let buyer = fs.readFileSync(buyerPath, 'utf8').replace(/\r\n/g, '\n');

// Insert after the existing confirm route
const afterConfirmRoute = `router.post('/matches/:id/confirm', async (req, res) => {
  try {
    const matchId = req.params.id;
    const match = await updateMatchStatus(matchId, 'Completed', {
      instructions: "Receipt confirmed by buyer. Quality checklist verified upon discharge."
    });

    res.json({
      success: true,
      message: \`Delivery receipt confirmed for \${match.matchedQuantity.toLocaleString()} L. Fresh water savings recorded!\`,
      match
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});`;

const withDeliverRoute = `router.post('/matches/:id/confirm', async (req, res) => {
  try {
    const matchId = req.params.id;
    const match = await updateMatchStatus(matchId, 'Completed', {
      instructions: "Receipt confirmed by buyer. Quality checklist verified upon discharge."
    });

    res.json({
      success: true,
      message: \`Delivery receipt confirmed for \${match.matchedQuantity.toLocaleString()} L. Fresh water savings recorded!\`,
      match
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/matches/:id/deliver
 * Buyer confirms they received the delivered water — marks match as Completed.
 * Called by buyerApi.confirmDelivery(matchId).
 */
router.post('/matches/:id/deliver', async (req, res) => {
  try {
    const matchId = req.params.id;
    const db = loadDB();

    // Resolve match by id or requestId
    let match = (db.matches || []).find(m => m.id === matchId || m.requestId === matchId);
    if (!match) {
      return res.status(404).json({ error: \`Match \${matchId} not found for delivery confirmation.\` });
    }

    const updated = await updateMatchStatus(match.id, 'Completed', {
      confirmedReusedQuantity: match.matchedQuantity || match.quantity,
      instructions: 'Buyer confirmed receipt. Delivery complete.'
    });

    res.json({
      success: true,
      message: \`Delivery confirmed for \${(updated.matchedQuantity || updated.quantity || 0).toLocaleString()} L. Freshwater savings recorded!\`,
      match: updated
    });
  } catch (err) {
    console.error('[POST /matches/:id/deliver]', err.message);
    res.status(400).json({ error: err.message });
  }
});`;

if (!buyer.includes(afterConfirmRoute)) {
  console.error('Bug 2: anchor for /matches/:id/deliver not found in buyer.js');
  process.exit(1);
}
buyer = buyer.replace(afterConfirmRoute, withDeliverRoute);
fs.writeFileSync(buyerPath, buyer, 'utf8');
console.log('✅ Bug 2 fixed: POST /matches/:id/deliver route added to buyer.js');

// ─── Bug 3: dashboard.js — add GET /demands/:id/matches route ────────────────
const dashRoutePath = path.join(ROOT, 'server', 'routes', 'dashboard.js');
let dashRoute = fs.readFileSync(dashRoutePath, 'utf8').replace(/\r\n/g, '\n');

// Add import for matching service and demand service at top
const oldImport = `import express from 'express';\nimport { getCanonicalSources, loadDB, saveDB, createDemand } from '../services/inventoryService.js';`;
const newImport = `import express from 'express';\nimport { getCanonicalSources, loadDB, saveDB, createDemand, getDemandById } from '../services/inventoryService.js';\nimport { findMatchesForDemand } from '../services/matchingService.js';`;

if (!dashRoute.includes(oldImport)) {
  console.error('Bug 3: import anchor not found in dashboard.js');
  process.exit(1);
}
dashRoute = dashRoute.replace(oldImport, newImport);

// Add the route after GET /demands
const afterGetDemands = `router.post('/demands', async (req, res) => {
  try {
    const created = await createDemand(req.body);
    return res.status(201).json(created);
  } catch (err) {
    console.error("[dashboardRoutes] Error creating demand:", err.message);
    res.status(400).json({ error: err.message });
  }
});`;

const withMatchesRoute = `router.post('/demands', async (req, res) => {
  try {
    const created = await createDemand(req.body);
    return res.status(201).json(created);
  } catch (err) {
    console.error("[dashboardRoutes] Error creating demand:", err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/demands/:id/matches
 * Runs the matching engine for a specific demand and returns ranked eligible sources.
 * Called by buyerApi.findMatchesForDemand(demandId).
 */
router.get('/demands/:id/matches', async (req, res) => {
  try {
    const demandId = req.params.id;
    const demand = await getDemandById(demandId);
    if (!demand) {
      return res.status(404).json({ error: \`Demand \${demandId} not found.\` });
    }
    const allSources = await getCanonicalSources();
    const result = findMatchesForDemand(demand, allSources);
    res.json({
      demandId,
      demand,
      totalEligible: result.totalEligible,
      matches: result.eligibleMatches,
      partialFulfillmentPlan: result.partialFulfillmentPlan
    });
  } catch (err) {
    console.error('[GET /demands/:id/matches]', err.message);
    res.status(500).json({ error: err.message });
  }
});`;

if (!dashRoute.includes(afterGetDemands)) {
  console.error('Bug 3: anchor for /demands/:id/matches not found in dashboard.js');
  process.exit(1);
}
dashRoute = dashRoute.replace(afterGetDemands, withMatchesRoute);
fs.writeFileSync(dashRoutePath, dashRoute, 'utf8');
console.log('✅ Bug 3 fixed: GET /demands/:id/matches route added to dashboard.js');

console.log('\n✅ All 3 bugs fixed. Run: npm run build');
