import { recordRaceResults } from './resultService';
import { Race } from '../types';

describe('Result Service', () => {
  let race: Race;
  
  beforeEach(() => {
    race = {
      id: '1',
      name: '100m Sprint',
      lanes: [
        { laneNumber: 1, studentId: '1' },
        { laneNumber: 2, studentId: '2' },
        { laneNumber: 3, studentId: '3' }
      ]
    };
  });

  test('should record valid race results', () => {
    const results = [
      { laneNumber: 1, place: 1 },
      { laneNumber: 2, place: 2 },
      { laneNumber: 3, place: 3 }
    ];

    const updatedRace = recordRaceResults(race, results);
    
    expect(updatedRace.lanes[0].place).toBe(1);
    expect(updatedRace.lanes[1].place).toBe(2);
    expect(updatedRace.lanes[2].place).toBe(3);
  });

  test('should throw error if places have gaps', () => {
    const results = [
      { laneNumber: 1, place: 1 },
      { laneNumber: 2, place: 2 },
      { laneNumber: 3, place: 4 }
    ];

    expect(() => recordRaceResults(race, results)).toThrow('Race results have gaps in places');
  });

  test('should allow ties with correct next place', () => {
    const results = [
      { laneNumber: 1, place: 1 },
      { laneNumber: 2, place: 1 },
      { laneNumber: 3, place: 3 }
    ];

    const updatedRace = recordRaceResults(race, results);
    
    expect(updatedRace.lanes[0].place).toBe(1);
    expect(updatedRace.lanes[1].place).toBe(1);
    expect(updatedRace.lanes[2].place).toBe(3);
  });
});