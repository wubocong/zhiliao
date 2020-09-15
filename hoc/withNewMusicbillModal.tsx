import React from 'react';
import { Modal } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

import storesContext from '../store';
import NewMusicbill from '../components/NewMusicbill';

interface InjectProps {
  openNewMusicbillModal(): void;
}
export default function withNewMusicbillModal<Props extends InjectProps>(
  WrappedComponent: React.ComponentType<Props>
) {
   class WithNewMusicbillModal extends React.Component<
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
            openNewMusicbillModal={this._openModal}
          />
          <Modal
            visible={this.state.modalVisibile}
            backdropStyle={styles.backdrop}
            onBackdropPress={this._closeModal}
          >
            <NewMusicbill closeNewMusicbillModal={this._closeModal} />
          </Modal>
        </>
      );
    }
  };
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithNewMusicbillModal.displayName=`WithNewMusicbillModal${displayName}`;
  return WithNewMusicbillModal;
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
