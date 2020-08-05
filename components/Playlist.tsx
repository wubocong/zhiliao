import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';

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
            >
              <Text
                style={styles.songText}
                status={currentSong?.id === song.id ? 'primary' : 'basic'}
              >
                {song.name} -
                {song.singers.reduce(
                  (str, singer) => `${str}&${singer.name}`,
                  song.singers[0].name
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
  container: {
    margin: 20,
  },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  songText: {
    overflow: 'hidden',
    width: 200,
  },
});
