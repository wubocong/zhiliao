import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Layout } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList, MainStackParamList } from '../types';
import PlayerState from '../state/PlayerState';

@inject('player')
@observer
export default class PlayerScreen extends React.Component<
  StackScreenProps<RootStackParamList & MainStackParamList, 'Player'> & {
    player: PlayerState;
  }
> {
  componentDidMount() {
    if (!this.props.route.params) this.props.navigation.replace('Main');
    else if (
      typeof this.props.route.params.togglePlay !== 'function' ||
      typeof this.props.route.params.setLoopingType !== 'function'
    )
      this.props.navigation.replace('Main');
  }
  _goBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    if (!this.props.route.params) return null;
    const { togglePlay, setLoopingType } = this.props.route.params;
    const { isPlaying, loopingType } = this.props.player.status;
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <TouchableOpacity onPress={this._goBack}>
            <Feather name="arrow-left" size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.controller}>
          <TouchableOpacity
            onPress={() => setLoopingType((loopingType + 1) % 3)}
          >
            {loopingType === 0 ? (
              <Entypo name="loop" size={24} />
            ) : loopingType === 1 ? (
              <MaterialCommunityIcons
                name="numeric-1-circle-outline"
                size={24}
              />
            ) : (
              <FontAwesome name="random" size={24} />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="skip-back" size={24}></Feather>
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={48}
              onPress={togglePlay}
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
