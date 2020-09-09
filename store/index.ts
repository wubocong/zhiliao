import React from 'react';

import GlobalStore from './GlobalStore';
import MusicbillStore from './MusicbillStore';
import PlayerStore from './PlayerStore';

const storesContext = React.createContext({
  globalStore: new GlobalStore(),
  musicbillStore: new MusicbillStore(),
  playerStore: new PlayerStore(),
});

export default storesContext;
