import React, { ReactElement, Children } from 'react';
import {
  TouchableOpacity,
  Image,
  ViewStyle,
  ImageSourcePropType,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

export default function IconButton({
  style,
  onPress,
  children,
}: {
  style?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
  children: ReactElement;
}) {
  return (
    <TouchableOpacity style={[styles.default, style]}>
      {children}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  default: {
    width: 24,
    height: 24,
  },
});
