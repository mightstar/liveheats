import { Student } from '../types';

const STUDENTS_KEY = 'liveheats_students';

let studentsCache: Student[] = [];

// Initialize the cache from localStorage
function initializeCache(): void {
  try {
    const storedStudents = localStorage.getItem(STUDENTS_KEY);
    if (storedStudents) {
      studentsCache = JSON.parse(storedStudents);
    }
  } catch (error) {
    console.error('Failed to load students from localStorage:', error);
    studentsCache = [];
  }
}

// Save students to localStorage
function saveToStorage(): void {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(studentsCache));
}

export function getStudents(): Student[] {
  initializeCache();
  return [...studentsCache];
}

export function addStudent(student: Student): void {
  initializeCache();
  
  // Check if student already exists
  const exists = studentsCache.some(s => s.id === student.id);
  if (!exists) {
    studentsCache.push(student);
    saveToStorage();
  }
}

export function clearStudents(): void {
  studentsCache = [];
  saveToStorage();
}