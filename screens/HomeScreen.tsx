import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Tab, TabBar, Layout } from '@ui-kitten/components';
import { Audio } from 'expo-av';

import PlayerBottomBar from '../components/PlayerBottomBar';
import { MainStackParamList, RootStackParamList } from '../types';
import { inject, observer } from 'mobx-react';

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const LOADING_STRING = '... loading ...';

@inject('player')
@observer
export default class HomeScreen extends React.Component<
  StackScreenProps<MainStackParamList & RootStackParamList, 'Home'>,
  { selectedIndex: number; isPlaying: boolean }
> {
  playerInstance: any;
  constructor(
    props: StackScreenProps<MainStackParamList & RootStackParamList, 'Home'>
  ) {
    super(props);
    this.playerInstance = null;
    this.state = {
      selectedIndex: 0,
      playerInstanceName: LOADING_STRING,
      loopingType: LOOPING_TYPE_ALL,
      muted: false,
      playerInstancePosition: null,
      playerInstanceDuration: null,
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

  _onPlayerStatusUpdate = (status) => {
    if (status.isLoaded) {
      const newState = {
        playerInstancePosition: status.positionMillis,
        playerInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
        shouldCorrectPitch: status.shouldCorrectPitch,
      };
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
      _togglePlay: this._togglePlay,
    });
  };
  _setSelectedIndex = (selectedIndex: number) => {
    this.setState({
      selectedIndex,
    });
  };
  _togglePlay = async () => {
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
        this._onPlayerStatusUpdate
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
  render() {
    return (
      <Layout level="1" style={styles.container}>
        <TabBar
          selectedIndex={this.state.selectedIndex}
          onSelect={this._setSelectedIndex}
        >
          <Tab title="我的"></Tab>
          <Tab title="发现" />
        </TabBar>
        <PlayerBottomBar
          onPress={this._openPlayer}
          togglePlay={this._togglePlay}
          isPlaying={this.state.isPlaying}
        />
      </Layout>
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
