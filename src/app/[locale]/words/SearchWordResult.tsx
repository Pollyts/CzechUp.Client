'use client';

import { useState } from "react";
import { SearchedWordDto } from '../../../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SearchWordResultModalProps {
  data: SearchedWordDto | null;
  onClose: () => void;
  onSave: () => void;
  jwtToken: string | null;
}

const SearchWordResultModal = ({ data, onClose, onSave, jwtToken }: SearchWordResultModalProps) => {
  const [examplesOpen, setExamplesOpen] = useState<boolean>(false);

  const wordData = data?.Word;

  const SaveWord = async () => {

    try {
      const response = await fetch(`https://localhost:44376/api/Word`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wordData),
      });

      if (!response.ok) throw new Error("Failed to update topic");

      onSave();
    } catch (err) {
      console.error(err);
      alert("Ошибка при редактировании темы");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>

        <h1 className="text-3xl font-semibold mb-6 text-black">{wordData?.Word}</h1>
        <div className="space-y-4 text-lg text-gray-800">
          <div>
            <ul className="list-disc list-inside pl-2 space-y-1">
              {wordData?.Translations && wordData.Translations.length > 0 ? (
                wordData.Translations.map((t, index) => (
                  <li key={index}>{t}</li>
                ))
              ) : (
                <li className="italic text-gray-500">No translations</li>
              )}
            </ul>
          </div>

          <div>
            <button
              onClick={() => setExamplesOpen(!examplesOpen)}
              className="flex items-center gap-2 font-semibold text-left text-green hover:underline focus:outline-none"
            >
              <span>Examples</span>
              {examplesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {examplesOpen && (
              wordData?.WordExamples && wordData.WordExamples.length > 0 ? (
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

          {data?.CanAddToDb && (
            <div className="pt-4">
              <button
                onClick={SaveWord}
                className="bg-green cursor-pointer text-white px-4 py-2 rounded hover:bg-green-dark transition"
              >
                Добавить в словарь
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchWordResultModal;
