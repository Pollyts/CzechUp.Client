'use client';

import { useState } from "react";

interface CreateTopicModalProps {
  jwtToken: string | null;
  onClose: () => void;
  onCreate: () => void;
}

const CreateTopicModal = ({ jwtToken, onClose, onCreate }: CreateTopicModalProps) => {
  const [newTopicName, setNewTopicName] = useState('');

  const handleAddTopic = async () => {
    if (!newTopicName.trim()) return;

    try {
      const newTopic = { Name: newTopicName };

      const response = await fetch("https://localhost:44376/api/Topic", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTopic),
      });

      if (!response.ok) throw new Error("Failed to create topic");

      setNewTopicName('');
      onCreate();
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании темы");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Создать новую тему</h2>
        <input
          type="text"
          placeholder="Название темы"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Закрыть
          </button>
          <button
            onClick={handleAddTopic}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTopicModal;
