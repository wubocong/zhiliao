import React from 'react';
import { Modal } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import storesContext from '../store';
import MusicbillList from '../components/MusicbillList';
import { Song } from '../types';

interface InjectProps {
  openMusicbillListModal(operatingSong: Song): void;
}
export default function withMusicbillListModal<Props extends InjectProps>(
  WrappedComponent: React.ComponentType<Props>
) {
  class WithMusicbillListModal extends React.Component<
    Omit<Props, keyof InjectProps>,
    {
      modalVisibile: boolean;
      operatingSong?: Song;
    }
  > {
    static contextType = storesContext;
    context!: React.ContextType<typeof storesContext>;
    static displayName: string;
    constructor(props: Omit<Props, keyof InjectProps>) {
      super(props);
      this.state = {
        modalVisibile: false,
        operatingSong: undefined,
      };
    }
    _openModal = (operatingSong: Song) => {
      this.context.globalStore.pushCloseModalFunction(this._closeModal);
      this.setState({ modalVisibile: true, operatingSong });
    };
    _closeModal = () => {
      this.context.globalStore.popCloseModalFunction();
      this.setState({ modalVisibile: false });
    };
    render() {
      return (
        <>
          <WrappedComponent
            {...(this.props as any)}
            openMusicbillListModal={this._openModal}
          />
          <Modal
            visible={this.state.modalVisibile}
            backdropStyle={styles.backdrop}
            onBackdropPress={this._closeModal}
          >
            <MusicbillList
              closeAddToMusicbillModal={this._closeModal}
              operatingSong={this.state.operatingSong!}
            />
          </Modal>
        </>
      );
    }
  }
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithMusicbillListModal.displayName = `WithMusicbillListModal${displayName}`;
  return WithMusicbillListModal;
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
