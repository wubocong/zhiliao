import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import BottomBar from '../components/BottomBar';
import { RootStackParamList } from '../types';

export default function MainScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Main'>) {
  return (
    <View style={styles.container}>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
