export interface Student {
    id: string;
    name: string;
  }
  
  export interface Lane {
    laneNumber: number;
    studentId: string;
    place?: number;
  }
  
  export interface Race {
    id: string;
    name: string;
    lanes: Lane[];
  }