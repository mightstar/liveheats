import { getStudents, addStudent, clearStudents } from './studentService';
import { Student } from '../types';

describe('Student Service', () => {
  beforeEach(() => {
    localStorage.clear();
    clearStudents();
  });

  test('should add and retrieve students', () => {
    const student: Student = { id: '1', name: 'Alice' };
    addStudent(student);
    
    const students = getStudents();
    expect(students).toHaveLength(1);
    expect(students[0]).toEqual(student);
  });

  test('should clear students', () => {
    const student: Student = { id: '1', name: 'Alice' };
    addStudent(student);
    
    clearStudents();
    
    const students = getStudents();
    expect(students).toHaveLength(0);
  });
});