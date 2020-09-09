import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, MenuItem, OverflowMenu } from '@ui-kitten/components';

import { Song } from '../types';
import useStores from '../hooks/useStores';
import withConfirm from '../hoc/withConfirm';

function SongItem({
  addSongToPlaylistAndPlay,
  confirm,
  currentMusicbillId,
  openAddToMusicbillModal,
  song,
}: {
  addSongToPlaylistAndPlay: (song: Song) => void;
  confirm: ({
    callback,
    cancelButtonText,
    confirmButtonText,
    content,
    title,
  }: {
    callback: () => void;
    cancelButtonText?: string;
    confirmButtonText?: string;
    content: JSX.Element | string;
    title?: string;
  }) => void;
  currentMusicbillId?: string;
  openAddToMusicbillModal: () => void;
  song: Song;
}) {
  const {
    musicbillStore: { setOperatingSong, deleteSongFromMusicbill },
    playerStore: { playAfterCurrentSong },
    globalStore: { setCloseModalFunction },
  } = useStores();
  const [menuVisible, setMenuVisible] = useState(false);
  const closeMenu = () => {
    setMenuVisible(false);
  };
  const openMenu = () => {
    setCloseModalFunction(closeMenu);
    setOperatingSong(song);
    setMenuVisible(true);
    
  };
  const addToMusicbill = () => {
    closeMenu();
    openAddToMusicbillModal();
  };
  return (
    <TouchableOpacity
      style={styles.songItem}
      onPress={(e) => {
        e.preventDefault(); // 处理 react-native-web bug
        addSongToPlaylistAndPlay(song);
      }}
    >
      <View style={styles.songInfo}>
        <Text>{song.name}</Text>
        <View style={styles.singerWrapper}>
          <Text style={styles.singer}>{song.singers[0].name}</Text>
          {song.singers.slice(1).map((singer, index) => (
            <Text style={styles.singer} key={index}>
              {'&' + singer.name}
            </Text>
          ))}
        </View>
      </View>
      <OverflowMenu
        anchor={() => (
          <TouchableOpacity onPress={openMenu} style={styles.moreButton}>
            <Feather name="more-vertical" size={20} color="black" />
          </TouchableOpacity>
        )}
        visible={menuVisible}
        onSelect={closeMenu}
        onBackdropPress={closeMenu}
      >
        <MenuItem
          title="下一首播放"
          accessoryLeft={() => (
            <Feather name="fast-forward" size={20} color="black" />
          )}
          onPress={() => {
            closeMenu();
            playAfterCurrentSong(song);
          }}
        />
        <MenuItem
          title="收藏到歌单"
          accessoryLeft={() => (
            <Feather name="folder-plus" size={20} color="black" />
          )}
          onPress={addToMusicbill}
        />
        <MenuItem
          title="下载"
          accessoryLeft={() => (
            <Feather name="download" size={20} color="black" />
          )}
        />
        <MenuItem
          style={{ display: currentMusicbillId ? 'flex' : 'none' }}
          title="删除"
          accessoryLeft={() => (
            <Feather name="trash-2" size={20} color="black" />
          )}
          onPress={() => {
            closeMenu();
            confirm({
              callback: () =>
                deleteSongFromMusicbill(song, currentMusicbillId!),
              confirmButtonText: '删除',
              content: `确定从歌单中删除歌曲“${song.name}”？`,
            });
          }}
        />
      </OverflowMenu>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  songItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingLeft: 20,
  },
  songInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  singerWrapper: {
    flexDirection: 'row',
  },
  singer: {
    fontSize: 12,
  },
  moreButton: {
    padding: 20,
  },
});

export default withConfirm(SongItem);
