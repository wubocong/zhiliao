import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';

import Layout from '../constants/Layout';
import { Song } from '../types';

export default function Playlist({
  currentSong,
  playlist,
  deleteSongfromPlaylist,
  playSongInPlaylist,
}: {
  currentSong?: Song;
  playlist: Song[];
  deleteSongfromPlaylist: (song: Song) => void;
  playSongInPlaylist: (song: Song) => void;
}) {
  return (
    <View style={styles.container}>
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
              <TouchableOpacity>
                <Feather
                  name="trash-2"
                  size={24}
                  color="black"
                  onPress={() => deleteSongfromPlaylist(song)}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff' },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Layout.window.width - 40,
    padding: 20,
  },
  songText: {
    overflow: 'hidden',
    width: 200,
    fontSize: 20,
  },
});
