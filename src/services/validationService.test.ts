import { validateLaneAssignments } from './validationService';

describe('Validation Service', () => {
  test('should pass validation for valid lane assignments', () => {
    const laneAssignments = [
      { studentId: '1', laneNumber: 1 },
      { studentId: '2', laneNumber: 2 },
      { studentId: '3', laneNumber: 3 }
    ];

    expect(() => validateLaneAssignments(laneAssignments)).not.toThrow();
  });

  test('should throw error if the same lane is assigned to different students', () => {
    const laneAssignments = [
      { studentId: '1', laneNumber: 1 },
      { studentId: '2', laneNumber: 1 }
    ];

    expect(() => validateLaneAssignments(laneAssignments)).toThrow('Lane 1 is assigned to multiple students');
  });

  test('should throw error if the same student is assigned to multiple lanes', () => {
    const laneAssignments = [
      { studentId: '1', laneNumber: 1 },
      { studentId: '1', laneNumber: 2 }
    ];

    expect(() => validateLaneAssignments(laneAssignments)).toThrow('Student with ID 1 is assigned to multiple lanes');
  });
});