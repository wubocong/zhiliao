import { observable, action } from 'mobx';

import { Song, Musicbill } from '../types';

export default class MusicbillState {
  @observable musicbillList: Musicbill[] = [];
  @observable currentSongId: string = '';
  @action setMusicbillList = (musicbillList: Musicbill[]) => {
    this.musicbillList = musicbillList;
  };
  @action setCurrentSongId = (currentSongId: string) => {
    this.currentSongId = currentSongId;
  };

  @action mergeOneMusicbill = (musicbillId: string, musicbill: Musicbill) => {
    const index = this.musicbillList.findIndex(
      (item) => item.id === musicbillId
    );
    Object.assign(this.musicbillList[index], musicbill);
  };
  @action addSongToMusicbill = (song: Song, id: string) => {
    const musicbill = this.musicbillList.find((item) => item.id === id);
    musicbill?.music_list.push(song);
  };
}
