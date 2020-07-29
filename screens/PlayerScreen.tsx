import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@ui-kitten/components';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { observer, inject } from 'mobx-react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

import { RootStackParamList, MainStackParamList } from '../types';
import PlayerState from '../state/PlayerState';

const DEVICE_WIDTH = Dimensions.get('window').width;
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
    const { togglePlay, setLoopingType, song } = this.props.route.params;
    const {
      isPlaying,
      loopingType,
      playerInstancePosition,
      playerInstanceDuration,
    } = this.props.player.status;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.returnButton} onPress={this._goBack}>
            <Feather name="arrow-left" size={24} />
          </TouchableOpacity>
          <View style={styles.songInfo}>
            <Text>{song?.name}</Text>
            <View style={styles.singerWrapper}>
              <Text style={styles.singer}>{song?.singers[0].name}</Text>
              {song?.singers.slice(1).map((singer, index) => (
                <Text style={styles.singer} key={index}>
                  {'&' + singer.name}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View>
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={1}
            value={playerInstancePosition / playerInstanceDuration}
          />

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
    backgroundColor: '#fff',
  },
  topBar: { justifyContent: 'flex-start', flexDirection: 'row' },
  returnButton: { margin: 20 },
  songInfo: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },
  singerWrapper: {
    flexDirection: 'row',
  },
  singer: {
    fontSize: 12,
  },
  progressBar: {
    margin: 20,
    width: DEVICE_WIDTH - 40,
    height: 40,
  },
  controller: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});
