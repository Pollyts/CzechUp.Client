'use client';

import { useEffect, useState } from 'react';
import { LanguageLevel, Topic, WordDto, WordExampleDto, UserTag } from '../../../../../types';

interface EditWordModalProps {
    jwtToken: string | null;
    word: WordDto;
    onClose: () => void;
    onSave: () => void;
  }

  const EditWordModal = ({ jwtToken, word, onClose, onSave }: EditWordModalProps) => {
    const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [wordDto, setWordDto] = useState<WordDto>(word);
    const [tags, setTags] = useState<UserTag[]>([]);
    
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [levelsRes, topicsRes, tagsRes] = await Promise.all([
          fetch('https://localhost:44376/dictionary/LanguageLevels', {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('https://localhost:44376/api/Topic/', {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('https://localhost:44376/api/Tag?tagType=0', {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!levelsRes.ok) {
          const text = await levelsRes.text();
          throw new Error(`Ошибка загрузки уровней: ${levelsRes.status} ${text}`);
        }

        if (!topicsRes.ok) {
          const text = await topicsRes.text();
          throw new Error(`Ошибка загрузки тем: ${topicsRes.status} ${text}`);
        }

        if (!tagsRes.ok) {
            const text = await tagsRes.text();
            throw new Error(`Ошибка загрузки тэгов: ${tagsRes.status} ${text}`);
          }

        const levels: LanguageLevel[] = await levelsRes.json();
        const topicsData: Topic[] = await topicsRes.json();
        const tags: UserTag[] = await tagsRes.json();
        

        setLanguageLevels(levels);
        setTopics(topicsData);
        setTags(tags);
      } catch (err) {
        console.error('Ошибка при загрузке уровней и тем:', err);
      }
    };

    if (jwtToken) {
      fetchDropdownData();
    }
  }, [jwtToken]);

  const handleChangeExample = (index: number, field: keyof WordExampleDto, value: string) => {
    const newExamples = [...wordDto.WordExamples];
    newExamples[index][field] = value;
    setWordDto({ ...wordDto, WordExamples: newExamples });
  };
  

  const handleUpdateWord = async () => {
    try {
      const response = await fetch('https://localhost:44376/api/word', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wordDto),
      });

      if (!response.ok) throw new Error('Ошибка при обновлении слова');

      onSave();
    } catch (err) {
      console.error(err);
      alert('Ошибка при обновлении слова');
    }
  };

  const addExample = () => {
    setWordDto({
      ...wordDto,
      WordExamples: [...wordDto.WordExamples, { Guid: '00000000-0000-0000-0000-000000000000', OriginalExample: '', TranslatedExample: '' }],
    });
  };

  const removeExample = (index: number) => {
    const newExamples = wordDto.WordExamples.filter((_, i) => i !== index);
    setWordDto({ ...wordDto, WordExamples: newExamples });
  };

  const handleChangeTranslation = (index: number, value: string) => {
    const newTranslations = [...wordDto.Translations];
    newTranslations[index] = value;
    setWordDto({ ...wordDto, Translations: newTranslations });
  };

  const addTranslation = () => {
    setWordDto({
      ...wordDto,
      Translations: [...wordDto.Translations, ''],
    });
  };

  const removeTranslation = (index: number) => {
    const newTranslations = wordDto.Translations.filter((_, i) => i !== index);
    setWordDto({ ...wordDto, Translations: newTranslations });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4">
      <h2 className="text-2xl font-semibold">Редактировать слово</h2>

        <input
          type="text"
          placeholder="Слово"
          value={wordDto.Word}
          onChange={(e) => setWordDto({ ...wordDto, Word: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />

        <div className="space-y-2">
          <label className="block font-medium">Переводы:</label>
          {wordDto.Translations.map((translation, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={translation}
                onChange={(e) => handleChangeTranslation(index, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
              {wordDto.Translations.length > 1 && (
                <button
                  onClick={() => removeTranslation(index)}
                  className="text-red-600 hover:text-red-800 text-xl px-2"
                  title="Удалить перевод"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addTranslation}
            className="text-sm text-blue-600 hover:underline"
          >
            + Добавить перевод
          </button>
        </div>

        <select
    value=""
    onChange={(e) => {
      const selectedTag = e.target.value;
      if (selectedTag && !wordDto.Tags.includes(selectedTag)) {
        setWordDto({ ...wordDto, Tags: [...wordDto.Tags, selectedTag] });
      }
    }}
    className="w-full p-2 border border-gray-300 rounded-lg"
  >
    <option value="">Выберите тег</option>
    {tags.map((tag) => (
      <option key={tag.Guid} value={tag.Name}>
        {tag.Name}
      </option>
    ))}
  </select>

  <div className="flex flex-wrap gap-2">
    {wordDto.Tags.map((tagName, index) => (
      <span
        key={index}
        className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
      >
        {tagName}
        <button
          onClick={() => {
            const updatedTags = wordDto.Tags.filter((_, i) => i !== index);
            setWordDto({ ...wordDto, Tags: updatedTags });
          }}
          className="ml-2 text-blue-600 hover:text-blue-800"
          title="Удалить тег"
        >
          ✖
        </button>
      </span>
    ))}
  </div>


        <select
          value={wordDto.LanguageLevel}
          onChange={(e) => setWordDto({ ...wordDto, LanguageLevel: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Выберите уровень</option>
          {languageLevels.map((level) => (
            <option key={level.Guid} value={level.Name}>
              {level.Name}
            </option>
          ))}
        </select>

        <select
          value={wordDto.Topic}
          onChange={(e) => setWordDto({ ...wordDto, Topic: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value="">Выберите тему</option>
          {topics.map((topic) => (
            <option key={topic.Guid} value={topic.Name}>
              {topic.Name}
            </option>
          ))}
        </select>

        <div className="space-y-2">
          <label className="block font-medium">Примеры использования:</label>
          {wordDto.WordExamples.map((example, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Оригинал"
                value={example.OriginalExample}
                onChange={(e) => handleChangeExample(index, 'OriginalExample', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Перевод"
                value={example.TranslatedExample}
                onChange={(e) => handleChangeExample(index, 'TranslatedExample', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
              {wordDto.WordExamples.length > 1 && (
                <button
                  onClick={() => removeExample(index)}
                  className="text-red-600 hover:text-red-800 text-xl px-2"
                  title="Удалить пример"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addExample}
            className="text-sm text-blue-600 hover:underline"
          >
            + Добавить пример
          </button>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Отмена
          </button>
          <button
            onClick={handleUpdateWord}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Сохранить
          </button>
        </div>
      </div>
      </div>
  );
};

export default EditWordModal;
