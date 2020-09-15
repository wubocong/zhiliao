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
import { observer } from 'mobx-react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-root-toast';

import PlayerBottomBar from '../components/PlayerBottomBar';
import SongItem from '../components/SongItem';
import { RootStackParamList, MainStackParamList } from '../types';
import { ScrollView } from 'react-native-gesture-handler';
import zlFetch from '../utils/zlFetch';
import storesContext from '../store';
import Device from '../constants/Device';

type State = {
  topBarMenuVisible: boolean;
};
@observer
export default class MusicbillScreen extends React.Component<
  StackScreenProps<RootStackParamList & MainStackParamList, 'Musicbill'>,
  State
> {
  static contextType = storesContext;
  context!: React.ContextType<typeof storesContext>;
  constructor(
    props: StackScreenProps<
      RootStackParamList & MainStackParamList,
      'Musicbill'
    >
  ) {
    super(props);
    this.state = {
      topBarMenuVisible: false,
    };
  }
  componentDidMount() {
    this.context.globalStore.setNavigation(this.props.navigation);
    if (!this.props.route.params.name) this.props.navigation.replace('Home');
    // else this._getMusicbillDetail();
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
      this.context.musicbillStore.mergeOneMusicbill(data);
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
    if (this.context.playerStore.currentSong)
      this.props.navigation.navigate('Player');
  };
  _openTopBarMenu = () => {
    this.setState({ topBarMenuVisible: true });
  };
  _playAll = () => {
    const songList = this.context.musicbillStore.musicbillList.find(
      (musicbill) => musicbill.id === this.props.route.params.id
    )!.music_list;
    this.context.playerStore.setPlaylist(songList);
    this.context.playerStore.switchSong(songList[0]);
  };
  render() {
    const name = this.props.route.params?.name;
    if (!name) return null;
    const { musicbillList } = this.context.musicbillStore;
    const { currentSong } = this.context.playerStore;
    const currentMusicbillId = this.props.route.params.id;
    const songList = musicbillList.find(
      (musicbill) => musicbill.id === currentMusicbillId
    )!.music_list;
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
        <ScrollView
          style={{
            height: Device.window.height - 128,
            paddingBottom: currentSong ? 85 : 0,
          }}
        >
          <View>
            {songList.map((song) => (
              <SongItem
                key={song.id}
                song={song}
                currentMusicbillId={currentMusicbillId}
              />
            ))}
          </View>
        </ScrollView>

        <PlayerBottomBar onPress={this._openPlayer} />
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
