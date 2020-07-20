import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { Provider } from 'mobx-react';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import PlayerState from './state/PlayerState';

const player = new PlayerState();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <RootSiblingParent>
          <Provider player={player}>
            <ApplicationProvider {...eva} theme={eva.light}>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </ApplicationProvider>
          </Provider>
        </RootSiblingParent>
      </SafeAreaProvider>
    );
  }
}
