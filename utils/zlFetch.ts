import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { MainStackParamList, RootStackParamList } from '../types';
export default async function (
  url: string,
  options?: RequestInit & { token?: boolean | string },
  navigation?: StackNavigationProp<
    MainStackParamList & RootStackParamList,
    'Home' | 'Login' | 'Main' | 'Musicbill' | 'Player' | 'NotFound'
  >
) {
  const optionsLocal = Object.assign({}, options);
  if (optionsLocal.token) {
    const token =
      optionsLocal.token === true
        ? await AsyncStorage.getItem('token')
        : optionsLocal.token;
    if (token) {
      if (typeof optionsLocal.headers === 'object')
        Object.assign(optionsLocal.headers, { Authorization: token });
      else optionsLocal.headers = { Authorization: token };
    } else {
      navigation && navigation.replace('Login');
      throw new Error('未登录');
    }
    delete optionsLocal.token;
  }

  const json = await fetch(url, optionsLocal).then((res) => res.json());
  if (json.code === 0) return json.data;
  else {
    if (json.code === 100004) {
      await AsyncStorage.removeItem('token');
      navigation && navigation.replace('Login');
    }
    throw new Error(json.message);
  }
}
