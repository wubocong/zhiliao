import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { ColorSchemeName } from 'react-native';
import { BackHandler } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PlayerScreen from '../screens/PlayerScreen';
import MusicbillScreen from '../screens/MusicbillScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList, MainStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import useLocalData from '../hooks/useLocalData';
import useStores from '../hooks/useStores';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  // 歌单数据本地缓存
  useLocalData();

  // 统一处理按返回键行为
  const {
    globalStore: { closeModalFunctionStack },
  } = useStores();
  useEffect(() => {
    function onHardwareBackPress() {
      const length = closeModalFunctionStack.length;
      if (length > 0) {
        closeModalFunctionStack[length - 1]();
        return true;
      }
      return false;
    }
    BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onHardwareBackPress);
    };
  }, [closeModalFunctionStack]);
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal

const MainStack = createStackNavigator<MainStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

function MainNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Login" component={LoginScreen} />
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Player" component={PlayerScreen} />
      <MainStack.Screen name="Musicbill" component={MusicbillScreen} />
    </MainStack.Navigator>
  );
}
function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }} mode="modal">
      <RootStack.Screen name="Main" component={MainNavigator} />
      <RootStack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
    </RootStack.Navigator>
  );
}
