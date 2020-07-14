import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';

import { RootStackParamList } from '../types';

const emailRegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const captchaRegExp = /\d{6}/;

export default function LoginScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Login'>) {
  const [email, onChangeEmail] = useState('');
  const [captcha, onChangeCaptcha] = useState('');
  const [captchaCoolDown, setCaptchaCoolDown] = useState(true);
  return (
    <View style={styles.container}>
      <Input
        placeholder="邮箱"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        onChangeText={onChangeEmail}
        value={email}
      />
      <View style={{ width: '100%', flexDirection: 'row' }}>
        <Input
          inputStyle={{ width: '100%' }}
          containerStyle={{ width: '60%' }}
          placeholder="验证码"
          leftIcon={{ type: 'font-awesome', name: 'key' }}
          maxLength={6}
          onChangeText={onChangeCaptcha}
          value={captcha}
        />
        <Button
          title={captchaCoolDown ? '发送验证码' : '等待60秒'}
          containerStyle={{ width: '40%' }}
          buttonStyle={styles.button}
          disabled={!emailRegExp.test(email) || !captchaCoolDown}
          onPress={async () => {
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
          }}
        ></Button>
      </View>
      <Button
        title="登录"
        containerStyle={{ width: '100%' }}
        buttonStyle={styles.button}
        disabled={!emailRegExp.test(email) || !captchaRegExp.test(captcha)}
        onPress={async () => {
          const res = await fetch('https://engine.mebtte.com/1/user/signin', {
            body: JSON.stringify({
              email,
              verify_code: captcha,
            }),
            headers: {
              'content-type': 'application/json',
            },
            method: 'POST'
          }).then((res) => res.json());
          if (res.code !== 0) Toast.show(res.message);
          else {
            Toast.show('登录成功');
            await AsyncStorage.setItem('user_info', res.data);
            navigation.replace('Root');
          }
        }}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#31c27c',
  },
});
