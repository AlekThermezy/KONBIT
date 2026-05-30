// Haiti city coordinates and metadata
export interface HaitiCity {
  name: string;
  lat: number;
  lng: number;
  elevation: number; // meters - affects heatmap intensity
  tier: 'major' | 'secondary' | 'minor';
}

export const HAITI_CITIES: HaitiCity[] = [
  {
    name: 'Port-au-Prince',
    lat: 18.5944,
    lng: -72.3074,
    elevation: 90,
    tier: 'major',
  },
  {
    name: 'Cap-Haïtien',
    lat: 19.7557,
    lng: -72.2000,
    elevation: 0,
    tier: 'major',
  },
  {
    name: 'Les Cayes',
    lat: 18.1996,
    lng: -73.7474,
    elevation: 10,
    tier: 'major',
  },
  {
    name: 'Jacmel',
    lat: 18.2344,
    lng: -72.5354,
    elevation: 50,
    tier: 'secondary',
  },
  {
    name: 'Lavalle de Jacmel',
    lat: 18.1333,
    lng: -72.4667,
    elevation: 450,
    tier: 'minor',
  },
  {
    name: 'Gonaïves',
    lat: 19.4500,
    lng: -72.6833,
    elevation: 10,
    tier: 'secondary',
  },
  {
    name: 'Port-de-Paix',
    lat: 19.9500,
    lng: -72.8333,
    elevation: 5,
    tier: 'secondary',
  },
  {
    name: 'Hinche',
    lat: 19.3333,
    lng: -72.0167,
    elevation: 350,
    tier: 'secondary',
  },
  {
    name: 'Jacqueney',
    lat: 18.3167,
    lng: -72.6167,
    elevation: 180,
    tier: 'minor',
  },
];

// Weight multiplier per tier (determines heatmap intensity)
export const TIER_WEIGHTS = {
  major: 1.0,
  secondary: 0.6,
  minor: 0.3,
};

// Base heatmap intensity (adjusted by business count per city)
export const BASE_INTENSITY = 0.4;