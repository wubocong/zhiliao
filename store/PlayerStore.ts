import { observable, action } from 'mobx';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { throttle, debounce } from 'lodash';

import { Song } from '../types';
import {
  LOOPING_TYPE_ALL,
  LOOPING_TYPE_ONE,
  LOOPING_TYPE_RANDOM,
} from '../constants/Player';
import AsyncStorage from '@react-native-community/async-storage';

type PlayerStatus = {
  positionMillis?: number;
  durationMillis?: number;
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
  constructor() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession!.setActionHandler('play', this.togglePlay);
      navigator.mediaSession!.setActionHandler('pause', this.togglePlay);
      // navigator.mediaSession.setActionHandler('seekbackward', function () { });
      // navigator.mediaSession.setActionHandler('seekforward', function () { });
      navigator.mediaSession!.setActionHandler('previoustrack', () =>
        this.nextSong(false)
      );
      navigator.mediaSession!.setActionHandler('nexttrack', () =>
        this.nextSong()
      );
    }
  }
  playbackInstance: Audio.Sound | null = null;
  unloading: boolean = false;
  switching: boolean = false;
  @observable playlist: Song[] = [];
  @observable currentSong?: Song;
  @observable status: PlayerStatus = {
    positionMillis: 0,
    durationMillis: 1,
    shouldPlay: false,
    isPlaying: false,
    isBuffering: false,
    rate: 1,
    isMuted: false,
    volume: 1,
    loopingType: LOOPING_TYPE_ALL,
    shouldCorrectPitch: true,
  };
  @action setStatus = (status: PlayerStatus) => {
    this.status = status;
  };
  @action mergeStatus = (status: PlayerStatus) => {
    Object.assign(this.status, status);
  };
  @action setCurrentSong = async (song?: Song, persist: boolean = true) => {
    this.currentSong = song;
    if (persist) {
      this.mergeStatus({ positionMillis: 0, durationMillis: 1 });
      if (song) await AsyncStorage.setItem('currentSong', JSON.stringify(song));
      else await AsyncStorage.removeItem('currentSong');
    }
  };
  @action setPlaylist = async (playlist: Song[], persist: boolean = true) => {
    this.playlist = playlist;
    if (persist) await this._persistPlaylist();
  };
  @action addSongToPlaylistAndPlay = (song: Song) => {
    if (this._getSongIndexInPlaylist(song) === -1) {
      this.playlist.splice(
        this._getSongIndexInPlaylist(this.currentSong) + 1,
        0,
        song
      );
      this._persistPlaylist();
    }
    this.switchSong(song);
  };
  @action clearPlaylist = async () => {
    this.playlist = [];
    this._persistPlaylist();
    this.unloadSong();
  };
  @action deleteSongfromPlaylist = async (song: Song) => {
    const { playlist, currentSong } = this;
    if (song.id === currentSong?.id) {
      if (playlist.length === 1) {
        await this.setCurrentSong(undefined);
        await this.playbackInstance?.unloadAsync();
        this.playbackInstance = null;
      } else {
        const nextSongIndex =
          (playlist.findIndex((item) => item.id === song.id) + 1) %
          playlist.length;
        this.switchSong(playlist[nextSongIndex]);
      }
    }
    this.playlist = playlist.filter((item) => item.id !== song.id);
    this._persistPlaylist();
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
  @action playAfterCurrentSong = (song: Song) => {
    if (song.id === this.currentSong?.id) return;
    const index = this._getSongIndexInPlaylist(song);
    if (index !== -1) this.playlist.splice(index, 1);
    this.playlist.splice(
      this._getSongIndexInPlaylist(this.currentSong) + 1,
      0,
      song
    );
    if (this.playlist.length === 1) this.switchSong(song);
    this._persistPlaylist();
  };
  @action setLoopingType = async (newLoopingType: number) => {
    const { loopingType } = this.status;
    if (loopingType !== newLoopingType) {
      if (loopingType === LOOPING_TYPE_ONE)
        await this.playbackInstance?.setIsLoopingAsync(false);
      else if (newLoopingType === LOOPING_TYPE_ONE)
        await this.playbackInstance?.setIsLoopingAsync(true);
      this.status.loopingType = newLoopingType;
      this._persistStatus();
    }
  };
  setPosition = (value: number) => {
    const { durationMillis } = this.status;
    if (durationMillis)
      this.playbackInstance?.setPositionAsync(
        Math.round(value * durationMillis)
      );
  };
  @action switchSong = async (song: Song) => {
    if (this.currentSong?.id === song.id) {
      this.setPosition(0);
    } else {
      this.switching = true;
      await this.setCurrentSong(song);
      await this._loadSong(song);
    }
  };
  @action unloadSong = async () => {
    await this.setCurrentSong(undefined);
    if (this.playbackInstance && !this.unloading) {
      this.unloading = true;
      await this.playbackInstance.unloadAsync();
      this.playbackInstance = null;
      this.unloading = false;
    }
  };
  togglePlay = () => {
    if (!this.playbackInstance) {
      if (this.currentSong) this._loadSong(this.currentSong);
    } else {
      if (this.status.isPlaying === true) {
        this.playbackInstance!.pauseAsync();
      } else if (this.status.isPlaying === false) {
        this.playbackInstance!.playAsync();
      }
    }
  };
  _getSongIndexInPlaylist = (song?: Song) => {
    return this.playlist.findIndex((item) => item.id === song?.id);
  };
  _loadSong = debounce(async (song: Song) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession!.metadata = new MediaMetadata({
        title: song.name,
        artist: song.singers.reduce(
          (str, singer, index) => str + (index === 0 ? '' : '&') + singer.name,
          ''
        ),
        // album: 'ALBUM',
        artwork: [
          {
            sizes: '320x320', // <- MUST BE EXACTLY!
            src: song.cover,
            type: '',
          },
        ],
      });
    }
    if (this.playbackInstance && !this.unloading) {
      this.unloading = true;
      await this.playbackInstance.unloadAsync();
      this.playbackInstance = null;
      this.unloading = false;
    }
    const {
      rate,
      isMuted,
      volume,
      loopingType,
      shouldCorrectPitch,
      positionMillis,
    } = this.status;

    const initialStatus = {
      shouldPlay: false,
      rate: rate,
      isMuted: isMuted,
      volume: volume,
      isLooping: loopingType === LOOPING_TYPE_ONE,
      shouldCorrectPitch: shouldCorrectPitch,
    };
    if (positionMillis) Object.assign(initialStatus, { positionMillis });
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.normal },
        initialStatus,
        this._onPlayerStatusUpdate
      );
      if (this.currentSong?.id === song.id && !this.playbackInstance) {
        this.playbackInstance = sound;
        this.switching = false;
        await this.playbackInstance.playAsync();
      } else {
        await sound.unloadAsync();
      }
    } catch (err) {
      setTimeout(() => {
        if (!this.playbackInstance) this._loadSong(song);
      }, 1000);
    }
  }, 350);
  @action _onPlayerStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && !this.switching) {
      const newStatus = {
        positionMillis: status.positionMillis,
        durationMillis: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        isMuted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
      };
      Object.assign(this.status, newStatus);
      this._persistStatus();
      if (status.didJustFinish && !status.isLooping) this.nextSong();
    } else {
      //
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };
  _persistStatus = throttle(async () => {
    const playbackStatus = { ...this.status };
    delete playbackStatus.isPlaying;
    delete playbackStatus.isBuffering;
    delete playbackStatus.shouldPlay;
    await AsyncStorage.setItem(
      'playbackStatus',
      JSON.stringify(playbackStatus)
    );
  }, 1000);
  _persistPlaylist = async () => {
    await AsyncStorage.setItem('playlist', JSON.stringify(this.playlist));
  };
}
