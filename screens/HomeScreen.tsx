import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, GestureResponderEvent, BackHandler } from 'react-native';
import { Tab, TabView, Modal, Text } from '@ui-kitten/components';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { inject, observer } from 'mobx-react';

import PlayerBottomBar from '../components/PlayerBottomBar';
import SearchTab from '../components/SearchTab';
import Playlist from '../components/Playlist';
import { MainStackParamList, RootStackParamList, Song } from '../types';
import PlayerState from '../state/PlayerState';

type State = {
  playlistVisible: boolean;
  selectedIndex: number;
};
@inject('player')
@observer
export default class HomeScreen extends React.Component<
  StackScreenProps<MainStackParamList & RootStackParamList, 'Home'> & {
    player: PlayerState;
  },
  State
> {
  constructor(
    props: StackScreenProps<MainStackParamList & RootStackParamList, 'Home'> & {
      player: PlayerState;
    }
  ) {
    super(props);
    this.state = {
      playlistVisible: false,
      selectedIndex: 0,
    };
  }
  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
    BackHandler.addEventListener('hardwareBackPress', this._onBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._onBackPress);
  }
  _closePlaylist = () => {
    this.setState({ playlistVisible: false });
  };
  _onBackPress = () => {
    if (this.state.playlistVisible) {
      this.setState({ playlistVisible: false });
      return true;
    }
    return false;
  };
  _openPlayer = (e: GestureResponderEvent) => {
    e.preventDefault(); // 防止web端点击穿透
    if (this.props.player.currentSong)
      this.props.navigation.navigate('Player', {
        openPlaylist: this._openPlaylist,
      });
  };
  _openPlaylist = () => {
    this.setState({ playlistVisible: true });
  };

  _setSelectedIndex = (selectedIndex: number) => {
    this.setState({ selectedIndex });
  };
  render() {
    const {
      addSongToPlaylistAndPlay,
      currentSong,
      deleteSongfromPlaylist,
      playlist,
      setLoopingType,
      status: { isPlaying, loopingType },
      switchSong,
      togglePlay,
    } = this.props.player;
    const { playlistVisible, selectedIndex } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <TabView
          style={{ flex: 1 }}
          selectedIndex={selectedIndex}
          onSelect={this._setSelectedIndex}
        >
          <Tab title="我的">
            <Text>1</Text>
          </Tab>
          <Tab title="发现">
            <SearchTab
              addSongToPlaylistAndPlay={addSongToPlaylistAndPlay}
              shouldHavePadding={playlist.length !== 0}
            />
          </Tab>
        </TabView>
        <PlayerBottomBar
          style={{ display: playlist.length === 0 ? 'none' : 'flex' }}
          song={currentSong}
          onPress={this._openPlayer}
          togglePlay={togglePlay}
          openPlaylist={this._openPlaylist}
          isPlaying={isPlaying}
        />
        <Modal
          visible={playlistVisible}
          backdropStyle={styles.playlistBackdrop}
          onBackdropPress={this._closePlaylist}
        >
          <Playlist
            currentSong={currentSong}
            deleteSongfromPlaylist={deleteSongfromPlaylist}
            loopingType={loopingType}
            playlist={playlist}
            playSongInPlaylist={switchSong}
            setLoopingType={setLoopingType}
          />
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  playlistBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
