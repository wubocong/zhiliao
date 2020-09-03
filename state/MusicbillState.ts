import { observable, action } from 'mobx';

import { Song, Musicbill } from '../types';

export default class MusicbillState {
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
    index !== -1 && Object.assign(this.musicbillList[index], musicbill);
  };
  @action addSongToMusicbill = (song: Song, id: string) => {
    const musicbill = this.musicbillList.find((item) => item.id === id);
    musicbill?.music_list.push(song);
  };
}
