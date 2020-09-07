import React, { useState } from 'react';
import { Input, Button, Text, Layout } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import Toast from 'react-native-root-toast';

import Device from '../constants/Device';
import zlFetch from '../utils/zlFetch';
import useStores from '../hooks/useStores';

export default function NewMusicbill({ onCancel }: { onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const { musicbillStore } = useStores();
  const onSubmit = async () => {
    try {
      await zlFetch('https://engine.mebtte.com/1/musicbill', {
        token: true,
        body: JSON.stringify({
          name: title,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const musicbillList = await zlFetch(
        'https://engine.mebtte.com/1/musicbill/list',
        {
          token: true,
        }
      );
      musicbillStore.setMusicbillList(musicbillList);
      onCancel();
    } catch (err) {
      Toast.show(err.message);
    }
  };
  return (
    <Layout style={styles.container} level="1">
      <Text style={{ marginBottom: 8, fontSize: 18 }}>新建歌单</Text>
      <Input
        placeholder="请输入歌单标题"
        value={title}
        onChangeText={setTitle}
      />
      <View style={styles.buttons}>
        <Button appearance="ghost" onPress={onCancel}>
          取消
        </Button>
        <Button disabled={!title} appearance="ghost" onPress={onSubmit}>
          提交
        </Button>
      </View>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    width: Device.window.width - 40,
    padding: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
