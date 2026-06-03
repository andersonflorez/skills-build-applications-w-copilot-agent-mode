import { useEffect, useState } from 'react';
import { API_BASE_URL, normalizeApiResponse } from '../api';

type Workout = {
  id: string;
  name: string;
  focus: string;
  durationMinutes: number;
  difficulty: string;
};
 
function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const url = `${API_BASE_URL}/api/workouts/`;
    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load workouts: ${response.status}`);
        }
        const data = await response.json();
        setWorkouts(normalizeApiResponse<Workout>(data));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2>Workouts</h2>
      <p className="api-path">{API_BASE_URL}/api/workouts/</p>
      {loading && <p>Loading workouts…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && workouts.length === 0 && <p>No workouts found.</p>}
      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>
            <strong>{workout.name}</strong> — {workout.focus}, {workout.durationMinutes} min ({workout.difficulty})
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Workouts;
