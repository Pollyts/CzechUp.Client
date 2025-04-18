'use client';

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from '../../../i18n/navigation';
import { useTranslations } from 'next-intl';
import { Language, LanguageLevel } from '../../../../types';

interface RegistrationFormData {
  Login: string;
  Email: string;
  Password: string;
  RequiredLanguageLevelGuid: string;  // Изменено на string, так как guid это строка
  OriginLanguageGuid: string;  // Изменено на string, так как guid это строка
}

type Props = {
  languages: Language[];
  languageLevels: LanguageLevel[];
};

export default function RegistrationForm({ languages, languageLevels }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>();

  const t = useTranslations('RegistrationForm');
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegistrationFormData) => {
    setLoading(true);
    const response = await fetch("https://localhost:44376/api/Auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (response.ok) {
      alert("Registration successful!");
      router.push('/');
    } else {
      alert("Registration failed.");
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="p-6 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-green mb-4">{t('title')}</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto space-y-4 p-6 rounded-lg shadow-lg"
          >

            <input
              type="email"
              {...register("Email", { required: "Email is required" })}
              placeholder={t('email')}
              className="w-full p-2 border rounded-lg"
            />
            {errors.Email && <p className="text-red-600 text-sm">{errors.Email.message}</p>}

            <input
              type="password"
              {...register("Password", { required: "Password is required" })}
              placeholder={t('password')}
              className="w-full p-2 border rounded-lg"
            />
            {errors.Password && <p className="text-red-600 text-sm">{errors.Password.message}</p>}

            <select
              {...register("RequiredLanguageLevelGuid", {
                required: "Language level is required",
              })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">{t('langlevel')}</option>
              {languageLevels.map((level) => (
                <option key={level.Guid} value={level.Guid}>  {/* Используем guid */}
                  {level.Name}
                </option>
              ))}
            </select>
            {errors.RequiredLanguageLevelGuid && (
              <p className="text-red-600 text-sm">{errors.RequiredLanguageLevelGuid.message}</p>
            )}

            <select
              {...register("OriginLanguageGuid", {
                required: "Language is required",
              })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">{t('origlang')}</option>
              {languages
                .filter((lang) => lang.Name !== "CZ")
                .map((lang) => (
                  <option key={lang.Guid} value={lang.Guid}>  {/* Используем guid */}
                    {lang.Name}
                  </option>
                ))}
            </select>
            {errors.OriginLanguageGuid && (
              <p className="text-red-600 text-sm">{errors.OriginLanguageGuid.message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 bg-black text-white rounded-lg hover:bg-green transition"
            >
              {loading ? "Registering..." : t('register')}
            </button>
          </form>
        </div>
      </div>
    </div>


  );
}
