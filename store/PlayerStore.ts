import { observable, action } from 'mobx';
import { Audio, AVPlaybackStatus } from 'expo-av';

import { Song } from '../types';
import {
  LOOPING_TYPE_ALL,
  LOOPING_TYPE_ONE,
  LOOPING_TYPE_RANDOM,
} from '../constants/Player';
import Toast from 'react-native-root-toast';

type PlayerStatus = {
  playbackInstancePosition?: number;
  playbackInstanceDuration?: number;
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
      navigator.mediaSession!.setActionHandler(
        'nexttrack',
        () => this.nextSong
      );
    }
  }
  playbackInstance: Audio.Sound | null = null;
  @observable playlist: Song[] = [];
  @observable currentSong?: Song;
  @observable status = {
    playbackInstancePosition: 0,
    playbackInstanceDuration: 1,
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
  @action setCurrentSong = (song?: Song) => {
    this.currentSong = song;
  };
  @action setPlaylist = (playlist: Song[]) => {
    this.playlist = playlist;
  };

  @action addSongToPlaylistAndPlay = (song: Song) => {
    if (this._getSongIndexInPlaylist(song) === -1) {
      this.playlist.splice(
        this._getSongIndexInPlaylist(this.currentSong) + 1,
        0,
        song
      );
    }
    this.switchSong(song);
  };
  @action clearPlaylist = async () => {
    this.playlist = [];
    this.unloadSong();
  };
  @action deleteSongfromPlaylist = async (song: Song) => {
    const { playlist, currentSong } = this;
    if (song.id === currentSong?.id) {
      if (playlist.length === 1) {
        this.currentSong = undefined;
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
  };
  @action setLoopingType = async (newLoopingType: number) => {
    const { loopingType } = this.status;
    if (loopingType !== newLoopingType) {
      if (loopingType === LOOPING_TYPE_ONE)
        await this.playbackInstance?.setIsLoopingAsync(false);
      else if (newLoopingType === LOOPING_TYPE_ONE)
        await this.playbackInstance?.setIsLoopingAsync(true);
      this.status.loopingType = newLoopingType;
    }
  };
  setPosition = (value: number) => {
    const { playbackInstanceDuration } = this.status;
    if (playbackInstanceDuration)
      this.playbackInstance?.setPositionAsync(
        Math.round(value * playbackInstanceDuration)
      );
  };
  @action switchSong = (song: Song) => {
    this.currentSong = song;
    this._loadSong(song);
  };
  @action unloadSong = async () => {
    this.currentSong = undefined;
    if (this.playbackInstance) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance = null;
    }
  };
  togglePlay = () => {
    if (this.status.isPlaying) {
      this.playbackInstance!.pauseAsync();
    } else {
      this.playbackInstance!.playAsync();
    }
  };
  _getSongIndexInPlaylist = (song?: Song) => {
    return this.playlist.findIndex((item) => item.id === song?.id);
  };
  _loadSong = async (song: Song) => {
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
    if (this.playbackInstance) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance = null;
    }
    const {
      rate,
      isMuted,
      volume,
      loopingType,
      shouldCorrectPitch,
    } = this.status;
    const initialStatus = {
      shouldPlay: false,
      rate: rate,
      isMuted: isMuted,
      volume: volume,
      isLooping: loopingType === LOOPING_TYPE_ONE,
      shouldCorrectPitch: shouldCorrectPitch,
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.normal },
        initialStatus,
        this._onPlayerStatusUpdate
      );
      if (this.currentSong?.id === song.id) {
        this.playbackInstance = sound;
        await this.playbackInstance.playAsync();
      } else {
        await sound.unloadAsync();
      }
    } catch (err) {
      Toast.show(err.message);
    }
  };
  @action _onPlayerStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const newStatus = {
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
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
