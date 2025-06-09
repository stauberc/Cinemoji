'use client'; // Carlotta
import { useEffect, useState } from 'react';

interface HistoryData {
  id: number;
  createdAt: string;
  rounds: {
    id: number;
    emoji: string;
    correctAnswer: string;
    createdAt: string;
    guesses: {
      id: number;
      guess: string;
      isCorrect: boolean;
      createdAt: string;
      user: { username: string };
    }[];
  }[];
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<HistoryData[]>([]);

  useEffect(() => {
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => setSessions(data));
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl mt-12">📚 Spielverlauf</h1>
      {sessions.length === 0 && (
        <p className="text-gray-500">Noch keine Spielverläufe gespeichert.</p>
      )}

      {sessions.map((session) => {
        const allGuesses = session.rounds.flatMap((r) => r.guesses);
        const players = Array.from(new Set(allGuesses.map((g) => g.user.username)));

        const scores = allGuesses
          .filter((g) => g.isCorrect)
          .reduce((acc: Record<string, number>, guess) => {
            const name = guess.user.username;
            acc[name] = (acc[name] || 0) + 1;
            return acc;
          }, {});

        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const maxScore = sortedScores.length > 0 ? sortedScores[0][1] : 0;
        const winners = sortedScores
          .filter(([, points]) => points === maxScore)
          .map(([name]) => name);

        return (
          <div key={session.id} className="mb-10 border-b pb-6">
            <h2 className="text-xl font-semibold mb-1"> 🎮 Session #{session.id} – Spieler:innen: {players.join(' vs ')}</h2>
            <p className="text-sm text-gray-500"> Gestartet am: {new Date(session.createdAt).toLocaleString()} </p>

            <p className="text-sm text-gray-600 mt-2 mb-1"> Punkte:
              {players.map((p) => (
                <span key={p} className="ml-2">
                  {p}: {scores[p] || 0}
                </span>
              ))}
            </p>

            <p className="text-sm text-blue-700 mb-4">
              {winners.length === 1 ? `Gewinner: ${winners[0]}` : `Unentschieden zwischen: ${winners.join(' & ')}`}
            </p>

            {session.rounds.map((round, index) => (
              <div key={round.id} className="mb-6 pl-4 border-l-2 border-green-400">
                <h3 className="font-bold mb-1">Runde {index + 1}</h3>
                <p>🎭 Emoji: <span className="text-xl">{round.emoji}</span></p>
                <p>✅ Lösung: <strong>{round.correctAnswer}</strong></p>
                <p className="text-sm text-gray-500"> ⏱️ {new Date(round.createdAt).toLocaleString()}</p>
                <ul className="mt-2 pl-2">
                  {round.guesses.map((guess) => (
                    <li key={guess.id} className={`mb-1 ${guess.isCorrect ? 'text-green-600' : 'text-red-500'}`} > {guess.user.username}: {guess.guess} {guess.isCorrect ? '✅' : '❌'} </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </main>
  );
}
