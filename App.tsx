import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { Provider } from 'mobx-react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import PlayerState from './state/PlayerState';
import MusicbillState from './state/MusicbillState';

const player = new PlayerState();
const musicbill = new MusicbillState();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider player={player} musicbill={musicbill}>
          <RootSiblingParent>
            <ApplicationProvider {...eva} theme={eva.light}>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </ApplicationProvider>
          </RootSiblingParent>
        </Provider>
      </SafeAreaProvider>
    );
  }
}
