import React from 'react';
import { Modal } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import storesContext from '../store';
import Playlist from '../components/Playlist';

interface InjectProps {
  openPlaylistModal(): void;
}
export default function withPlaylistModal<Props extends InjectProps>(WrappedComponent: React.ComponentType<Props>) {
  class WithPlaylistModal extends React.Component<
  Omit<Props, keyof InjectProps>,
    {
      modalVisibile: boolean;
    }
  > {
    static contextType = storesContext;
    context!: React.ContextType<typeof storesContext>;
    static displayName: string;
    constructor(props: Omit<Props, keyof InjectProps>) {
      super(props);
      this.state = {
        modalVisibile: false,
      };
    }
    _openModal = () => {
      this.context.globalStore.pushCloseModalFunction(this._closeModal);
      this.setState({ modalVisibile: true });
    };
    _closeModal = () => {
      this.context.globalStore.popCloseModalFunction();
      this.setState({ modalVisibile: false });
    };
    render() {
      return (
        <>
          <WrappedComponent
            {...this.props as any}
            openPlaylistModal={this._openModal}
          />
          <Modal
            visible={this.state.modalVisibile}
            backdropStyle={styles.backdrop}
            onBackdropPress={this._closeModal}
          >
            <Playlist />
          </Modal>
        </>
      );
    }
  };
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithPlaylistModal.displayName = `WithPlaylistModal${displayName}`;
  return WithPlaylistModal;
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
