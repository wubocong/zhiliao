import { observable, action } from 'mobx';

import { Song, Musicbill } from '../types';

export default class MusicbillStore {
  @observable musicbillList: Musicbill[] = [];
  @observable operatingSong?: Song;
  @action setMusicbillList = (musicbillList: Musicbill[]) => {
    this.musicbillList = musicbillList;
    this.musicbillList.forEach((musicbill) => {
      !musicbill.music_list && (musicbill.music_list = []);
    });
  };
  @action setOperatingSong = (operatingSong: Song | undefined) => {
    this.operatingSong = operatingSong;
  };

  @action mergeOneMusicbill = (musicbillId: string, musicbill: Musicbill) => {
    const index = this.musicbillList.findIndex(
      (item) => item.id === musicbillId
    );
    if (index !== -1) Object.assign(this.musicbillList[index], musicbill);
  };
  @action addSongToMusicbill = (song: Song, musicbillId: string) => {
    const musicbill = this.musicbillList.find(
      (item) => item.id === musicbillId
    ) as Musicbill;
    if (!musicbill.music_list.find((item) => item.id === song.id))
      musicbill.music_list.push(song);
  };
  @action deleteSongFromMusicbill = (song: Song, musicbillId: string) => {
    const musicbill = this.musicbillList.find(
      (item) => item.id === musicbillId
    ) as Musicbill;
    const index = musicbill.music_list.findIndex((item) => item.id === song.id);
    if (index !== -1) musicbill.music_list.splice(index, 1);
  };
}
