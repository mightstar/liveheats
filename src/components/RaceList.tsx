import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

export const RaceList: React.FC = () => {
  const { races } = useAppContext();

  if (races.length === 0) {
    return <p>No races found. Please create a race to get started.</p>;
  }

  // Helper function to check if a race has results
  const hasResults = (raceId: string) => {
    const race = races.find(r => r.id === raceId);
    return race && race.lanes.every(lane => lane.place !== undefined);
  };

  return (
    <div className="race-list">
      <h2>Races</h2>
      <table>
        <thead>
          <tr>
            <th>Race Name</th>
            <th>Students</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {races.map(race => (
            <tr key={race.id}>
              <td>{race.name}</td>
              <td>{race.lanes.length} students</td>
              <td>
                {hasResults(race.id) ? 'Completed' : 'Pending'}
              </td>
              <td>
                {hasResults(race.id) ? (
                  <Link to={`/race/${race.id}/results`}>View Results</Link>
                ) : (
                  <Link to={`/race/${race.id}/record`}>Record Results</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};