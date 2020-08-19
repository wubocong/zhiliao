import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
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
import Layout from '../constants/Layout';
import {
  LOOPING_TYPE_ALL,
  LOOPING_TYPE_ONE,
  LOOPING_TYPE_RANDOM,
} from '../constants/Player';

type State = {
  currentValue: number;
  isSliding: boolean;
};
@inject('player')
@observer
export default class PlayerScreen extends React.Component<
  StackScreenProps<RootStackParamList & MainStackParamList, 'Player'> & {
    player: PlayerState;
  },
  State
> {
  rotateValue = new Animated.Value(0);
  rotateAnimation = Animated.loop(
    Animated.sequence([
      Animated.timing(this.rotateValue, {
        duration: 20000,
        toValue: 1,
        useNativeDriver: false,
        easing: Easing.linear,
      }),
      Animated.timing(this.rotateValue, {
        duration: 0,
        toValue: 0,
        useNativeDriver: false,
        easing: Easing.linear,
      }),
    ])
  );
  constructor(
    props: StackScreenProps<
      RootStackParamList & MainStackParamList,
      'Player'
    > & {
      player: PlayerState;
    }
  ) {
    super(props);
    this.state = {
      currentValue: 0,
      isSliding: false,
    };
  }
  componentDidMount() {
    if (!this.props.player.currentSong) this.props.navigation.replace('Main');
    else if (this.props.player.status.isPlaying) this.rotateAnimation.start();
  }
  _goBack = () => {
    this.props.navigation.goBack();
  };
  _onSlidingComplete = (value: number) => {
    this.setState({ isSliding: false });
    this.props.route.params.setPosition(value);
  };
  _onSlidingStart = (currentValue: number) => {
    this.setState({ isSliding: true, currentValue });
  };
  _togglePlay = () => {
    if (this.props.player.status.isPlaying) {
      this.rotateValue.stopAnimation((value) => {
        this.rotateValue = new Animated.Value(value);
        this.rotateAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(this.rotateValue, {
              duration: Math.floor(20000 * (1 - value)),
              toValue: 1,
              useNativeDriver: false,
              easing: Easing.linear,
            }),
            Animated.timing(this.rotateValue, {
              duration: 0,
              toValue: 0,
              useNativeDriver: false,
              easing: Easing.linear,
            }),
            Animated.timing(this.rotateValue, {
              duration: Math.floor(20000 * value),
              toValue: value,
              useNativeDriver: false,
              easing: Easing.linear,
            }),
          ])
        );
      });
    } else this.rotateAnimation.start();
    this.props.route.params.togglePlay();
  };
  render() {
    // 直接访问这个页面不渲染任何东西
    const { currentSong } = this.props.player;
    if (!currentSong) return null;
    const { setLoopingType, openPlaylist, nextSong } = this.props.route.params;
    const {
      isPlaying,
      loopingType,
      playerInstancePosition,
      playerInstanceDuration,
    } = this.props.player.status;
    const rotateDegree = this.rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.returnButton} onPress={this._goBack}>
            <Feather name="arrow-left" size={24} />
          </TouchableOpacity>
          <View style={styles.songInfo}>
            <Text style={{ fontSize: 18 }}>{currentSong?.name}</Text>
            <View style={styles.singerWrapper}>
              <Text style={styles.singer}>
                {currentSong?.singers?.[0].name}
              </Text>
              {currentSong?.singers?.slice(1).map((singer, index) => (
                <Text style={styles.singer} key={index}>
                  {'&' + singer.name}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.coverWrapper}>
          <Animated.Image
            style={[
              styles.cover,
              {
                transform: [{ rotate: rotateDegree }],
              },
            ]}
            source={{ uri: currentSong?.cover }}
          />
        </View>
        <View>
          <View style={styles.progressBarWrapper}>
            <Slider
              style={styles.progressBar}
              minimumValue={0}
              maximumValue={1}
              onSlidingStart={this._onSlidingStart}
              onSlidingComplete={this._onSlidingComplete}
              value={
                this.state.isSliding
                  ? this.state.currentValue
                  : playerInstancePosition / playerInstanceDuration
              }
            />
          </View>
          <View style={styles.controller}>
            <TouchableOpacity
              onPress={() => setLoopingType((loopingType + 1) % 3)}
            >
              <Entypo
                style={{
                  display: loopingType === LOOPING_TYPE_ALL ? 'flex' : 'none',
                }}
                name="loop"
                size={24}
              />
              <MaterialCommunityIcons
                style={{
                  display: loopingType === LOOPING_TYPE_ONE ? 'flex' : 'none',
                }}
                name="numeric-1-circle-outline"
                size={24}
              />
              <FontAwesome
                style={{
                  display:
                    loopingType === LOOPING_TYPE_RANDOM ? 'flex' : 'none',
                }}
                name="random"
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={nextSong.bind(null, false)}>
              <Feather name="skip-back" size={24}></Feather>
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={48}
                onPress={this._togglePlay}
              ></Feather>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextSong.bind(null, true)}>
              <Feather name="skip-forward" size={24}></Feather>
            </TouchableOpacity>
            <TouchableOpacity onPress={openPlaylist}>
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
  coverWrapper: {
    margin: 20,
  },
  cover: {
    width: Layout.window.width - 40,
    height: Layout.window.width - 40,
    borderRadius: (Layout.window.width - 40) / 2,
  },
  progressBarWrapper: {
    margin: 20,
  },
  progressBar: {
    width: '100%',
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
