# Liveheats - School Race Day Management System

A web-based system for managing school race days, allowing teachers to set up races, record results, and view race outcomes. Built with React, TypeScript, and designed with Test-Driven Development.


https://github.com/user-attachments/assets/21972b07-8eb0-45c0-8809-66d5230fb73c


## Features

- Student Management: Add students who will participate in races
- Race Creation: Create races with at least 2 students, assigning them to specific lanes
- Results Recording: Record the final placements of students in each race
- Results Viewing: View the results of completed races, including handling ties

## Business Rules

The system enforces the following rules:
1. A race can only be created with at least 2 students
2. Different students cannot be assigned to the same lane
3. The same student cannot be assigned to more than one lane in the same race
4. The final places in the race must be entered without gaps (e.g., 1, 2, 4 is not allowed)
5. In the case of ties, the next available place skips the number of tied athletes (e.g., if two people tie for 1st, the next place is 3rd)

## Technical Stack

- React
- TypeScript
- React Router
- Jest and React Testing Library for testing
- Local storage for data persistence
- Docker for containerization

## Prerequisites

- [Node.js](https://nodejs.org/) v18.x or higher
- [npm](https://www.npmjs.com/) v9.x or higher
- [Docker](https://www.docker.com/get-started) (optional, for containerized deployment)

## Getting Started

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/mightstar/liveheats.git
   cd liveheats
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser to http://localhost:3000

### Running with Docker

1. Build and start the container:
   ```bash
   docker-compose up --build
   ```

2. Open your browser to http://localhost:3000

3. To stop the container:
   ```bash
   docker-compose down
   ```

### Running Tests

```bash
npm test
```

## Project Structure

```bash
src/
├── components/        # UI components
│   ├── StudentForm.tsx
│   ├── StudentList.tsx
│   ├── RaceForm.tsx
│   ├── RaceList.tsx
│   ├── RecordResults.tsx
│   └── RaceResults.tsx
├── context/           # React context for state management
│   └── AppContext.tsx
├── services/          # Business logic and storage services
│   ├── raceService.ts
│   ├── resultService.ts
│   ├── storageService.ts
│   ├── studentService.ts
│   └── validationService.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main application component
├── App.css            # Application styles
└── index.tsx          # Entry point
```

## Usage Workflow

1. Add Students: Start by adding students who will participate in races.
2. Create Races: Create a race by giving it a name and assigning students to lanes.
3. Record Results: After a race is completed, record the finishing place for each student.
4. View Results: View race results to determine winners and award medals.

## Deployment

### Building for Production

```bash
npm run build
```

This creates a `build` directory with optimized production-ready files.
