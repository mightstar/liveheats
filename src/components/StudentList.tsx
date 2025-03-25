import React from 'react';
import { useAppContext } from '../context/AppContext';

export const StudentList: React.FC = () => {
  const { students } = useAppContext();

  if (students.length === 0) {
    return <p>No students found. Please add students to create races.</p>;
  }

  return (
    <div className="student-list">
      <h2>Students</h2>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            {student.name}
          </li>
        ))}
      </ul>
    </div>
  );
};