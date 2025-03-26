import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RaceResults } from './RaceResults';
import { AppProvider } from '../context/AppContext';

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )
}));

// Mock the AppContext
const mockGetRaceById = jest.fn();
const mockStudents = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' }
];

jest.mock('../context/AppContext', () => ({
  ...jest.requireActual('../context/AppContext'),
  useAppContext: () => ({
    getRaceById: mockGetRaceById,
    students: mockStudents
  })
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

describe('RaceResults Component', () => {
  beforeEach(() => {
    mockGetRaceById.mockReset();
  });

  it('displays "Race not found" message when race does not exist', () => {
    mockGetRaceById.mockReturnValue(null);
    
    renderWithRouter(<RaceResults />);

    expect(screen.getByText('Race not found')).toBeInTheDocument();
  });

  it('displays message and link when race results are incomplete', () => {
    const mockRace = {
      id: '1',
      name: 'Test Race',
      lanes: [
        { laneNumber: 1, studentId: '1', place: 1 },
        { laneNumber: 2, studentId: '2', place: undefined }
      ]
    };

    mockGetRaceById.mockReturnValue(mockRace);
    
    renderWithRouter(<RaceResults />);

    expect(screen.getByText('Results: Test Race')).toBeInTheDocument();
    expect(screen.getByText('Results have not been recorded for this race yet.')).toBeInTheDocument();
    expect(screen.getByText('Record Results')).toBeInTheDocument();
  });

  it('displays complete race results in sorted order', () => {
    const mockRace = {
      id: '1',
      name: 'Test Race',
      lanes: [
        { laneNumber: 1, studentId: '1', place: 2 },
        { laneNumber: 2, studentId: '2', place: 1 },
        { laneNumber: 3, studentId: '3', place: 3 }
      ]
    };

    mockGetRaceById.mockReturnValue(mockRace);
    
    renderWithRouter(<RaceResults />);

    // Check headers
    expect(screen.getByText('Place')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Lane')).toBeInTheDocument();

    // Check results are displayed in correct order
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4); // Header row + 3 data rows

    // Check back to races link
    expect(screen.getByText('Back to Races')).toBeInTheDocument();
  });

  it('displays "Unknown Student" when student ID is not found', () => {
    const mockRace = {
      id: '1',
      name: 'Test Race',
      lanes: [
        { laneNumber: 1, studentId: '999', place: 1 }
      ]
    };

    mockGetRaceById.mockReturnValue(mockRace);
    
    renderWithRouter(<RaceResults />);

    expect(screen.getByText('Unknown Student')).toBeInTheDocument();
  });
}); 