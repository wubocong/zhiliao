
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Layout, Input } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { observer } from 'mobx-react';

import SongItem from './SongItem';
import { Song } from '../types';
import Device from '../constants/Device';
import zlFetch from '../utils/zlFetch';
import useStores from '../hooks/useStores';

function SearchTab({
  shouldHavePadding,
}: {
  shouldHavePadding: boolean;
}) {
  const [inputText, onChangeInputText] = useState('');
  const [songList, setSongList] = useState([]);
  const {
    globalStore: { navigation },
  } = useStores();
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
          {songList.map((song: Song) => (
            <SongItem key={song.id} song={song} />
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
    margin: 20,
    marginBottom: 5,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default observer(SearchTab);
