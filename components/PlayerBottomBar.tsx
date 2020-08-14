import React, { SyntheticEvent } from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';

import { Song } from '../types';
export default function PlayerBottomBar({
  song,
  isPlaying,
  togglePlay,
  onPress,
  openPlaylist,
  style,
}: {
  song?: Song;
  isPlaying: boolean;
  togglePlay: () => void;
  onPress: (e: GestureResponderEvent) => void;
  openPlaylist: () => void;
  style?: ViewStyle;
}) {
  return (
    <TouchableOpacity style={[styles.wrapper, style]} onPress={onPress}>
      <Layout style={styles.container} level="2">
        <View style={styles.songWrapper}>
          <Image
            style={styles.cover}
            source={
              song
                ? { uri: song?.cover }
                : require('../assets/images/default-music-logo.webp')
            }
          />
          <View style={styles.songInfo}>
            <Text>{song?.name}</Text>
            <View style={styles.singerWrapper}>
              <Text style={styles.singer}>{song?.singers[0].name}</Text>
              {song?.singers.slice(1).map((singer, index) => (
                <Text style={styles.singer} key={index}>
                  {'&' + singer.name}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={{ padding: 8, paddingRight: 5 }}
            onPress={togglePlay}
          >
            <Feather
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={40}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 8, paddingLeft: 5 }}
            onPress={openPlaylist}
          >
            <Feather name="list" size={40} />
          </TouchableOpacity>
        </View>
      </Layout>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 10,
  },
  container: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  songWrapper: {
    flexDirection: 'row',
  },
  cover: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  songInfo: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  singerWrapper: {
    flexDirection: 'row',
  },
  singer: {
    fontSize: 12,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
});
