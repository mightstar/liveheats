import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Student } from '../types';

export const RecordResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRaceById, recordResults, students } = useAppContext();
  
  const [results, setResults] = useState<Array<{ laneNumber: number; studentId: string; place: string }>>([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!id) return;
    
    const race = getRaceById(id);
    if (!race) {
      navigate('/');
      return;
    }
    
    // Initialize results with empty places
    setResults(
      race.lanes.map(lane => ({
        laneNumber: lane.laneNumber,
        studentId: lane.studentId,
        place: ''
      }))
    );
  }, [id, getRaceById, navigate]);
  
  // Find student name by ID
  const getStudentName = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };
  
  const handlePlaceChange = (laneNumber: number, place: string) => {
    setResults(
      results.map(result =>
        result.laneNumber === laneNumber ? { ...result, place } : result
      )
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate that all places are filled
    if (results.some(result => !result.place)) {
      setError('Please enter places for all students');
      return;
    }
    
    // Convert places to numbers
    const numericResults = results.map(result => ({
      laneNumber: result.laneNumber,
      place: parseInt(result.place, 10)
    }));
    
    try {
      if (!id) throw new Error('Race ID not found');
      recordResults(id, numericResults);
      navigate(`/race/${id}/results`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record results');
    }
  };
  
  const race = id ? getRaceById(id) : null;
  if (!race) return <p>Race not found</p>;
  
  return (
    <div className="record-results">
      <h2>Record Results: {race.name}</h2>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th>Lane</th>
              <th>Student</th>
              <th>Place</th>
            </tr>
          </thead>
          <tbody>
            {results.map(result => (
              <tr key={result.laneNumber}>
                <td>{result.laneNumber}</td>
                <td>{getStudentName(result.studentId)}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={result.place}
                    onChange={(e) => handlePlaceChange(result.laneNumber, e.target.value)}
                    aria-label={`Place for ${getStudentName(result.studentId)}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {error && <p className="error">{error}</p>}
        
        <button type="submit">Save Results</button>
      </form>
    </div>
  );
};