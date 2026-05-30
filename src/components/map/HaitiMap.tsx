"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { HAITI_CITIES, TIER_WEIGHTS, BASE_INTENSITY, HaitiCity } from '@/data/haiti-cities';

interface HeatPoint {
  lat: number;
  lng: number;
  intensity: number;
}

interface BusinessCityCount {
  city: string;
  count: number;
}

// Dynamic import for Leaflet (client-side only)
let L: any = null;
let HeatMap: any = null;

export default function HaitiMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const heatLayerRef = useRef<any>(null);
  const [heatmapData, setHeatmapData] = useState<HeatPoint[]>([]);
  const [cityCounts, setCityCounts] = useState<BusinessCityCount[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch business counts per city from Supabase
  const fetchHeatData = async () => {
    const { data, error } = await supabase
      .from('businesses')
      .select('city, id')
      .not('city', 'is', null);

    if (error) {
      console.error('Error fetching heat data:', error);
      return;
    }

    // Aggregate counts per city
    const counts: Record<string, number> = {};
    data?.forEach((b: any) => {
      const city = b.city?.toLowerCase().trim();
      if (city) {
        counts[city] = (counts[city] || 0) + 1;
      }
    });

    const cityCountArray: BusinessCityCount[] = Object.entries(counts).map(([city, count]) => ({
      city,
      count,
    }));
    setCityCounts(cityCountArray);

    // Build heat points
    const points: HeatPoint[] = HAITI_CITIES.map((city) => {
      const match = cityCountArray.find(
        (c) => c.city === city.name.toLowerCase() || c.city.includes(city.name.toLowerCase())
      );
      const businessCount = match?.count || 0;
      const tierWeight = TIER_WEIGHTS[city.tier];
      const intensity = BASE_INTENSITY * tierWeight * (1 + businessCount * 0.3);
      return {
        lat: city.lat,
        lng: city.lng,
        intensity: Math.min(intensity, 1.0),
      };
    });

    setHeatmapData(points);
    return points;
  };

  // Initialize Leaflet map
  const initMap = async (heatPoints: HeatPoint[]) => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic imports
    const leaflet = await import('leaflet');
    const heatmapModule = await import('leaflet.heat');
    
    L = leaflet.default || leaflet;
    HeatMap = heatmapModule.default || heatmapModule;

    // Center on Haiti
    const map = L.map(mapRef.current, {
      center: [19.0, -72.4],
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add heat layer
    const heatData = heatPoints.map((p) => [p.lat, p.lng, p.intensity]);
    heatLayerRef.current = L.heatLayer(heatData, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      max: 1.0,
      gradient: {
        0.0: 'rgba(0, 0, 0, 0)',
        0.2: 'rgba(0, 50, 100, 0.4)',
        0.4: 'rgba(0, 100, 150, 0.6)',
        0.6: 'rgba(0, 150, 100, 0.8)',
        0.8: 'rgba(34, 197, 94, 0.9)',
        1.0: 'rgba(245, 158, 11, 1.0)',
      },
    }).addTo(map);

    // Add city markers
    HAITI_CITIES.forEach((city) => {
      const count = cityCounts.find(
        (c) => c.city === city.name.toLowerCase() || c.city.includes(city.name.toLowerCase())
      )?.count || 0;

      const markerHtml = `
        <div class="haiti-marker" data-tier="${city.tier}" data-count="${count}">
          <div class="marker-pulse"></div>
          <div class="marker-dot"></div>
          <div class="marker-label">${city.name}${count > 0 ? ` (${count})` : ''}</div>
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'haiti-marker-container',
        iconSize: [120, 40],
        iconAnchor: [60, 20],
      });

      L.marker([city.lat, city.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="popup-content">
            <h3>${city.name}</h3>
            <p class="popup-tier">${city.tier.charAt(0).toUpperCase() + city.tier.slice(1)} City</p>
            ${count > 0 ? `<p class="popup-count"><strong>${count}</strong> business${count !== 1 ? 'es' : ''} registered</p>` : '<p class="popup-empty">No businesses yet — be the first!</p>'}
          </div>
        `);
    });

    mapInstanceRef.current = map;
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const points = await fetchHeatData();
      if (points && mapRef.current) {
        await initMap(points);
      }
      setLoading(false);
    };
    load();

    // Subscribe to real-time business changes
    const channel = supabase
      .channel('businesses-map')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, async () => {
        const newPoints = await fetchHeatData();
        if (newPoints && heatLayerRef.current && mapInstanceRef.current) {
          const heatData = newPoints.map((p) => [p.lat, p.lng, p.intensity]);
          heatLayerRef.current.setLatLngs(heatData);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: '500px' }} />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-void)]/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-[var(--green-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-[var(--green-primary)] text-sm font-mono">Mapping Haiti...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-card rounded-xl p-3 border border-[var(--border-subtle)] z-10">
        <div className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Activity Heat</div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-xs text-[var(--text-secondary)]">High Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_8px_rgba(6,182,212,0.4)]"></div>
            <span className="text-xs text-[var(--text-secondary)]">Medium Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-900 to-cyan-700 opacity-60"></div>
            <span className="text-xs text-[var(--text-secondary)]">Low Activity</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 rounded-full bg-[var(--gold-accent)] shadow-[0_0_6px_rgba(245,158,11,0.6)]"></div>
            <span className="text-xs text-[var(--text-secondary)]">Major City</span>
          </div>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 glass-card rounded-xl p-3 border border-[var(--border-subtle)] z-10">
        <div className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Active Regions</div>
        <div className="text-2xl font-black font-mono text-[var(--green-primary)] text-glow-green">
          {cityCounts.filter((c) => c.count > 0).length}
        </div>
        <div className="text-xs text-[var(--text-muted)]">of {HAITI_CITIES.length} cities</div>
        <div className="mt-2 pt-2 border-t border-[var(--border-subtle)]">
          <div className="text-xs font-bold text-white mb-1">Total Businesses</div>
          <div className="text-lg font-black font-mono text-[var(--gold-accent)]">
            {cityCounts.reduce((sum, c) => sum + c.count, 0)}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .haiti-marker-container {
          background: transparent !important;
          border: none !important;
        }
        .haiti-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-pulse {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.3);
          animation: markerPulse 2s ease-out infinite;
        }
        .haiti-marker[data-tier="major"] .marker-pulse {
          background: rgba(245, 158, 11, 0.4);
          width: 30px;
          height: 30px;
        }
        .marker-dot {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--green-primary, #22c55e);
          box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
        }
        .haiti-marker[data-tier="major"] .marker-dot {
          background: var(--gold-accent, #F59E0B);
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.8);
          width: 12px;
          height: 12px;
        }
        .marker-label {
          position: absolute;
          left: 18px;
          white-space: nowrap;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 3px rgba(0,0,0,0.8);
          background: rgba(0,0,0,0.5);
          padding: 2px 6px;
          border-radius: 4px;
        }
        @keyframes markerPulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .leaflet-popup-content-wrapper {
          background: rgba(5, 5, 5, 0.95) !important;
          border: 1px solid rgba(34, 197, 94, 0.3) !important;
          border-radius: 12px !important;
          backdrop-filter: blur(10px);
          color: white;
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
        }
        .leaflet-popup-tip {
          background: rgba(5, 5, 5, 0.95) !important;
          border: 1px solid rgba(34, 197, 94, 0.3) !important;
        }
        .popup-content h3 {
          font-size: 14px;
          font-weight: 700;
          color: white;
          margin: 0 0 4px 0;
        }
        .popup-tier {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          margin: 0 0 8px 0;
        }
        .popup-count {
          font-size: 12px;
          color: var(--green-primary, #22c55e);
          margin: 0;
        }
        .popup-empty {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin: 0;
          font-style: italic;
        }
        .leaflet-container {
          background: #050505 !important;
        }
      `}</style>
    </div>
  );
}
