import React, { useState, useRef, useCallback } from 'react';
import {
  Animated,
  StyleProp,
  ImageStyle,
  Image as RNImage,
  ImageProps as RNImageProps,
  ImageSourcePropType,
  View,
  StyleSheet,
} from 'react-native';

type ResizeMode = 'contain' | 'cover' | 'stretch' | 'center';

type Props = {
  placeholderUri?: string;
  style?: StyleProp<ImageStyle>;
  priority?: 'low' | 'normal' | 'high' | 'default';
  resizeMode?: ResizeMode;
} & {
  source: { uri: string } | ImageSourcePropType;
} & Omit<RNImageProps, 'source' | 'resizeMode'>;

export const Image: React.FC<Props> = ({
  source,
  style,
  placeholderUri,
  resizeMode = 'cover',
  ...restProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  const handleLoadComplete = useCallback(() => {
    if (isLoaded) return;
    setIsLoaded(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isLoaded, opacity]);

  return (
    <View style={[style, styles.container]}>
      {placeholderUri && !isLoaded && (
        <RNImage
          source={{ uri: placeholderUri }}
          style={StyleSheet.absoluteFill}
          blurRadius={5}
          resizeMode={resizeMode as RNImageProps['resizeMode']}
        />
      )}

      <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
        <RNImage
          source={source}
          style={StyleSheet.absoluteFill}
          resizeMode={resizeMode as RNImageProps['resizeMode']}
          onLoad={handleLoadComplete}
          {...restProps as RNImageProps}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

