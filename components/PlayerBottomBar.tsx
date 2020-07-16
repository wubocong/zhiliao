import React from 'react';
import { StyleSheet, Image, View } from 'react-native';

export default function BottomBar() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.cover}
        source={{
          uri:
            'https://p2.music.126.net/_UUwBC98AF4ViM5UsO3wlw==/5736152162190997.jpg?param=200y200',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  cover: {
    width: 80,
    height: 80,
  },
});
