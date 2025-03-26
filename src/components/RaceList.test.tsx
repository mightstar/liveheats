import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RaceList } from './RaceList';
import { AppProvider } from '../context/AppContext';
import { getAllRaces } from '../services/storageService';

// Mock the storage service
jest.mock('../services/storageService', () => ({
  getAllRaces: jest.fn()
}));

// Test utility function to render components with configured router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        {component}
      </AppProvider>
    </BrowserRouter>
  );
};

describe('RaceList Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (getAllRaces as jest.Mock).mockReset();
  });

  it('displays "No races found" message when races array is empty', () => {
    (getAllRaces as jest.Mock).mockReturnValue([]);
    
    renderWithRouter(<RaceList />);

    expect(screen.getByText('No races found. Please create a race to get started.')).toBeInTheDocument();
  });

  it('renders the races table with correct headers', () => {
    const mockRaces = [
      {
        id: '1',
        name: 'Race 1',
        lanes: [
          { id: '1', studentName: 'Student 1', place: 1 },
          { id: '2', studentName: 'Student 2', place: 2 }
        ]
      }
    ];
    
    (getAllRaces as jest.Mock).mockReturnValue(mockRaces);

    renderWithRouter(<RaceList />);

    expect(screen.getByText('Race Name')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('displays correct race information in the table', () => {
    const mockRaces = [
      {
        id: '1',
        name: 'Race 1',
        lanes: [
          { id: '1', studentName: 'Student 1', place: 1 },
          { id: '2', studentName: 'Student 2', place: 2 }
        ]
      },
      {
        id: '2',
        name: 'Race 2',
        lanes: [
          { id: '3', studentName: 'Student 3', place: undefined },
          { id: '4', studentName: 'Student 4', place: undefined }
        ]
      }
    ];
    
    (getAllRaces as jest.Mock).mockReturnValue(mockRaces);

    renderWithRouter(<RaceList />);

    expect(screen.getByText('Race 1')).toBeInTheDocument();
    expect(screen.getByText('Race 2')).toBeInTheDocument();
    // Use getAllByText for multiple elements
    const studentCounts = screen.getAllByText('2 students');
    expect(studentCounts).toHaveLength(2);
  });

  it('shows correct status for completed and pending races', () => {
    const mockRaces = [
      {
        id: '1',
        name: 'Race 1',
        lanes: [
          { id: '1', studentName: 'Student 1', place: 1 },
          { id: '2', studentName: 'Student 2', place: 2 }
        ]
      },
      {
        id: '2',
        name: 'Race 2',
        lanes: [
          { id: '3', studentName: 'Student 3', place: undefined },
          { id: '4', studentName: 'Student 4', place: undefined }
        ]
      }
    ];
    
    (getAllRaces as jest.Mock).mockReturnValue(mockRaces);

    renderWithRouter(<RaceList />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders correct action links based on race status', () => {
    const mockRaces = [
      {
        id: '1',
        name: 'Race 1',
        lanes: [
          { id: '1', studentName: 'Student 1', place: 1 },
          { id: '2', studentName: 'Student 2', place: 2 }
        ]
      },
      {
        id: '2',
        name: 'Race 2',
        lanes: [
          { id: '3', studentName: 'Student 3', place: undefined },
          { id: '4', studentName: 'Student 4', place: undefined }
        ]
      }
    ];
    
    (getAllRaces as jest.Mock).mockReturnValue(mockRaces);

    renderWithRouter(<RaceList />);

    expect(screen.getByText('View Results')).toBeInTheDocument();
    expect(screen.getByText('Record Results')).toBeInTheDocument();
  });
}); 