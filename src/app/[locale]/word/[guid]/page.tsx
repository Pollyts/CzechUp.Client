'use client';

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { WordDto, WordFormDto } from '../../../../../types';
import EditWordModal from './EditWordModal';
import WordFormsPart from './WordForms';
import { useTranslations } from 'next-intl';

type FiltersTypeFor = {
  g: string;
  n: string;
  e: string;
  d: string;
  m: string;
};

const WordDetailPage = () => {
  const { guid } = useParams();
  const [wordData, setWordData] = useState<WordDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [examplesOpen, setExamplesOpen] = useState<boolean>(false); // 👈 Добавлено состояние
  const [wordFormsOpen, setWordFormsOpen] = useState<boolean>(false); // 👈 Добавлено состояние
  const [isEditOpen, setIsEditOpen] = useState(false);
  const t = useTranslations('Word');


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
    return <div className="text-center py-4">{t('loading')}</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  if (!wordData) {
    return <div className="text-center py-4">Word not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-beige rounded-lg shadow-lg max-w-6xl mt-10">
      <div className="flex justify-between items-center">
      <h1 className="text-4xl font-semibold mb-6 text-black">{wordData.Word}</h1>
      <button
        onClick={() => setIsEditOpen(true)}
        className="px-4 py-2 text-l font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
      >
        {t('edit')}
      </button>
      </div>
      
      <div className="space-y-4 text-lg text-gray-800">
        <div>
          <ul className="list-disc list-inside pl-2 space-y-1">
            {wordData.Translations.length > 0 ? (
              wordData.Translations.map((t, index) => (
                <li key={index}>{t}</li>
              ))
            ) : (
              <li className="italic text-gray-500">{t('NoTranslations')}</li>
            )}
          </ul>
        </div>

        <p><span className="font-semibold">{t("languageLevel")}:</span> {wordData.LanguageLevel}</p>
        <p><span className="font-semibold">{t("topics")}:</span> {wordData.Topics.join(', ')}</p>
        <p><span className="font-semibold">{t("tags")}:</span> {wordData.Tags.join(', ')}</p>

        <div>
          <button
            onClick={() => setExamplesOpen(!examplesOpen)}
            className="flex items-center gap-2 font-semibold text-left text-green hover:underline focus:outline-none"
          >
            <span>{t("examples")}</span>
            {examplesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {examplesOpen && (
            wordData.WordExamples.length > 0 ? (
              <ul className="space-y-3 mt-3">
                {wordData.WordExamples.map((ex) => (
                  <li key={ex.Guid} className="bg-gray rounded-lg p-3">
                    <p><strong>{t("translated")}:</strong> {ex.OriginalExample}</p>
                    <p>
                      <strong>{t("original")}:</strong>{" "}
                      <span dangerouslySetInnerHTML={{ __html: ex.TranslatedExample }} />
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-500 mt-2">No examples available.</p>
            )
          )}
        </div>


        <div>
          <button
            onClick={() => setWordFormsOpen(!wordFormsOpen)}
            className="flex items-center gap-2 font-semibold text-left text-green hover:underline focus:outline-none"
          >
            <span>{t("wordForms")}</span>
            {wordFormsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {wordFormsOpen && (
            wordData.WordForms.length > 0 ? (
              <WordFormsPart wordForms={wordData.WordForms}></WordFormsPart>
            ) : (
              <p className="italic text-gray-500 mt-2">Not found.</p>
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
