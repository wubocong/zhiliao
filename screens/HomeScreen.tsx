import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, GestureResponderEvent } from 'react-native';
import { Tab, TabView, Modal } from '@ui-kitten/components';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react';

import PlayerBottomBar from '../components/PlayerBottomBar';
import SearchTab from '../components/SearchTab';
import MineTab from '../components/MineTab';
import Playlist from '../components/Playlist';
import { MainStackParamList, RootStackParamList } from '../types';
import storesContext from '../store';

type State = {
  playlistVisible: boolean;
  selectedIndex: number;
};
@observer
export default class HomeScreen extends React.Component<
  StackScreenProps<MainStackParamList & RootStackParamList, 'Home'>,
  State
> {
  static contextType = storesContext;
  context!: React.ContextType<typeof storesContext>;
  constructor(
    props: StackScreenProps<MainStackParamList & RootStackParamList, 'Home'>
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
  }
  _closePlaylist = () => {
    this.setState({ playlistVisible: false });
  };
  _openPlayer = (e: GestureResponderEvent) => {
    e.preventDefault(); // 防止web端点击穿透
    const { currentSong } = this.context.playerStore;
    if (currentSong)
      this.props.navigation.navigate('Player', {
        openPlaylist: this._openPlaylist,
      });
  };
  _openPlaylist = () => {
    this.context.globalStore.setCloseModalFunction(this._closePlaylist);
    this.setState({ playlistVisible: true });
  };

  _setSelectedIndex = (selectedIndex: number) => {
    // react-native-web的bug，打开modal时会以NaN为参数调用这个方法
    if (!Number.isNaN(selectedIndex)) this.setState({ selectedIndex });
  };
  render() {
    const {
      addSongToPlaylistAndPlay,
      playlist,
    } = this.context.playerStore;
    const { navigation } = this.props;
    const { playlistVisible, selectedIndex } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <TabView
          style={{ flex: 1 }}
          selectedIndex={selectedIndex}
          onSelect={this._setSelectedIndex}
        >
          <Tab title="我的">
            <MineTab
              shouldHavePadding={playlist.length !== 0}
              navigation={navigation}
              openPlaylist={this._openPlaylist}
            />
          </Tab>
          <Tab title="发现">
            <SearchTab
              addSongToPlaylistAndPlay={addSongToPlaylistAndPlay}
              navigation={navigation}
              shouldHavePadding={playlist.length !== 0}
            />
          </Tab>
        </TabView>
        <PlayerBottomBar
          onPress={this._openPlayer}
          openPlaylist={this._openPlaylist}
        />
        <Modal
          visible={playlistVisible}
          backdropStyle={styles.playlistBackdrop}
          onBackdropPress={this._closePlaylist}
        >
          <Playlist />
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
