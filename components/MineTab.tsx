import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Layout, Text, Modal } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { observer } from 'mobx-react';

import NewMusicbill from '../components/NewMusicbill';
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
  const { musicbillStore } = useStores();
  const [addMusicbillModalvisible, setAddMusicbillModalvisible] = useState(
    false
  );
  const closeAddMusicbillModal = () => {
    setAddMusicbillModalvisible(false);
  };
  useEffect(() => {
    (async function () {
      try {
        const data = await zlFetch(
          'https://engine.mebtte.com/1/musicbill/list',
          {
            token: true,
          },
          navigation
        );
        musicbillStore.setMusicbillList(data);
      } catch (err) {
        Toast.show(err.message);
      }
    })();
  }, []);
  return (
    <Layout
      level="1"
      style={[styles.container, { paddingBottom: shouldHavePadding ? 85 : 0 }]}
    >
      <ScrollView>
        <Layout level="1">
          <View style={styles.musicbillHeader}>
            <Text style={{ fontSize: 18 }}>我创建的歌单</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.musicbillItem,
              {
                borderTopColor: '#c0c4cc',
                borderTopWidth: 1,
              },
            ]}
            onPress={() => {
              setAddMusicbillModalvisible(true);
            }}
          >
            <Feather name="plus-square" size={40} style={{ marginRight: 8 }} />
            <Text>新建歌单</Text>
          </TouchableOpacity>
          {musicbillStore.musicbillList.map((musicbill) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Musicbill', {
                  name: musicbill.name,
                  id: musicbill.id,
                  openPlaylist,
                });
              }}
              key={musicbill.id}
              style={styles.musicbillItem}
            >
              <Text>{musicbill.name}</Text>
            </TouchableOpacity>
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
    paddingLeft: 20,
    paddingRight: 20,
  },
  musicbillHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  musicbillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#c0c4cc',
    borderBottomWidth: 1,
    height: 60,
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
