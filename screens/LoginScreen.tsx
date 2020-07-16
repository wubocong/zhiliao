import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Layout, Input } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { Feather } from '@expo/vector-icons';

import { RootStackParamList } from '../types';

const emailRegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const captchaRegExp = /\d{6}/;

export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Login'>) {
  const [email, onChangeEmail] = useState('');
  const [captcha, onChangeCaptcha] = useState('');
  const [captchaCoolDown, setCaptchaCoolDown] = useState(true);
  const sendCaptcha = useCallback(async () => {
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
  }, [email]);
  const login = useCallback(async () => {
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
      await AsyncStorage.setItem('user_info', res.data);
      navigation.replace('Root');
    }
  }, [email, captcha]);
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
        onPress={() => {
          navigation.replace('Main');
        }}
      >
        进入主页
      </Button>
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
