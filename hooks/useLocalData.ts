import { useEffect } from 'react';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';

import useStores from '../hooks/useStores';
import zlFetch from '../utils/zlFetch';
import { Musicbill } from '../types';

export default function useLocalData() {
  const { musicbillStore:{setMusicbillList,loadAllMusicbillDetail} } = useStores();
  useEffect(() => {
    (async function () {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const musicbillList = await AsyncStorage.getItem('musicbillList');
        if (musicbillList)
          setMusicbillList(JSON.parse(musicbillList));
        else await loadAllMusicbillDetail()
      } catch (err) {
        Toast.show(err.message);
      }
    })();
  }, []);
}
