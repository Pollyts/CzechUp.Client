'use client';

import { useEffect, useState } from 'react';
import { LanguageLevel, Topic, UserTag, ExerciseType, FilterExerciseDto } from '../../../../types';
import { useTranslations } from 'next-intl';

interface ExerciseFilterProps {
  jwtToken: string | null;
  onApplyFilter: (filters: FilterExerciseDto) => void;
}

const ExerciseFilter: React.FC<ExerciseFilterProps> = ({ jwtToken, onApplyFilter }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tags, setTags] = useState<UserTag[]>([]);
  const [result, setResult] = useState<number | undefined>(undefined);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);

  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [selectedTags, setSelectedTags] = useState<UserTag[]>([]);
  const [selectedExerciseTypes, setSelectedExerciseTypes] = useState<ExerciseType[]>([]);
  const [selectedLanguageLevels, setSelectedLanguageLevels] = useState<LanguageLevel[]>([]);

  const t = useTranslations('ExercisesFilter');

  const fetchTopics = async () => {
    const response = await fetch('https://localhost:44376/api/Topic/general', {
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
    <div className="w-70 ml-5">
    <div className="w-76 p-4 bg-beige rounded-md h-fit fixed">
      <div className="mb-4">
        <h1 className='text-2xl text-center mb-5 text-green font-bold'>{t('filter')}</h1>
        <label className="block font-medium mb-2">{t('topics')}</label>
        <select
          onChange={(e) => {
            const selected = topics.find((t) => t.Guid === e.target.value);
            if (selected) handleSelect(selected, selectedTopics, setSelectedTopics);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">{t('selectTopic')}</option>
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
        <label className="block font-medium mb-2">{t('tags')}</label>
        <select
          onChange={(e) => {
            const selected = tags.find((t) => t.Guid === e.target.value);
            if (selected) handleSelect(selected, selectedTags, setSelectedTags);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">{t('selectTag')}</option>
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

      <div className="mb-4">
        <label className="block font-medium mb-2">{t('languageLevels')}</label>
        <select
          onChange={(e) => {
            const selected = languageLevels.find((t) => t.Guid === e.target.value);
            if (selected) handleSelect(selected, selectedLanguageLevels, setSelectedLanguageLevels);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">{t('selectLanguageLevel')}</option>
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

      <div className="mb-4">
        <label className="block font-medium mb-2">{t('tags')}</label>
        <select
          onChange={(e) => {
            const selected = tags.find((t) => t.Guid === e.target.value);
            if (selected) handleSelect(selected, selectedTags, setSelectedTags);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">{t('selectTag')}</option>
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
        className="w-full mb-2 px-4 py-2 text-l font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
      >
        {t('apply')}
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
        className="w-full px-4 py-2 text-l font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
      >
        {t('reset')}
      </button>
    </div>
    </div>
  );
};

export default ExerciseFilter;
