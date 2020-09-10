import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Layout, Text, Modal } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { observer } from 'mobx-react';

import MusicbillItem from './MusicbillItem';
import Device from '../constants/Device';
import useStores from '../hooks/useStores';
import withNewMusicbillModal from '../hoc/withNewMusicbillModal';

function MineTab({
  openNewMusicbillModal,
  shouldHavePadding,
}: {
  openNewMusicbillModal: () => void;
  shouldHavePadding: boolean;
}) {
  const {
    musicbillStore: { musicbillList, loadAllMusicbillDetail },
    globalStore: { navigation },
  } = useStores();
  useEffect(() => {
    loadAllMusicbillDetail();
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
            <TouchableOpacity onPress={loadAllMusicbillDetail}>
              <Feather name="refresh-cw" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.newMusicbill}
            onPress={openNewMusicbillModal}
          >
            <Feather name="plus-square" size={40} style={{ marginRight: 8 }} />
            <Text>新建歌单</Text>
          </TouchableOpacity>
          {musicbillList.map((musicbill) => (
            <MusicbillItem
              key={musicbill.id}
              musicbill={musicbill}
              onPress={() => {
                navigation!.navigate('Musicbill', {
                  name: musicbill.name,
                  id: musicbill.id,
                });
              }}
              showMoreButton
            />
          ))}
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
});

export default withNewMusicbillModal(observer(MineTab));
