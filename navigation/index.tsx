import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import PlayerScreen from '../screens/PlayerScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList,MainStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
    </MainStack.Navigator>
  )
}
function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }} mode="modal">
      <RootStack.Screen name="Main" component={MainNavigator} />
      <RootStack.Screen name="Player" component={PlayerScreen} />
      <RootStack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </RootStack.Navigator>
  );
}
