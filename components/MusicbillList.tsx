import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import { Text } from '@ui-kitten/components';
import { observer } from 'mobx-react';

import MusicbillItem from './MusicbillItem';
import Layout from '../constants/Device';
import useStores from '../hooks/useStores';

function MusicbillList({
  closeAddToMusicbillModal,
}: {
  closeAddToMusicbillModal: () => void;
}) {
  const {
    musicbillStore: { addSongToMusicbill, musicbillList, operatingSong },
  } = useStores();
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20, fontSize: 18 }}>收藏到歌单</Text>
      <ScrollView>
        <View>
          {musicbillList.map((musicbill) => (
            <MusicbillItem
              key={musicbill.id}
              musicbill={musicbill}
              onPress={() =>
                addSongToMusicbill(
                  operatingSong!,
                  musicbill.id,
                  closeAddToMusicbillModal
                )
              }
            />
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
});

export default observer(MusicbillList);
