'use client';

import { useEffect, useState, useMemo  } from "react";
import { useParams, useSearchParams, useRouter  } from 'next/navigation';
import { ExerciseDto, ExerciseResultDto } from '../../../../../types';

function shuffleString(str: string): string[] {
  console.log("вертим");
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
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);

  const jwtToken = localStorage.getItem("token");

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
    if (!userAnswer.includes(word)) {
      setUserAnswer([...userAnswer, word]);
    }
  };
  
  const removeWord = (word: string) => {
    setUserAnswer(userAnswer.filter(w => w !== word));
  };
  
  const handleSaveAnswer = async () => {
    const joinedAnswer = userAnswer.join(', ');
    console.log(joinedAnswer);
    console.log(exercise!.Answer);
    const isAnswerCorrect = joinedAnswer === exercise!.Answer;
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
      <h1 className="text-xl font-bold mb-4 text-green">Вставьте пропущенные слова из предложенных в текст</h1>
      <p className="text-black">{exercise.Question}</p>
  
      <div className="flex flex-wrap gap-2 mt-10">
        {answerOptions.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleWordClick(option)}
            className="px-3 py-1 border border-gray rounded-md bg-gray text-black hover:bg-green hover:text-beige cursor-pointer"
          >
            {option}
          </button>
        ))}
      </div>
  
      <div className="mt-6">
        <h2 className="font-semibold mb-2 text-green">Ваш ответ:</h2>
        <div className="flex flex-wrap gap-2">
          {userAnswer.map((word, idx) => (
            <span
              key={idx}
              className="flex items-center px-3 py-1 border border-gray rounded-full bg-white text-green"
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
      </div>
  
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSaveAnswer}
          className="px-4 py-2 bg-green font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
        >
          Сохранить ответ
        </button>
        <button
          onClick={handleShowAnswer}
          className="px-4 py-2 font-bold bg-green text-beige cursor-pointer rounded-lg hover:bg-gray border-2 border-green hover:text-green"
        >
          Посмотреть результат
        </button>
      </div>
  
      {isCorrect !== null && (
        <div className={`mt-4 font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrect ? "Правильно!" : "Неправильно"}
        </div>
      )}
  
      {showCorrectAnswer && (
        <div className="mt-2 text-gray-700">
          <strong>Правильный ответ:</strong> {exercise.Answer}
        </div>
      )}

      {index!==null &&<button
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleNext}
      >
        {currentIndex + 1 < data.length ? "Далее" : "Завершить"}
      </button>}
      
    </div>
  );
}
