import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const StudentForm: React.FC = () => {
  const { addStudent } = useAppContext();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter a name');
      return;
    }
    
    // Create a new student with a random ID
    addStudent({
      id: Date.now().toString(),
      name: name.trim()
    });
    
    // Reset form
    setName('');
    setError('');
  };

  return (
    <div className="student-form">
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentName">Student Name:</label>
          <input
            id="studentName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};