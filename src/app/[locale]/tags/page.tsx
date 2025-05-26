'use client';

import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import EditTagModal from './EditTagModal';
import CreateTagModal  from './CreateTagModal';
import { UserTag, TagType } from '../../../../types';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loading from '../../../../components/Loading'

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

const handleDeleteTag = (guid: string) => {
  toast((tToast) => (
    <span>
      {t('delete')}
      <div className="mt-4 flex justify-around">
        <button
          onClick={async () => {
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
      toast.dismiss(tToast.id)
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении тэга");
    }
          }}
          className="px-8 py-1 r-5 font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
        >
          {t('yes')}
        </button>
        <button
          onClick={() => toast.dismiss(tToast.id)}
          className="px-8 py-1 r-5 font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
        >
          {t('no')}
        </button>
      </div>
    </span>
  ), {
    duration: 5000,
  });
};


  

  if (loading) {
          return <Loading></Loading>;
      }
  if (error) return <div className="text-center text-red-600 py-4">{error}</div>;

  return (
    <div className="container max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-semibold text-black">{t('dictionary')}</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-l mr-5 font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
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
                onClick={() => {
                    setEditTag({ ...tag });
                    setEditModalOpen(true);
                  }}
              >
                {tag.Name}
              </td>
              <td className="p-3 border-b border-gray text-right space-x-2">
                <Trash2
                       onClick={() => handleDeleteTag(tag.Guid)}
                      className="text-green cursor-pointer inline-block"
                    ></Trash2>
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