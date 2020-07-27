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

const DEVICE_HEIGHT = Dimensions.get('window').height;
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
          {musicList.map((music, index) => (
            <TouchableOpacity key={index} style={styles.musicItem}>
              <View style={styles.musicInfo}>
                <Text>{music.name}</Text>
                <View style={styles.singerWrapper}>
                  <Text style={styles.singer}>{music.singers[0].name}</Text>
                  {music.singers.slice(1).map((singer, index) => (
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
    height: DEVICE_HEIGHT - 54,
  },
  input: {
    width: '100%',
    marginTop: 5,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#c0c4cc',
    borderTopWidth: 1,
    height: 60,
    paddingLeft: 10,
    paddingRight: 10
  },
  musicInfo: {
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
