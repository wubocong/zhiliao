import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Layout, Text, Modal } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { observer } from 'mobx-react';

import NewMusicbill from './NewMusicbill';
import MusicbillItem from './MusicbillItem';
import { MainStackParamList, RootStackParamList } from '../types';
import Device from '../constants/Device';
import zlFetch from '../utils/zlFetch';
import useStores from '../hooks/useStores';

function MineTab({
  navigation,
  openPlaylist,
  shouldHavePadding,
}: {
  navigation: StackNavigationProp<
    MainStackParamList & RootStackParamList,
    'Home'
  >;
  openPlaylist: () => void;
  shouldHavePadding: boolean;
}) {
  const {
    musicbillStore: { musicbillList, loadAllMusicbillDetail },
  } = useStores();
  const [addMusicbillModalvisible, setAddMusicbillModalvisible] = useState(
    false
  );
  const closeAddMusicbillModal = () => {
    setAddMusicbillModalvisible(false);
  };
  return (
    <Layout
      level="1"
      style={[styles.container, { paddingBottom: shouldHavePadding ? 85 : 0 }]}
    >
      <ScrollView>
        <Layout level="1">
          <View style={styles.musicbillHeader}>
            <Text style={{ fontSize: 18 }}>我创建的歌单</Text>
            <TouchableOpacity onPress={loadAllMusicbillDetail}>
              <Feather name="refresh-cw" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.newMusicbill}
            onPress={() => {
              setAddMusicbillModalvisible(true);
            }}
          >
            <Feather name="plus-square" size={40} style={{ marginRight: 8 }} />
            <Text>新建歌单</Text>
          </TouchableOpacity>
          {musicbillList.map((musicbill) => (
            <MusicbillItem
              key={musicbill.id}
              musicbill={musicbill}
              onPress={() => {
                navigation.navigate('Musicbill', {
                  name: musicbill.name,
                  id: musicbill.id,
                  openPlaylist,
                });
              }}
              showMoreButton
            />
          ))}
        </Layout>
      </ScrollView>
      <Modal
        visible={addMusicbillModalvisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={closeAddMusicbillModal}
      >
        <NewMusicbill onCancel={closeAddMusicbillModal} />
      </Modal>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Device.window.height - 54, // 不设置height web无法滚动
  },
  musicbillHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  newMusicbill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  songInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  singerWrapper: {
    flexDirection: 'row',
  },
  singer: {
    fontSize: 12,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default observer(MineTab);
