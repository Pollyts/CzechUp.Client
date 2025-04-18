'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Word } from '../../../../types';


const WordsPage = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('Words');
  const router = useRouter();

  const jwtToken = localStorage.getItem("token");

  useEffect(() => {
    if (!jwtToken) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }

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

    fetchWords();
  }, [jwtToken]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(t('dictionary'), 14, 15);
    autoTable(doc, {
      startY: 20,
      body: words.map((word) => [word.Word]),
    });
    doc.save('words.pdf');
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-black">{t('dictionary')}</h1>
        <button
          onClick={handleExportPDF}
          className="bg-green text-white px-4 py-2 rounded hover:bg-green hover:text-white transition"        >
          {t('export')}
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray rounded-lg">
        <tbody>
          {words.map((word) => (
            <tr
              key={word.Guid}
              className="hover:bg-gray-100 transition-all cursor-pointer"
              onClick={() => router.push(`/word/${word.Guid}`)}
            >
              <td className="p-3 border-b border-gray">{word.Word}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WordsPage;
