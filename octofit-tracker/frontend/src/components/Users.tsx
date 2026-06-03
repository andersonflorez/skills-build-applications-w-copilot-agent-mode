import { useEffect, useState } from 'react';
import { API_BASE_URL, normalizeApiResponse } from '../api';

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = `${API_BASE_URL}/api/users/`;
    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load users: ${response.status}`);
        }
        const data = await response.json();
        setUsers(normalizeApiResponse<User>(data));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2>Users</h2>
      <p className="api-path">{API_BASE_URL}/api/users/</p>
      {loading && <p>Loading users…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> — {user.email} (joined {new Date(user.createdAt).toLocaleDateString()})
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Users;
