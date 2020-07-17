import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Layout, Button } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';

import { RootStackParamList } from '../types';

export default class PlayerScreen extends React.Component<
  StackScreenProps<RootStackParamList, 'Player'>
> {
  _goBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const { isPlaying } = this.props;
    return (
      <Layout level="1">
        <View>
          <TouchableOpacity onPress={this._goBack}>
            <Feather name="arrow-left" size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.controller}>
          <Feather name="skip-back" size={24}></Feather>
          <Feather
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={48}
          ></Feather>
          <Feather name="skip-forward" size={24}></Feather>
        </View>
      </Layout>
    );
  }
}
const styles = StyleSheet.create({
  controller: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
