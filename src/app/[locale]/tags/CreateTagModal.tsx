'use client';

import { useState } from "react";

interface CreateTagModalProps {
  jwtToken: string | null;
  onClose: () => void;
  onCreate: () => void;
}

enum TagTypeEnum {
  Word = 0,
  Rule = 1,
  Topic = 2,
  Exercise = 3,
}

const TAG_TYPE_LABELS: { [key in TagTypeEnum]: string } = {
  [TagTypeEnum.Word]: "Слово",
  [TagTypeEnum.Rule]: "Правило",
  [TagTypeEnum.Topic]: "Тема",
  [TagTypeEnum.Exercise]: "Упражнение",
};

const CreateTagModal = ({ jwtToken, onClose, onCreate }: CreateTagModalProps) => {
  const [newTagName, setNewTagName] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<TagTypeEnum[]>([]);

  const handleCheckboxChange = (type: TagTypeEnum) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleAddTag = async () => {
    if (!newTagName.trim() || selectedTypes.length === 0) return;

    try {
      const newTag = {
        name: newTagName,
        tagTypes: selectedTypes.map(type => ({
          tagTypeEnum: type
        }))
      };

      const response = await fetch("https://localhost:44376/api/Tag", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTag),
      });

      if (!response.ok) throw new Error("Failed to create tag");

      setNewTagName('');
      setSelectedTypes([]);
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
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />

        <div className="mb-4">
          <p className="font-semibold mb-2">Типы:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TagTypeEnum)
              .filter(([key]) => isNaN(Number(key))) // Оставить только названия, не числовые ключи
              .map(([key, value]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(value as TagTypeEnum)}
                    onChange={() => handleCheckboxChange(value as TagTypeEnum)}
                  />
                  {TAG_TYPE_LABELS[value as TagTypeEnum]}
                </label>
              ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Закрыть
          </button>
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTagModal;
