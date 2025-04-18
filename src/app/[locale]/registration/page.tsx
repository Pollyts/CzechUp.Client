import RegistrationForm from "./RegistrationForm";
import { Language, LanguageLevel } from '../../../../types';

async function getLanguages(): Promise<Language[]> {
  const res = await fetch("https://localhost:44376/dictionary/Languages");
  const data = await res.json();
  console.log(data);
  return data;
}

async function getLanguageLevels(): Promise<LanguageLevel[]> {
  const res = await fetch("https://localhost:44376/dictionary/LanguageLevels");
  return res.json();
}

export default async function RegistrationPage() {
  const languages = await getLanguages();
  const languageLevels = await getLanguageLevels();

  return (
    <RegistrationForm languages={languages} languageLevels={languageLevels} />    
  );
}