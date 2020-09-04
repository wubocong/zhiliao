import { useEffect } from 'react';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-community/async-storage';

import useStores from '../hooks/useStores';
import zlFetch from '../utils/zlFetch';

export default function useLocalData() {
  const { musicbillStore } = useStores();
  useEffect(() => {
    (async function () {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const musicbillList = await AsyncStorage.getItem('musicbillList');
        if (musicbillList)
          musicbillStore.setMusicbillList(JSON.parse(musicbillList));
        else {
          const data = await zlFetch(
            'https://engine.mebtte.com/1/musicbill/list',
            {
              token: true,
            }
          );
          musicbillStore.setMusicbillList(data);
        }
      } catch (err) {
        Toast.show(err.message);
      }
    })();
  }, []);
}
