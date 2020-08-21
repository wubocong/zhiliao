import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Layout from '../constants/Layout';
import { Song } from '../types';
import {
  LOOPING_TYPE_ALL,
  LOOPING_TYPE_ONE,
  LOOPING_TYPE_RANDOM,
} from '../constants/Player';

export default function Playlist({
  currentSong,
  deleteSongfromPlaylist,
  loopingType,
  playlist,
  playSongInPlaylist,
  setLoopingType,
}: {
  currentSong?: Song;
  deleteSongfromPlaylist: (song: Song) => void;
  loopingType: number;
  playlist: Song[];
  playSongInPlaylist: (song: Song) => void;
  setLoopingType: (loopingType: number) => void;
}) {
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
              <Entypo name="loop" size={16} />
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
              <MaterialCommunityIcons
                name="numeric-1-circle-outline"
                size={16}
              />
              <Text>列表循环</Text>
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
              <FontAwesome name="random" size={16} />
              <Text>列表循环</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.row}>
              <Feather name="folder-plus" size={16} color="black" />
              <Text>收藏全部</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="trash-2" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View>
          {playlist.map((song) => (
            <TouchableOpacity
              style={styles.songItem}
              onPress={() => playSongInPlaylist(song)}
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
                <Entypo name="cross" size={24} color="black" />
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
