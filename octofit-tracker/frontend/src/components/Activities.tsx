import { useEffect, useState } from 'react';
import { API_BASE_URL, normalizeApiResponse } from '../api';

type Activity = {
  id: string;
  type: string;
  userId: string;
  durationMinutes: number;
  caloriesBurned: number;
  date: string;
};

function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `${API_BASE_URL}/api/activities/`;
    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load activities: ${response.status}`);
        }
        const data = await response.json();
        setActivities(normalizeApiResponse<Activity>(data));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2>Activities</h2>
      <p className="api-path">{API_BASE_URL}/api/activities/</p>
      {loading && <p>Loading activities…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && activities.length === 0 && <p>No activities found.</p>}
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <strong>{activity.type}</strong> for user <code>{activity.userId}</code> — {activity.durationMinutes} min, {activity.caloriesBurned} kcal on {new Date(activity.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Activities;
