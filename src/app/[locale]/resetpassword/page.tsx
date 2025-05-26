'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {useTranslations} from 'next-intl';
import { toast } from 'react-hot-toast';

export default function LoginForm() {
  const t = useTranslations('ResetPassword');
  const [Email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('email', Email);

    const res = await fetch('https://localhost:44376/api/Auth/resetPassword', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      toast.success(t('success'), { duration: 3000 });
      setEmail('');
    } else {
      const data = await res.json();
      toast.error(t('error'), { duration: 3000 });
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error(t('error'), { duration: 3000 });
  }
};

  return (
  <div className="flex flex-col items-center min-h-screen px-4 bg-white">
    <div className="w-full max-w-md p-6 shadow-md rounded-2xl bg-beige mt-10 sm:mt-16 md:mt-20">
      <h1 className="font-mulish text-xl sm:text-xl font-bold text-green text-center mb-6">
        {t('writeEmail')}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={Email}
          placeholder={t('email')}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-green rounded text-green placeholder-green focus:outline-none focus:ring-2 focus:ring-green/50"
          required
        />
        <button
          type="submit"
          className="w-full bg-green text-beige py-3 cursor-pointer rounded hover:bg-green/80 transition-colors font-semibold"
        >
          {t('send')}
        </button>
      </form>
    </div>
  </div>
);

}