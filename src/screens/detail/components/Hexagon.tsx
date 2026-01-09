import React, {useMemo} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Svg, {Polygon, Defs, ClipPath, Image as SvgImage} from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';

interface HexagonProps {
  size?: number;
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  children?: React.ReactNode;
  imageUri?: string;
  imageSource?: any; // Local image source (require())
}

const Hexagon: React.FC<HexagonProps> = ({
  size = 64,
  borderColor = '#2a2d3a',
  backgroundColor = '#1e2130',
  borderWidth = 2,
  children,
  imageUri,
  imageSource,
}) => {
  const width = size;
  const height = size * 1.15; // Hexagon height ratio
  
  // Generate unique ID for clipPath
  const clipId = useMemo(() => `hexagon-clip-${Math.random().toString(36).substr(2, 9)}`, []);
  
  // Calculate hexagon points (flat-top hexagon)
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width / 2;
  
  const points = [
    [centerX, centerY - radius], // top
    [centerX + radius * 0.866, centerY - radius * 0.5], // top-right
    [centerX + radius * 0.866, centerY + radius * 0.5], // bottom-right
    [centerX, centerY + radius], // bottom
    [centerX - radius * 0.866, centerY + radius * 0.5], // bottom-left
    [centerX - radius * 0.866, centerY - radius * 0.5], // top-left
  ].map(p => p.join(',')).join(' ');
  return (
    <View style={[styles.container, {width, height}]}>
      <Svg width={width} height={height} style={styles.svg}>
        <Defs>
          <ClipPath id={clipId}>
            <Polygon points={points} />
          </ClipPath>
        </Defs>
        {/* Background hexagon */}
        <Polygon
          points={points}
          fill={backgroundColor}
          stroke={borderColor}
          strokeWidth={borderWidth}
        />
        {/* Image clipped to hexagon shape (for URL images) */}
        {imageUri && !imageSource && (
          <SvgImage
            href={{uri: imageUri}}
            x="0"
            y="0"
            width={width}
            height={height}
            clipPath={`url(#${clipId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        )}
      </Svg>
      {/* Local image overlay (for require() images) */}
      {imageSource && (
        <MaskedView
          style={styles.localImageContainer}
          maskElement={
            <Svg width={width} height={height} style={styles.localImageSvg}>
              <Polygon points={points} fill="white" />
            </Svg>
          }>
          <Image
            source={imageSource}
            style={[styles.localImage, {width, height}]}
            resizeMode="cover"
          />
        </MaskedView>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  svg: {
    position: 'absolute',
  },
  localImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  localImageSvg: {
    flex: 1,
  },
  localImage: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Hexagon;

