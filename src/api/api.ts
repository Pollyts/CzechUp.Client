import {ExerciseGeneratorDto, ExerciseDto} from '../../types'
import { useTranslations } from 'next-intl';

var jwtToken = localStorage.getItem("token");
var host = 'https://localhost:44376'
const t = useTranslations('errors');

const generateExercises = async (
    dto: ExerciseGeneratorDto
  ): Promise<ExerciseDto | undefined> => {
    try {
      const response = await fetch(`${host}/api/exercise/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(dto),
      });
  
      const jsonResult = await response.json();
  
      if (!response.ok) {
        showError(jsonResult.message, response.status);
        return;
      }
  
      return jsonResult as ExerciseDto;
    } catch (error) {
      console.error(error);
      showError(t('clientError'), 500);
    }
  };

const showError = (message: string, code: number) => {
}