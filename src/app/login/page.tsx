'use client'; // Carlotta
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

// Lena: Eingabeüberüfung
  const validateUsername = (name: string) => {
    const hasTwoLetters = (name.match(/[a-zA-Z]/g) || []).length >= 2;
    const hasNumber = /\d/.test(name);
    return name.trim().length > 0 && hasTwoLetters && hasNumber;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateUsername(username)) {
      setError('Der Benutzername muss mindestens 2 Buchstaben enthalten und mindestens eine Zahl.');
      return;
    }

    const result = await signIn('credentials', {
      username,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/game');
    } else {
      setError('Login fehlgeschlagen. Bitte Benutzernamen prüfen.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Anmeldung</h1>

        <label htmlFor="username" className="block mb-2 text-sm font-medium">
          Benutzername
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError('');
          }}
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Einloggen
        </button>
      </form>
    </div>
  );
}