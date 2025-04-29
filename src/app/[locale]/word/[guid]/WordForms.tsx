import React, { useState } from "react";
import { WordFormDto } from "../../../../../types";
import { useTranslations } from "next-intl";

type Props = {
  wordForms: WordFormDto[];
};

const part1Buttons = [
  { key: "c1", label: "Nominativ" },
  { key: "c2", label: "Genitiv" },
  { key: "c3", label: "Dativ" },
  { key: "c4", label: "Akuzativ" },
  { key: "c5", label: "Vokativ" },
  { key: "c6", label: "Lokál" },
  { key: "c7", label: "Instrumentál" },
  { key: "nS", label: "Singular" },
  { key: "nP", label: "Plural" },
];

const part2Buttons = [
  { key: "c1", label: "Nominativ" },
  { key: "c2", label: "Genitiv" },
  { key: "c3", label: "Dativ" },
  { key: "c4", label: "Akuzativ" },
  { key: "c5", label: "Vokativ" },
  { key: "c6", label: "Lokál" },
  { key: "c7", label: "Instrumentál" },
  { key: "nS", label: "Singular" },
  { key: "nP", label: "Plural" },
  { key: "eA", label: "Affirmation" },
  { key: "eN", label: "Negation" },
  { key: "gM", label: "Animate masculine" },
  { key: "gI", label: "Inanimate masculine" },
  { key: "gF", label: "Feminine" },
  { key: "gN", label: "Neuter" },
  { key: "d1", label: "Positive" },
  { key: "d2", label: "Comparative" },
  { key: "d3", label: "Superlative" },
];

const part5Buttons = [
  { key: "nS", label: "Singular" },
  { key: "nP", label: "Plural" },
  { key: "eA", label: "Affirmation" },
  { key: "eN", label: "Negation" },
  { key: "gM", label: "Animate masculine" },
  { key: "gI", label: "Inanimate masculine" },
  { key: "gF", label: "Feminine" },
  { key: "gN", label: "Neuter" },
  { key: "aP", label: "Perfect" },
  { key: "aI", label: "Imperfect" },
  { key: "mF", label: "Infinitive" },
  { key: "mI", label: "Present Indicative" },
  { key: "mR", label: "Imperative" },
  { key: "mA", label: "Active part. (past)" },
  { key: "mN", label: "Passive part." },
  { key: "mS", label: "Adv. part. (present)" },
  { key: "mD", label: "Adv. part. (past)" },
  { key: "mB", label: "Futreu indicative" },
  { key: "p1", label: "First Person" },
  { key: "p2", label: "Second Person" },
  { key: "p3", label: "Third Person" },
];

const WordFormsPart: React.FC<Props> = ({ wordForms }) => {
  const [selectedKeys, setSelectedKeys] = useState<Record<string, string[]>>({});

  if (!wordForms.length) return <div>No word forms available</div>;
  const t = useTranslations('WordForms');

  const groupName = [
    { key: "n", value: t('Number') },
    { key: "g", value: t('Gender') },
    { key: "c", value: t('Case') },
    { key: "e", value: t('Negation') },
    { key: "d", value: t('Degree') },
    { key: "p", value: t('Person') },
    { key: "m", value: t('Type') },
    { key: "a", value: t('Aspect') },
  ]

  const part: number = Number(wordForms[0].Part);
  var buttons = part1Buttons;

  switch (part) {
    case 2:
      buttons = part2Buttons;
      break;
    case 5:
      buttons = part5Buttons;
      break;
  }

  const groupedButtons = buttons.reduce<Record<string, { key: string; label: string }[]>>((acc, btn) => {
    const groupKey = btn.key[0];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(btn);
    return acc;
  }, {});


  const toggleKey = (group: string, key: string) => {
    setSelectedKeys(prev => {
      const currentGroup = prev[group] || [];
      const isSelected = currentGroup.includes(key);

      const newGroup = isSelected
        ? currentGroup.filter(k => k !== key)
        : [...currentGroup, key];

      const newSelected = { ...prev, [group]: newGroup };

      // Убираем пустые группы
      if (newGroup.length === 0) {
        delete newSelected[group];
      }

      return newSelected;
    });
  };

  const filteredForms = Object.keys(selectedKeys).length
    ? wordForms.filter(wf =>
      Object.entries(selectedKeys).every(([group, keys]) =>
        keys.some(key => wf.Tag.includes(key))
      )
    )
    : wordForms;

  const resetFilters = () => {
    setSelectedKeys({});
  };

  return (
    <div className="mt-4">
      <div className="flex justify-end">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-l font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green mb-5"
        >
          Reset
        </button>
      </div>
      <div className="space-y-4 mb-6">
        {Object.entries(groupedButtons).map(([groupKey, groupButtons], index) => (
          <div key={groupKey}>
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="group-name flex items-center w-40">
                {groupName.find(item => item.key === groupKey)?.value}
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {groupButtons.map(btn => (
                  <button
                    key={btn.key}
                    onClick={() => toggleKey(groupKey, btn.key)}
                    className={`px-2 py-1 rounded cursor-pointer hover:bg-green hover:text-beige ${selectedKeys[groupKey]?.includes(btn.key)
                      ? "bg-green text-beige"
                      : "bg-gray"
                      }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {index !== Object.entries(groupedButtons).length - 1 && (
              <hr className="border-t border-gray-400 my-2" />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {filteredForms.map((wf, index) => {
          const matchedButtons = buttons.filter(btn => wf.Tag.includes(btn.key));

          return (
            <div key={index} className="p-2 border border-gray rounded flex justify-between">
              <div className="font-semibold">{wf.Form}</div>
              {matchedButtons.length > 0 && (
                <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-2">
                  {matchedButtons.map((btn, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      {btn.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default WordFormsPart;
