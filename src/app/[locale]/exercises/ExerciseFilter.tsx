'use client';

import { useEffect, useState } from 'react';
import { LanguageLevel, Topic, UserTag, FilterExerciseDto } from '../../../../types';

interface ExerciseFilterProps {
  jwtToken: string | null;
  onApplyFilter: (filters: FilterExerciseDto) => void;
}

const ExerciseFilter: React.FC<ExerciseFilterProps> = ({ jwtToken, onApplyFilter }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tags, setTags] = useState<UserTag[]>([]);

  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [selectedTags, setSelectedTags] = useState<UserTag[]>([]);

  const fetchTopics = async () => {
    const response = await fetch('https://localhost:44376/api/Topic/', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setTopics(data);
  };

  const fetchTags = async () => {
    const response = await fetch('https://localhost:44376/api/Tag?tagType=3', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setTags(data);
  };

  useEffect(() => {
    fetchTopics();
    fetchTags();
  }, []);

  const handleSelect = <T extends { Guid: string }>(
    item: T,
    selectedList: T[],
    setSelectedList: (items: T[]) => void
  ) => {
    if (!selectedList.some((i) => i.Guid === item.Guid)) {
      setSelectedList([...selectedList, item]);
    }
  };

  const handleRemove = <T extends { Guid: string }>(
    id: string,
    selectedList: T[],
    setSelectedList: (items: T[]) => void
  ) => {
    setSelectedList(selectedList.filter((item) => item.Guid !== id));
  };

  return (
    <div className="w-64 p-4 border-r border-gray-200 bg-gray-50">
      <div className="mb-4">
        <label className="block font-medium mb-2">Темы</label>
        <select
          onChange={(e) => {
            const selected = topics.find((t) => t.Guid === e.target.value);
            if (selected) handleSelect(selected, selectedTopics, setSelectedTopics);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Выберите тему</option>
          {topics.map((topic) => (
            <option key={topic.Guid} value={topic.Guid}>
              {topic.Name}
            </option>
          ))}
        </select>

        <div className="mt-2">
          {selectedTopics.map((topic) => (
            <div key={topic.Guid} className="flex items-center justify-between bg-white px-2 py-1 mt-1 rounded shadow">
              <span>{topic.Name}</span>
              <button onClick={() => handleRemove(topic.Guid, selectedTopics, setSelectedTopics)}>✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Тэги</label>
        <select
          onChange={(e) => {
            const selected = tags.find((t) => t.Guid === e.target.value);
            if (selected) handleSelect(selected, selectedTags, setSelectedTags);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Выберите тэг</option>
          {tags.map((tag) => (
            <option key={tag.Guid} value={tag.Guid}>
              {tag.Name}
            </option>
          ))}
        </select>

        <div className="mt-2">
          {selectedTags.map((tag) => (
            <div key={tag.Guid} className="flex items-center justify-between bg-white px-2 py-1 mt-1 rounded shadow">
              <span>{tag.Name}</span>
              <button onClick={() => handleRemove(tag.Guid, selectedTags, setSelectedTags)}>✕</button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() =>
          onApplyFilter({
            Topics: selectedTopics.map((t) => t.Guid),
            Tags: selectedTags.map((t) => t.Guid),
            LanguageLevels: [],
            ExerciseTypes: [],
            CompleteResults: []
          })
        }
        className="w-full mt-4 bg-green text-white py-2 rounded hover:bg-green-dark transition"
      >
        Применить фильтр
      </button>

      <button
        onClick={() => {
          setSelectedTopics([]);
          setSelectedTags([]);
          onApplyFilter({ 
            Topics: [], 
            Tags: [],
            LanguageLevels: [],
            ExerciseTypes: [],
            CompleteResults: [] });
        }}
        className="w-full mt-2 bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
      >
        Сбросить фильтр
      </button>
    </div>
  );
};

export default ExerciseFilter;
