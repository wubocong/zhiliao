import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';

export default function BottomBar({
  isPlaying,
  togglePlay,
}: {
  isPlaying: boolean;
  togglePlay: () => void;
}) {
  return (
    <Layout style={styles.container} level="2">
      <Image
        style={styles.cover}
        source={{
          uri:
            'https://p2.music.126.net/_UUwBC98AF4ViM5UsO3wlw==/5736152162190997.jpg?param=200y200',
        }}
      />
      <TouchableOpacity onPress={togglePlay}>
        <Feather name={isPlaying ? 'pause-circle' : 'play-circle'} />
      </TouchableOpacity>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'space-between',
    left: 0,
    bottom: 0,
  },
  cover: {
    width: 80,
    height: 80,
  },
});
