export type MainStackParamList = {
  Home: undefined;
  Login: undefined;
};

export type RootStackParamList = {
  NotFound: undefined;
  Player: {
    openPlaylist: () => void;
  };
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
