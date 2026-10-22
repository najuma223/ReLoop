// Haversine distance formula between two lat/lng coordinates in km
export function calculateDistanceKm(coord1, coord2) {
  if (!coord1 || !coord2 || coord1.length < 2 || coord2.length < 2) return 5.0;
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Category compatibility matrix
export const COMPATIBILITY_RULES = {
  'Treated Wastewater': ['Irrigation', 'Landscaping', 'Toilet Flushing', 'Construction', 'Dust Suppression', 'Industrial Cooling'],
  'Industrial': ['Industrial Cooling', 'Construction', 'Dust Suppression', 'Irrigation'],
  'RO Reject Water': ['Toilet Flushing', 'Dust Suppression', 'Construction', 'Industrial Scrubbers'],
  'Greywater': ['Toilet Flushing', 'Landscaping', 'Gardening', 'Irrigation'],
  'Stormwater': ['Groundwater Recharge', 'Irrigation', 'Landscaping', 'Construction', 'Dust Suppression'],
};

/**
 * Intelligent Matching Algorithm
 * Calculates compatibility score, distance, and explainable recommendation reasons
 */
export function evaluateCandidateMatch(listing, request) {
  const reasons = [];
  let proximityScore = 100;
  let quantityScore = 100;
  let qualityScore = 100;
  let urgencyScore = 80;

  // 1. Proximity Evaluation
  const listingCoords = listing.location?.coordinates || [13.0827, 80.2707];
  const requestCoords = request.deliveryLocation?.coordinates || request.coordinates || [13.0827, 80.2707];
  const distanceKm = calculateDistanceKm(listingCoords, requestCoords);

  if (distanceKm <= 3.0) {
    proximityScore = 98;
    reasons.push(`Optimal proximity (${distanceKm} km away) minimizes transit emissions`);
  } else if (distanceKm <= 7.0) {
    proximityScore = 85;
    reasons.push(`Moderate transit corridor (${distanceKm} km away)`);
  } else if (distanceKm <= 15.0) {
    proximityScore = 65;
    reasons.push(`Extended distance (${distanceKm} km) requires coordinated transport`);
  } else {
    proximityScore = 40;
    reasons.push(`High transit distance (${distanceKm} km)`);
  }

  // 2. Quantity Compatibility
  const reqQty = Number(request.requiredQuantity || request.quantity || 1000);
  const availQty = Number(listing.availableQuantity || listing.quantity || 0);

  if (availQty >= reqQty) {
    quantityScore = 100;
    reasons.push(`Full fulfillment: Available supply (${availQty.toLocaleString()} L) covers 100% of request (${reqQty.toLocaleString()} L)`);
  } else if (availQty >= reqQty * 0.5) {
    const pct = Math.round((availQty / reqQty) * 100);
    quantityScore = 75;
    reasons.push(`Partial fulfillment: Supplies ${pct}% (${availQty.toLocaleString()} L) of requested volume`);
  } else {
    quantityScore = 30;
    reasons.push(`Low volume: Only covers ${Math.round((availQty / reqQty) * 100)}% of demand`);
  }

  // 3. Category & Purpose Suitability
  const waterCat = listing.waterCategory || listing.type || 'Treated Wastewater';
  const intendedUse = request.intendedUse || request.purpose || 'Irrigation';
  const allowedUses = COMPATIBILITY_RULES[waterCat] || ['Irrigation', 'Construction'];

  const isCategoryExact = listing.waterCategory && request.waterCategory &&
    listing.waterCategory.toLowerCase() === request.waterCategory.toLowerCase();

  const isPurposeSuitable = allowedUses.some(
    u => u.toLowerCase().includes(intendedUse.toLowerCase()) || intendedUse.toLowerCase().includes(u.toLowerCase())
  );

  if (isCategoryExact && isPurposeSuitable) {
    reasons.push(`High standard match: ${waterCat} certified suitable for ${intendedUse}`);
  } else if (isPurposeSuitable) {
    reasons.push(`Permissible application: ${waterCat} meets technical standards for ${intendedUse}`);
  } else {
    qualityScore -= 30;
    reasons.push(`Caution: Intended use '${intendedUse}' requires verification against ${waterCat} specification`);
  }

  // 4. Quality Verification
  const quality = listing.qualityVerificationStatus || listing.quality || 'Pending';
  if (quality === 'Verified') {
    qualityScore = Math.min(100, qualityScore + 10);
    reasons.push(`Lab analysis verified by accredited testing laboratory`);
  } else if (quality === 'Pending') {
    qualityScore = 50;
    reasons.push(`Quality clearance in review; verifier approval required before dispatch`);
  } else {
    qualityScore = 10;
    reasons.push(`Quality non-compliant or expired`);
  }

  // 5. Urgency Score
  const priority = request.priority || 'Standard';
  if (priority === 'Urgent') {
    urgencyScore = 100;
    reasons.push(`High priority request with immediate requirement`);
  } else if (priority === 'High') {
    urgencyScore = 90;
  }

  // Weighted Score Formula: Proximity 30%, Quantity 30%, Quality 30%, Urgency 10%
  const totalScore = Math.round(
    proximityScore * 0.30 +
    quantityScore * 0.30 +
    qualityScore * 0.30 +
    urgencyScore * 0.10
  );

  return {
    distanceKm,
    matchScore: Math.max(15, Math.min(99, totalScore)),
    factors: {
      proximityScore,
      quantityScore,
      qualityScore,
      urgencyScore,
      reasons,
    },
  };
}
