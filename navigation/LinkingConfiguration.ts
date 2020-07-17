import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Main: {
        screens: {
          Login: 'login',
          Home: 'home',
        },
      },
      Player: 'player',
      NotFound: '*',
    },
  },
};
