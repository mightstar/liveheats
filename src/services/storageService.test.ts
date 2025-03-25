import { saveRace, getRace, getAllRaces, clearRaces } from './storageService';
import { Race } from '../types';

describe('Storage Service', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    clearRaces();
  });

  const race: Race = {
    id: '1',
    name: '100m Sprint',
    lanes: [
      { laneNumber: 1, studentId: '1', place: 1 },
      { laneNumber: 2, studentId: '2', place: 2 },
    ]
  };

  test('should save and retrieve a race', () => {
    saveRace(race);
    const retrievedRace = getRace('1');
    expect(retrievedRace).toEqual(race);
  });

  test('should return null for non-existent race', () => {
    const nonExistentRace = getRace('999');
    expect(nonExistentRace).toBeNull();
  });

  test('should get all races', () => {
    const race2: Race = {
      id: '2',
      name: '200m Sprint',
      lanes: [
        { laneNumber: 1, studentId: '3', place: 1 },
        { laneNumber: 2, studentId: '4', place: 2 },
      ]
    };

    saveRace(race);
    saveRace(race2);

    const allRaces = getAllRaces();
    expect(allRaces).toHaveLength(2);
    expect(allRaces).toContainEqual(race);
    expect(allRaces).toContainEqual(race2);
  });

  test('should update an existing race', () => {
    saveRace(race);
    
    const updatedRace: Race = {
      ...race,
      name: 'Updated 100m Sprint'
    };
    
    saveRace(updatedRace);
    
    const retrievedRace = getRace('1');
    expect(retrievedRace).toEqual(updatedRace);
    expect(retrievedRace?.name).toBe('Updated 100m Sprint');
  });
});