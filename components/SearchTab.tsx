import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Layout, Input, Text, Modal } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';

import SongItem from './SongItem';
import MusicbillList from './MusicbillList';
import { MainStackParamList, RootStackParamList } from '../types';
import { Song } from '../types';
import MusicbillState from '../state/MusicbillState';
import Device from '../constants/Device';
import zlFetch from '../utils/zlFetch';
import { inject, observer } from 'mobx-react';

function SearchTab({
  addSongToPlaylistAndPlay,
  musicbill,
  navigation,
  shouldHavePadding,
}: {
  addSongToPlaylistAndPlay: (song: Song) => void;
  musicbill: MusicbillState;
  navigation: StackNavigationProp<
    MainStackParamList & RootStackParamList,
    'Home'
  >;
  shouldHavePadding: boolean;
}) {
  const [inputText, onChangeInputText] = useState('');
  const [songList, setSongList] = useState([]);
  const [addToMusicbillModalVisible, setAddToMusicbillModalVisible] = useState(
    false
  );
  const search = async () => {
    try {
      const data = await zlFetch(
        `https://engine.mebtte.com/1/music/list?key=keyword&value=${encodeURI(
          inputText
        )}`,
        {
          token: true,
        },
        navigation
      );
      setSongList(data);
    } catch (err) {
      Toast.show(err.message);
    }
  };
  const openAddToMusicbillModal = () => {
    setAddToMusicbillModalVisible(true);
  };
  const closeAddToMusicbillModal = () => {
    setAddToMusicbillModalVisible(true);
  };
  return (
    <Layout
      level="1"
      style={[styles.container, { paddingBottom: shouldHavePadding ? 85 : 0 }]}
    >
      <Input
        style={styles.input}
        placeholder="音乐"
        accessoryRight={() => (
          <TouchableOpacity onPress={search}>
            <Feather name="search" size={24} />
          </TouchableOpacity>
        )}
        onChangeText={onChangeInputText}
        value={inputText}
        onSubmitEditing={search}
        returnKeyType="search"
      />
      <ScrollView>
        <Layout level="1">
          {songList.map((song: Song, index) => (
            <SongItem
              key={song.id}
              song={song}
              addSongToPlaylistAndPlay={addSongToPlaylistAndPlay}
              openAddToMusicbillModal={openAddToMusicbillModal}
            />
          ))}
        </Layout>
      </ScrollView>
      <Modal
        visible={addToMusicbillModalVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={closeAddToMusicbillModal}
      >
        <MusicbillList
          musicbillList={musicbill.musicbillList}
          currentSongId={musicbill.operatingSong?.id}
          closeAddToMusicbillModal={closeAddToMusicbillModal}
        />
      </Modal>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Device.window.height - 54, // 不设置height web无法滚动
  },
  input: {
    width: '100%',
    marginTop: 5,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default inject('musicbill')(observer(SearchTab));
