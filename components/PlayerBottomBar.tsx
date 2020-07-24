import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from 'react-native';
import { Layout } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';

export default function PlayerBottomBar({
  image = require('../assets/images/default-music-logo.webp'),
  isPlaying,
  togglePlay,
  onPress,
}: {
  image: ImageSourcePropType;
  isPlaying: boolean;
  togglePlay: () => void;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress}>
      <Layout style={styles.container} level="2">
        <Image style={styles.cover} source={image} />
        <View style={styles.buttonWrapper}>
          <TouchableOpacity onPress={togglePlay}>
            <Feather
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={40}
            />
          </TouchableOpacity>
          <TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cover: {
    width: 80,
    height: 80,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
});
