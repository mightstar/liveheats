import { Race } from '../types';

const RACES_KEY = 'liveheats_races';

interface RaceStorage {
  [key: string]: Race;
}

let racesCache: RaceStorage = {};

// Initialize the cache from localStorage
function initializeCache(): void {
  try {
    const storedRaces = localStorage.getItem(RACES_KEY);
    if (storedRaces) {
      racesCache = JSON.parse(storedRaces);
    }
  } catch (error) {
    console.error('Failed to load races from localStorage:', error);
    racesCache = {};
  }
}

// Save races to localStorage
function saveToStorage(): void {
  localStorage.setItem(RACES_KEY, JSON.stringify(racesCache));
}

export function saveRace(race: Race): void {
  initializeCache();
  racesCache[race.id] = race;
  saveToStorage();
}

export function getRace(id: string): Race | null {
  initializeCache();
  return racesCache[id] || null;
}

export function getAllRaces(): Race[] {
  initializeCache();
  return Object.values(racesCache);
}

export function clearRaces(): void {
  racesCache = {};
  saveToStorage();
}