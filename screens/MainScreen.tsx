import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Tab, TabBar } from '@ui-kitten/components';
import { Audio } from 'expo-av';

import PlayerBottomBar from '../components/PlayerBottomBar';
import { RootStackParamList } from '../types';

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#FFF8ED';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = '... loading ...';
const BUFFERING_STRING = '...buffering...';
const RATE_SCALE = 3.0;
const VIDEO_CONTAINER_HEIGHT = (DEVICE_HEIGHT * 2.0) / 5.0 - FONT_SIZE * 2;
export default class MainScreen extends React.Component<
  StackScreenProps<RootStackParamList, 'Main'>,
  { selectedIndex: number; isPlaying: boolean }
> {
  playerInstance: any;
  constructor(props: StackScreenProps<RootStackParamList, 'Main'>) {
    super(props);
    this.playerInstance = null;
    this.state = {
      selectedIndex: 0,
      showVideo: false,
      playbackInstanceName: LOADING_STRING,
      loopingType: LOOPING_TYPE_ALL,
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      poster: false,
      useNativeControls: false,
      fullscreen: false,
      throughEarpiece: false,
    };
  }
  componentDidMount() {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    });
  }
  setSelectedIndex = (selectedIndex: number) => {
    this.setState({
      selectedIndex,
    });
  };
  togglePlay = async () => {
    if (!this.playerInstance) {
      const initialStatus = {
        shouldPlay: true,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
        volume: this.state.volume,
        isMuted: this.state.muted,
        isLooping: this.state.loopingType === LOOPING_TYPE_ONE,
        // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
        // androidImplementation: 'MediaPlayer',
      };
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri:
            'http://freetyst.nf.migu.cn/public/product5th/product34/2019/05/3020/2019%E5%B9%B405%E6%9C%8828%E6%97%A511%E7%82%B947%E5%88%86%E5%86%85%E5%AE%B9%E5%87%86%E5%85%A5%E6%AD%A3%E4%B8%9C64%E9%A6%96746986/%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD/flac/6005661WKJ2.flac?key=6d2e761987a70098&Tim=1594635486410&channelid=00&msisdn=e21a34e0ebf342cab5123990876387db&CI=6005661WKJ22600913000003988109&F=011002',
        },
        initialStatus,
        this._onPlaybackStatusUpdate
      );
      this.playerInstance = sound;
    } else {
      if (this.state.isPlaying) {
        this.playerInstance.pauseAsync();
      } else {
        this.playerInstance.playAsync();
      }
    }
  };
  _onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
        shouldCorrectPitch: status.shouldCorrectPitch,
      });
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <TabBar
          selectedIndex={this.state.selectedIndex}
          onSelect={this.setSelectedIndex}
        >
          <Tab title="我的"></Tab>
          <Tab title="发现" />
        </TabBar>
        <PlayerBottomBar
          togglePlay={this.togglePlay}
          isPlaying={this.state.isPlaying}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 20,
  },
});
