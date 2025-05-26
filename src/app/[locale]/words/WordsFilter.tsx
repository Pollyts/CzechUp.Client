'use client';

import { useEffect, useState } from 'react';
import { LanguageLevel, Topic, UserTag, FilterWordDto } from '../../../../types';
import { fetchLanguageLevels, fetchTags, fetchTopics } from '../../../api/api'
import { useTranslations } from 'next-intl';

interface WordsFilterProps {
  onApplyFilter: (filters: FilterWordDto) => void;
  selectedTopics: Topic[];
  setSelectedTopics: (topics: Topic[]) => void;
  selectedTags: UserTag[];
  setSelectedTags: (tags: UserTag[]) => void;
  selectedLanguageLevels: LanguageLevel[];
  setSelectedLanguageLevels: (levels: LanguageLevel[]) => void;
}

const WordsFilter: React.FC<WordsFilterProps> = ({ onApplyFilter, selectedTopics, setSelectedTopics, selectedTags, setSelectedTags, selectedLanguageLevels, setSelectedLanguageLevels }) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tags, setTags] = useState<UserTag[]>([]);
  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);
  const t = useTranslations('WordsFilter');

  const getTopics = async () => {
    var data = await fetchTopics();
    if (data) {
      setTopics(data);
    }
  };

  const getTags = async () => {
    var data = await fetchTags();
    if (data) {
      setTags(data);
    }
  };

  const getLanguageLevels = async () => {
    var data = await fetchLanguageLevels();
    if (data) {
      setLanguageLevels(data);
    }
  };

  useEffect(() => {
    getTopics();
    getTags();
    getLanguageLevels();
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
            className="w-full p-2 border cursor-pointer rounded"
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
            className="w-full p-2 border cursor-pointer rounded"
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
          <label className="block font-medium mb-2">{t('languageLevel')}</label>
          <select
            onChange={(e) => {
              const selected = languageLevels.find((t) => t.Guid === e.target.value);
              if (selected) handleSelect(selected, selectedLanguageLevels, setSelectedLanguageLevels);
            }}
            className="w-full p-2 border rounded cursor-pointer"
          >
            <option value="">{t('selectLanguageLevel')}</option>
            {languageLevels.map((ll) => (
              <option key={ll.Guid} value={ll.Guid}>
                {ll.Name}
              </option>
            ))}
          </select>

          <div className="mt-2">
            {selectedLanguageLevels.map((ll) => (
              <div key={ll.Guid} className="flex items-center justify-between bg-white px-2 py-1 mt-1 rounded shadow">
                <span>{ll.Name}</span>
                <button onClick={() => handleRemove(ll.Guid, selectedLanguageLevels, setSelectedLanguageLevels)}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() =>
            onApplyFilter({
              Topics: selectedTopics.map((t) => t.Guid),
              Tags: selectedTags.map((t) => t.Guid),
              LanguageLevels: selectedLanguageLevels.map((t) => t.Guid)
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
            setSelectedLanguageLevels([]);
            onApplyFilter({ Topics: [], Tags: [], LanguageLevels: [] });
          }}
          className="w-full px-4 py-2 text-l font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
        >
          {t('reset')}
        </button>
      </div>
    </div>
  );
};

export default WordsFilter;
