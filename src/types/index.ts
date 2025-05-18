import { UploadFile } from 'antd';

export type FieldTypeLogin = {
  email: string;
  password: string;
};

export type MessageType = {
  fullname: string;
  email: string;
  message: string;
  seen?: boolean;
  _id?: string;
};

export type TProjectType = {
  name: string;
  thumbnail: {
    fileList: TFile[];
  };
  images: {
    fileList: TFile[];
  };
  overview: string;
  link: string;
};

export type TStoredProject = {
  _id: string;
  name: string;
  thumbnail: string;
  images: {
    _id: string;
    key: number;
    link: string;
  }[];
  overview: string;
  link: string;
};

export type TFile = UploadFile & { originFileObj: object };

export type TLinkObj = {
  link: string;
  key: number;
};

export type TProject = {
  _id: string;
  name: string;
  thumbnail?: string;
  images?: TImages[];
  overview: string;
  link: string;
  imagesKey: {
    key: number;
    link: string;
  }[];
};

export type TImages = {
  key: number;
  link: string;
};
