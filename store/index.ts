import React from 'react';

import MusicbillStore from './MusicbillStore';
import PlayerStore from './PlayerStore';

const storesContext = React.createContext({
  musicbillStore: new MusicbillStore(),
  playerStore: new PlayerStore(),
});

export default storesContext;
