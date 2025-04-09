import RegistrationForm from "./RegistrationForm";

type Language = { guid: string; name: string };  // Изменено на guid (string)
type LanguageLevel = { guid: string; name: string };  // Изменено на guid (string)

async function getLanguages(): Promise<Language[]> {
  const res = await fetch("https://localhost:44376/dictionary/Languages");
  return res.json();
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