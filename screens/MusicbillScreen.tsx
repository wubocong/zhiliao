import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { Text, MenuItem, OverflowMenu } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';

import PlayerBottomBar from '../components/PlayerBottomBar';
import { RootStackParamList, MainStackParamList, Song } from '../types';
import PlayerState from '../state/PlayerState';
import Layout from '../constants/Layout';

type State = {
  songList: Song[];
  topBarMenuVisible: boolean;
};
@inject('player')
@observer
export default class MusicbillScreen extends React.Component<
  StackScreenProps<RootStackParamList & MainStackParamList, 'Musicbill'> & {
    player: PlayerState;
  },
  State
> {
  constructor(
    props: StackScreenProps<
      RootStackParamList & MainStackParamList,
      'Musicbill'
    > & {
      player: PlayerState;
    }
  ) {
    super(props);
    this.state = {
      songList: [],
      topBarMenuVisible: false,
    };
  }
  componentDidMount() {
    if (!this.props.route.params.name) this.props.navigation.replace('Home');
  }
  _closeTopBarMenu = () => {
    this.setState({ topBarMenuVisible: false });
  };
  _getMusicbillDetail = async () => {
    const token = JSON.parse(
      (await AsyncStorage.getItem('user_info')) as string
    ).token;
    const json = await fetch(
      `https://engine.mebtte.com/1/musicbill?id=${this.props.route.params.id}`,
      {
        headers: { Authorization: token },
      }
    ).then((res) => res.json());
    if (json.code === 0) this.setState({ songList: json.data.music_list });
    else Toast.show(json.message);
  };
  _goBack = () => {
    this.props.navigation.goBack();
  };
  _openPlayer = (e: GestureResponderEvent) => {
    e.preventDefault(); // 防止web端点击穿透
    if (this.props.player.currentSong)
      this.props.navigation.navigate('Player', {
        openPlaylist: this.props.route.params.openPlaylist,
      });
  };
  _openTopBarMenu = () => {
    this.setState({ topBarMenuVisible: true });
  };

  render() {
    const name = this.props.route.params?.name;
    if (!name) return null;
    const { openPlaylist } = this.props.route.params;
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
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.topBarButton}
              onPress={this._goBack}
            >
              <Feather name="arrow-left" size={24} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18 }}>{name}</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.topBarButton}>
              <Feather name="search" size={24} color="black" />
            </TouchableOpacity>
            <OverflowMenu
              anchor={() => (
                <TouchableOpacity
                  onPress={this._openTopBarMenu}
                  style={styles.topBarButton}
                >
                  <Feather name="more-vertical" size={24} color="black" />
                </TouchableOpacity>
              )}
              visible={this.state.topBarMenuVisible}
              onSelect={this._closeTopBarMenu}
              onBackdropPress={this._closeTopBarMenu}
            >
              <MenuItem
                title="添加歌曲"
                accessoryLeft={() => (
                  <Feather name="plus-circle" size={20} color="black" />
                )}
              />
              <MenuItem
                title="编辑歌单信息"
                accessoryLeft={() => (
                  <Feather name="edit" size={20} color="black" />
                )}
              />
              <MenuItem
                title="更改歌曲排序"
                accessoryLeft={() => (
                  <Feather name="grid" size={20} color="black" />
                )}
              />
            </OverflowMenu>
          </View>
        </View>
        {playlist.length !== 0 && (
          <PlayerBottomBar
            song={currentSong}
            onPress={this._openPlayer}
            togglePlay={togglePlay}
            openPlaylist={openPlaylist}
            isPlaying={isPlaying}
          />
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  topBar: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarButton: { padding: 10 },
});
