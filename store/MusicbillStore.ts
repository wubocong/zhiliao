import { observable, action } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import Toast from 'react-native-root-toast';

import { Song, Musicbill } from '../types';
import zlFetch from '../utils/zlFetch';

export default class MusicbillStore {
  @observable musicbillList: Musicbill[] = [];
  @observable operatingSong?: Song;
  @action setMusicbillList = (musicbillList: Musicbill[]) => {
    this.musicbillList = musicbillList;
    this.musicbillList.forEach((musicbill) => {
      !musicbill.music_list && (musicbill.music_list = []);
    });
    this._persistMusicbillList();
  };
  @action setOperatingSong = (operatingSong: Song | undefined) => {
    this.operatingSong = operatingSong;
  };

  @action addSongToMusicbill = async (
    song: Song,
    musicbillId: string,
    callback: () => void
  ) => {
    try {
      await zlFetch('https://engine.mebtte.com/1/musicbill/music', {
        token: true,
        body: JSON.stringify({
          musicbill_id: musicbillId,
          music_id: this.operatingSong!.id,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Toast.show('添加成功');

      const musicbill = this.musicbillList.find(
        (item) => item.id === musicbillId
      )!;
      if (!musicbill.music_list.find((item) => item.id === song.id)) {
        musicbill.music_list.push(song);
        this._persistMusicbillList();
      }
      callback();
    } catch (err) {
      Toast.show(err.message);
    }
  };
  @action deleteMusicbill = async (musicbillId: string) => {
    try {
      await zlFetch(`https://engine.mebtte.com/1/musicbill?id=${musicbillId}`, {
        token: true,
        method: 'DELETE',
      });

      const index = this.musicbillList.findIndex(
        (musicbill) => musicbill.id === musicbillId
      );
      if (index !== -1) {
        this.musicbillList.splice(index, 1);
        this._persistMusicbillList();
      }
    } catch (err) {
      Toast.show(err.message);
    }
  };
  @action deleteSongFromMusicbill = async (song: Song, musicbillId: string) => {
    try {
      await zlFetch(
        `https://engine.mebtte.com/1/musicbill/music?musicbill_id=${musicbillId}&music_id=${song.id}`,
        {
          token: true,
          method: 'DELETE',
        }
      );

      const musicbill = this.musicbillList.find(
        (item) => item.id === musicbillId
      )!;
      const index = musicbill.music_list.findIndex(
        (item) => item.id === song.id
      );
      if (index !== -1) {
        musicbill.music_list.splice(index, 1);
        this._persistMusicbillList();
      }
    } catch (err) {
      Toast.show(err.message);
    }
  };
  @action loadAllMusicbillDetail = async (token?: string) => {
    try {
      const musicbillList = (await zlFetch(
        'https://engine.mebtte.com/1/musicbill/list',
        {
          token: token || true,
        }
      )) as Musicbill[];
      this.setMusicbillList(musicbillList);
      await Promise.all(
        musicbillList.map(async (musicbill) => {
          try {
            const musicbillDetail = await zlFetch(
              `https://engine.mebtte.com/1/musicbill?id=${musicbill.id}`,
              {
                token: token,
              }
            );
            this.mergeOneMusicbill(musicbillDetail);
          } catch (err) {
            Toast.show(err.message);
          }
        })
      );
    } catch (err) {
      Toast.show(err.message);
    }
  };
  @action mergeOneMusicbill = (musicbill: Musicbill) => {
    const index = this.musicbillList.findIndex(
      (item) => item.id === musicbill.id
    );
    if (index !== -1) {
      Object.assign(this.musicbillList[index], musicbill);
      this._persistMusicbillList();
    }
  };
  _persistMusicbillList = async () => {
    await AsyncStorage.setItem(
      'musicbillList',
      JSON.stringify(this.musicbillList)
    );
  };
}
