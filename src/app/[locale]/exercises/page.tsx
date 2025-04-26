'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CompleteResult, ExerciseResultDto, ExerciseType, FilterExerciseDto, ExerciseGeneratorDto, ExerciseDto} from '../../../../types';
import ExerciseGenerationModal from './ExerciseGenerationModal';
import { Trash2 } from 'lucide-react';
import ExerciseFilter from './ExerciseFilter';
import { CheckCircle, XCircle } from 'lucide-react'; // или любую другую иконку


const WordsPage = () => {
  
  const [exercises, setExercises] = useState<ExerciseResultDto[]>([]);
  const [filter, setFilter] = useState<FilterExerciseDto>({
    Tags: [],
    Topics: [],
    LanguageLevels: [],
    ExerciseTypes: [],
    CompleteResults: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('Exercises');
  const router = useRouter();

  const jwtToken = localStorage.getItem("token");

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // месяцы с 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

    const EXERCISE_TYPE_LABELS: { [key in ExerciseType]: string } = {
      [ExerciseType.CreateSentence]: "Построить предложение",
      [ExerciseType.InsertWordInRightForm]: "Слово в правильной форме",
      [ExerciseType.InsertWordToText]: "Вставить слова в текст",
      [ExerciseType.MatchingWordAndItsTranslate]: "Соединить с переводом",
      [ExerciseType.WriteCzechWord]: "Вставить слово",
    };

  const generateExercises = async (dto: ExerciseGeneratorDto) => {
    try {
      const response = await fetch("https://localhost:44376/api/exercise/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании упражнения");
      }

      const result = await response.json();

      if (Array.isArray(result) && result.length > 0) {
        localStorage.setItem("exercises", JSON.stringify(result));
        router.push(`/exercise/${result[0].Guid}?index=0`);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }
  
  const fetchFilteredWords = async (filters: FilterExerciseDto) => {
    setFilter(filters);
    try {
      const response = await fetch("https://localhost:44376/api/exercise/withFilter", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });
  
      if (!response.ok) {
        throw new Error("Ошибка при получении отфильтрованных слов");
      }
  
      const data: ExerciseResultDto[] = await response.json();
      setExercises(data);
    } catch (error) {
      console.error("Ошибка при фильтрации слов:", error);
      alert("Произошла ошибка при фильтрации.");
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jwtToken) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }   
    fetchFilteredWords(filter);
  }, [jwtToken]);

  const deleteExercise = async (guid: string) => {
    if (!confirm("Вы уверены, что хотите удалить это слово?")) return;
  
    try {
      const response = await fetch(`https://localhost:44376/api/exercise?guid=${guid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Не удалось удалить слово');
      }
  
      setExercises((prev) => prev.filter((word) => word.Guid !== guid));
    } catch (error) {
      console.error('Ошибка при удалении слова:', error);
      alert('Произошла ошибка при удалении.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="flex">
    {/* Фильтр слева */}
    <ExerciseFilter jwtToken={jwtToken} onApplyFilter={fetchFilteredWords} />

    {/* Контент справа */}
    <div className="flex-1 container mx-auto p-6 bg-white rounded-lg shadow-lg">
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-black">{t('dictionary')}</h1>
        <button
                  className="bg-green text-white px-4 py-2 rounded hover:bg-green hover:text-white transition"
                  onClick={() => setIsModalOpen(true)}                >
                  {t('Generate')}
        </button>        
      </div>
      <table className="min-w-full bg-white border border-gray rounded-lg">
  <thead>
    <tr>
      <th className="text-left p-3 border-b border-gray">{t('LastOpen')}</th>
      <th className="text-left p-3 border-b border-gray">{t('ExerciseType')}</th>
      <th className="text-left p-3 border-b border-gray">{t('Result')}</th>
      <th className="text-left p-3 border-b border-gray"></th>
    </tr>
  </thead>
  <tbody>
    {exercises.map((word) => (
      <tr
      key={word.Guid}
      onClick={() => router.push(`/exercise/${word.Guid}`)}
      className="hover:bg-gray-100 transition-all cursor-pointer"
    >
        <td className="p-3 border-b border-gray cursor-pointer">
  {formatDate(new Date(word.LastUsed))}
</td>
<td className="p-3 border-b border-gray cursor-pointer">
  {EXERCISE_TYPE_LABELS[word.ExerciseType]}
</td>
<td className="p-3 border-b border-gray cursor-pointer">
  {word.Result ? (
    <CheckCircle className="text-green-500 w-5 h-5" />
  ) : (
    <XCircle className="text-red-500 w-5 h-5" />
  )}
</td>
        <td className="p-3 border-b border-gray">
          <button
            onClick={() => deleteExercise(word.Guid)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Удалить
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      
{isModalOpen && (
  <ExerciseGenerationModal
    onClose={() => setIsModalOpen(false)}
    onSave={generateExercises}  // Здесь передаем функцию напрямую
    jwtToken={jwtToken}
  />
)}

    </div>
    </div>
    </div>
  );
};

export default WordsPage;
