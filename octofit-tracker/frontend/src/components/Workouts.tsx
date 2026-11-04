import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type Workout = {
  title: string;
  focus?: string;
  minutes?: number;
  reason?: string;
};

export default function Workouts() {
  const [suggestions, setSuggestions] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<{ suggestions: Workout[] }>('/api/workouts/suggestions/mona@example.com')
      .then(({ suggestions: nextSuggestions }) => setSuggestions(nextSuggestions))
      .catch(() => setError('Unable to load workout suggestions.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="card h-100" aria-labelledby="workouts-title">
      <div className="card-body">
        <h2 id="workouts-title" className="h4">Workout suggestions</h2>
        {loading && <p role="status">Loading workout suggestions...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && suggestions.length === 0 && <p>No workout suggestions yet.</p>}
        {!loading && !error && suggestions.length > 0 && (
          <>
            <p role="status">Workout suggestions loaded successfully.</p>
            <ul>
              {suggestions.map((suggestion) => (
                <li key={suggestion.title}>
                  <strong>{suggestion.title}</strong>
                  {suggestion.focus ? ` (${suggestion.focus})` : ''}
                  {suggestion.minutes ? ` - ${suggestion.minutes} minutes` : ''}
                  {suggestion.reason ? `: ${suggestion.reason}` : ''}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
