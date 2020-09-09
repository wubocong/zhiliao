import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';
import { observer } from 'mobx-react';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import useLocalData from './hooks/useLocalData';
import useStores from './hooks/useStores';

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  // 歌单数据本地缓存
  useLocalData();

  // 统一处理按返回键行为
  const {
    globalStore: { closeModalFunction,setCloseModalFunction },
  } = useStores();
  useEffect(() => {
    function onHardwareBackPress() {
      if (typeof closeModalFunction === 'function') {
        closeModalFunction();
        setCloseModalFunction(undefined);
        return true;
      }
      return false;
    }
    BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPress);
    };
  }, [closeModalFunction]);
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <RootSiblingParent>
          <ApplicationProvider {...eva} theme={eva.light}>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </ApplicationProvider>
        </RootSiblingParent>
      </SafeAreaProvider>
    );
  }
}
export default observer(App);
