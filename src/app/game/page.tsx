'use client'; //Carlotta
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

let socket: any;

export default function EmojiMovieQuiz() {
  const [emoji, setEmoji] = useState('🎬❓');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); //Lena
  const [gameStarted, setGameStarted] = useState(false);
  const [gameDuration, setGameDuration] = useState(120); //Lena
  const [score, setScore] = useState(0); //Lena
  const [finalScores, setFinalScores] = useState<{ id: string; shortId: string; score: number }[] | null>(null); //Lena

  useEffect(() => {
    socket = io();

    socket.on('emoji', (newEmoji: string) => {
      setEmoji(newEmoji);
    });

    socket.on('answerBroadcast', (message: string) => {
      setMessages((prev) => [...prev, `💬 ${message}`]);
    });

    socket.on('scoreUpdate', (newScore: number) => {
      setScore(newScore); //Lena
    });

    socket.on('finalScores', (scores) => {
      setFinalScores(scores); //Lena
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || timeLeft === null) return;

    if (timeLeft <= 0) { //Lena
      setGameStarted(false);
      socket.emit('requestScores');
      return;
    }

    const timer = setTimeout(() => { //Lena
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted]);

  const startGame = () => { //Carlotta
    setGameStarted(true);
    setMessages([]);
    setTimeLeft(gameDuration);
    setFinalScores(null);
    socket.emit('startGame');
  };

  const sendAnswer = () => { //Carlotta
    if (!input.trim()) return;
    socket.emit('answer', input);
    setInput('');
  };

  const formatTime = (seconds: number) => { //Lena
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (finalScores) { //Lena
    const maxScore = Math.max(...finalScores.map((s) => s.score));
    const winners = finalScores.filter((s) => s.score === maxScore);

    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">🏁 Spiel beendet!</h1>
        <p className="text-xl mb-4">
          {winners.length === 1
            ? `🎉 Gewinner: ${winners[0].shortId} mit ${winners[0].score} Punkten`
            : `🎉 Gleichstand! ${winners.map(w => w.shortId).join(', ')} mit ${maxScore} Punkten`}
        </p>
        <h2 className="text-lg font-semibold mb-2">Punktestände:</h2>
        <ul className="text-left w-80">
          {finalScores.map((s) => (
            <li key={s.id}>
              {s.shortId}: {s.score} Punkt{s.score !== 1 ? 'e' : ''}
            </li>
          ))}
        </ul>
        <button
          onClick={startGame}
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Neue Runde starten
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">🎬 Emoji-Film-Quiz (Multiplayer)</h1>

      {!gameStarted ? (
        <div className="mb-6">
          <h2 className="text-xl mb-2">Spieldauer wählen:</h2>
          <div className="flex gap-4 mb-4">
            <button className={`px-4 py-2 rounded ${gameDuration === 30 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setGameDuration(30)}>
              30 Sekunden
            </button>
            <button className={`px-4 py-2 rounded ${gameDuration === 60 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setGameDuration(60)}>
              1 Minute
            </button>
          </div>
          <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition" onClick={startGame}>
            Spiel starten
          </button>
        </div>
      ) : (
        <>
          <div className="text-6xl mb-4">{emoji}</div>
          <div className="text-lg mb-4">⏱️ Zeit: {formatTime(timeLeft!)}</div>
          <div className="text-lg mb-2">⭐ Punkte: {score}</div>

          <input
            className="border p-2 text-lg w-72 mb-3"
            placeholder="Filmtitel eingeben..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendAnswer()}
          />
          <div className="flex gap-4 mb-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" onClick={sendAnswer}>
              Senden
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl mb-2">Antworten anderer:</h2>
            <ul className="text-left max-h-40 overflow-y-auto w-80">
              {messages.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
