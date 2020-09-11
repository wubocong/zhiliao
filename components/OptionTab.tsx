import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { observer } from 'mobx-react';

import Device from '../constants/Device';
import useStores from '../hooks/useStores';

function OptionTab({
}: {
}) {
  const {
    globalStore: { navigation },
    playerStore:{currentSong}
  } = useStores();
  return (
    <Layout
      level="1"
      style={[styles.container, { paddingBottom: currentSong ? 85 : 0 }]}
    >
      <ScrollView>
        <Layout level="1">

        </Layout>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Device.window.height - 54, // 不设置height web无法滚动
  },
});

export default (observer(OptionTab));
