import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';

export default function PlayerBottomBar({
  isPlaying,
  togglePlay,
  onPress,
}: {
  isPlaying: boolean;
  togglePlay: () => void;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <Layout style={styles.container} level="2">
        <Image
          style={styles.cover}
          source={{
            uri:
              'https://p2.music.126.net/_UUwBC98AF4ViM5UsO3wlw==/5736152162190997.jpg?param=200y200',
          }}
        />
        <TouchableOpacity onPress={togglePlay}>
          <Feather
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={40}
          />
        </TouchableOpacity>
      </Layout>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper:{
    width: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cover: {
    width: 80,
    height: 80,
  },
});
