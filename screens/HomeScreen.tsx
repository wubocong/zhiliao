import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, GestureResponderEvent } from 'react-native';
import { Tab, TabView } from '@ui-kitten/components';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react';

import PlayerBottomBar from '../components/PlayerBottomBar';
import SearchTab from '../components/SearchTab';
import MineTab from '../components/MineTab';
import { MainStackParamList, RootStackParamList } from '../types';
import storesContext from '../store';
import OptionTab from '../components/OptionTab';

type State = {
  selectedIndex: number;
};
@observer
export default class HomeScreen extends React.Component<
  StackScreenProps<MainStackParamList & RootStackParamList, 'Home'>,
  State
> {
  static contextType = storesContext;
  context!: React.ContextType<typeof storesContext>;
  constructor(
    props: StackScreenProps<MainStackParamList & RootStackParamList, 'Home'>
  ) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }
  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
    this.context.globalStore.setNavigation(this.props.navigation);
  }
  _openPlayer = (e: GestureResponderEvent) => {
    e.preventDefault(); // 防止web端点击穿透
    const { currentSong } = this.context.playerStore;
    if (currentSong) this.props.navigation.navigate('Player');
  };

  _setSelectedIndex = (selectedIndex: number) => {
    // react-native-web的bug，打开modal时会以NaN为参数调用这个方法
    if (!Number.isNaN(selectedIndex)) this.setState({ selectedIndex });
  };
  render() {
    const { playlist } = this.context.playerStore;
    const { selectedIndex } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <TabView
          style={{ flex: 1 }}
          selectedIndex={selectedIndex}
          onSelect={this._setSelectedIndex}
        >
          <Tab title="我的">
            <MineTab />
          </Tab>
          <Tab title="发现">
            <SearchTab />
          </Tab>

          <Tab title="设置">
            <OptionTab />
          </Tab>
        </TabView>
        <PlayerBottomBar onPress={this._openPlayer} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
});
