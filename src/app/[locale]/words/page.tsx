// pages/WordsPage.tsx
'use client';

// pages/WordsPage.tsx

import { useEffect, useState } from "react";

// Интерфейс для данных с API
interface Word {
  guid: string;
  word: string;
  languageLevelGuid?: string;
  userTopicGuid?: string;
  generalOriginalWordGuid?: string;
}

const WordsPage = () => {
  // Состояние для хранения списка слов
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Получаем JWT токен из localStorage или другого источника
  const jwtToken = localStorage.getItem("token");

  useEffect(() => {
    if (!jwtToken) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }

    // Делаем запрос к API
    const fetchWords = async () => {
      try {
        const response = await fetch("https://localhost:44376/api/Word", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch words");
        }

        const data: Word[] = await response.json();
        setWords(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [jwtToken]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-beige rounded-lg shadow-lg">
      <h1 className="text-4xl font-semibold text-center mb-8 text-black">Words List</h1>
      <table className="min-w-full bg-white border border-gray rounded-lg">
        <tbody>
          {words.map((word) => (
            <tr key={word.guid} className="hover:bg-gray transition-all">
              <td className="p-3 border-b border-gray">{word.word}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};

export default WordsPage;
