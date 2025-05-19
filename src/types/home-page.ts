import { TFile } from '.';

export type HeroSectionDataType = {
  _id: string;
  stack: 'frontend' | 'backend' | 'full-stack';
  tagline: string;
  about_me: string;
  thumbnail:
    | {
        fileList: TFile[];
      }
    | string;
};

export type SkillType = {
  _id: string;
  name: string;
  description: string;
  skill_icon:
    | {
        fileList: TFile[];
      }
    | string;
};
