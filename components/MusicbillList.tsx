import React from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { Text } from '@ui-kitten/components';

import MusicbillListItem from './MusicbillListItem';
import Layout from '../constants/Layout';
import { inject, observer } from 'mobx-react';
import { Musicbill } from '../types';

// @inject('musicbill')
// @observer
// export default class MusicbillList extends React.Component<{ musicbill: MusicbillState }> {
//   render() {
//     const { musicbill } = this.props;
//     return (
//       <View style={styles.container}>
//         <Text style={{ marginBottom: 20, fontSize: 18 }}>收藏到歌单</Text>
//         <ScrollView>
//           <View>
//             {musicbill?.musicbillList.map((musicbill) => (
//               <MusicbillListItem musicbill={musicbill} key={musicbill.id} />
//             ))}
//           </View>
//         </ScrollView>
//       </View>
//     );
//   }
// }
export default function MusicbillList({
  currentSongId,
  musicbillList,
}: {
  currentSongId: string;
  musicbillList: Musicbill[];
}) {
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20, fontSize: 18 }}>收藏到歌单</Text>
      <ScrollView>
        <View>
          {musicbillList.map((musicbill) => (
            <MusicbillListItem musicbill={musicbill} key={musicbill.id} currentSongId={currentSongId} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: Layout.window.width - 40,
    padding: 20,
  },
});
// export default inject('musicbill')(observer(Musicbilllist));
