'use client';

import { useEffect, useState } from 'react';
import { LanguageLevel, Topic, WordDto, WordExampleDto, UserTag, ExerciseType, ExerciseGeneratorDto } from '../../../../types';
import { useTranslations } from 'next-intl';

interface ExerciseGenerationModalProps {
  jwtToken: string | null;
  onClose: () => void;
  onSave: (data: ExerciseGeneratorDto) => void;
}

const ExerciseGenerationModal = ({ jwtToken, onClose, onSave }: ExerciseGenerationModalProps) => {
  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [tags, setTags] = useState<UserTag[]>([]);
  const [count, setCount] = useState<number>(1);
  const [onlyNew, setOnlyNew] = useState<boolean>(true);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([ExerciseType.CreateSentence, ExerciseType.InsertWordInRightForm, ExerciseType.InsertWordToText, ExerciseType.MatchingWordAndItsTranslate, ExerciseType.WriteCzechWord]);
  const [exerciseGenerator, setExerciseGenerator] = useState<ExerciseGeneratorDto>({
    LanguageLevels: [],
    Topics: [],
    ExerciseTypes: [],
    Tags: [],
    Count: 1,
    OnlyNew: true,
  });
  const t = useTranslations('ExercisesGeneration');

  const EXERCISE_TYPE_LABELS: { [key in ExerciseType]: string } = {
    [ExerciseType.CreateSentence]: t('createSentence'),
    [ExerciseType.InsertWordInRightForm]: t('insertWordInRightForm'),
    [ExerciseType.InsertWordToText]: t('insertWordToText'),
    [ExerciseType.MatchingWordAndItsTranslate]: t('matchingWordAndItsTranslate'),
    [ExerciseType.WriteCzechWord]: t('writeCzechWord'),
  };

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
          fetch('https://localhost:44376/api/Topic/general', {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('https://localhost:44376/api/Tag?tagType=3', {
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

  const handleAddWord = async () => {
    onSave(exerciseGenerator);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto hide-scrollbar">

        <h2 className="text-2xl font-semibold">{t('generate')}</h2>

        <div className="space-y-2">
          <label className="block font-medium">{t('topics')}</label>

          <select
            value=""
            onChange={(e) => {
              const selectedTopic = e.target.value;
              if (selectedTopic && !exerciseGenerator.Topics.includes(selectedTopic)) {
                setExerciseGenerator({ ...exerciseGenerator, Topics: [...exerciseGenerator.Topics, selectedTopic] });
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">{t('selectTopic')}</option>
            {topics.map((topic) => (
              <option key={topic.Guid} value={topic.Guid}>
                {topic.Name}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
           {exerciseGenerator.Topics.map((topicGuid, index) => {
  const topic = topics.find((t) => t.Guid === topicGuid);
  return (
    <span
      key={index}
      className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
    >
      {topic?.Name ?? topicGuid}
      <button
        onClick={() => {
          const updatedTopics = exerciseGenerator.Topics.filter((_, i) => i !== index);
          setExerciseGenerator({ ...exerciseGenerator, Topics: updatedTopics });
        }}
        className="ml-2 text-blue-600 hover:text-blue-800"
        title="Удалить тему"
      >
        ✖
      </button>
    </span>
  );
})}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">{t('exerciseType')}</label>

          <select
            value=""
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
            
              if (!isNaN(value) && Object.values(ExerciseType).includes(value)) {
                const selectedType = value as ExerciseType;
            
                if (!exerciseGenerator.ExerciseTypes.includes(selectedType)) {
                  setExerciseGenerator({
                    ...exerciseGenerator,
                    ExerciseTypes: [...exerciseGenerator.ExerciseTypes, selectedType],
                  });
                }
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">{t('selectExerciseType')}</option>
            {Object.values(ExerciseType)
  .filter((v) => typeof v === 'number')
  .map((value) => (
    <option key={value} value={value}>
      {EXERCISE_TYPE_LABELS[value as ExerciseType]}
    </option>
))}
          </select>

          <div className="flex flex-wrap gap-2">
            {exerciseGenerator.ExerciseTypes.map((index) => (
              <span
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
              >
                {EXERCISE_TYPE_LABELS[index as ExerciseType]}
                <button
                  onClick={() => {
                    const updatedExerciseTypes = exerciseGenerator.ExerciseTypes.filter((_, i) => i !== index);
                    setExerciseGenerator({ ...exerciseGenerator, ExerciseTypes: updatedExerciseTypes });
                  }}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  title="Удалить тип"
                >
                  ✖
                </button>
              </span>
            ))}
          </div>
        </div>


        <div className="space-y-2">
          <label className="block font-medium">{t('languageLevel')}</label>

          <select
            value=""
            onChange={(e) => {
              const selectedLevel = e.target.value;
              if (selectedLevel && !exerciseGenerator.LanguageLevels.includes(selectedLevel)) {
                setExerciseGenerator({ ...exerciseGenerator, LanguageLevels: [...exerciseGenerator.LanguageLevels, selectedLevel] });
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">{t('selectLanguageLevel')}</option>
            {languageLevels.map((level) => (
              <option key={level.Guid} value={level.Guid}>
                {level.Name}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
            {exerciseGenerator.LanguageLevels.map((levelGuid, index) => {
  const level = languageLevels.find((l) => l.Guid === levelGuid);
  return (
    <span
      key={index}
      className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
    >
      {level?.Name ?? levelGuid}
      <button
        onClick={() => {
          const updatedLevels = exerciseGenerator.LanguageLevels.filter((_, i) => i !== index);
          setExerciseGenerator({ ...exerciseGenerator, LanguageLevels: updatedLevels });
        }}
        className="ml-2 text-blue-600 hover:text-blue-800"
        title="Удалить уровень"
      >
        ✖
      </button>
    </span>
  );
})}

          </div>
        </div>


        <div className="space-y-2">
          <label className="block font-medium">{t('tags')}</label>

          <select
            value=""
            onChange={(e) => {
              const selectedTag = e.target.value;
              if (selectedTag && !exerciseGenerator.Tags.includes(selectedTag)) {
                setExerciseGenerator({ ...exerciseGenerator, Tags: [...exerciseGenerator.Tags, selectedTag] });
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">{t('selectTag')}</option>
            {tags.map((tag) => (
              <option key={tag.Guid} value={tag.Guid}>
                {tag.Name}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2">
            {exerciseGenerator.Tags.map((tagGuid, index) => {
  const tag = tags.find((t) => t.Guid === tagGuid);
  return (
    <span
      key={index}
      className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
    >
      {tag?.Name ?? tagGuid}
      <button
        onClick={() => {
          const updatedTags = exerciseGenerator.Tags.filter((_, i) => i !== index);
          setExerciseGenerator({ ...exerciseGenerator, Tags: updatedTags });
        }}
        className="ml-2 text-blue-600 hover:text-blue-800"
        title="Удалить тег"
      >
        ✖
      </button>
    </span>
  );
})}

          </div>
        </div>

        <div className="flex flex-col gap-4 p-4">
  {/* Счётчик */}
  <div className="flex items-center gap-2">
    <label htmlFor="count" className="text-sm font-medium text-gray-700">
      {t('number')}
    </label>
    <input
      id="count"
      type="number"
      min={1}
      value={exerciseGenerator.Count}
      onChange={(e) => setExerciseGenerator({
        ...exerciseGenerator,
        Count: Number(e.target.value),
      })}
      className="w-20 rounded border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>

  <div className="flex items-center gap-2">
    <input
      id="onlyNew"
      type="checkbox"
      checked={exerciseGenerator.OnlyNew}
      onChange={(e) => setExerciseGenerator({
        ...exerciseGenerator,
        OnlyNew: e.target.checked,
      })}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <label htmlFor="onlyNew" className="text-sm text-gray-700">
      {t('onlyNews')}
    </label>
  </div>
</div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-l font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
          >
            {t('close')}
          </button>
          <button
            onClick={handleAddWord}
            className="px-4 py-2 text-l font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseGenerationModal;
