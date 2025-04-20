'use client';

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { WordDto } from '../../../../../types';
import EditWordModal from './EditWordModal';

const WordDetailPage = () => {
  const { guid } = useParams();
  const [wordData, setWordData] = useState<WordDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [examplesOpen, setExamplesOpen] = useState<boolean>(false); // 👈 Добавлено состояние
  const [isEditOpen, setIsEditOpen] = useState(false);

  const jwtToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchWord = async () => {
    try {
      const response = await fetch(`https://localhost:44376/api/word/word?wordGuid=${guid}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch word data.");
      }

      const data: WordDto = await response.json();
      setWordData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jwtToken) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }    
    if (guid) {
      fetchWord();
    }
  }, [guid, jwtToken]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  if (!wordData) {
    return <div className="text-center py-4">Word not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-2xl mt-10">
      <h1 className="text-3xl font-semibold mb-6 text-black">{wordData.Word}</h1>
      <button
        onClick={() => setIsEditOpen(true)}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Изменить
      </button>
      <div className="space-y-4 text-lg text-gray-800">
        <div>
          <ul className="list-disc list-inside pl-2 space-y-1">
            {wordData.Translations.length > 0 ? (
              wordData.Translations.map((t, index) => (
                <li key={index}>{t}</li>
              ))
            ) : (
              <li className="italic text-gray-500">No translations</li>
            )}
          </ul>
        </div>

        <p><span className="font-semibold">Level:</span> {wordData.LanguageLevel}</p>
        <p><span className="font-semibold">Topic:</span> {wordData.Topic}</p>
        <p><span className="font-semibold">Tags:</span> {wordData.Tags.join(', ')}</p>

        <div>
          <button
            onClick={() => setExamplesOpen(!examplesOpen)}
            className="flex items-center gap-2 font-semibold text-left text-green hover:underline focus:outline-none"
          >
            <span>Examples</span>
            {examplesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {examplesOpen && (
            wordData.WordExamples.length > 0 ? (
              <ul className="space-y-3 mt-3">
                {wordData.WordExamples.map((ex) => (
                  <li key={ex.Guid} className="bg-gray rounded-lg p-3">
                    <p><strong>Original:</strong> {ex.OriginalExample}</p>
                    <p><strong>Translation:</strong> {ex.TranslatedExample}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-500 mt-2">No examples available.</p>
            )
          )}
        </div>
      </div>
      {isEditOpen && (
      <EditWordModal
        jwtToken={jwtToken}
        word={wordData}
        onClose={() => setIsEditOpen(false)}
        onSave={() => {
          setIsEditOpen(false);
          // Перезагружаем данные
          if (guid) fetchWord(); // 👈 Оберни `fetchWord` выше в useCallback, если нужно
        }}
      />
    )}
    </div>
  );
};

export default WordDetailPage;
