'use client';

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from '../../../i18n/navigation';
import { useTranslations } from 'next-intl';
import { Language, LanguageLevel } from '../../../../types';
import { toast } from 'react-hot-toast';

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
      toast.success(t('success'), { duration: 3000 });

      setTimeout(() => {
        router.push('/signin');
      }, 3000);
    } else {
      toast.error(t('error'));
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 bg-white">
  <div className="w-full max-w-md bg-beige shadow-md rounded-2xl p-6 mt-10 sm:mt-16 md:mt-20">
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-green text-center mb-4">
        {t('title')}
      </h1>

      {/* Email */}
      {errors.Email && (
        <p className="text-red-600 text-xs self-start -mb-2">
          {errors.Email.message}
        </p>
      )}
      <input
        type="email"
        {...register("Email", { required: "Email is required" })}
        placeholder={t('email')}
        className="w-full p-3 border border-green rounded text-green placeholder-green focus:outline-none focus:ring-2 focus:ring-green/50"
      />

      {/* Password */}
      {errors.Password && (
        <p className="text-red-600 text-xs self-start -mb-2">
          {errors.Password.message}
        </p>
      )}
      <input
        type="password"
        {...register("Password", { required: "Password is required" })}
        placeholder={t('password')}
        className="w-full p-3 border border-green rounded text-green placeholder-green focus:outline-none focus:ring-2 focus:ring-green/50"
      />

      {/* Language Level */}
      {errors.RequiredLanguageLevelGuid && (
        <p className="text-red-600 text-xs self-start -mb-2">
          {errors.RequiredLanguageLevelGuid.message}
        </p>
      )}
      <select
        {...register("RequiredLanguageLevelGuid", {
          required: "Language level is required",
        })}
        className="w-full p-3 border border-green rounded text-green focus:outline-none focus:ring-2 focus:ring-green/50"
      >
        <option value="">{t('langlevel')}</option>
        {languageLevels.map((level) => (
          <option key={level.Guid} value={level.Guid}>
            {level.Name}
          </option>
        ))}
      </select>

      {/* Origin Language */}
      {errors.OriginLanguageGuid && (
        <p className="text-red-600 text-xs self-start -mb-2">
          {errors.OriginLanguageGuid.message}
        </p>
      )}
      <select
        {...register("OriginLanguageGuid", {
          required: "Language is required",
        })}
        className="w-full p-3 border border-green rounded text-green focus:outline-none focus:ring-2 focus:ring-green/50"
      >
        <option value="">{t('origlang')}</option>
        {languages
          .filter((lang) => lang.Name !== "CZ")
          .map((lang) => (
            <option key={lang.Guid} value={lang.Guid}>
              {lang.Name}
            </option>
          ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer bg-green text-beige py-3 rounded font-semibold hover:bg-green/80 transition-colors disabled:opacity-50"
      >
        {loading ? t('registering') : t('register')}
      </button>
    </form>
  </div>
</div>



  );
}
