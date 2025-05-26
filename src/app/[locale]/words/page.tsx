'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../../../public/fonts/js/Lora-Regular-normal'; // путь к файлу со шрифтом, который ты сгенерировал
import { SearchedWordDto, Word, FilterWordDto, PdfWord, UserTag, Topic, LanguageLevel } from '../../../../types';
import SearchWordResultModal from './SearchWordResult'
import CreateWordModal from './CreateWordModal';
import { Trash2 } from 'lucide-react';
import WordsFilter from './WordsFilter';
import Loading from '../../../../components/Loading'
import { fetchFilteredWords } from '../../../api/api'

const jwtToken = localStorage.getItem("token");

const WordsPage = () => {

  const [words, setWords] = useState<Word[]>([]);
  const [filter, setFilter] = useState<FilterWordDto>({
    Tags: [],
    Topics: [],
    LanguageLevels: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalData, setModalData] = useState<SearchedWordDto | null>(null);
  const [searchingWord, setSearchingWord] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('Words');
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [selectedTags, setSelectedTags] = useState<UserTag[]>([]);
  const [selectedLanguageLevels, setSelectedLanguageLevels] = useState<LanguageLevel[]>([]);

  const getFilteredWords = async (filters: FilterWordDto) => {
    setFilter(filters);
    setLoading(true);
    const data = await fetchFilteredWords(filters); // добавлено await
    if (data != null) {
      console.log(data)
      setWords(data);
      setLoading(false);
    }   
  };

  useEffect(() => {
    getFilteredWords(filter);
  }, []);

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

  const handleExportPDF = async () => {

    try {
      const response = await fetch("https://localhost:44376/api/Word/pdf", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filter),
      });

      if (!response.ok) {
        throw new Error("Ошибка при получении отфильтрованных слов");
      }

      const data: PdfWord[] = await response.json();
      const doc = new jsPDF();
      doc.setFont('Lora-Regular');
      doc.text(t('dictionary'), 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [['Word', 'Translation']],
        body: data.map((word) => [word.Word, word.Translations]),
        styles: { font: 'Lora-Regular' },
        headStyles: {
          font: 'Lora-Regular',
          fillColor: [46, 119, 88],
          textColor: [254, 249, 243],
          fontStyle: 'bold',
        },
      });
      doc.save('words.pdf');
    } catch (error) {
      console.error("Ошибка при фильтрации слов:", error);
      alert("Произошла ошибка при фильтрации.");
    }


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
      if (data.CanAddToDb == false) {
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
    return <Loading></Loading>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="flex">
      <WordsFilter
        onApplyFilter={getFilteredWords}
        selectedTopics={selectedTopics}
        selectedTags={selectedTags}
        selectedLanguageLevels={selectedLanguageLevels}
        setSelectedTopics={setSelectedTopics}
        setSelectedTags={setSelectedTags}
        setSelectedLanguageLevels={setSelectedLanguageLevels}
      />
      <div className="flex-1 container mx-auto ml-10 mr-5">
        <div className="container mx-auto p-6 bg-beige rounded-lg shadow-lg">
          <div className="flex justify-end items-center mb-6">
            <h1 className="text-4xl mr-auto font-semibold text-black">{t('dictionary')}</h1>
            <button
              className="px-4 py-2 text-l mr-5 font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
              onClick={() => setIsCreateModalOpen(true)}                >
              {t('createWord')}
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 text-l font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green">
              {t('export')}
            </button>
          </div>

          <div className="flex">
            <input
              type="text"
              placeholder={t('enterCzechWord')}
              value={searchingWord}
              onChange={(e) => setSearchingWord(e.target.value)}
              className="w-full p-2 mr-5 border bg-white border-green rounded-lg mb-4"
            />
            <button onClick={searchWord} className="px-4 py-2 text-l mb-4 font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green">{t('searchWord')}</button>
          </div>

          <table className="min-w-full font-lora bg-white border border-gray rounded-lg">
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
                  <td className="p-3 border-b border-gray text-right">
                    <Trash2
                      onClick={() => deleteWord(word.Guid)}
                      className="text-green cursor-pointer inline-block"
                    ></Trash2>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && (<SearchWordResultModal data={modalData} onClose={() => setIsModalOpen(false)} onSave={() => getFilteredWords(filter)} jwtToken={jwtToken} />)}

          {isCreateModalOpen && (
            <CreateWordModal
              jwtToken={jwtToken}
              onClose={() => {
                setIsCreateModalOpen(false);
              }}
              onSave={() => {
                setIsCreateModalOpen(false);
                getFilteredWords(filter);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WordsPage;
