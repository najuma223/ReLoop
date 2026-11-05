/**
 * Fix the status transition validation to also handle
 * edge cases where existing match records may have unexpected statuses
 * (e.g., admin-created matches that start as 'Admin Approved').
 * We normalize those to 'Scheduled' before checking transitions.
 */
const fs = require('fs');
const path = require('path');

const svcPath = path.join(__dirname, '..', 'server', 'services', 'inventoryService.js');
let src = fs.readFileSync(svcPath, 'utf8').replace(/\r\n/g, '\n');

const oldTransitions = `    const validTransitions = {
      'Pending': ['Accepted', 'Scheduled', 'Confirmed', 'Cancelled'],
      'Accepted': ['Scheduled', 'Confirmed', 'In Transit', 'Cancelled'],
      'Scheduled': ['Confirmed', 'In Transit', 'Cancelled'],
      'Confirmed': ['In Transit', 'Delivered', 'Completed', 'Cancelled'],
      'In Transit': ['Delivered', 'Completed', 'Cancelled', 'Failed'],
      'Delivered': ['Completed', 'Failed'],
      'Completed': [],
      'Cancelled': [],
      'Failed': []
    };

    const allowed = validTransitions[match.status] || [];
    if (!allowed.includes(newStatus) && match.status !== newStatus) {
      throw new Error(\`Invalid status transition: Cannot transition match from '\${match.status}' to '\${newStatus}'. Allowed: \${allowed.join(', ') || 'None'}\`);
    }`;

const newTransitions = `    // Normalize legacy/admin statuses to canonical equivalents before transition check
    const statusAliases = {
      'Admin Approved': 'Confirmed',
      'Rerouted': 'Confirmed',
      'Rescued': 'In Transit'
    };
    if (statusAliases[match.status]) {
      match.status = statusAliases[match.status];
    }

    const validTransitions = {
      'Pending': ['Accepted', 'Scheduled', 'Confirmed', 'In Transit', 'Cancelled'],
      'Accepted': ['Scheduled', 'Confirmed', 'In Transit', 'Cancelled'],
      'Scheduled': ['Confirmed', 'In Transit', 'Completed', 'Cancelled'],
      'Confirmed': ['In Transit', 'Delivered', 'Completed', 'Cancelled'],
      'In Transit': ['Delivered', 'Completed', 'Cancelled', 'Failed'],
      'Delivered': ['Completed', 'Failed'],
      'Completed': [],
      'Cancelled': [],
      'Failed': []
    };

    const allowed = validTransitions[match.status] || [];
    if (!allowed.includes(newStatus) && match.status !== newStatus) {
      throw new Error(\`Invalid status transition: Cannot transition match from '\${match.status}' to '\${newStatus}'. Allowed: \${allowed.join(', ') || 'None'}\`);
    }`;

if (!src.includes(oldTransitions)) {
  console.error('Target not found — checking actual text around line 827:');
  const lines = src.split('\n').slice(825, 845);
  lines.forEach((l, i) => console.log(`${826 + i}: ${JSON.stringify(l)}`));
  process.exit(1);
}

src = src.replace(oldTransitions, newTransitions);
fs.writeFileSync(svcPath, src, 'utf8');
console.log('✅ inventoryService.js — transition table updated with aliases and Scheduled→Completed path');
