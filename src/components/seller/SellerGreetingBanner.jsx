import React from 'react';
import { Leaf, MapPin, SunMedium, PlusCircle, Droplets } from 'lucide-react';

export default function SellerGreetingBanner({ 
  profile, 
  currentUser, 
  onOpenAddSource 
}) {
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const sellerName = currentUser?.fullName || profile?.name || profile?.organization || "Apex Tech Park STP";
  const locationStr = profile?.location || profile?.facilityAddress || "Sholinganallur, Chennai, Tamil Nadu";
  const todayStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  return (
    <section className="greeting-banner-card seller-greeting-banner">
      {/* Background Soft Water & Leaf Artwork */}
      <div className="banner-leaf-bg">
        <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 10C80 25 120 70 140 110C100 110 60 90 40 50C35 40 40 20 50 10Z"
            fill="#10b981"
            fillOpacity="0.16"
          />
          <path
            d="M110 5C140 25 170 60 190 100C160 95 130 80 115 50C110 40 105 20 110 5Z"
            fill="#059669"
            fillOpacity="0.12"
          />
          {/* Subtle water ripples */}
          <circle cx="160" cy="80" r="16" stroke="#2dd4bf" strokeOpacity="0.2" strokeWidth="2" fill="none" />
          <circle cx="160" cy="80" r="28" stroke="#0d9488" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="banner-left-content">
        <div className="leaf-badge-icon seller-banner-icon">
          <Droplets size={22} className="leaf-svg" />
        </div>
        <div className="banner-titles">
          <h1 className="banner-heading">
            {getGreetingTime()}, {sellerName}!
          </h1>
          <p className="banner-subtext">
            Manage your water resources, connect with buyers, and make every drop count.
          </p>
        </div>
      </div>

      <div className="banner-right-meta">
        <span className="meta-item meta-date">{todayStr}</span>

        <span className="meta-item meta-location">
          <MapPin size={14} className="meta-icon text-emerald-600" />
          <span title={locationStr}>{locationStr.split(',').slice(0, 2).join(',')}</span>
        </span>

        <div className="weather-pill">
          <SunMedium size={18} className="weather-sun-icon" />
          <div className="weather-text">
            <span className="weather-temp">31°C</span>
            <span className="weather-condition">Sunny & Humid</span>
          </div>
        </div>

        {onOpenAddSource && (
          <button 
            type="button" 
            className="banner-quick-action-btn"
            onClick={onOpenAddSource}
            title="List a new water supply"
          >
            <PlusCircle size={15} />
            <span>+ Add Source</span>
          </button>
        )}
      </div>
    </section>
  );
}
