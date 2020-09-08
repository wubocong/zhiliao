import React from 'react';
import { Image, ImageStyle } from 'react-native';

export default function LoopAll({
  style = { width: '100%', height: '100%' },
}: {
  style?: ImageStyle;
}) {
  return (
    <Image
      style={style}
      source={require('../../assets/images/buttons/loop-all.png')}
    />
  );
}
