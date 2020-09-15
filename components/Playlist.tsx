import React from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { observer } from 'mobx-react';

import LoopAll from '../components/png/LoopAll';
import LoopOne from '../components/png/LoopOne';
import LoopRandom from '../components/png/LoopRandom';
import Layout from '../constants/Device';
import {
  LOOPING_TYPE_ALL,
  LOOPING_TYPE_ONE,
  LOOPING_TYPE_RANDOM,
} from '../constants/Player';
import useStores from '../hooks/useStores';
import withConfirm from '../hoc/withConfirm';
import Device from '../constants/Device';

function Playlist({
  confirm,
}: {
  confirm: ({
    callback,
    cancelButtonText,
    confirmButtonText,
    content,
    title,
  }: {
    callback: () => void;
    cancelButtonText?: string;
    confirmButtonText?: string;
    content: JSX.Element | string;
    title?: string;
  }) => void;
}) {
  const {
    playerStore: {
      clearPlaylist,
      currentSong,
      deleteSongfromPlaylist,
      playlist,
      setLoopingType,
      status: { loopingType },
      switchSong,
    },
  } = useStores();
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ marginBottom: 8, fontSize: 18 }}>
          当前播放({playlist.length})
        </Text>
        <View style={styles.actionBar}>
          <TouchableOpacity
            onPress={() => setLoopingType((loopingType + 1) % 3)}
          >
            <View
              style={[
                styles.row,
                {
                  display: loopingType === LOOPING_TYPE_ALL ? 'flex' : 'none',
                },
              ]}
            >
              <LoopAll style={styles.icon} />
              <Text>列表循环</Text>
            </View>
            <View
              style={[
                styles.row,
                {
                  display: loopingType === LOOPING_TYPE_ONE ? 'flex' : 'none',
                },
              ]}
            >
              <LoopOne style={styles.icon} />
              <Text>单曲循环</Text>
            </View>
            <View
              style={[
                styles.row,
                {
                  display:
                    loopingType === LOOPING_TYPE_RANDOM ? 'flex' : 'none',
                },
              ]}
            >
              <LoopRandom style={styles.icon} />
              <Text>随机播放</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.row}>
              <Feather
                name="folder-plus"
                style={{ marginRight: 4 }}
                size={16}
                color="black"
              />
              <Text>收藏全部</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              confirm({
                content: '确认清空播放列表吗？',
                confirmButtonText: '清空',
                callback: clearPlaylist,
              })
            }
          >
            <Feather name="trash-2" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{ maxHeight: Device.window.height - 212 }}>
        <View>
          {playlist.map((song) => (
            <TouchableOpacity
              style={styles.songItem}
              onPress={() => {
                if (currentSong?.id !== song.id) switchSong(song);
              }}
              key={song.id}
            >
              <Text
                style={styles.songText}
                status={currentSong?.id === song.id ? 'primary' : 'basic'}
              >
                {song.name}-
                {song.singers.reduce(
                  (str, singer, index) =>
                    `${str}${index === 0 ? '' : '&'}${singer.name}`,
                  ''
                )}
              </Text>
              <TouchableOpacity onPress={() => deleteSongfromPlaylist(song)}>
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
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
    padding: 20,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  songText: {
    overflow: 'hidden',
    width: 200,
    fontSize: 16,
  },
});
export default withConfirm(observer(Playlist));
