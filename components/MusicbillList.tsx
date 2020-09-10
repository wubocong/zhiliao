import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@ui-kitten/components';
import { observer } from 'mobx-react';
import { Feather } from '@expo/vector-icons';

import MusicbillItem from './MusicbillItem';
import Layout from '../constants/Device';
import useStores from '../hooks/useStores';
import withNewMusicbillModal from '../hoc/withNewMusicbillModal';
import { Song } from '../types';

function MusicbillList({
  openNewMusicbillModal,
  operatingSong,
  closeAddToMusicbillModal,
}: {
  openNewMusicbillModal: () => void;
  operatingSong: Song;
  closeAddToMusicbillModal: () => void;
}) {
  const {
    musicbillStore: { addSongToMusicbill, musicbillList },
  } = useStores();
  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>收藏到歌单</Text>
      <ScrollView>
        <View>
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
              onPress={() =>
                addSongToMusicbill(
                  operatingSong,
                  musicbill.id,
                  closeAddToMusicbillModal
                )
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: Layout.window.width - 40,
  },
  modalTitle: {
    padding: 20,
    fontSize: 18,
  },
  newMusicbill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingLeft: 20,
    paddingRight: 20,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default withNewMusicbillModal(observer(MusicbillList));
