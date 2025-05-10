'use client'; // Carlotta
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

let socket: any;

export default function EmojiMovieQuiz() {
  const [emoji, setEmoji] = useState('🎬❓');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket = io(); // Standardverbindung zu http://localhost:3000

    socket.on('emoji', (newEmoji: string) => {
      setEmoji(newEmoji);
    });

    socket.on('answerBroadcast', (message: string) => {
      setMessages((prev) => [...prev, `💬 ${message}`]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendAnswer = () => {
    socket.emit('answer', input);
    setInput('');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">🎬 Emoji-Film-Quiz (Multiplayer)</h1>
      <div className="text-6xl mb-4">{emoji}</div>
      <input
        className="border p-2 text-lg w-72 mb-3"
        placeholder="Filmtitel eingeben..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendAnswer()}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={sendAnswer}
      >
        Senden
      </button>

      <div className="mt-6">
        <h2 className="text-xl mb-2">Antworten anderer:</h2>
        <ul className="text-left">
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
