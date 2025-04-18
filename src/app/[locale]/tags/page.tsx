'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import EditTagModal from './EditTagModal';
import CreateTagModal  from './CreateTagModal';
import { UserTag, TagType } from '../../../../types';

const TagsPage = () => {
  const [tags, setTags] = useState<UserTag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTag, setEditTag] = useState<UserTag | null>(null);
  const t = useTranslations('Tags');
  const router = useRouter();

  const jwtToken = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  const fetchTags = async () => {
    if (!jwtToken) return;

    setLoading(true);
    try {
      const response = await fetch("https://localhost:44376/api/Tag", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }

      const data: UserTag[] = await response.json();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [jwtToken]);

  const handleDeleteTag = async (guid: string) => {
    if (!confirm("Удалить этот тег?")) return;

    try {
      const response = await fetch(`https://localhost:44376/api/Tag?guid=${guid}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete tag");

      fetchTags();
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении тэга");
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
          {t('create')}
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray rounded-lg">
        <tbody>
          {tags.map((tag) => (
            <tr
              key={tag.Guid}
              className="hover:bg-gray-100 transition-all"
            >
              <td
                className="p-3 border-b border-gray cursor-pointer"
              >
                {tag.Name}
              </td>
              <td className="p-3 border-b border-gray text-right space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => {
                    setEditTag({ ...tag });
                    setEditModalOpen(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDeleteTag(tag.Guid)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <CreateTagModal
          jwtToken={jwtToken}
          onClose={() => setModalOpen(false)}
          onCreate={() => {
            setModalOpen(false);
            fetchTags();
          }}
        />
      )}

      {editModalOpen && editTag && (
        <EditTagModal
          tag={editTag}
          jwtToken={jwtToken}
          onClose={() => {
            setEditModalOpen(false);
            setEditTag(null);
          }}
          onSave={() => {
            setEditModalOpen(false);
            setEditTag(null);
            fetchTags();
          }}
        />
      )}
    </div>
  );
};

export default TagsPage;