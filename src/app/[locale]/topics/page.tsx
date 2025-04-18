'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import EditTopicModal from './EditTopicModal';
import CreateTopicModal  from './CreateTopicModal';
import { Topic } from '../../../../types';

const TopicsPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const t = useTranslations('Topics');
  const router = useRouter();

  const jwtToken = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  const fetchTopics = async () => {
    if (!jwtToken) return;

    setLoading(true);
    try {
      const response = await fetch("https://localhost:44376/api/Topic", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch topics");
      }

      const data: Topic[] = await response.json();
      setTopics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [jwtToken]);

  const handleDeleteTopic = async (guid: string) => {
    if (!confirm("Удалить эту тему?")) return;

    try {
      const response = await fetch(`https://localhost:44376/api/Topic?guid=${guid}&withWords=true`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete topic");

      fetchTopics();
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении темы");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600 py-4">{error}</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-black">{t('dictionary')}</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Создать тему
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray rounded-lg">
        <tbody>
          {topics.map((topic) => (
            <tr
              key={topic.Guid}
              className="hover:bg-gray-100 transition-all"
            >
              <td
                className="p-3 border-b border-gray cursor-pointer"
                onClick={() => router.push(`/word/${topic.Guid}`)}
              >
                {topic.Name}
              </td>
              <td className="p-3 border-b border-gray text-right space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    setEditTopic({ ...topic });
                    setEditModalOpen(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDeleteTopic(topic.Guid)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <CreateTopicModal
          jwtToken={jwtToken}
          onClose={() => setModalOpen(false)}
          onCreate={() => {
            setModalOpen(false);
            fetchTopics();
          }}
        />
      )}

      {editModalOpen && editTopic && (
        <EditTopicModal
          topic={editTopic}
          jwtToken={jwtToken}
          onClose={() => {
            setEditModalOpen(false);
            setEditTopic(null);
          }}
          onSave={() => {
            setEditModalOpen(false);
            setEditTopic(null);
            fetchTopics();
          }}
        />
      )}
    </div>
  );
};

export default TopicsPage;