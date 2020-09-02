import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, CheckBox } from '@ui-kitten/components';
import Toast from 'react-native-root-toast';

import { Musicbill } from '../types';
import zlFetch from '../utils/zlFetch';
import MusicbillState from '../state/MusicbillState';
import { observer, inject } from 'mobx-react';

export default function MusicbillListItem({
  currentSongId,
  musicbill,
}: {
  currentSongId: string;
  musicbill: Musicbill;
}) {
  const [checked, setChecked] = useState(false);
  const toggleCheck = async () => {
    try {
      if (!checked)
        await zlFetch('https://engine.mebtte.com/1/musicbill/music', {
          token: true,
          body: JSON.stringify({
            musicbill_id: musicbill.id,
            music_id: currentSongId,
          }),
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
        });
      else
        await zlFetch('https://engine.mebtte.com/1/musicbill/music', {
          token: true,
          body: JSON.stringify({
            musicbill_id: musicbill.id,
            music_id: currentSongId,
          }),
          method: 'DELETE',
          headers: {
            'content-type': 'application/json',
          },
        });
      setChecked(!checked);
    } catch (err) {
      Toast.show(err.message);
    }
  };
  return (
    <TouchableOpacity style={styles.item}>
      <CheckBox checked={checked} onChange={toggleCheck} />
      <View>
        <Text style={styles.name}>{musicbill.name}</Text>
        <Text>{musicbill.music_list.length}首</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
// export default inject((allStores: { musicbill: MusicbillState }) => ({
//   songId: allStores.musicbill.currentSongId,
// }))(observer(MusicbillListItem));
