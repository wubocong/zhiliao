import React from 'react';
import { Text, Modal, Layout, Button } from '@ui-kitten/components';
import { StyleSheet, View } from 'react-native';
import { IReactComponent } from 'mobx-react/dist/types/IReactComponent';

import Device from '../constants/Device';
import storesContext from '../store';

export default function withConfirm(WrappedComponent: IReactComponent) {
  return class extends React.Component<
    any,
    {
      modalVisibile: boolean;
      title?: string;
      cancelButtonText?: string;
      confirmButtonText?: string;
      content?: JSX.Element | string;
    }
  > {
    static contextType = storesContext;
    context!: React.ContextType<typeof storesContext>;
    callback?: () => void;
    constructor(props: any) {
      super(props);
      this.state = {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        content: undefined,
        modalVisibile: false,
        title: undefined,
      };
    }
    _confirm = ({
      callback,
      cancelButtonText = '取消',
      confirmButtonText = '确定',
      content,
      title,
    }: {
      callback: () => void;
      cancelButtonText?: string;
      confirmButtonText?: string;
      content: JSX.Element | string;
      title?: string;
    }) => {
      this.callback = callback;
      this.context.globalStore.setCloseModalFunction(this._closeModal);
      this.setState({
        cancelButtonText,
        confirmButtonText,
        content,
        modalVisibile: true,
        title,
      });
    };
    _closeModal = () => {
      this.setState({ modalVisibile: false });
    };
    _onConfirm = () => {
      this.callback && this.callback();
      this.setState({ modalVisibile: false });
    };
    render() {
      return (
        <>
          <WrappedComponent confirm={this._confirm} {...this.props} />
          <Modal
            visible={this.state.modalVisibile}
            backdropStyle={styles.backdrop}
            onBackdropPress={this._closeModal}
          >
            <Layout style={styles.container} level="1">
              {this.state.title && (
                <Text style={{ marginBottom: 8, fontSize: 18 }}>
                  {this.state.title}
                </Text>
              )}
              {typeof this.state.content === 'string' ? (
                <Text style={{ textAlign: 'center' }}>
                  {this.state.content}
                </Text>
              ) : (
                this.state.content
              )}
              <View style={styles.buttons}>
                <Button appearance="ghost" onPress={this._closeModal}>
                  {this.state.cancelButtonText}
                </Button>
                <Button appearance="ghost" onPress={this._onConfirm}>
                  {this.state.confirmButtonText}
                </Button>
              </View>
            </Layout>
          </Modal>
        </>
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 10,
    width: Device.window.width - 80,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
