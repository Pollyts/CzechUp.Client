'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../../../public/fonts/js/Lora-Regular-normal'; // путь к файлу со шрифтом, который ты сгенерировал
import { SearchedWordDto, Word, FilterWordDto } from '../../../../types';
import SearchWordResultModal from './SearchWordResult'
import CreateWordModal from './CreateWordModal';
import { Trash2 } from 'lucide-react';
import WordsFilter from './WordsFilter';


const WordsPage = () => {
  
  const [words, setWords] = useState<Word[]>([]);
  const [filter, setFilter] = useState<FilterWordDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalData, setModalData] = useState<SearchedWordDto | null>(null);
  const [searchingWord, setSearchingWord] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('Words');
  const router = useRouter();

  const jwtToken = localStorage.getItem("token");
  
  const fetchWords = async () => {
    if(filter!=null){
      fetchFilteredWords(filter);
      return;
    }
    try {
      const response = await fetch("https://localhost:44376/api/Word", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if(response.status == 401)
          {
            router.replace('/signin')
          }
          else{
            throw new Error("Failed to fetch words");
          }          
      }

      const data: Word[] = await response.json();
      setWords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredWords = async (filters: FilterWordDto) => {
    setFilter(filters);
    try {
      const response = await fetch("https://localhost:44376/api/Word/withFilter", {
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
  
      const data: Word[] = await response.json();
      setWords(data);
    } catch (error) {
      console.error("Ошибка при фильтрации слов:", error);
      alert("Произошла ошибка при фильтрации.");
    }
  };

  useEffect(() => {
    if (!jwtToken) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }   
    fetchWords();
  }, [jwtToken]);

  const deleteWord = async (guid: string) => {
    if (!confirm("Вы уверены, что хотите удалить это слово?")) return;
  
    try {
      const response = await fetch(`https://localhost:44376/api/word?guid=${guid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Не удалось удалить слово');
      }
  
      setWords((prev) => prev.filter((word) => word.Guid !== guid));
    } catch (error) {
      console.error('Ошибка при удалении слова:', error);
      alert('Произошла ошибка при удалении.');
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Lora-Regular');
    doc.text(t('dictionary'), 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [['Word']],
      body: words.map((word) => [word.Word]),
      styles: { font: 'Lora-Regular' },
    });
    doc.save('words.pdf');
  };

  const searchWord = async () => {
    if (!searchingWord.trim()) return;
  
    try {
      const response = await fetch(`https://localhost:44376/api/word/searchWord?word=${encodeURIComponent(searchingWord)}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error('Ошибка при поиске слова');
  
      const data = await response.json();
      if(data.CanAddToDb == false){
        router.push(`/word/${data.Word.Guid}`)
        return;
      }
      setModalData(data); // данные, которые попадут в модалку
      setIsModalOpen(true); // показать модалку
    } catch (error) {
      console.error('Ошибка поиска:', error);
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
    <WordsFilter jwtToken={jwtToken} onApplyFilter={fetchFilteredWords} />

    {/* Контент справа */}
    <div className="flex-1 container mx-auto p-6 bg-white rounded-lg shadow-lg">
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-black">{t('dictionary')}</h1>
        <button
                  className="bg-green text-white px-4 py-2 rounded hover:bg-green hover:text-white transition"
                  onClick={() => setIsCreateModalOpen(true)}                >
                  {t('CreateWord')}
        </button>
        <button
          onClick={handleExportPDF}
          className="bg-green text-white px-4 py-2 rounded hover:bg-green hover:text-white transition">
          {t('export')}
        </button>
      </div>

      <div className="flex">
      <input
          type="text"
          placeholder={t('searchWord')}
          value={searchingWord}
          onChange={(e) => setSearchingWord(e.target.value)}
          className="w-full p-2 mr-10 border border-gray-300 rounded-lg mb-4"
        />
        <button onClick={searchWord} className="bg-green text-white mb-4 rounded hover:bg-green hover:text-white transition">{t('searchWord')}</button>
      </div>

      <table className="min-w-full bg-white border border-gray rounded-lg">
  <thead>
    <tr>
      <th className="text-left p-3 border-b border-gray">Слово</th>
      <th className="text-left p-3 border-b border-gray">Действия</th>
    </tr>
  </thead>
  <tbody>
    {words.map((word) => (
      <tr
        key={word.Guid}
        className="hover:bg-gray-100 transition-all"
      >
        <td
          className="p-3 border-b border-gray cursor-pointer"
          onClick={() => router.push(`/word/${word.Guid}`)}
        >
          {word.Word}
        </td>
        <td className="p-3 border-b border-gray">
          <button
            onClick={() => deleteWord(word.Guid)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Удалить
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      
      {isModalOpen && (<SearchWordResultModal data={modalData} onClose={() => setIsModalOpen(false)} onSave={() => fetchWords()} jwtToken={jwtToken} />)}

      {isCreateModalOpen && (
        <CreateWordModal
          jwtToken={jwtToken}
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
          onSave={() => {
            setIsCreateModalOpen(false);
            fetchWords();
          }}
        />
      )}
    </div>
    </div>
    </div>
  );
};

export default WordsPage;
