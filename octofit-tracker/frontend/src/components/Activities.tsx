import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Activity = {
  type: string;
  minutes: number;
  points: number;
};

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<{ activities: Activity[] }>('/api/activities')
      .then(({ activities: nextActivities }) => setActivities(nextActivities))
      .catch(() => setError('Unable to load activities.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="card h-100" aria-labelledby="activities-title">
      <div className="card-body">
        <h2 id="activities-title" className="h4">Activities</h2>
        {loading && <p role="status">Loading activities...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && activities.length === 0 && <p>No activities yet.</p>}
        {!loading && !error && activities.length > 0 && (
          <>
            <p role="status">Activities loaded successfully.</p>
            <ul>
              {activities.map((activity, index) => (
                <li key={`${activity.type}-${index}`}>
                  {activity.type}: {activity.minutes} minutes, {activity.points} points
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
