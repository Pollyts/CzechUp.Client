import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Language = { id: number; name: string };
type LanguageLevel = { id: number; name: string };

// Интерфейс для данных формы
interface RegistrationFormData {
  Login: string;
  Email: string;
  Password: string;
  RequiredLanguageLevelId: number;
  OriginLanguageId: number;
}

export default function RegistrationForm() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegistrationFormData>();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);

  useEffect(() => {
    async function fetchData() {
      const langRes = await fetch("https://localhost:44376/dictionary/Languages");
      const levelRes = await fetch("https://localhost:44376/dictionary/LanguageLevels");
      setLanguages(await langRes.json());
      setLanguageLevels(await levelRes.json());
    }
    fetchData();
  }, []);

  const onSubmit = async (data: RegistrationFormData) => {
    const response = await fetch("https://localhost:44376/api/Auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Registration successful!");
    } else {
      alert("Registration failed.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4 bg-white p-6 rounded-lg shadow-lg border"
    >
      <input
        {...register("Login")}
        placeholder="Login"
        required
        className="w-full p-2 border rounded-lg"
      />
      {errors.Login && <p className="text-red-600 text-sm">Login is required</p>}

      <input
        type="email"
        {...register("Email")}
        placeholder="Email"
        required
        className="w-full p-2 border rounded-lg"
      />
      {errors.Email && <p className="text-red-600 text-sm">Email is required</p>}

      <input
        type="password"
        {...register("Password")}
        placeholder="Password"
        required
        className="w-full p-2 border rounded-lg"
      />
      {errors.Password && <p className="text-red-600 text-sm">Password is required</p>}

      <select
        {...register("RequiredLanguageLevelId", { required: "Language level is required" })}
        className="w-full p-2 border rounded-lg"
      >
        <option value="">Choose Language Level</option>
        {languageLevels.map((level) => (
          <option key={level.id} value={level.id}>
            {level.name}
          </option>
        ))}
      </select>
      {errors.RequiredLanguageLevelId && (
        <p className="text-red-600 text-sm">{errors.RequiredLanguageLevelId.message}</p>
      )}

      <select
  {...register("OriginLanguageId", { required: "Language is required" })}
  className="w-full p-2 border rounded-lg"
>
  <option value="">Choose Language</option>
  {languages
    .filter((lang) => lang.name !== "CZ") // Исключаем "CZ"
    .map((lang) => (
      <option key={lang.id} value={lang.id}>
        {lang.name}
      </option>
    ))}
</select>
      {errors.OriginLanguageId && (
        <p className="text-red-600 text-sm">{errors.OriginLanguageId.message}</p>
      )}

      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  );
}
