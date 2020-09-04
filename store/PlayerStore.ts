import { observable, action } from 'mobx';
import { Audio, AVPlaybackStatus } from 'expo-av';

import { Song } from '../types';
import {
  LOOPING_TYPE_ALL,
  LOOPING_TYPE_ONE,
  LOOPING_TYPE_RANDOM,
} from '../constants/Player';

type PlayerStatus = {
  playerInstancePosition?: number;
  playerInstanceDuration?: number;
  shouldPlay?: boolean;
  isPlaying?: boolean;
  isBuffering?: boolean;
  rate?: number;
  isMuted?: boolean;
  volume?: number;
  loopingType?: number;
  shouldCorrectPitch?: boolean;
};
export default class PlayerStore {
  playerInstance: Audio.Sound | null = null;
  @observable playlist: Song[] = [];
  @observable currentSong?: Song;
  @observable status = {
    playerInstancePosition: 0,
    playerInstanceDuration: 1,
    shouldPlay: false,
    isPlaying: false,
    isBuffering: false,
    rate: 1,
    isMuted: false,
    volume: 1,
    loopingType: LOOPING_TYPE_ALL,
    shouldCorrectPitch: true,
  };

  
  @action setStatus = (statusObject: PlayerStatus) => {
    Object.assign(this.status, statusObject);
  };
  @action setCurrentSong = (song: Song | undefined) => {
    this.currentSong = song;
  };
  @action setPlaylist = (playlist: Song[]) => {
    this.playlist = playlist;
  };

  @action addSongToPlaylistAndPlay = (song: Song) => {
    if (!this.playlist.find((item) => item.id === song.id)) {
      this.playlist.push(song);
    }
    this.switchSong(song);
  };
  @action deleteSongfromPlaylist = async (song: Song) => {
    const { playlist, currentSong } = this;
    if (song.id === currentSong?.id) {
      if (playlist.length === 1) {
        this.currentSong = undefined;
        await this.playerInstance?.unloadAsync();
        this.playerInstance = null;
      } else {
        const nextSongIndex =
          (playlist.findIndex((item) => item.id === song.id) + 1) %
          playlist.length;
        this.switchSong(playlist[nextSongIndex]);
      }
    }
    this.playlist = playlist.filter((item) => item.id !== song.id);
  };
  @action nextSong = (forward: boolean = true) => {
    const {
      playlist,
      currentSong,
      status: { loopingType },
    } = this;
    const currentSongIndex = playlist.findIndex(
      (song) => song.id === currentSong?.id
    );
    if (loopingType === LOOPING_TYPE_ALL || loopingType === LOOPING_TYPE_ONE) {
      if (forward)
        this.switchSong(playlist[(currentSongIndex + 1) % playlist.length]);
      else
        this.switchSong(
          playlist[(currentSongIndex - 1 + playlist.length) % playlist.length]
        );
    } else if (loopingType === LOOPING_TYPE_RANDOM) {
      let randomIndex = Math.floor(Math.random() * playlist.length);
      if (randomIndex === currentSongIndex)
        randomIndex = (randomIndex + 1) % playlist.length;
      this.switchSong(playlist[randomIndex]);
    }
  };
  @action setLoopingType = async (newLoopingType: number) => {
    const { loopingType } = this.status;
    if (loopingType !== newLoopingType) {
      if (loopingType === LOOPING_TYPE_ONE)
        await this.playerInstance?.setIsLoopingAsync(false);
      else if (newLoopingType === LOOPING_TYPE_ONE)
        await this.playerInstance?.setIsLoopingAsync(true);
      this.status.loopingType = newLoopingType;
    }
  };
  setPosition = (value: number) => {
    const { playerInstanceDuration } = this.status;
    if (playerInstanceDuration)
      this.playerInstance?.setPositionAsync(
        Math.round(value * playerInstanceDuration)
      );
  };
  @action switchSong = (song: Song) => {
    this.currentSong = song;
    this._loadSong(song.normal);
  };
  togglePlay = () => {
    if (!this.playerInstance) {
      if (this.currentSong) this._loadSong(this.currentSong.normal);
    } else {
      if (this.status.isPlaying) {
        this.playerInstance.pauseAsync();
      } else {
        this.playerInstance.playAsync();
      }
    }
  };
  _loadSong = async (uri: string) => {
    if (this.playerInstance) {
      await this.playerInstance.unloadAsync();
      this.playerInstance = null;
    }
    const {
      rate,
      isMuted,
      volume,
      loopingType,
      shouldCorrectPitch,
    } = this.status;
    const initialStatus = {
      shouldPlay: true,
      rate: rate,
      isMuted: isMuted,
      volume: volume,
      isLooping: loopingType === LOOPING_TYPE_ONE,
      shouldCorrectPitch: shouldCorrectPitch,
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      initialStatus,
      this._onPlayerStatusUpdate
    );
    this.playerInstance = sound;
  };
  @action _onPlayerStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const newStatus = {
        playerInstancePosition: status.positionMillis,
        playerInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        isMuted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
      };
      if (status.didJustFinish && !status.isLooping) this.nextSong();
      if (status.isLooping)
        Object.assign(newStatus, { loopingType: LOOPING_TYPE_ONE });
      Object.assign(this.status, newStatus);
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };
}
