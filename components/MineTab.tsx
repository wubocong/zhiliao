import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';

import { MainStackParamList, RootStackParamList, Musicbill } from '../types';
import Device from '../constants/Layout';
import zlFetch from '../utils/zlFetch';

export default function SearchTab({
  shouldHavePadding,
  navigation,
  openPlaylist
}: {
  shouldHavePadding: boolean;
  navigation: StackNavigationProp<
    MainStackParamList & RootStackParamList,
    'Home'
  >;
  openPlaylist:()=>void;
}) {
  const [musicbillList, setMusicbillList] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const data = await zlFetch(
          'https://engine.mebtte.com/1/musicbill/list',
          {
            token: true,
          },
          navigation
        );
        setMusicbillList(data);
      } catch (err) {
        Toast.show(err.message);
      }
    })();
  }, []);
  return (
    <Layout
      level="1"
      style={[styles.container, { paddingBottom: shouldHavePadding ? 85 : 0 }]}
    >
      <ScrollView>
        <Layout level="1">
          <View style={styles.musicbillHeader}>
            <Text style={{ fontSize: 18 }}>我创建的歌单</Text>
          </View>
          {musicbillList.map((musicbill: Musicbill, index) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Musicbill', {
                  name: musicbill.name,
                  id: musicbill.id,
                  openPlaylist
                });
              }}
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
    height: Device.window.height - 54, // 不设置height web无法滚动
    paddingLeft: 20,
    paddingRight: 20,
  },
  musicbillHeader: {
    marginTop: 20,
    marginBottom: 10,
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
