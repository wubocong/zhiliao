import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Layout, Input } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { Feather } from '@expo/vector-icons';

import { MainStackParamList } from '../types';

const emailRegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const captchaRegExp = /\d{6}/;

export default function LoginScreen({
  navigation,
}: StackScreenProps<MainStackParamList, 'Login'>) {
  const [email, onChangeEmail] = useState('');
  const [captcha, onChangeCaptcha] = useState('');
  const [captchaCoolDown, setCaptchaCoolDown] = useState(true);
  const [token, setToken] = useState('');
  const sendCaptcha = async () => {
    const res = await fetch(
      `https://engine.mebtte.com/1/verify_code?type=signin&email=${email}`
    ).then((res) => res.json());
    if (res.code !== 0) Toast.show(res.message);
    else {
      Toast.show('验证码已发送');
      setCaptchaCoolDown(false);
      setTimeout(() => {
        setCaptchaCoolDown(true);
      }, 60 * 1000);
    }
  };
  const login = async () => {
    const res = await fetch('https://engine.mebtte.com/1/user/signin', {
      body: JSON.stringify({
        email,
        verify_code: captcha,
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
    }).then((res) => res.json());
    if (res.code !== 0) Toast.show(res.message);
    else {
      Toast.show('登录成功');
      await AsyncStorage.setItem('user_info', JSON.stringify(res.data));
      navigation.replace('Home');
    }
  };
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
          if (token)
            await AsyncStorage.setItem('user_info', JSON.stringify({ token }));
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
