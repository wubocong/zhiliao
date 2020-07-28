import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Layout, Input, Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-root-toast';

import { Song } from '../types';

const DEVICE_HEIGHT = Dimensions.get('window').height;
export default function SearchTab({
  switchSong,
}: {
  switchSong: (song: Song) => void;
}) {
  const [inputText, onChangeInputText] = useState('');
  const [songList, setSongList] = useState([]);
  const search = async () => {
    const token = JSON.parse(
      (await AsyncStorage.getItem('user_info')) as string
    ).token;
    const res = await fetch(
      `https://engine.mebtte.com/1/music/list?key=keyword&value=${encodeURI(
        inputText
      )}`,
      { headers: { Authorization: token } }
    ).then((res) => res.json());
    if (res.code === 0) setSongList(res.data);
    else Toast.show(res.message);
  };
  return (
    <Layout level="1" style={styles.container}>
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
        <Layout
          style={{
            marginBottom: 80,
          }}
          level="1"
        >
          {songList.map((song: Song, index) => (
            <TouchableOpacity
              key={index}
              style={styles.songItem}
              onPress={(e) => {
                e.preventDefault(); // 处理 react-native-web bug
                switchSong(song);
              }}
            >
              <View style={styles.songInfo}>
                <Text>{song.name}</Text>
                <View style={styles.singerWrapper}>
                  <Text style={styles.singer}>{song.singers[0].name}</Text>
                  {song.singers.slice(1).map((singer, index) => (
                    <Text style={styles.singer} key={index}>
                      {'&' + singer.name}
                    </Text>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Layout>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: DEVICE_HEIGHT - 54, // 不设置height web无法滚动
  },
  input: {
    width: '100%',
    marginTop: 5,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#c0c4cc',
    borderTopWidth: 1,
    height: 60,
    paddingLeft: 10,
    paddingRight: 10,
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
