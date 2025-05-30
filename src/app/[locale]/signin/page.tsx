'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {useTranslations} from 'next-intl';
import { Link } from '../../../i18n/navigation';

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
  <div className="flex flex-col items-center min-h-screen px-4 bg-white">
    <div className="w-full max-w-md p-6 shadow-md rounded-2xl bg-beige mt-10 sm:mt-16 md:mt-20">
      {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

      <h1 className="font-mulish text-2xl sm:text-3xl font-bold text-green text-center mb-6">
        {t('signIn')}
      </h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          value={Email}
          placeholder={t('email')}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-green rounded text-green placeholder-green focus:outline-none focus:ring-2 focus:ring-green/50"
          required
        />
        <input
          type="password"
          placeholder={t('password')}
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-green rounded text-green placeholder-green focus:outline-none focus:ring-2 focus:ring-green/50"
          required
        />
        <button
          type="submit"
          className="w-full bg-green text-beige py-3 cursor-pointer rounded hover:bg-green/80 transition-colors font-semibold"
        >
          {t('signIn')}
        </button>
      </form>

      <div className="text-center mt-5">
        <Link
          className="text-sm sm:text-base font-bold text-green hover:underline"
          href="/registration"
        >
          {t('registration')}
        </Link>
      </div>
    </div>

    <Link
      className="text-xs text-green mt-4 hover:underline"
      href="resetpassword"
    >
      {t('resetPassword')}
    </Link>
  </div>
);

}