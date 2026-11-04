import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type LeaderboardEntry = {
  teamName: string;
  totalPoints: number;
  rank: number;
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<{ leaderboard: LeaderboardEntry[] }>('/api/leaderboard')
      .then(({ leaderboard: nextLeaderboard }) => setLeaderboard(nextLeaderboard))
      .catch(() => setError('Unable to load leaderboard.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="card h-100" aria-labelledby="leaderboard-title">
      <div className="card-body">
        <h2 id="leaderboard-title" className="h4">Leaderboard</h2>
        {loading && <p role="status">Loading leaderboard...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && leaderboard.length === 0 && <p>No leaderboard rankings yet.</p>}
        {!loading && !error && leaderboard.length > 0 && (
          <>
            <p role="status">Leaderboard loaded successfully.</p>
            <ol>
              {leaderboard.map((entry) => (
                <li key={entry.teamName}>
                  {entry.teamName}: {entry.totalPoints} points (rank {entry.rank})
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}
