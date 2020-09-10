export type MainStackParamList = {
  Home: undefined;
  Login: undefined;
  Player: undefined;
  Musicbill: {
    name: string;
    id: string;
  };
};

export type RootStackParamList = {
  NotFound: undefined;
  Main: undefined;
};
export type Singer = {
  alias: string;
  avatar: string;
  id: string;
  name: string;
};
export type Song = {
  accompany: boolean;
  alias: string;
  cover: string;
  cover_from: string | null;
  hq: boolean;
  id: string;
  mv: boolean;
  name: string;
  normal: string;
  singers: Singer[];
  type: number;
};
export type Musicbill = {
  cover: string;
  create_time: string;
  description: string;
  music_list: Song[];
  id: string;
  name: string;
  order: number;
};
