import React from 'react';
import { render, screen } from '@testing-library/react';
import { StudentList } from './StudentList';
import { AppProvider } from '../context/AppContext';
import { getStudents, addStudent } from '../services/studentService';

// Mock the student service
jest.mock('../services/studentService', () => ({
  getStudents: jest.fn(),
  addStudent: jest.fn()
}));

describe('StudentList', () => {
  beforeEach(() => {
    // Reset mocks
    (getStudents as jest.Mock).mockReset();
  });

  test('renders empty message when no students', () => {
    (getStudents as jest.Mock).mockReturnValue([]);
    
    render(
      <AppProvider>
        <StudentList />
      </AppProvider>
    );
    
    expect(screen.getByText(/no students found/i)).toBeInTheDocument();
  });

  test('renders list of students', () => {
    (getStudents as jest.Mock).mockReturnValue([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ]);
    
    render(
      <AppProvider>
        <StudentList />
      </AppProvider>
    );
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });
});