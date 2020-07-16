import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tab, TabBar } from '@ui-kitten/components';

import PlayerBottomBar from '../components/PlayerBottomBar';
import { RootStackParamList } from '../types';

export default function MainScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Main'>) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <View style={styles.container}>
      <TabBar selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
        <Tab title="我的"></Tab>
        <Tab title="发现" />
      </TabBar>
      <PlayerBottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
});
