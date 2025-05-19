import { TFile } from '.';

export type HeroSectionDataType = {
  stack: 'frontend' | 'backend' | 'full-stack';
  tagline: string;
  about_me: string;
  thumbnail: {
    fileList: TFile[];
  };
};
