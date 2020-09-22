import { observable, action, observe } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-root-toast';

import { Song, Musicbill } from '../types';
import zlFetch from '../utils/zlFetch';
import GlobalStore from './GlobalStore';

export default class MusicbillStore {
  constructor(globalStore: GlobalStore) {
    this.globalStore = globalStore;
  }
  globalStore: GlobalStore;
  @observable musicbillList: Musicbill[] = [];
  @action setMusicbillList = (musicbillList: Musicbill[]) => {
    this.musicbillList = musicbillList;
    this.musicbillList.forEach((musicbill) => {
      !musicbill.music_list && (musicbill.music_list = []);
    });
    this._persistMusicbillList();
  };

  @action addSongToMusicbill = async (
    song: Song,
    musicbillId: string,
    callback?: () => void
  ) => {
    const musicbill = this.musicbillList.find(
      (item) => item.id === musicbillId
    )!;
    if (!musicbill.music_list.find((item) => item.id === song.id)) {
      await zlFetch(
        'https://engine.mebtte.com/1/musicbill/music',
        {
          token: true,
          body: JSON.stringify({
            musicbill_id: musicbillId,
            music_id: song.id,
          }),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        this.globalStore.navigation
      );
      musicbill.music_list.push(song);
      Toast.show('添加成功');
      this._persistMusicbillList();
    } else {
      Toast.show('歌曲已存在歌单中');
    }
    callback && callback();
  };
  @action deleteMusicbill = async (musicbillId: string) => {
    await zlFetch(
      `https://engine.mebtte.com/1/musicbill?id=${musicbillId}`,
      {
        token: true,
        method: 'DELETE',
      },
      this.globalStore.navigation
    );

    const index = this.musicbillList.findIndex(
      (musicbill) => musicbill.id === musicbillId
    );
    if (index !== -1) {
      this.musicbillList.splice(index, 1);
      this._persistMusicbillList();
    }
  };
  @action deleteSongFromMusicbill = async (song: Song, musicbillId: string) => {
    await zlFetch(
      `https://engine.mebtte.com/1/musicbill/music?musicbill_id=${musicbillId}&music_id=${song.id}`,
      {
        token: true,
        method: 'DELETE',
      },
      this.globalStore.navigation
    );

    const musicbill = this.musicbillList.find(
      (item) => item.id === musicbillId
    )!;
    const index = musicbill.music_list.findIndex((item) => item.id === song.id);
    if (index !== -1) {
      musicbill.music_list.splice(index, 1);
      this._persistMusicbillList();
    }
  };
  @action loadAllMusicbillDetail = async (token?: any) => {
    const musicbillList = (await zlFetch(
      'https://engine.mebtte.com/1/musicbill/list',
      {
        token: typeof token === 'string' ? token : true,
      },
      this.globalStore.navigation
    )) as Musicbill[];

    await Promise.all(
      musicbillList.map(async (musicbill) => {
        const musicbillDetail = await zlFetch(
          `https://engine.mebtte.com/1/musicbill?id=${musicbill.id}`,
          {
            token: typeof token === 'string' ? token : true,
          },
          this.globalStore.navigation
        );
        this.mergeOneMusicbill(musicbillDetail, musicbillList);
      })
    );
    this.setMusicbillList(musicbillList);
  };
  @action mergeOneMusicbill = (
    musicbill: Musicbill,
    musicbillList?: Musicbill[]
  ) => {
    const temp = musicbillList ? musicbillList : this.musicbillList;
    const index = temp.findIndex((item) => item.id === musicbill.id);
    if (index !== -1) {
      Object.assign(temp[index], musicbill);
      !musicbillList && this._persistMusicbillList();
    }
  };
  _persistMusicbillList = async () => {
    await AsyncStorage.setItem(
      'musicbillList',
      JSON.stringify(this.musicbillList)
    );
  };
}
