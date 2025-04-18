export interface IDbEntity {
  Guid: string;
}

export interface Word extends IDbEntity{
  Guid: string;
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