import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentForm } from './StudentForm';
import { AppProvider } from '../context/AppContext';

describe('StudentForm', () => {
  test('renders student form', () => {
    render(
      <AppProvider>
        <StudentForm />
      </AppProvider>
    );
    
    expect(screen.getByLabelText(/student name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add student/i })).toBeInTheDocument();
  });

  test('adds a student when form is submitted', () => {
    render(
      <AppProvider>
        <StudentForm />
      </AppProvider>
    );
    
    const nameInput = screen.getByLabelText(/student name/i);
    const addButton = screen.getByRole('button', { name: /add student/i });
    
    fireEvent.change(nameInput, { target: { value: 'New Student' } });
    fireEvent.click(addButton);
    
    // Form should be cleared after submission
    expect(nameInput).toHaveValue('');
  });

  test('does not submit if name is empty', () => {
    render(
      <AppProvider>
        <StudentForm />
      </AppProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /add student/i });
    
    fireEvent.click(addButton);
    
    // Should show validation message
    expect(screen.getByText(/please enter a name/i)).toBeInTheDocument();
  });
});