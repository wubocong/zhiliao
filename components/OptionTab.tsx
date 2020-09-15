import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { observer } from 'mobx-react';
import * as Updates from 'expo-updates';
import { brand } from 'expo-device';

import Device from '../constants/Device';
import useStores from '../hooks/useStores';
import withConfirm from '../hoc/withConfirm';
import Toast from 'react-native-root-toast';

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
        {brand && (
          <TouchableOpacity
            style={styles.item}
            onPress={async () => {
              const { isAvailable } = await Updates.checkForUpdateAsync();
              if (isAvailable) {
                confirm({
                  confirmButtonText: '更新',
                  callback: async () => {
                    const { isNew } = await Updates.fetchUpdateAsync();
                    if (isNew) await Updates.reloadAsync();
                  },
                  content: '是否更新？',
                });
              } else Toast.show('已是最新版本');
            }}
          >
            <Text>检查更新</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
  },
});

export default withConfirm(observer(OptionTab));
