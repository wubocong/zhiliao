import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Layout, Input, Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-root-toast';

import { Musicbill } from '../types';

const DEVICE_HEIGHT = Dimensions.get('window').height;
export default function SearchTab({
  shouldHavePadding,
}: {
  shouldHavePadding: boolean;
}) {
  const [musicbillList, setMusicbillList] = useState([]);

  useEffect(() => {
    (async function () {
      const token = JSON.parse(
        (await AsyncStorage.getItem('user_info')) as string
      ).token;
      const json = await fetch('https://engine.mebtte.com/1/musicbill/list', {
        headers: { Authorization: token },
      }).then((res) => res.json());
      if (json.code === 0) setMusicbillList(json.data);
      else Toast.show(json.message);
    })();
  }, []);
  return (
    <Layout
      level="1"
      style={[styles.container, { paddingBottom: shouldHavePadding ? 85 : 0 }]}
    >
      <ScrollView>
        <Layout level="1">
          <Text>我的歌单</Text>
          {musicbillList.map((musicbill: Musicbill, index) => (
            <TouchableOpacity
              key={musicbill.id}
              style={[
                styles.musicbillItem,
                {
                  borderTopColor: '#c0c4cc',
                  borderTopWidth: index === 0 ? 1 : 0,
                },
              ]}
            >
              <Text>{musicbill.name}</Text>
            </TouchableOpacity>
          ))}
        </Layout>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: DEVICE_HEIGHT - 54, // 不设置height web无法滚动
    paddingLeft: 20,
    paddingRight: 20,
  },
  musicbillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#c0c4cc',
    borderBottomWidth: 1,
    height: 60,
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
});
