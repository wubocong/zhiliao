import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Layout,
  Autocomplete,
  AutocompleteItem,
  Text,
} from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';

export default function SearchTab() {
  const [inputText, onChangeInputText] = useState('');
  const [musicList, setMusicList] = useState([]);
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
    if (res.code === 0) setMusicList(res.data);
  };
  return (
    <Layout level="1" style={styles.container}>
      <Autocomplete
        style={{ width: '100%' }}
        placeholder="音乐"
        accessoryRight={() => (
          <TouchableOpacity onPress={search}>
            <Feather name="search" />
          </TouchableOpacity>
        )}
        onChangeText={onChangeInputText}
        value={inputText}
      >
        <AutocompleteItem onPress={search} title={`搜索 “${inputText}”`} />
      </Autocomplete>
      {musicList.map((music) => (
        <TouchableOpacity>
          <Layout style={styles.musicItem} level="2">
            <View style={styles.musicInfo}>
              <Text>{music.name}</Text>
              {music.singers.map((singer) => (
                <Text>{singer.name + '&'}</Text>
              ))}
            </View>
          </Layout>
        </TouchableOpacity>
      ))}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicInfo: {
    justifyContent: 'space-between',
  },
});
