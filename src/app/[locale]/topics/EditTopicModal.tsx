// components/EditTopicModal.tsx

'use client';

import { useState } from "react";
import { Topic } from '../../../../types';

interface EditTopicModalProps {
  topic: Topic;
  onClose: () => void;
  onSave: () => void;
  jwtToken: string | null;
}

const EditTopicModal = ({ topic, onClose, onSave, jwtToken }: EditTopicModalProps) => {
  const [editedTopic, setEditedTopic] = useState<Topic>(topic);

  const handleUpdate = async () => {
    if (!editedTopic.Name.trim()) return;

    try {
      const response = await fetch(`https://localhost:44376/api/Topic`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedTopic),
      });

      if (!response.ok) throw new Error("Failed to update topic");

      onSave();
    } catch (err) {
      console.error(err);
      alert("Ошибка при редактировании темы");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Редактировать тему</h2>
        <input
          type="text"
          value={editedTopic.Name}
          onChange={(e) => setEditedTopic({ ...editedTopic, Name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTopicModal;
