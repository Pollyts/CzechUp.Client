'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegistrationForm from './RegistrationForm';

export default function LoginForm() {
  const [login, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false); // Состояние для переключения форм
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://localhost:44376/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });

      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {isRegistering ? (
        <RegistrationForm />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Авторизация</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              value={login}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Войти
            </button>
          </form>
          <p className="text-center mt-4">
            Нет аккаунта?{' '}
            <button
              onClick={() => setIsRegistering(true)} // Переключаемся на форму регистрации
              className="text-blue-500 hover:underline"
            >
              Зарегистрироваться
            </button>
          </p>
        </>
      )}
    </div>
  );
}
