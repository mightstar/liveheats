import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecordResults } from './RecordResults';
import { AppProvider } from '../context/AppContext';

// Mock the useNavigate hook
const mockNavigate = jest.fn();

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  )
}));

// Mock the AppContext
const mockGetRaceById = jest.fn();
const mockRecordResults = jest.fn();
const mockStudents = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' }
];

jest.mock('../context/AppContext', () => ({
  ...jest.requireActual('../context/AppContext'),
  useAppContext: () => ({
    getRaceById: mockGetRaceById,
    recordResults: mockRecordResults,
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

describe('RecordResults Component', () => {
  beforeEach(() => {
    mockGetRaceById.mockReset();
    mockRecordResults.mockReset();
    mockNavigate.mockReset();
  });

  it('displays "Race not found" message when race does not exist', () => {
    mockGetRaceById.mockReturnValue(null);
    
    renderWithRouter(<RecordResults />);

    expect(screen.getByText('Race not found')).toBeInTheDocument();
  });

  it('renders the form with correct race information', () => {
    const mockRace = {
      id: '1',
      name: 'Test Race',
      lanes: [
        { laneNumber: 1, studentId: '1', place: undefined },
        { laneNumber: 2, studentId: '2', place: undefined }
      ]
    };

    mockGetRaceById.mockReturnValue(mockRace);
    
    renderWithRouter(<RecordResults />);

    expect(screen.getByText('Record Results: Test Race')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Save Results')).toBeInTheDocument();
  });

  it('displays error when submitting with empty places', async () => {
    const mockRace = {
      id: '1',
      name: 'Test Race',
      lanes: [
        { laneNumber: 1, studentId: '1', place: undefined },
        { laneNumber: 2, studentId: '2', place: undefined }
      ]
    };

    mockGetRaceById.mockReturnValue(mockRace);
    
    renderWithRouter(<RecordResults />);

    const submitButton = screen.getByText('Save Results');
    fireEvent.click(submitButton);

    expect(screen.getByText('Please enter places for all students')).toBeInTheDocument();
    expect(mockRecordResults).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('successfully records results and navigates to results page', async () => {
    const mockRace = {
      id: '1',
      name: 'Test Race',
      lanes: [
        { laneNumber: 1, studentId: '1', place: undefined },
        { laneNumber: 2, studentId: '2', place: undefined }
      ]
    };

    mockGetRaceById.mockReturnValue(mockRace);
    mockRecordResults.mockReturnValue({ ...mockRace, lanes: [
      { laneNumber: 1, studentId: '1', place: 1 },
      { laneNumber: 2, studentId: '2', place: 2 }
    ]});
    
    renderWithRouter(<RecordResults />);

    // Fill in the places
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });

    // Submit the form
    const submitButton = screen.getByText('Save Results');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRecordResults).toHaveBeenCalledWith('1', [
        { laneNumber: 1, place: 1 },
        { laneNumber: 2, place: 2 }
      ]);
      expect(mockNavigate).toHaveBeenCalledWith('/race/1/results');
    });
  });

  it('displays error when recordResults throws an error', async () => {
    const mockRace = {
      id: '1',
      name: 'Test Race',
      lanes: [
        { laneNumber: 1, studentId: '1', place: undefined },
        { laneNumber: 2, studentId: '2', place: undefined }
      ]
    };

    mockGetRaceById.mockReturnValue(mockRace);
    mockRecordResults.mockImplementation(() => {
      throw new Error('Failed to record results');
    });
    
    renderWithRouter(<RecordResults />);

    // Fill in the places
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });

    // Submit the form
    const submitButton = screen.getByText('Save Results');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to record results')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('displays "Unknown Student" when student ID is not found', () => {
    const mockRace = {
      id: '1',
      name: 'Test Race',
      lanes: [
        { laneNumber: 1, studentId: '999', place: undefined }
      ]
    };

    mockGetRaceById.mockReturnValue(mockRace);
    
    renderWithRouter(<RecordResults />);

    expect(screen.getByText('Unknown Student')).toBeInTheDocument();
  });
}); 