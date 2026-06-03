import { useEffect, useState } from 'react';
import { API_BASE_URL, normalizeApiResponse } from '../api';

type Team = {
  id: string;
  name: string;
  members: number;
  score: number;
};

function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `${API_BASE_URL}/api/teams/`;
    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load teams: ${response.status}`);
        }
        const data = await response.json();
        setTeams(normalizeApiResponse<Team>(data));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2>Teams</h2>
      <p className="api-path">{API_BASE_URL}/api/teams/</p>
      {loading && <p>Loading teams…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && teams.length === 0 && <p>No teams found.</p>}
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <strong>{team.name}</strong> — {team.members} members, {team.score} points
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Teams;
