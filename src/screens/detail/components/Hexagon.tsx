import React from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Polygon} from 'react-native-svg';

interface HexagonProps {
  size?: number;
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  children?: React.ReactNode;
}

const Hexagon: React.FC<HexagonProps> = ({
  size = 64,
  borderColor = '#2a2d3a',
  backgroundColor = '#1e2130',
  borderWidth = 2,
  children,
}) => {
  const width = size;
  const height = size * 1.15; // Hexagon height ratio
  
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
        {/* Background hexagon */}
        <Polygon
          points={points}
          fill={backgroundColor}
          stroke={borderColor}
          strokeWidth={borderWidth}
        />
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

