import { NavLink, Routes, Route } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import { API_BASE_URL, codespaceName } from './api';

function App() {
  const codeSpaceMessage = codespaceName
    ? `Using GitHub Codespaces API host: ${API_BASE_URL}`
    : 'VITE_CODESPACE_NAME is not set. Define it in .env.local to use Codespaces API URLs; otherwise localhost:8000 will be used.';

  return (
    <div className="app-container">
      <header>
        <h1>OctoFit Tracker</h1>
        <p>React 19 + Vite frontend with backend routing and Codespaces-aware API support.</p>
        <p className="env-note">{codeSpaceMessage}</p>
      </header>

      <nav>
        <NavLink to="/users" end>Users</NavLink>
        <NavLink to="/teams">Teams</NavLink>
        <NavLink to="/activities">Activities</NavLink>
        <NavLink to="/workouts">Workouts</NavLink>
        <NavLink to="/leaderboard">Leaderboard</NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
