import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text, MenuItem, OverflowMenu } from '@ui-kitten/components';
import { observer } from 'mobx-react';

import { Musicbill } from '../types';
import useStores from '../hooks/useStores';

function MusicbillItem({
  musicbill,
  onPress,
  showMoreButton = false,
}: {
  musicbill: Musicbill;
  onPress: () => void;
  showMoreButton?: boolean;
}) {
  const {
    musicbillStore: { deleteMusicbill },
  } = useStores();
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => {
    setMenuVisible(true);
  };
  const closeMenu = () => {
    setMenuVisible(false);
  };
  return (
    <TouchableOpacity style={styles.musicbillItem} onPress={onPress}>
      {musicbill.cover !== '' && <Image source={{ uri: musicbill.cover }} />}
      <View>
        <Text style={styles.musicbillName}>{musicbill.name}</Text>
        <Text>{musicbill.music_list.length}首</Text>
      </View>
      {showMoreButton && (
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
            title="删除"
            accessoryLeft={() => (
              <Feather name="trash-2" size={20} color="black" />
            )}
            onPress={() => deleteMusicbill(musicbill.id)}
          />
        </OverflowMenu>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  musicbillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingLeft: 20,
  },
  musicbillName: {
    overflow: 'hidden',
    width: 200,
    fontSize: 16,
  },
  moreButton: {
    padding: 20,
  },
});

export default observer(MusicbillItem);
