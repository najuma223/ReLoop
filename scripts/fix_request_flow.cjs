/**
 * Fix 1: BuyerDashboard.jsx — replace api.requestMatch() (doesn't exist)
 *         with api.requestWater() (the correct function)
 * Fix 2: buyer.js — add missing POST /requests route
 */
const fs = require('fs');
const path = require('path');

// ─── Fix 1: BuyerDashboard.jsx ───────────────────────────────────────────────
const dashPath = path.join(__dirname, '..', 'src', 'components', 'buyer', 'BuyerDashboard.jsx');
let dash = fs.readFileSync(dashPath, 'utf8').replace(/\r\n/g, '\n');

const oldCall = `      await api.requestMatch(\n        sourceId, \n        demandId || (demand ? demand.id : ''), \n        qty, \n        \`Allocation request for \${demand?.title || customDemandData?.demandTitle || 'Water'}\`,\n        {\n          demandTitle: demand?.title || customDemandData?.demandTitle,\n          purpose: demand?.purpose || customDemandData?.purpose,\n          deliveryLocation: demand?.location || demand?.deliveryLocation || customDemandData?.deliveryLocation\n        }\n      );`;

const newCall = `      await api.requestWater({\n        sourceId,\n        demandId: demandId || (demand ? demand.id : ''),\n        requestedQuantity: qty,\n        notes: \`Allocation request for \${demand?.title || customDemandData?.demandTitle || 'Water'}\`,\n        demandTitle: demand?.title || customDemandData?.demandTitle,\n        purpose: demand?.purpose || customDemandData?.purpose,\n        deliveryLocation: demand?.location || demand?.deliveryLocation || customDemandData?.deliveryLocation\n      });`;

if (!dash.includes(oldCall)) {
  console.error('Fix 1: Target not found in BuyerDashboard.jsx');
  process.exit(1);
}
dash = dash.replace(oldCall, newCall);
fs.writeFileSync(dashPath, dash, 'utf8');
console.log('✅ Fix 1 applied: BuyerDashboard.jsx — api.requestMatch → api.requestWater');

// ─── Fix 2: buyer.js — add POST /requests route ──────────────────────────────
const buyerPath = path.join(__dirname, '..', 'server', 'routes', 'buyer.js');
let buyer = fs.readFileSync(buyerPath, 'utf8').replace(/\r\n/g, '\n');

const afterGetRequests = `router.get('/requests', handleGetRequests);\nrouter.get('/buyer/requests', handleGetRequests);`;

const withPostRequests = `router.get('/requests', handleGetRequests);\nrouter.get('/buyer/requests', handleGetRequests);\n\n/**\n * POST /api/requests (and /api/buyer/requests)\n * Buyer submits a water allocation request to a specific supplier source.\n * createWaterRequest() saves to db.requests AND db.sellerRequests so the\n * supplier sees it immediately on their Incoming Requests page.\n */\nrouter.post('/requests', async (req, res) => {\n  try {\n    const request = await createWaterRequest(req.body);\n    res.status(201).json(request);\n  } catch (err) {\n    console.error('[POST /requests]', err.message);\n    res.status(400).json({ error: err.message });\n  }\n});\nrouter.post('/buyer/requests', async (req, res) => {\n  try {\n    const request = await createWaterRequest(req.body);\n    res.status(201).json(request);\n  } catch (err) {\n    console.error('[POST /buyer/requests]', err.message);\n    res.status(400).json({ error: err.message });\n  }\n});`;

if (!buyer.includes(afterGetRequests)) {
  console.error('Fix 2: Target anchor not found in buyer.js');
  process.exit(1);
}
buyer = buyer.replace(afterGetRequests, withPostRequests);
fs.writeFileSync(buyerPath, buyer, 'utf8');
console.log('✅ Fix 2 applied: buyer.js — POST /requests + POST /buyer/requests routes added');

console.log('\nAll fixes applied. Run: npm run build && node server/index.js');
