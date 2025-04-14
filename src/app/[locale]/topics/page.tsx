'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Интерфейс для данных с API
interface Topic {
  guid: string;
  name: string;
  userGuid: string;
  GeneralTopicGuid?: string;
}

const TopicsPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('Topics');
  const router = useRouter();

  const jwtToken = localStorage.getItem("token");

  useEffect(() => {
    if (!jwtToken) {
      setError("JWT token not found.");
      setLoading(false);
      return;
    }

    const fetchTopics = async () => {
      try {
        const response = await fetch("https://localhost:44376/api/Topic", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch words");
        }

        const data: Topic[] = await response.json();
        setTopics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [jwtToken]);

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
      </div>

      <table className="min-w-full bg-white border border-gray rounded-lg">
        <tbody>
          {topics.map((topic) => (
            <tr
              key={topic.guid}
              className="hover:bg-gray-100 transition-all cursor-pointer"
              onClick={() => router.push(`/word/${topic.guid}`)}
            >
              <td className="p-3 border-b border-gray">{topic.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopicsPage;
