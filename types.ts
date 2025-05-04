export interface IDbEntity {
  Guid: string;
}

export interface Language extends IDbEntity{
  Name: string;
}

export interface LanguageLevel extends IDbEntity{
  Name: string;
}

export interface Word extends IDbEntity{
  Word: string;
  LanguageLevelGuid?: string;
  UserTopicGuid?: string;
  GeneralOriginalWordGuid?: string;
}

export interface Topic extends IDbEntity{
    Name: string;
    UserGuid: string;
    GeneralTopicGuid?: string;
}

export interface Rule extends IDbEntity{
  Name: string;
}

export interface UserRuleNote extends IDbEntity{
  Note: string;
  UserGuid: string;
  RuleGuid: string;
  Rule: Rule;
}

export enum TagTypeEnum {
    Word = 0,
    Rule = 1,
    Topic = 2,
    Exercise = 3,
}
  
export interface TagType extends IDbEntity {
    TagTypeEnum: TagTypeEnum;
}
  
export interface UserTag extends IDbEntity {
  Name: string;
  UserGuid: string;
  TagTypes: TagType[];
}

export interface WordDto extends IDbEntity {
  Word: string;
  LanguageLevel: string;
  Topics: string[];
  Translations: string[];
  Tags: string[];
  WordForms: WordFormDto[];
  WordExamples: WordExampleDto[];
}

export interface WordFormDto extends IDbEntity {
  Tag: string;
  Form: string;
  Part: string;
  Pad: string;
  Cislo: string;
  Negace: string;
  Stupen: string;
  Vid: string;
  Typ: string;
  Rod: String;
  Osoba: string;
}

export interface WordExampleDto extends IDbEntity {
  OriginalExample: string;
  TranslatedExample: string;
}

export interface PdfWord{
  Word: string;
  Translations: string;
}

export interface SearchedWordDto extends IDbEntity {
  Word: WordDto;
  CanAddToDb: boolean;
}

export interface FilterWordDto {
  Tags: string[];
  Topics: string[];
}

export interface FilterExerciseDto
{
    Tags: string[];
    Topics: string[];
    LanguageLevels: string[];
    ExerciseTypes: string[];
    CompleteResults: CompleteResult[];
}

export enum  CompleteResult
{
    WithMistakes = 0,
    WithoutMistakes = 1
}

export interface ExerciseGeneratorDto
{
    Tags: string[];
    Topics: string[];
    LanguageLevels: string[];
    ExerciseTypes: ExerciseType[];
    Count: number;
    OnlyNew: boolean;
}

export interface ExerciseResultDto extends IDbEntity
{
    LastUsed: Date
    ExerciseType: ExerciseType;
    Result: boolean;
}

export enum ExerciseType
{
    InsertWordInRightForm, // Заполнение пропуска подходящим словом в правильной форме. 
    CreateSentence, //Составление предложений с новыми словами
    InsertWordToText, //	Заполнение пропусков в тексте словами из предложенных вариантов
    MatchingWordAndItsTranslate, //	Выбрать правильный перевод слова из предложенных
    WriteCzechWord, // Написать перевод слова
}

export interface ExerciseDto extends IDbEntity
{
    Question : string;
    AnswerOptions: string;
    Answer: string;
    ExerciseType: ExerciseType;
}