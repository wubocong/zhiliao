import React, { useState } from 'react';
import { Input, Button, Text, Layout } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';

import Device from '../constants/Device';
import zlFetch from '../utils/zlFetch';
import useStores from '../hooks/useStores';

export default function NewMusicbill({
  closeNewMusicbillModal,
}: {
  closeNewMusicbillModal: () => void;
}) {
  const [title, setTitle] = useState('');
  const {
    musicbillStore: { loadAllMusicbillDetail },
  } = useStores();
  const onSubmit = async () => {
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
    await loadAllMusicbillDetail();
    closeNewMusicbillModal();
  };
  return (
    <Layout style={styles.container} level="1">
      <Text style={styles.modalTitle}>新建歌单</Text>
      <Input
        placeholder="请输入歌单标题"
        value={title}
        onChangeText={setTitle}
      />
      <View style={styles.buttons}>
        <Button appearance="ghost" onPress={closeNewMusicbillModal}>
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
  modalTitle: {
    padding: 20,
    fontSize: 18,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
