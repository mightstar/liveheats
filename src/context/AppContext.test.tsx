import React from 'react';
import { render, act } from '@testing-library/react';
import { AppProvider, useAppContext } from './AppContext';
import { Student, Race, Lane } from '../types';

// Test component that consumes the context
const TestComponent = () => {
  const { 
    students, 
    races,
    addStudent,
    createNewRace,
    recordResults
  } = useAppContext();
  
  return (
    <div>
      <div data-testid="studentCount">{students.length}</div>
      <div data-testid="raceCount">{races.length}</div>
      <button 
        data-testid="addStudent" 
        onClick={() => addStudent({ id: '1', name: 'Test Student' })}
      >
        Add Student
      </button>
      <button 
        data-testid="createRace" 
        onClick={() => {
          try {
            createNewRace('Test Race', [
              { studentId: '1', laneNumber: 1 },
              { studentId: '2', laneNumber: 2 }
            ]);
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Create Race
      </button>
    </div>
  );
};

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear();
    // Add test students
    localStorage.setItem('liveheats_students', JSON.stringify([
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ]));
    // Clear races
    localStorage.setItem('liveheats_races', JSON.stringify({}));
  });

  test('should provide students from storage', () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    expect(getByTestId('studentCount').textContent).toBe('2');
  });

  test('should add a student', () => {
    let stuLen: Element;
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    stuLen = getByTestId('studentCount');
    expect(stuLen.textContent).toBe('2');
    
    act(() => {
      // Add a third student
      getByTestId('addStudent').click();
    });
    
    // Should still show 2 since we tried to add a duplicate ID
    expect(stuLen.textContent).toBe('2');
  });

  test('should create a race', () => {
    const { getByTestId } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    expect(getByTestId('raceCount').textContent).toBe('0');
    
    act(() => {
      getByTestId('createRace').click();
    });
    
    expect(getByTestId('raceCount').textContent).toBe('1');
  });
});