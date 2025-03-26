import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { StudentForm } from "./components/StudentForm";
import { StudentList } from "./components/StudentList";
import { RaceForm } from "./components/RaceForm";
import { RaceList } from "./components/RaceList";
import { RecordResults } from "./components/RecordResults";
import { RaceResults } from "./components/RaceResults";
import "./App.css";

function App() {
  return (
    <Router>
      <AppProvider>
        <div className="app">
          <header>
            <h1>Liveheats - School Race Day</h1>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/students">Students</Link>
              <Link to="/races">Races</Link>
            </nav>
          </header>

          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <div className="home">
                    <section>
                      <h2>Manage Students</h2>
                      <p>Add students who will participate in the races.</p>
                      <Link to="/students">Manage Students</Link>
                    </section>

                    <section>
                      <h2>Manage Races</h2>
                      <p>Create races and record results.</p>
                      <Link to="/races">Manage Races</Link>
                    </section>
                  </div>
                }
              />

              <Route
                path="/students"
                element={
                  <div className="students-page">
                    <StudentForm />
                    <StudentList />
                  </div>
                }
              />

              <Route
                path="/races"
                element={
                  <div className="races-page">
                    <RaceForm />
                    <RaceList />
                  </div>
                }
              />

              <Route path="/race/:id/record" element={<RecordResults />} />
              <Route path="/race/:id/results" element={<RaceResults />} />
            </Routes>
          </main>

          <footer>
            <p>&copy; {new Date().getFullYear()} Liveheats - School Race Day</p>
          </footer>
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
