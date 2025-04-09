'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {useTranslations} from 'next-intl';

export default function LoginForm() {
  const t = useTranslations('SignInForm');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://localhost:44376/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email, Password })
      });

      if (!response.ok) {
        throw new Error(t('error'));
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      router.push('/words');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('error'));
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 shadow-md rounded-lg">
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              value={Email}
              placeholder={t('email')}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 border border-black rounded"
              required
            />
            <input
              type="password"
              placeholder={t('password')}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-3 border border-black rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white text-white py-2 rounded hover:bg-green"
            >
              {t('signIn')}
            </button>
          </form>
    </div>
  );
}