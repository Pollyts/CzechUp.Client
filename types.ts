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
  Topic: string;
  Translations: string[];
  Tags: string[];
  WordForms: WordFormDto[];
  WordExamples: WordExampleDto[];
}

export interface WordFormDto extends IDbEntity {
  Tag: string;
  Form: string;
}

export interface WordExampleDto extends IDbEntity {
  OriginalExample: string;
  TranslatedExample: string;
}

export interface SearchedWordDto extends IDbEntity {
  Word: WordDto;
  CanAddToDb: boolean;
}