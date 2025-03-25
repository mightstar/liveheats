import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Lane } from '../types';

export const RaceForm: React.FC = () => {
  const { students, createNewRace } = useAppContext();
  const [raceName, setRaceName] = useState('');
  const [lanes, setLanes] = useState<Array<{ laneNumber: number; studentId: string }>>([
    { laneNumber: 1, studentId: '' },
    { laneNumber: 2, studentId: '' }
  ]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addLane = () => {
    const nextLaneNumber = lanes.length + 1;
    setLanes([...lanes, { laneNumber: nextLaneNumber, studentId: '' }]);
  };

  const removeLane = (laneNumber: number) => {
    if (lanes.length <= 2) {
      setError('A race requires at least 2 students');
      return;
    }
    
    // Remove the lane and renumber the remaining lanes
    const filteredLanes = lanes
      .filter(lane => lane.laneNumber !== laneNumber)
      .map((lane, index) => ({ ...lane, laneNumber: index + 1 }));
    
    setLanes(filteredLanes);
  };

  const handleStudentSelect = (laneNumber: number, studentId: string) => {
    setLanes(
      lanes.map(lane =>
        lane.laneNumber === laneNumber ? { ...lane, studentId } : lane
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate race name
    if (!raceName.trim()) {
      setError('Please enter a race name');
      return;
    }
    
    // Validate student selection
    if (lanes.some(lane => !lane.studentId)) {
      setError('Please select students for all lanes');
      return;
    }
    
    // Check for duplicate students
    const studentIds = lanes.map(lane => lane.studentId);
    const uniqueStudents = new Set(studentIds);
    if (uniqueStudents.size !== studentIds.length) {
      setError('Each student can only be assigned to one lane');
      return;
    }
    
    try {
      // Create the race
      createNewRace(raceName, lanes);
      
      // Reset form
      setRaceName('');
      setLanes([
        { laneNumber: 1, studentId: '' },
        { laneNumber: 2, studentId: '' }
      ]);
      setSuccess('Race created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create race');
    }
  };

  return (
    <div className="race-form">
      <h2>Create Race</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="raceName">Race Name:</label>
          <input
            id="raceName"
            type="text"
            value={raceName}
            onChange={(e) => setRaceName(e.target.value)}
          />
        </div>
        
        <div className="lanes-section">
          <h3>Lanes</h3>
          {lanes.map(lane => (
            <div key={lane.laneNumber} className="lane-row" data-testid="lane-input">
              <span>Lane {lane.laneNumber}</span>
              <select
                value={lane.studentId}
                onChange={(e) => handleStudentSelect(lane.laneNumber, e.target.value)}
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
              <button 
                type="button" 
                onClick={() => removeLane(lane.laneNumber)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addLane}>
            Add Lane
          </button>
        </div>
        
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        
        <button type="submit">Create Race</button>
      </form>
    </div>
  );
};