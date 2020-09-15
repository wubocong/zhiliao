import { StackNavigationProp } from '@react-navigation/stack';
import { observable, action } from 'mobx';
import { MainStackParamList, RootStackParamList } from '../types';

type Navigation = StackNavigationProp<
  MainStackParamList & RootStackParamList,
  'Home' | 'Login' | 'Main' | 'Musicbill' | 'Player' | 'NotFound'
>;
export default class GlobalStore {
  @observable navigation?: Navigation;
  @observable closeModalFunctionStack: Array<() => void> = [];
  @action pushCloseModalFunction = (func: () => void) => {
    this.closeModalFunctionStack.push(func);
  };
  @action popCloseModalFunction = () => {
    this.closeModalFunctionStack.pop();
  };
  @action setNavigation = (navigation: Navigation) => {
    this.navigation = navigation;
  };
}
