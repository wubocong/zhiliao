import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList, MainStackParamList } from '../types';

@inject('player')
@observer
export default class PlayerScreen extends React.Component<
  StackScreenProps<RootStackParamList & MainStackParamList, 'Player'>
> {
  componentDidMount() {
    if (!this.props.route.params?._togglePlay) {
      this.props.navigation.replace('Home');
    }
  }
  _goBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const { _togglePlay } = this.props.route.params;
    const { isPlaying } = this.props.player.status;
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TouchableOpacity onPress={this._goBack}>
            <Feather name="arrow-left" size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.controller}>
          <TouchableOpacity>
            <Feather name="skip-back" size={24}></Feather>
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={48}
              onPress={_togglePlay}
            ></Feather>
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="skip-forward" size={24}></Feather>
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="list" size={24} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  controller: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
