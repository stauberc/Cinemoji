'use client';

import { useEffect, useState } from 'react';

interface Answer {
  playerId: string;
  guess: string;
  isCorrect: boolean;
}

interface Round {
  roundNumber: number;
  emoji: string;
  correctAnswer: string;
  answers: Answer[];
}

interface Player {
  id: string;
  username: string;
  score: number;
}

interface SessionHistory {
  sessionId: string;
  startedAt: string;
  endedAt: string;
  players: Player[];
  rounds: Round[];
}

export default function SessionHistoryPage() {
  const [history, setHistory] = useState<SessionHistory | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/session-history');
        if (!res.ok) {
          console.error('Fehler beim Laden der Session:', res.status);
          return;
        }
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error('API-Fehler:', err);
      }
    }
    fetchHistory();
  }, []);

  if (!history) {
    return <div className="text-center p-6">Lade Spielverlauf...</div>;
  }

  const duration = Math.round(
    (new Date(history.endedAt).getTime() - new Date(history.startedAt).getTime()) / 1000
  );
  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div>
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mt-12 text-center ">Spielverlauf</h1>
        <p className="mb-2 text-center">Session-ID: {history.sessionId}</p>
        <p className="mb-6 text-center">Dauer: {formatTime(duration)}</p>

        <h2 className="text-2xl font-semibold mb-3">🎮 Spieler:innen</h2>
        <ul className="mb-6">
          {history.players.map((p, index) => (
            <li key={`${p.id}-${index}`}>
              {p.username}: {p.score} Punkte
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mb-3">🎬 Runden</h2>
        {history.rounds.length === 0 ? (
          <p>Keine Rundeninformationen gespeichert.</p>
        ) : (
          history.rounds.map((round) => (
            <div key={round.roundNumber} className="mb-4 border rounded p-4">
              <h3 className="text-xl font-medium mb-2">Runde {round.roundNumber}: {round.emoji}</h3>
              <p className="mb-2">Lösung: <b>{round.correctAnswer}</b></p>
              <ul>
                {round.answers.map((a, i) => (
                  <li key={i}>
                    {a.guess} – {a.isCorrect ? '✅' : '❌'} (
                    {history.players.find((p) => p.id === a.playerId)?.username})
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </main>
    </div>
  );
}