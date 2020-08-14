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

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOOPING_TYPE_RANDOM = 2;

type State = {
  playlistVisible: boolean;
  selectedIndex: number;

  playerInstancePosition?: number;
  playerInstanceDuration?: number;
  shouldPlay: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  rate: number;
  isMuted: boolean;
  volume: number;
  loopingType: number;
  shouldCorrectPitch: boolean;
};
@inject('player')
@observer
export default class HomeScreen extends React.Component<
  StackScreenProps<MainStackParamList & RootStackParamList, 'Home'> & {
    player: PlayerState;
  },
  State
> {
  playerInstance: Audio.Sound | null;
  constructor(
    props: StackScreenProps<MainStackParamList & RootStackParamList, 'Home'> & {
      player: PlayerState;
    }
  ) {
    super(props);
    this.playerInstance = null;
    this.state = {
      playlistVisible: false,
      selectedIndex: 0,

      playerInstancePosition: undefined,
      playerInstanceDuration: undefined,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      rate: 1.0,
      isMuted: false,
      volume: 1.0,
      loopingType: LOOPING_TYPE_ALL,
      shouldCorrectPitch: true,
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
  _addSongToPlaylistAndPlay = (song: Song) => {
    const { playlist, setPlaylist } = this.props.player;
    if (!playlist.find((item) => item.id === song.id)) {
      playlist.push(song);
      setPlaylist(playlist);
    }
    this._switchSong(song);
  };
  _closePlaylist = () => {
    this.setState({ playlistVisible: false });
  };
  _deleteSongfromPlaylist = (song: Song) => {
    const {
      playlist,
      currentSong,
      setPlaylist,
      setCurrentSong,
    } = this.props.player;
    if (song.id === currentSong?.id) {
      if (playlist.length === 1) setCurrentSong(undefined);
      else {
        const nextSongIndex =
          (playlist.findIndex((item) => item.id === song.id) + 1) %
          playlist.length;
        this._switchSong(playlist[nextSongIndex]);
      }
    }
    setPlaylist(playlist.filter((item) => item.id !== song.id));
  };
  _loadSong = async (uri: string) => {
    if (this.playerInstance) {
      await this.playerInstance.unloadAsync();
      this.playerInstance = null;
    }
    const initialStatus = {
      shouldPlay: true,
      rate: this.state.rate,
      isMuted: this.state.isMuted,
      volume: this.state.volume,
      isLooping: this.state.loopingType === LOOPING_TYPE_ONE,
      shouldCorrectPitch: this.state.shouldCorrectPitch,
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      initialStatus,
      this._onPlayerStatusUpdate
    );
    this.playerInstance = sound;
  };
  _onBackPress = () => {
    if (this.state.playlistVisible) {
      this.setState({ playlistVisible: false });
      return true;
    }
    return false;
  };
  _onPlayerStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const newState = {
        playerInstancePosition: status.positionMillis,
        playerInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        isMuted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
      };
      if (status.isLooping)
        Object.assign(newState, { loopingType: LOOPING_TYPE_ONE });
      this.setState(newState);
      this.props.player.setStatus(newState);
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };
  _openPlayer = (e: GestureResponderEvent) => {
    e.preventDefault(); // 防止web端点击穿透
    if (this.props.player.currentSong)
      this.props.navigation.navigate('Player', {
        setLoopingType: this._setLoopingType,
        setPosition: this._setPosition,
        togglePlay: this._togglePlay,
      });
  };
  _openPlaylist = () => {
    this.setState({ playlistVisible: true });
  };
  _setLoopingType = async (loopingType: number) => {
    if (this.state.loopingType !== loopingType) {
      if (this.state.loopingType === LOOPING_TYPE_ONE)
        await this.playerInstance?.setIsLoopingAsync(false);
      else if (loopingType === LOOPING_TYPE_ONE)
        await this.playerInstance?.setIsLoopingAsync(true);
      this.setState({ loopingType });
      this.props.player.setStatus({ loopingType });
    }
  };

  _setSelectedIndex = (selectedIndex: number) => {
    this.setState({ selectedIndex });
  };
  _setPosition = (value: number) => {
    if (this.state.playerInstanceDuration)
      this.playerInstance?.setPositionAsync(
        Math.round(value * this.state.playerInstanceDuration)
      );
  };
  _switchSong = (song: Song) => {
    this.props.player.setCurrentSong(song);
    this._loadSong(song.normal);
  };
  _togglePlay = () => {
    if (!this.playerInstance) {
      if (this.props.player.currentSong)
        this._loadSong(this.props.player.currentSong.normal);
    } else {
      if (this.state.isPlaying) {
        this.playerInstance.pauseAsync();
      } else {
        this.playerInstance.playAsync();
      }
    }
  };
  render() {
    const { currentSong, playlist } = this.props.player;
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
              addSongToPlaylistAndPlay={this._addSongToPlaylistAndPlay}
            />
          </Tab>
        </TabView>
        <PlayerBottomBar
          style={{ display: playlist.length === 0 ? 'none' : 'flex' }}
          song={currentSong}
          onPress={this._openPlayer}
          togglePlay={this._togglePlay}
          openPlaylist={this._openPlaylist}
          isPlaying={this.state.isPlaying}
        />
        <Modal
          visible={playlistVisible}
          backdropStyle={styles.playlistBackdrop}
          onBackdropPress={this._closePlaylist}
        >
          <Playlist
            currentSong={currentSong}
            playlist={playlist}
            playSongInPlaylist={this._switchSong}
            deleteSongfromPlaylist={this._deleteSongfromPlaylist}
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
