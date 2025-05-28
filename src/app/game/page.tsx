'use client';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Header from '../components/header'; //Luna
import Footer from '../components/footer';

interface FinalScore {
  id: string;
  shortId: string;
  username: string;
  score: number;
}

let socket: Socket;

export default function EmojiMovieQuiz() {
  const [emoji, setEmoji] = useState('🎬❓');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [finalScores, setFinalScores] = useState<FinalScore[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState('');

  // Login-Check beim Laden
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Socket erst verbinden, wenn eingeloggt
  useEffect(() => {
    if (!username) return;

    socket = io({ query: { username } });

    socket.emit('readyToPlay');

    socket.on('waitingForPlayers', () => setLoading(true));
    socket.on('gameStarting', () => {
      setLoading(false);
      setScore(0);
    });
    socket.on('emoji', (e: string) => setEmoji(e));
    socket.on('answerBroadcast', (msg: string) => setMessages((prev) => [...prev, `💬 ${msg}`]));
    socket.on('scoreUpdate', setScore);
    socket.on('finalScores', setFinalScores);

    return () => socket.disconnect();
  }, [username]);

  const sendAnswer = () => {
    if (!input.trim()) return;
    socket.emit('answer', input);
    setInput('');
  };

  // Login-Formular anzeigen, wenn nicht eingeloggt
  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <h1 className="text-2xl mb-4">Login</h1>
        <input
          className="border p-2 mb-2"
          placeholder="Benutzername"
          value={usernameInput}
          onChange={e => setUsernameInput(e.target.value)}
        />
        
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            if (usernameInput.trim()) {
              localStorage.setItem('username', usernameInput.trim());
              setUsername(usernameInput.trim());
            }
          }}
        >
          Einloggen
        </button>
      </div>
    );
  }

  if (finalScores) {
    const max = Math.max(...finalScores.map((s) => s.score));
    const winners = finalScores.filter((s) => s.score === max);

    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl mb-4">🏁 Spiel beendet!</h1>
        <p>{winners.length === 1 ? `🎉 Gewinner: ${winners[0].username}` : `🎉 Gleichstand: ${winners.map((w) => w.username).join(', ')}`}</p>
        <ul className="mt-4">
          {finalScores.map((s) => <li key={s.id}>{s.username}: {s.score} Punkte</li>)}
        </ul>
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <div className="text-right mb-2 text-sm">Eingeloggt als: <b>{username}</b></div>
      {loading ? (
        <h2 className="text-xl">⏳ Warten auf weitere Spieler ...</h2>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">🎬 Emoji-Film-Quiz</h1>
          <div className="text-6xl mb-4">{emoji}</div>
          <div className="text-lg mb-2">Punkte: {score}</div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendAnswer()}
            className="border p-2 text-lg mb-4"
            placeholder="Filmtitel eingeben..."
          />
          <button onClick={sendAnswer} className="bg-blue-600 text-white px-4 py-2 rounded">Senden</button>
          <div className="mt-6">
            <h2 className="text-xl mb-2">Antworten:</h2>
            <ul className="max-h-40 overflow-y-auto">
              {messages.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </div>
        </>
      )}
      
  return (
    <div>
      < Header /> {/*Luna*/}
      <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center mt-20">
        <h1 className="text-3xl font-bold mb-4">Emoji-Film-Quiz (Multiplayer)</h1>

        {!gameStarted ? (
          <div className="mb-6">
            <h2 className="text-xl mb-2">Spieldauer wählen:</h2>
            <div className="flex gap-4 mb-4">
              <button className={`px-4 py-2 rounded ${gameDuration === 30 ? 'bg-[var(--darkgreen)] text-white' : 'bg-gray-200'}`} onClick={() => setGameDuration(30)}>
                30 Sekunden
              </button>
              <button className={`px-4 py-2 rounded ${gameDuration === 60 ? 'bg-[var(--darkgreen)] text-white' : 'bg-gray-200'}`} onClick={() => setGameDuration(60)}>
                1 Minute
              </button>
            </div>
            <div className="flex justify-center">
              <button className="bg-[var(--green)] text-[var(--foreground)] px-6 py-3 rounded hover:bg-[var(--darkgreen)] transition" onClick={startGame}>
                Spiel starten
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-6xl mb-4">{emoji}</div>
            <div className="text-lg mb-4">⏱️ Zeit: {formatTime(timeLeft!)}</div>
            <div className="text-lg mb-2">⭐ Punkte: {score}</div>

            <input
              className="border p-2 text-lg w-72 mb-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
              placeholder="Filmtitel eingeben..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendAnswer()}
            />
            <div className="flex gap-4 mb-4">
              <button className="bg-[var(--green)] text-[var(--foreground)] px-4 py-2 rounded hover:bg-[var(--darkgreen)] transition" onClick={sendAnswer}>
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
      <Footer /> {/*Luna*/}
    </div>
  );
}