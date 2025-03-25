import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Race, Lane } from '../types';
import { getStudents, addStudent as addStudentToService } from '../services/studentService';
import { createRace } from '../services/raceService';
import { saveRace, getAllRaces, getRace } from '../services/storageService';
import { recordRaceResults } from '../services/resultService';

interface AppContextType {
  students: Student[];
  races: Race[];
  addStudent: (student: Student) => void;
  createNewRace: (name: string, lanes: Omit<Lane, 'place'>[]) => Race;
  recordResults: (raceId: string, results: { laneNumber: number, place: number }[]) => Race;
  getRaceById: (id: string) => Race | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    // Load initial data
    setStudents(getStudents());
    setRaces(getAllRaces());
  }, []);

  const addStudent = (student: Student) => {
    addStudentToService(student);
    setStudents(getStudents());
  };

  const createNewRace = (name: string, lanes: Omit<Lane, 'place'>[]) => {
    const race = createRace(name, lanes);
    saveRace(race);
    setRaces(getAllRaces());
    return race;
  };

  const recordResults = (raceId: string, results: { laneNumber: number, place: number }[]) => {
    const race = getRace(raceId);
    if (!race) {
      throw new Error(`Race with ID ${raceId} not found`);
    }
    
    const updatedRace = recordRaceResults(race, results);
    saveRace(updatedRace);
    setRaces(getAllRaces());
    return updatedRace;
  };

  const getRaceById = (id: string) => {
    return getRace(id);
  };

  const value = {
    students,
    races,
    addStudent,
    createNewRace,
    recordResults,
    getRaceById
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};