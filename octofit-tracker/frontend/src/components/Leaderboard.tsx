import { useEffect, useState } from 'react';
import { API_BASE_URL, normalizeApiResponse } from '../api';

type LeaderboardEntry = {
  id: string;
  teamId: string;
  teamName: string;
  score: number;
  recordedAt?: string;
};

function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `${API_BASE_URL}/api/leaderboard/`;
    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load leaderboard: ${response.status}`);
        }
        const data = await response.json();
        setEntries(normalizeApiResponse<LeaderboardEntry>(data));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2>Leaderboard</h2>
      <p className="api-path">{API_BASE_URL}/api/leaderboard/</p>
      {loading && <p>Loading leaderboard…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && entries.length === 0 && <p>No leaderboard entries available.</p>}
      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.teamName}</strong> — {entry.score} points{entry.recordedAt ? ` (updated ${new Date(entry.recordedAt).toLocaleDateString()})` : ''}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default Leaderboard;
