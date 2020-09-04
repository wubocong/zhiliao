import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';
import { observer } from 'mobx-react';

import zlFetch from '../utils/zlFetch';
import Layout from '../constants/Device';
import { Musicbill, Song } from '../types';
import useStores from '../hooks/useStores';

function MusicbillList({
  closeAddToMusicbillModal,
}: {
  closeAddToMusicbillModal: () => void;
}) {
  const { musicbillStore } = useStores();

  const addToMusicbill = async (musicbillId: string) => {
    try {
      await zlFetch('https://engine.mebtte.com/1/musicbill/music', {
        token: true,
        body: JSON.stringify({
          musicbill_id: musicbillId,
          music_id: musicbillStore.operatingSong?.id,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Toast.show('添加成功');
      musicbillStore.addSongToMusicbill(musicbillStore.operatingSong as Song, musicbillId);
      closeAddToMusicbillModal();
    } catch (err) {
      Toast.show(err.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20, fontSize: 18 }}>收藏到歌单</Text>
      <ScrollView>
        <View>
          {musicbillStore.musicbillList.map((musicbill) => (
            <TouchableOpacity
              style={styles.item}
              key={musicbill.id}
              onPress={() => {
                addToMusicbill(musicbill.id);
              }}
            >
              <Image source={{ uri: musicbill.cover }} />
              <View>
                <Text style={styles.name}>{musicbill.name}</Text>
                <Text>{musicbill.music_list.length}首</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: Layout.window.width - 40,
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  name: {
    overflow: 'hidden',
    width: 200,
    fontSize: 16,
  },
});

export default observer(MusicbillList);
