import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export const RaceResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getRaceById, students } = useAppContext();
  
  // Find student name by ID
  const getStudentName = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };
  
  const race = id ? getRaceById(id) : null;
  if (!race) return <p>Race not found</p>;
  
  // Check if all results are recorded
  const hasCompleteResults = race.lanes.every(lane => lane.place !== undefined);
  if (!hasCompleteResults) {
    return (
      <div className="race-results">
        <h2>Results: {race.name}</h2>
        <p>Results have not been recorded for this race yet.</p>
        <Link to={`/race/${race.id}/record`}>Record Results</Link>
      </div>
    );
  }
  
  // Sort lanes by place
  const sortedLanes = [...race.lanes].sort((a, b) => {
    if (a.place === undefined) return 1;
    if (b.place === undefined) return -1;
    return a.place - b.place;
  });
  
  return (
    <div className="race-results">
      <h2>Results: {race.name}</h2>
      <table>
        <thead>
          <tr>
            <th>Place</th>
            <th>Student</th>
            <th>Lane</th>
          </tr>
        </thead>
        <tbody>
          {sortedLanes.map(lane => (
            <tr key={lane.laneNumber}>
              <td>{lane.place}</td>
              <td>{getStudentName(lane.studentId)}</td>
              <td>{lane.laneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="actions">
        <Link to="/">Back to Races</Link>
      </div>
    </div>
  );
};