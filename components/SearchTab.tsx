import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Layout, Input, Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';

import SongItem from '../components/SongItem';
import { MainStackParamList, RootStackParamList } from '../types';
import { Song } from '../types';
import Device from '../constants/Layout';
import zlFetch from '../utils/zlFetch';

export default function SearchTab({
  addSongToPlaylistAndPlay,
  navigation,
  shouldHavePadding,
}: {
  addSongToPlaylistAndPlay: (song: Song) => void;
  navigation: StackNavigationProp<
    MainStackParamList & RootStackParamList,
    'Home'
  >;
  shouldHavePadding: boolean;
}) {
  const [inputText, onChangeInputText] = useState('');
  const [songList, setSongList] = useState([]);
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
  input: {
    width: '100%',
    marginTop: 5,
  },
});
