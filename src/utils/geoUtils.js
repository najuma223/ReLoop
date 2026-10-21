/**
 * geoUtils.js
 * Geospatial and water-quality utility functions for the ReLoop Water Reuse Platform.
 */

// ---------------------------------------------------------------------------
// 1. Haversine straight-line distance (km)
// ---------------------------------------------------------------------------

/**
 * Calculates the straight-line (as-the-crow-flies) distance between two
 * geographic coordinates using the Haversine formula.
 *
 * @param {[number, number]|{lat: number, lng: number}} coord1 - [lat, lng] or {lat, lng}
 * @param {[number, number]|{lat: number, lng: number}} coord2 - [lat, lng] or {lat, lng}
 * @returns {number} Distance in kilometres, rounded to 2 decimal places.
 */
export function calculateStraightLineDistance(coord1, coord2) {
  if (!coord1 || !coord2) return 0;

  const lat1 = Array.isArray(coord1) ? coord1[0] : (coord1?.lat ?? coord1?.latitude);
  const lon1 = Array.isArray(coord1) ? coord1[1] : (coord1?.lng ?? coord1?.lon ?? coord1?.longitude);
  const lat2 = Array.isArray(coord2) ? coord2[0] : (coord2?.lat ?? coord2?.latitude);
  const lon2 = Array.isArray(coord2) ? coord2[1] : (coord2?.lng ?? coord2?.lon ?? coord2?.longitude);

  const nLat1 = Number(lat1);
  const nLon1 = Number(lon1);
  const nLat2 = Number(lat2);
  const nLon2 = Number(lon2);

  if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) {
    return 0;
  }

  const R = 6371; // Earth's radius in km
  const dLat = toRad(nLat2 - nLat1);
  const dLon = toRad(nLon2 - nLon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(nLat1)) * Math.cos(toRad(nLat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// ---------------------------------------------------------------------------
// 2. Road-route fetcher (OSRM public API with straight-line fallback)
// ---------------------------------------------------------------------------

/**
 * Fetches a road-calibrated route between two coordinates using the public
 * OSRM demo server. Falls back to a straight-line approximation when the
 * network request fails or returns no route.
 *
 * @param {[number, number]|{lat: number, lng: number}} sourceCoords - [lat, lng] of water supplier.
 * @param {[number, number]|{lat: number, lng: number}} demandCoords - [lat, lng] of water buyer.
 * @returns {Promise<{
 *   polylineCoords: [number, number][],
 *   roadDistanceKm: string,
 *   straightLineKm: string,
 *   durationMin: string,
 *   routingSource: string
 * }>}
 */
export async function fetchRoadRoute(sourceCoords, demandCoords) {
  const parseCoord = (c) => {
    if (!c) return null;
    const lat = Array.isArray(c) ? c[0] : (c?.lat ?? c?.latitude);
    const lon = Array.isArray(c) ? c[1] : (c?.lng ?? c?.lon ?? c?.longitude);
    const nLat = Number(lat);
    const nLon = Number(lon);
    if (isNaN(nLat) || isNaN(nLon)) return null;
    return [nLat, nLon];
  };

  const s = parseCoord(sourceCoords);
  const d = parseCoord(demandCoords);

  if (!s || !d) {
    return {
      polylineCoords: [],
      roadDistanceKm: '0.0',
      straightLineKm: '0.0',
      durationMin: '0',
      routingSource: 'None',
    };
  }

  const straightLineKm = calculateStraightLineDistance(s, d);

  // Build OSRM request (note: OSRM expects lng,lat order)
  const [sLat, sLng] = s;
  const [dLat, dLng] = d;
  const osrmUrl =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${sLng},${sLat};${dLng},${dLat}` +
    `?overview=full&geometries=geojson&steps=false`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('OSRM non-OK response');

    const data = await response.json();
    if (!data.routes || data.routes.length === 0) throw new Error('No routes returned');

    const route = data.routes[0];
    const roadDistanceKm = (route.distance / 1000).toFixed(1);
    const durationMin = Math.max(1, Math.round(route.duration / 60)).toString();

    // GeoJSON coords are [lng, lat] — Leaflet polyline needs [lat, lng]
    const polylineCoords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

    return {
      polylineCoords,
      roadDistanceKm,
      straightLineKm: straightLineKm.toFixed(1),
      durationMin,
      routingSource: 'OSRM',
    };
  } catch {
    // Fallback: safe road estimation with direct polyline coordinates
    const estimatedRoadKm = (straightLineKm * 1.35).toFixed(1); // typical urban road factor
    const estimatedMin = Math.max(1, Math.round((parseFloat(estimatedRoadKm) / 30) * 60)).toString();

    return {
      polylineCoords: [s, d],
      roadDistanceKm: estimatedRoadKm,
      straightLineKm: straightLineKm.toFixed(1),
      durationMin: estimatedMin,
      routingSource: 'Estimated',
    };
  }
}

// ---------------------------------------------------------------------------
// 3. Water compatibility evaluator
// ---------------------------------------------------------------------------

/**
 * Evaluates whether a water source is compatible with a buyer's demand,
 * returning a human-readable status, a numeric score (0-100), and a
 * one-line reason explaining the verdict.
 *
 * @param {object|undefined} source - Water source record.
 * @param {object|undefined} demand - Water demand record.
 * @returns {{ status: string, score: number, reason: string }}
 */
export function evaluateWaterCompatibility(source, demand) {
  if (!source || !demand) {
    return {
      status: 'Unknown',
      score: 0,
      reason: 'Insufficient data to evaluate compatibility.',
    };
  }

  let score = 50; // base score
  const notes = [];

  // Quality gate
  const quality = source.quality || 'Pending';
  if (quality === 'Verified') {
    score += 30;
    notes.push('lab-certified supply');
  } else if (quality === 'Pending') {
    score -= 15;
    notes.push('lab certificate pending');
  } else {
    score -= 25;
    notes.push('unverified quality');
  }

  // Volume match
  const srcQty = Number(source.quantity) || 0;
  const demQty = Number(demand.quantity) || 0;
  const surplus = srcQty - demQty;
  if (surplus >= 0) {
    score += 15;
    notes.push(`supply surplus ${surplus.toLocaleString()} L/d`);
  } else {
    score += Math.max(-15, Math.round((surplus / (demQty || 1)) * 15));
    notes.push(`supply deficit ${Math.abs(surplus).toLocaleString()} L/d`);
  }

  // Purpose compatibility heuristic
  const purpose = (demand.purpose || '').toLowerCase();
  const sourceType = (source.type || '').toLowerCase();

  if (
    (purpose.includes('irrigation') || purpose.includes('landscaping')) &&
    (sourceType.includes('greywater') || sourceType.includes('industrial') || sourceType.includes('treated'))
  ) {
    score += 10;
    notes.push('suitable reuse category');
  } else if (purpose.includes('drinking') || purpose.includes('potable')) {
    score = Math.min(score, 30);
    notes.push('not approved for potable use');
  }

  score = Math.max(0, Math.min(100, score));

  let status;
  if (score >= 80) status = 'Excellent';
  else if (score >= 60) status = 'Good';
  else if (score >= 40) status = 'Marginal';
  else status = 'Poor';

  return {
    status,
    score,
    reason: notes.join(' · '),
  };
}
