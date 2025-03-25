import { Lane } from '../types';

export function validateLaneAssignments(lanes: Omit<Lane, 'place'>[]): void {
  // Check for duplicate lane numbers
  const laneNumbers = lanes.map(lane => lane.laneNumber);
  const uniqueLanes = new Set(laneNumbers);
  
  if (uniqueLanes.size !== laneNumbers.length) {
    const duplicateLane = laneNumbers.find((lane, index) => laneNumbers.indexOf(lane) !== index);
    throw new Error(`Lane ${duplicateLane} is assigned to multiple students`);
  }
  
  // Check for duplicate student IDs
  const studentIds = lanes.map(lane => lane.studentId);
  const uniqueStudents = new Set(studentIds);
  
  if (uniqueStudents.size !== studentIds.length) {
    const duplicateStudent = studentIds.find((studentId, index) => studentIds.indexOf(studentId) !== index);
    throw new Error(`Student with ID ${duplicateStudent} is assigned to multiple lanes`);
  }
}