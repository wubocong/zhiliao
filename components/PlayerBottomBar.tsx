import React from 'react';
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
import { observer } from 'mobx-react';

import useStores from '../hooks/useStores';
import withPlaylistModal from '../hoc/withPlaylistModal';

function PlayerBottomBar({
  onPress,
  openPlaylistModal,
  style,
}: {
  onPress: (e: GestureResponderEvent) => void;
  openPlaylistModal: () => void;
  style?: ViewStyle;
}) {
  const {
    playerStore: {
      currentSong,
      togglePlay,
      status: { isPlaying },
    },
  } = useStores();

  return currentSong ? (
    <TouchableOpacity style={[styles.wrapper, style]} onPress={onPress}>
      <Layout style={styles.container} level="2">
        <View style={styles.songWrapper}>
          <Image style={styles.cover} source={{ uri: currentSong.cover }} />
          <View style={styles.songInfo}>
            <Text>{currentSong.name}</Text>
            <View style={styles.singerWrapper}>
              <Text style={styles.singer}>{currentSong.singers[0].name}</Text>
              {currentSong.singers.slice(1).map((singer, index) => (
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
            onPress={openPlaylistModal}
          >
            <Feather name="list" size={40} />
          </TouchableOpacity>
        </View>
      </Layout>
    </TouchableOpacity>
  ) : null;
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

export default withPlaylistModal(observer(PlayerBottomBar));
