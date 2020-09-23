import { useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import useStores from '../hooks/useStores';

export default function useLocalData() {
  const {
    musicbillStore: { setMusicbillList, loadAllMusicbillDetail },
    playerStore: { setCurrentSong, mergeStatus, setPlaylist },
  } = useStores();

  useEffect(() => {
    (async function () {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const [
        [, currentSong],
        [, playbackStatus],
        [, playlist],
        [, musicbillList],
      ] = await AsyncStorage.multiGet([
        'currentSong',
        'playbackStatus',
        'playlist',
        'musicbillList',
      ]);
      if (currentSong)
        setCurrentSong(JSON.parse(currentSong), false);
      if (playbackStatus) mergeStatus(JSON.parse(playbackStatus));
      if (playlist) setPlaylist(JSON.parse(playlist), false);
      if (musicbillList) setMusicbillList(JSON.parse(musicbillList));
      else await loadAllMusicbillDetail();
    })();
  }, []);
}
