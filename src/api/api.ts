import { ExerciseGeneratorDto, ExerciseDto, FilterWordDto, Word, Topic, UserTag, LanguageLevel } from '../../types'

var jwtToken = localStorage.getItem("token");
var host = 'https://localhost:44376'

export async function fetchTopics(): Promise<Topic[] | undefined>
{
  try {
    const response = await fetch(`${host}/api/Topic/`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });   
    
    if (!response.ok) {
      if (response.status == 401) {
        window.location.href = "/signin";
      }
      else {
        const jsonResult = await response.json();
        showError(jsonResult.message, response.status);
      }
    }
    var result = await response.json();

    return result as Topic[]
  } catch (error) {
    console.log(error);
  }
};

export async function fetchTags(): Promise<UserTag[] | undefined>
{
  try {
    const response = await fetch(`${host}/api/Tag?tagType=0`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status == 401) {
        window.location.href = "/signin";
      }
      else {
        const jsonResult = await response.json();
        showError(jsonResult.message, response.status);
      }
    }
    var result = await response.json();

    return result as UserTag[]
  } catch (error) {
    console.log(error);
  }
};

export async function fetchLanguageLevels(): Promise<LanguageLevel[] | undefined>
{
  try {
    const response = await fetch(`${host}/dictionary/LanguageLevels`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status == 401) {
        window.location.href = "/signin";
      }
      else {
        const jsonResult = await response.json();
        showError(jsonResult.message, response.status);
      }
    }
    var result = await response.json();

    return result as LanguageLevel[]
  } catch (error) {
    console.log(error);
  }
};

export async function fetchFilteredWords(filters: FilterWordDto): Promise<Word[] | undefined>
{
  try {
    const response = await fetch(`${host}/api/Word/withFilter`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filters),
    });    
    
    if (!response.ok) {
      if (response.status == 401) {
        window.location.href = "/signin";
      }
      else {
        const jsonResult = await response.json();
        showError(jsonResult.message, response.status);
      }
    }
    var result = await response.json();

    return result as Word[]
  } catch (error) {
    console.log(error);
  }
};

export async function generateExercises(
  dto: ExerciseGeneratorDto
): Promise<ExerciseDto | undefined> {
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
      if (response.status == 401) {
        window.location.href = "/signin";
      }
      else {
        showError(jsonResult.message, response.status);
      }
    }

    return jsonResult as ExerciseDto;
  } catch (error) {
    console.error(error);
    showError('Error', 500);
  }
};

const showError = (message: string, code: number) => {
}