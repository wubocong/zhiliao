import { observable, action, computed } from 'mobx';

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
type PlayerStatus = {
  playerInstancePosition: number;
  playerInstanceDuration: number;
  shouldPlay: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  rate: number;
  muted: boolean;
  volume: number;
  loopingType: number;
  shouldCorrectPitch: boolean;
};
export default class PlayerState {
  @observable status = {
    playerInstancePosition: 0,
    playerInstanceDuration: 0,
    shouldPlay: false,
    isPlaying: false,
    isBuffering: false,
    rate: 1,
    muted: false,
    volume: 1,
    loopingType: LOOPING_TYPE_ALL,
    shouldCorrectPitch: false,
  };
  @action setStatus = (statusObject: PlayerStatus) => {
    this.status = statusObject;
  };
}
