import { Race } from '../types';

interface ResultEntry {
  laneNumber: number;
  place: number;
}

export function recordRaceResults(race: Race, results: ResultEntry[]): Race {
  const sortedResults = [...results].sort((a, b) => a.place - b.place);
  
  // Check for gaps in places
  const places = sortedResults.map(result => result.place);
  
  // Count occurrences of each place
  const placeCounts: Record<number, number> = {};
  places.forEach(place => {
    placeCounts[place] = (placeCounts[place] || 0) + 1;
  });
  
  // Validate place sequence considering ties
  let expectedPlace = 1;
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    if (place !== expectedPlace) {
      throw new Error('Race results have gaps in places');
    }
    
    // If this is a tie (multiple of the same place), skip the appropriate number
    if (i < places.length - 1 && places[i] === places[i + 1]) {
      continue;
    }
    
    // For the next expected place, add the count of current place
    expectedPlace = expectedPlace + placeCounts[place];
  }
  
  // Validate ties and correct place after ties
  for (let i = 0; i < places.length - 1; i++) {
    const currentPlace = places[i];
    const nextPlace = places[i + 1];
    
    if (currentPlace === nextPlace) continue;
    
    // If there was a tie, check for correct next place
    if (i > 0 && places[i - 1] === currentPlace) {
      const tieCount = placeCounts[currentPlace];
      const expectedNextPlace = currentPlace + tieCount;
      
      if (nextPlace !== expectedNextPlace) {
        throw new Error(`Place after a tie must be ${expectedNextPlace}, found ${nextPlace}`);
      }
    }
  }
  
  // Update the race with results
  const updatedLanes = race.lanes.map(lane => {
    const result = results.find(r => r.laneNumber === lane.laneNumber);
    return result ? { ...lane, place: result.place } : lane;
  });
  
  return {
    ...race,
    lanes: updatedLanes
  };
}