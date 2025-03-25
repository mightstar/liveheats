import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RaceForm } from './RaceForm';
import { AppProvider } from '../context/AppContext';
import { getStudents } from '../services/studentService';

// Mock the student service
jest.mock('../services/studentService', () => ({
  getStudents: jest.fn()
}));

describe('RaceForm', () => {
  beforeEach(() => {
    // Reset mocks
    (getStudents as jest.Mock).mockReset();
    
    // Mock students
    (getStudents as jest.Mock).mockReturnValue([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' },
      { id: '3', name: 'Charlie' }
    ]);
  });

  test('renders race form', () => {
    render(
      <AppProvider>
        <RaceForm />
      </AppProvider>
    );
    
    expect(screen.getByLabelText(/race name/i)).toBeInTheDocument();
    expect(screen.getByText(/lanes/i)).toBeInTheDocument();
  });

  test('allows adding lanes', () => {
    render(
      <AppProvider>
        <RaceForm />
      </AppProvider>
    );
    
    const addLaneButton = screen.getByRole('button', { name: /add lane/i });
    
    // Initially should have 2 lanes (minimum required)
    const initialLanes = screen.getAllByTestId('lane-input');
    expect(initialLanes.length).toBe(2);
    
    // Add a lane
    fireEvent.click(addLaneButton);
    
    // Should now have 3 lanes
    const updatedLanes = screen.getAllByTestId('lane-input');
    expect(updatedLanes.length).toBe(3);
  });

  test('validates race creation', async () => {
    render(
      <AppProvider>
        <RaceForm />
      </AppProvider>
    );
    
    // Submit without name
    const createButton = screen.getByRole('button', { name: /create race/i });
    fireEvent.click(createButton);
    
    // Should show validation error
    expect(screen.getByText(/please enter a race name/i)).toBeInTheDocument();
    
    // Fill in race name
    const nameInput = screen.getByLabelText(/race name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Race' } });
    
    // Don't select students
    fireEvent.click(createButton);
    
    // Should show validation error
    expect(screen.getByText(/please select students for all lanes/i)).toBeInTheDocument();
  });
});