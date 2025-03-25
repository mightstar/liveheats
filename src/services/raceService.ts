import { Lane, Race } from '../types';
import { validateLaneAssignments } from './validationService';

export function createRace(name: string, lanes: Omit<Lane, 'place'>[]): Race {
  if (lanes.length < 2) {
    throw new Error('A race requires at least 2 students');
  }
  
  validateLaneAssignments(lanes);
  
  return {
    id: Date.now().toString(),
    name,
    lanes: lanes.map(lane => ({ ...lane, place: undefined }))
  };
}