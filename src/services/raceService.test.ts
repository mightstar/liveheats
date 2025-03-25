import { createRace } from './raceService';
import { Student } from '../types';

describe('Race Service', () => {
  const students: Student[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' }
  ];

  test('should create a race with at least 2 students', () => {
    const raceName = '100m Sprint';
    const studentLanes = [
      { studentId: '1', laneNumber: 1 },
      { studentId: '2', laneNumber: 2 }
    ];

    const race = createRace(raceName, studentLanes);

    expect(race).toBeDefined();
    expect(race.name).toBe(raceName);
    expect(race.lanes.length).toBe(2);
    expect(race.id).toBeDefined();
  });

  test('should throw error if creating race with less than 2 students', () => {
    const raceName = '100m Sprint';
    const studentLanes = [
      { studentId: '1', laneNumber: 1 }
    ];

    expect(() => createRace(raceName, studentLanes)).toThrow('A race requires at least 2 students');
  });
});