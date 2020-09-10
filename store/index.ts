import React from 'react';

import GlobalStore from './GlobalStore';
import MusicbillStore from './MusicbillStore';
import PlayerStore from './PlayerStore';

const globalStore = new GlobalStore();
const storesContext = React.createContext({
  globalStore,
  musicbillStore: new MusicbillStore(globalStore),
  playerStore: new PlayerStore(),
});

export default storesContext;
