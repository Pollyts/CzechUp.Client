'use client';

import { useState, useEffect } from "react";
import { UserTag, TagTypeEnum } from '../../../../types';

interface EditTagModalProps {
  tag: UserTag;
  onClose: () => void;
  onSave: () => void;
  jwtToken: string | null;
}

// Лейблы для enum
const TAG_TYPE_LABELS: { [key in TagTypeEnum]: string } = {
  [TagTypeEnum.Word]: "Слово",
  [TagTypeEnum.Rule]: "Правило",
  [TagTypeEnum.Topic]: "Тема",
  [TagTypeEnum.Exercise]: "Упражнение",
};

const EditTagModal = ({ tag, onClose, onSave, jwtToken }: EditTagModalProps) => {
  const [editedTag, setEditedTag] = useState<UserTag>(tag);
  const [selectedTypes, setSelectedTypes] = useState<TagTypeEnum[]>([]);

  useEffect(() => {
    // Инициализация выбранных типов из пропса tag
    const initialTypes = tag.TagTypes.map(tt => tt.TagTypeEnum);
    setSelectedTypes(initialTypes);
  }, [tag]);

  const handleCheckboxChange = (type: TagTypeEnum) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleUpdate = async () => {
    if (!editedTag.Name.trim() || selectedTypes.length === 0) return;

    try {
      const updatedTag = {
        ...editedTag,
        TagTypes: selectedTypes.map(type => ({
          tagTypeEnum: type
        }))
      };

      const response = await fetch(`https://localhost:44376/api/Tag`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTag),
      });

      if (!response.ok) throw new Error("Failed to update tag");

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
          value={editedTag.Name}
          onChange={(e) => setEditedTag({ ...editedTag, Name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />

        <div className="mb-4">
          <p className="font-semibold mb-2">Типы:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TagTypeEnum)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(value as unknown as TagTypeEnum)}
                    onChange={() => handleCheckboxChange(value as unknown as TagTypeEnum)}
                  />
                  {TAG_TYPE_LABELS[value as unknown as TagTypeEnum]}
                </label>
              ))}
          </div>
        </div>

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

export default EditTagModal;
