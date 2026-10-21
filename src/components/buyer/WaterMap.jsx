import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Maximize2 } from 'lucide-react';

export default function WaterMap({ sources, demands, onRequestSource }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Coordinates
  const chennaiCenter = [13.0600, 80.2450]; // Chennai
  const greenParkCoord = [13.0550, 80.2520]; // Green Park (Buyer Destination)
  const factoryACoord = [13.0820, 80.2300];  // Factory A (Industrial Source)
  const stpPlantCoord = [13.0200, 80.2150];  // STP Plant
  const aptComplexCoord = [13.0680, 80.2650]; // Apartment Complex
  const itParkCoord = [12.9850, 80.2450];    // IT Park

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [13.0500, 80.2400],
      zoom: 12,
      zoomControl: false,
      attributionControl: true
    });

    // Real OpenStreetMap Standard Tiles (No API Key Required, No Watermark)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c'],
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Zoom controls at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Custom Icon Creators
    const createMarkerIcon = (color, typeText, isDestination = false) => {
      const pinColor = isDestination ? '#10b981' : '#0284c7';
      const innerSvg = isDestination 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;

      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="marker-pin-wrap ${isDestination ? 'dest-pin' : 'source-pin'}">
            <div class="pin-head" style="background: ${pinColor}">
              ${innerSvg}
            </div>
            <div class="pin-pulse" style="background: ${pinColor}"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 28],
        popupAnchor: [0, -28]
      });
    };

    // Add Destination: Green Park
    const greenParkMarker = L.marker(greenParkCoord, {
      icon: createMarkerIcon('#10b981', 'Buyer', true)
    }).addTo(map);

    greenParkMarker.bindPopup(`
      <div class="map-custom-card green-park-bubble">
        <div class="card-tag dest-tag">Destination</div>
        <div class="card-name">Green Park</div>
        <div class="card-stat">Needs <strong>4,000 L</strong> · 2.8 km</div>
      </div>
    `);

    // Add Factory A Source
    const factoryAMarker = L.marker(factoryACoord, {
      icon: createMarkerIcon('#0284c7', 'Factory A', false)
    }).addTo(map);

    factoryAMarker.bindPopup(`
      <div class="map-custom-card source-bubble">
        <div class="card-tag source-tag">Water Source</div>
        <div class="card-name">Factory A</div>
        <div class="card-stat"><strong>5,000 L</strong> available · 2.8 km</div>
      </div>
    `);

    // Add other sources
    const stpMarker = L.marker(stpPlantCoord, {
      icon: createMarkerIcon('#0284c7', 'STP', false)
    }).addTo(map);
    stpMarker.bindPopup(`
      <div class="map-custom-card source-bubble">
        <div class="card-tag source-tag">Treated Wastewater</div>
        <div class="card-name">STP Plant</div>
        <div class="card-stat"><strong>7,000 L</strong> available · 6.5 km</div>
      </div>
    `);

    const aptMarker = L.marker(aptComplexCoord, {
      icon: createMarkerIcon('#0284c7', 'Greywater', false)
    }).addTo(map);
    aptMarker.bindPopup(`
      <div class="map-custom-card source-bubble">
        <div class="card-tag source-tag">Greywater</div>
        <div class="card-name">Apartment Complex</div>
        <div class="card-stat"><strong>3,000 L</strong> available · 4.2 km</div>
      </div>
    `);

    // Draw Recommended Route between Factory A and Green Park (Curved/Waypoint polyline)
    const routeCoords = [
      factoryACoord,
      [13.0780, 80.2370],
      [13.0720, 80.2450],
      [13.0640, 80.2490],
      greenParkCoord
    ];

    L.polyline(routeCoords, {
      color: '#0284c7',
      weight: 3.5,
      opacity: 0.85,
      dashArray: '6, 8',
      lineCap: 'round'
    }).addTo(map);

    // Open popup for default focus
    factoryAMarker.openPopup();

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([13.0550, 80.2450], 12, { animate: true });
    }
  };

  return (
    <div className="water-map-card">
      <div className="map-card-header">
        <div className="map-header-left">
          <div className="map-title-icon-wrap">
            <MapPin size={17} className="map-title-icon" />
          </div>
          <h2 className="map-title">Nearby Water Sources & Destinations</h2>
        </div>

        <div className="map-header-right">
          <button 
            className="map-control-btn" 
            title="Recenter Map"
            onClick={handleRecenter}
          >
            <Navigation size={15} />
          </button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="map-legend-bar">
        <div className="legend-item">
          <span className="legend-dot dot-source"></span>
          <span className="legend-text">Water Source</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-dest"></span>
          <span className="legend-text">Destination</span>
        </div>
        <div className="legend-item">
          <span className="legend-line line-route"></span>
          <span className="legend-text">Recommended Route</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="leaflet-map-wrapper">
        <div ref={mapContainerRef} className="map-canvas-element" />

        {/* Floating overlays matching mockup */}
        <div className="map-floating-pill pill-factory">
          <div className="pill-icon-water">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#0284c7">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
          <div className="pill-body">
            <div className="pill-title">Factory A</div>
            <div className="pill-meta">5,000 L available · 2.8 km</div>
          </div>
        </div>

        <div className="map-floating-pill pill-greenpark">
          <div className="pill-icon-leaf">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#10b981">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="pill-body">
            <div className="pill-title">Green Park</div>
            <div className="pill-meta">Needs 4,000 L · 2.8 km</div>
          </div>
        </div>
      </div>
    </div>
  );
}
