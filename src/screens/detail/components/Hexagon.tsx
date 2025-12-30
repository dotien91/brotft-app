import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Polygon, Defs, ClipPath, Image as SvgImage} from 'react-native-svg';

interface HexagonProps {
  size?: number;
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  children?: React.ReactNode;
  imageUri?: string;
}

const Hexagon: React.FC<HexagonProps> = ({
  size = 64,
  borderColor = '#2a2d3a',
  backgroundColor = '#1e2130',
  borderWidth = 2,
  children,
  imageUri,
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
        {/* Image clipped to hexagon shape */}
        {imageUri && (
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
  },
  svg: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Hexagon;

