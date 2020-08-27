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

import PlayerBottomBar from '../components/PlayerBottomBar';
import { RootStackParamList, MainStackParamList, Song } from '../types';
import PlayerState from '../state/PlayerState';
import Layout from '../constants/Layout';
import { ScrollView } from 'react-native-gesture-handler';
import zlFetch from '../utils/zlFetch';

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
    else this._getMusicbillDetail();
  }
  _closeTopBarMenu = () => {
    this.setState({ topBarMenuVisible: false });
  };
  _getMusicbillDetail = async () => {
    try {
      const data = await zlFetch(
        `https://engine.mebtte.com/1/musicbill?id=${this.props.route.params.id}`,
        {
          token: true,
        },
        this.props.navigation
      );
      this.setState({ songList: data.music_list });
    } catch (err) {
      Toast.show(err.message);
    }
  };
  _goBack = () => {
    if (this.props.navigation.canGoBack()) this.props.navigation.goBack();
    else this.props.navigation.replace('Home');
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
  _playAll = () => {
    this.props.player.setPlaylist(this.state.songList);
    this.props.player.switchSong(this.state.songList[0]);
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
    const { songList } = this.state;
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
        {songList.length > 0 && (
          <TouchableOpacity style={styles.playAll} onPress={this._playAll}>
            <Feather
              name="play-circle"
              size={20}
              color="black"
              style={{ marginRight: 20 }}
            />
            <Text>播放全部(共{songList.length}首)</Text>
          </TouchableOpacity>
        )}
        <ScrollView>
          <View>
            {songList.map((song, index) => (
              <TouchableOpacity style={styles.songItem} key={song.id}>
                <View style={styles.songLeft}>
                  <Text style={styles.serial}>{index + 1}</Text>
                  <View style={styles.songInfo}>
                    <Text>{song.name}</Text>
                    <Text style={styles.singer}>
                      {song.singers.reduce(
                        (str, singer, index) =>
                          str + (index !== 0 ? '&' : '') + singer.name,
                        ''
                      )}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.songMore}>
                  <Feather name="more-vertical" size={20} color="black" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

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
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarButton: { padding: 20 },
  playAll: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  songLeft: {
    flexDirection: 'row',
  },
  songInfo: {
    justifyContent: 'space-around',
  },

  serial: {
    padding: 20,
  },
  singer: {
    fontSize: 12,
    color: '#666',
  },
  songMore: {
    padding: 20,
  },
});
