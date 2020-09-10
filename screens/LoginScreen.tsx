import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Layout, Input } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { Feather } from '@expo/vector-icons';

import { MainStackParamList, RootStackParamList, Musicbill } from '../types';
import zlFetch from '../utils/zlFetch';
import useStores from '../hooks/useStores';

const emailRegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const captchaRegExp = /\d{6}/;

export default function LoginScreen({
  navigation,
}: StackScreenProps<MainStackParamList & RootStackParamList, 'Login'>) {
  const [email, onChangeEmail] = useState('');
  const [captcha, onChangeCaptcha] = useState('');
  const [captchaCoolDown, setCaptchaCoolDown] = useState(true);
  const [token, setToken] = useState('');
  const {
    musicbillStore: { loadAllMusicbillDetail },
    globalStore: { setNavigation },
  } = useStores();
  useEffect(() => {
    setNavigation(navigation);
  }, []);
  const sendCaptcha = async () => {
    try {
      await zlFetch(
        `https://engine.mebtte.com/1/verify_code?type=signin&email=${email}`
      );
      Toast.show('验证码已发送');
      setCaptchaCoolDown(false);
      setTimeout(() => {
        setCaptchaCoolDown(true);
      }, 60 * 1000);
    } catch (err) {
      Toast.show(err.message);
    }
  };
  const login = async () => {
    try {
      const data = await zlFetch(
        'https://engine.mebtte.com/1/user/signin',
        {
          body: JSON.stringify({
            email,
            verify_code: captcha,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        }
      );
      Toast.show('登录成功');
      await Promise.all([
        loadAllMusicbillDetail(data.token),
        AsyncStorage.setItem('user_info', JSON.stringify(data)),
        AsyncStorage.setItem('token', data.token),
      ]);
      navigation.replace('Home');
    } catch (err) {
      Toast.show(err.message);
    }
  };
  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      if (token) navigation.replace('Home');
    });
  }, []);
  return (
    <Layout style={styles.container} level="1">
      <Input
        style={{ width: '100%' }}
        placeholder="邮箱"
        accessoryLeft={() => <Feather name="mail" />}
        onChangeText={onChangeEmail}
        value={email}
      />
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <Input
          style={{ width: '60%' }}
          placeholder="验证码"
          accessoryLeft={() => <Feather name="key" />}
          maxLength={6}
          onChangeText={onChangeCaptcha}
          value={captcha}
        />
        <Button
          style={[{ width: '40%' }]}
          disabled={!emailRegExp.test(email) || !captchaCoolDown}
          onPress={sendCaptcha}
        >
          {captchaCoolDown ? '发送验证码' : '等待60秒'}
        </Button>
      </View>
      <Button
        style={[{ width: '100%' }]}
        disabled={!emailRegExp.test(email) || !captchaRegExp.test(captcha)}
        onPress={login}
      >
        登录
      </Button>
      <Button
        style={[{ width: '100%' }]}
        onPress={async () => {
          if (token) await AsyncStorage.setItem('token', token);
          navigation.replace('Home');
        }}
      >
        进入主页
      </Button>
      <Input onChangeText={setToken} value={token}></Input>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#31c27c',
  },
});
