'use client';

import { useEffect, useState, useMemo  } from "react";
import { useParams, useSearchParams, useRouter  } from 'next/navigation';
import { ExerciseDto, ExerciseResultDto, ExerciseType } from '../../../../../types';
import { useTranslations } from 'next-intl';

function shuffleString(str: string): string[] {
  const words = str.split(';');

  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]]; // меняем местами элементы
  }

  return words;
}

export default function ExercisePage() {
  const data: ExerciseDto[] = JSON.parse(localStorage.getItem("exercises") || "[]");
  console.log(data);
  const router = useRouter();
  const { guid } = useParams();
  const index = useSearchParams().get('index');
  const [exercise, setExercise] = useState<ExerciseDto>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [userAnswerWord, setUserAnswerWord] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const t = useTranslations('Exercise');

  const jwtToken = localStorage.getItem("token");

  const EXERCISE_TYPE_TITLES: { [key in ExerciseType]: string } = {
  [ExerciseType.CreateSentence]: t('createSentence'),
    [ExerciseType.InsertWordInRightForm]: t('insertWordInRightForm'),
    [ExerciseType.InsertWordToText]: t('insertWordToText'),
    [ExerciseType.MatchingWordAndItsTranslate]: t('matchingWordAndItsTranslate'),
    [ExerciseType.WriteCzechWord]: t('writeCzechWord'),
};

  useEffect(() => {
    const fetchExercise = async () => {
      if (typeof guid === "string") {
        if (index === null) {
          try {
            const response = await fetch(`https://localhost:44376/api/exercise?guid=${guid}`,{
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
              },
            });
            if (!response.ok) {
              throw new Error('Ошибка загрузки упражнения с сервера');
            }
            const exerciseFromServer: ExerciseDto = await response.json();
            setExercise(exerciseFromServer);

            console.log(exercise);
  
            // перемешиваем варианты ответа
            const shuffled = shuffleString(exerciseFromServer.AnswerOptions);
            setAnswerOptions(shuffled);
          } catch (error) {
            console.error('Ошибка при загрузке упражнения:', error);
          }
        } else {
          const data: ExerciseDto[] = JSON.parse(localStorage.getItem("exercises") || "[]");
  
          if (typeof index === "string") {
            setCurrentIndex(parseInt(index));
          }
  
          const found = data.find((e) => e.Guid === guid);
          if (found) {
            setExercise(found);
  
            // перемешиваем варианты ответа
            const shuffled = shuffleString(found.AnswerOptions);
            setAnswerOptions(shuffled);
          }
        }
      }
    };
  
    fetchExercise();
  }, [guid, index]);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < data.length) {
      const next = data[nextIndex];
      console.log(data[nextIndex]);
      router.push(`/exercise/${next.Guid}?index=${nextIndex}`);
    } else {
      router.push("/exercises"); // Конец
    }
  };


  const handleWordClick = (word: string) => {
  if (exercise!.ExerciseType === ExerciseType.MatchingWordAndItsTranslate) {
    // Заменить существующий ответ
    setUserAnswer([word]);
  } else {
    // Добавить, только если ещё не добавлен
    if (!userAnswer.includes(word)) {
      setUserAnswer([...userAnswer, word]);
    }
  }
};
  
  const removeWord = (word: string) => {
    setUserAnswer(userAnswer.filter(w => w !== word));
  };
  
  const handleSaveAnswer = async () => {
    var isAnswerCorrect=false;
    if((exercise!.ExerciseType === ExerciseType.InsertWordToText ||
exercise!.ExerciseType === ExerciseType.CreateSentence) ){
  var joinedAnswer = "";
  if(exercise!.ExerciseType === ExerciseType.CreateSentence){
    joinedAnswer = userAnswer.join(' ');
  }
  if(exercise!.ExerciseType === ExerciseType.InsertWordToText){
joinedAnswer = userAnswer.join(', ');
  }
 
    console.log(joinedAnswer);
    console.log(exercise!.Answer);
    isAnswerCorrect = joinedAnswer === exercise!.Answer;  
}
else if((exercise!.ExerciseType === ExerciseType.MatchingWordAndItsTranslate ))
{
  isAnswerCorrect = userAnswer[0] === exercise!.Answer;  
}else{
  isAnswerCorrect = userAnswerWord === exercise!.Answer;
}

setIsCorrect(isAnswerCorrect);
    

  const resultDto: ExerciseResultDto = {
    Guid: exercise!.Guid,      
    LastUsed: new Date(),  
    ExerciseType: 0, 
    Result: isAnswerCorrect  
  };

  try {
    const response = await fetch('https://localhost:44376/api/exercise', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(resultDto),
    });

    if (!response.ok) {
      throw new Error('Ошибка при отправке результата на сервер');
    }

    console.log('Результат успешно отправлен');
  } catch (error) {
    console.error('Ошибка отправки:', error);
  }
  };
  
  const handleShowAnswer = () => {
    setShowCorrectAnswer(true);
  };

  if (!exercise) return <div>Загрузка...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-green">
      {EXERCISE_TYPE_TITLES[exercise.ExerciseType]}
    </h1>
      <p className="text-black">{exercise.Question}</p>
  
      {(exercise.ExerciseType === ExerciseType.InsertWordToText ||
  exercise.ExerciseType === ExerciseType.MatchingWordAndItsTranslate ||
  exercise.ExerciseType === ExerciseType.CreateSentence) && (
  <div className="flex flex-wrap gap-2 mt-10">
    {answerOptions.map((option, idx) => (
      <button
        key={idx}
        onClick={() => handleWordClick(option)}
        className="px-3 font-lora py-1 border border-gray rounded-md bg-gray text-black hover:bg-green hover:text-beige cursor-pointer"
      >
        {option}
      </button>
    ))}
  </div>
)}
  
      <div className="mt-6">
        <h2 className="font-semibold mb-2 text-green">{t('answer')}</h2>
        {(exercise.ExerciseType === ExerciseType.InsertWordToText ||
  exercise.ExerciseType === ExerciseType.MatchingWordAndItsTranslate ||
  exercise.ExerciseType === ExerciseType.CreateSentence) && (
  <div className="flex flex-wrap gap-2">
    {userAnswer.map((word, idx) => (
      <span
        key={idx}
        className="flex font-lora items-center px-3 py-1 border border-gray rounded-full bg-white text-green"
      >
        {word}
        <button
          onClick={() => removeWord(word)}
          className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
        >
          ✕
        </button>
      </span>
    ))}
  </div>
)}

{(exercise.ExerciseType === ExerciseType.WriteCzechWord ||
  exercise.ExerciseType === ExerciseType.InsertWordInRightForm) && (
<div>
  <input
      type="text"
              value={userAnswerWord}
              onChange={(e) => setUserAnswerWord(e.target.value)}
      className="w-50 rounded border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
    />
</div>)}

      </div>
  
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSaveAnswer}
          className="px-4 py-2 bg-green font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
        >
          {t('save')}
        </button>
        <button
          onClick={handleShowAnswer}
          className="px-4 py-2 font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
        >
          {t('show')}
        </button>
        {index!==null &&<button
        className="px-4 py-2 font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
        onClick={handleNext}
      >
        {currentIndex + 1 < data.length ? t('next') : t('finish')}
      </button>}
      </div>
  
      {isCorrect !== null && (
        <div className={`mt-4 font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? t('correct') : t('wrong')}
        </div>
      )}
  
      {showCorrectAnswer && (
        <div className="mt-2 text-gray-700">
          <strong>{t('correct')}: </strong><span className="font-lora">{exercise.Answer}</span> 
        </div>
      )}     
      
    </div>
  );
}
