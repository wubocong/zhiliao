import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import * as Updates from 'expo-updates';

import Device from '../constants/Device';
import useStores from '../hooks/useStores';
import withConfirm from '../hoc/withConfirm';

function OptionTab({
  confirm,
}: {
  confirm: (params: {
    callback: () => void;
    cancelButtonText?: string;
    confirmButtonText?: string;
    content: JSX.Element | string;
    title?: string;
  }) => void;
}) {
  const {
    globalStore: { navigation },
    playerStore: { currentSong },
  } = useStores();
  return (
    <Layout level="1" style={styles.container}>
      <ScrollView
        style={{
          paddingBottom: currentSong ? 85 : 0,
          height: Device.window.height - 55,
        }}
      >
        <TouchableOpacity onPress={() => {}}>
          <Text>检查更新</Text>
        </TouchableOpacity>
        <Layout level="1"></Layout>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withConfirm(observer(OptionTab));
