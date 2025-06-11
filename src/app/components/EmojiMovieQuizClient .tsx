'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client'; // Carlotta
import { useSession, signIn, signOut } from 'next-auth/react'; // Carlotta

// Lena -- Anfang
interface FinalScore {
  id: string;
  shortId: string;
  username: string;
  score: number;
}
// Lena -- Ende

let socket: Socket;

export default function EmojiMovieQuizClient() {
  const [emoji, setEmoji] = useState('🎬❓');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [finalScores, setFinalScores] = useState<FinalScore[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameDuration, setGameDuration] = useState(30);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { data: session, status } = useSession();
  const username = session?.user?.name ?? null;

  useEffect(() => {
     //Carlotta
    if (!username || typeof window === 'undefined') return;

    socket = io({ query: { username } });//Baut die Verbindung zum Server auf und sendet den Benutzernamen
    socket.emit('readyToPlay');

    socket.on('waitingForPlayers', () => setLoading(true));
    socket.on('gameStarting', () => {
      setLoading(false);
      setScore(0);
      setMessages([]);
      setGameStarted(true);
      setTimeLeft(gameDuration);
    });
    socket.on('emoji', (e: string) => setEmoji(e)); //Emotes werden empfangen und gesetzt
    socket.on('answerBroadcast', (msg: string) => //Die Antwort wird empfangen und in der Liste der Nachrichten angezeigt
      setMessages((prev) => [...prev, `💬 ${msg}`])
    );
    socket.on('scoreUpdate', setScore);
    socket.on('finalScores', setFinalScores);

    return () => socket.disconnect();
  }, [username, gameDuration]);

  // Lena -- Anfang
  useEffect(() => {
    if (!gameStarted || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev > 1) return prev - 1;
        clearInterval(timer);
        setGameStarted(false);
        socket.emit('endGame');
        socket.emit('requestScores');
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);
// Lena -- Ende


  const sendAnswer = () => {
    if (!input.trim()) return;
    socket.emit('answer', input);
    setInput('');
  };

  const startGame = () => {
    socket.emit('startGame', { duration: gameDuration }); // Sendet die Dauer des Spiels an den Server
  };

  // Lena -- Anfang
  const formatTime = (seconds: number) =>  //Lena
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; // Formatiert die Zeit in Minuten:Sekunden

  if (status === 'loading') {
    return <p className="text-center mt-10">Lade ...</p>;
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <h1 className="text-2xl mb-4">Login</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => signIn()} >Jetzt einloggen</button>
      </div>
    );
  }

  if (finalScores) {
    const max = Math.max(...finalScores.map((s) => s.score));
    //Filtert die finalScores, um nur die Spieler mit dem höchsten Punktestand zu erhalten
    const winners = finalScores.filter((s) => s.score === max);

    return ( //Lena
      <main className="p-6 text-center">
        <h1 className="text-3xl mb-4 mt-12">🏁 Spiel beendet!</h1>
        <p> 
          {winners.length === 1
            ? `🎉 Gewinner: ${winners[0].username}`
            : `🎉 Gleichstand: ${winners.map((w) => w.username).join(', ')}`}
        </p>
        <ul className="mt-4">
          {finalScores.map((s) => (
            <li key={s.id}>
              {s.username}: {s.score} Punkte
            </li>
          ))}
        </ul>
        <button className="mt-6 underline text-blue-600" onClick={() => signOut()}>Logout</button>
      </main>
    );
  }
  // Lena -- Ende

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center mt-20">
      <div className="text-right mb-2 text-sm w-full max-w-xl text-[var(--foreground)]">Eingeloggt als: <b>{username}</b>
        <button onClick={() => signOut()} className="ml-4 underline text-red-500" > Logout </button>
      </div>
      {!gameStarted ? (
        loading ? (
          <h2 className="text-xl">⏳ Warten auf weitere Spieler ...</h2>
        ) : (
          // Lena -- Anfang
          <>
            <h1 className="text-3xl font-bold mb-4">🎬 Emoji-Film-Quiz</h1>
            <h2 className="text-xl mb-2">Spieldauer wählen:</h2>
            <div className="flex gap-4 mb-4">
              <button className={`px-4 py-2 rounded ${ gameDuration === 30 ? 'bg-[var(--darkgreen)] text-white' : 'bg-gray-200' }`} onClick={() => setGameDuration(30)} > 30 Sekunden </button>
              <button className={`px-4 py-2 rounded ${ gameDuration === 60 ? 'bg-[var(--darkgreen)] text-white' : 'bg-gray-200' }`} onClick={() => setGameDuration(60)} >1 Minute </button>
            </div>
          {/* Lena -- Ende */}

            <button className="bg-[var(--green)] text-[var(--foreground)] px-6 py-3 rounded hover:bg-[var(--darkgreen)] transition" onClick={startGame} > Spiel starten</button>
          </>
        )
      ) : (
        <>
          <div className="text-6xl mb-4">{emoji}</div>
          {timeLeft !== null && (
            <div className="text-lg mb-4">⏱️ Zeit: {formatTime(timeLeft)}</div>
          )}
          <div className="text-lg mb-2">⭐ Punkte: {score}</div>

          <input className="border p-2 text-lg w-72 mb-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--green)]" placeholder="Filmtitel eingeben..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendAnswer()} />
          <div className="flex gap-4 mb-4">
            <button className="bg-[var(--green)] text-[var(--foreground)] px-4 py-2 rounded hover:bg-[var(--darkgreen)] transition" onClick={sendAnswer}>Senden</button>
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