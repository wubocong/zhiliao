import { observable, action } from 'mobx';

export default class GlobalStore {
  @observable closeModalFunction?: () => void;
  @action setCloseModalFunction = (func?: () => void) => {
    this.closeModalFunction = func;
  };
}
