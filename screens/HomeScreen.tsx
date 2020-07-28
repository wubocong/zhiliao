import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Tab, TabView, Layout, Text } from '@ui-kitten/components';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { inject, observer } from 'mobx-react';

import PlayerBottomBar from '../components/PlayerBottomBar';
import SearchTab from '../components/SearchTab';
import { MainStackParamList, RootStackParamList, Song } from '../types';
import PlayerState from '../state/PlayerState';

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOOPING_TYPE_RANDOM = 2;

type State = {
  currentSong?: Song;
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
      currentSong: undefined,
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
  }

  _loadSong = async (
    uri: string = 'http://freetyst.nf.migu.cn/public/product5th/product34/2019/05/3020/2019%E5%B9%B405%E6%9C%8828%E6%97%A511%E7%82%B947%E5%88%86%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E6%AD%A3%E4%B8%9C64%E9%A6%96746986/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/flac/6005661WKJ2.flac?key=6d2e761987a70098&Tim=1594635486410&channelid=00&msisdn=e21a34e0ebf342cab5123990876387db&CI=6005661WKJ22600913000003988109&F=011002'
  ) => {
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
  _openPlayer = () => {
    this.props.navigation.navigate('Player', {
      setLoopingType: this._setLoopingType,
      togglePlay: this._togglePlay,
    });
  };
  _setSelectedIndex = (selectedIndex: number) => {
    this.setState({
      selectedIndex,
    });
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
  _switchSong = (song: Song) => {
    this.setState({ currentSong: song });
    this._loadSong(song.normal);
  };
  _togglePlay = () => {
    if (!this.playerInstance) {
      this._loadSong();
    } else {
      if (this.state.isPlaying) {
        this.playerInstance.pauseAsync();
      } else {
        this.playerInstance.playAsync();
      }
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TabView
          style={{ flex: 1 }}
          selectedIndex={this.state.selectedIndex}
          onSelect={this._setSelectedIndex}
        >
          <Tab title="我的">
            <Text>1</Text>
          </Tab>
          <Tab title="发现">
            <SearchTab switchSong={this._switchSong} />
          </Tab>
        </TabView>
        <PlayerBottomBar
          song={this.state.currentSong}
          onPress={this._openPlayer}
          togglePlay={this._togglePlay}
          isPlaying={this.state.isPlaying}
        />
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
});
