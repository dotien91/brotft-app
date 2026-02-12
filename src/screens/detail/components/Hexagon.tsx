import React, {useMemo} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import Svg, {Polygon, Defs, ClipPath, Image as SvgImage} from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';
import {useTheme} from '@react-navigation/native';

interface HexagonProps {
  size?: number;
  borderColor?: string;
  backgroundColor?: string;
  borderWidth?: number;
  children?: React.ReactNode;
  imageUri?: string;
  imageSource?: any;
}

const Hexagon: React.FC<HexagonProps> = ({
  size = 64,
  borderColor = '#444',
  backgroundColor,
  borderWidth = 2,
  children,
  imageUri,
  imageSource,
}) => {
  const {colors} = useTheme();

  // ĐIỀU CHỈNH: Giảm tỷ lệ height xuống để bớt cảm giác bị "dài"
  // Tỷ lệ 1.1 hoặc 1.07 thường cho cảm giác nhìn thuận mắt hơn trên màn hình di động
// Trong Hexagon.tsx
const width = size;
const height = size * 1.1; // Giảm từ 1.15 xuống 1.1 để bớt dài

const points = useMemo(() => {
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Radius chuẩn dựa trên width để các cạnh bằng nhau
  const radius = (size / 2) - (borderWidth / 2);

  return [
    [centerX, centerY - radius * 1.05], // top
    [centerX + radius * 0.866, centerY - radius * 0.5], // top-right
    [centerX + radius * 0.866, centerY + radius * 0.5], // bottom-right
    [centerX, centerY + radius * 1.05], // bottom
    [centerX - radius * 0.866, centerY + radius * 0.5], // bottom-left
    [centerX - radius * 0.866, centerY - radius * 0.5], // top-left
  ].map(p => p.join(',')).join(' ');
}, [width, height, borderWidth, size]);

  // ... (giữ nguyên phần return và styles)

  const fillColor = backgroundColor || (colors as any).hexagonBg || '#222';
  const clipId = useMemo(() => `hexagon-clip-${Math.random().toString(36).substr(2, 9)}`, []);
  return (
    <View style={{width, height, alignItems: 'center', justifyContent: 'center'}}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <ClipPath id={clipId}>
            <Polygon points={points} />
          </ClipPath>
        </Defs>
        {/* Lớp nền và viền */}
        <Polygon
          points={points}
          fill={fillColor}
          stroke={borderColor}
          strokeWidth={borderWidth}
          strokeLinejoin="round"
        />
        {/* Ảnh từ URL */}
        {imageUri && !imageSource && (
          <SvgImage
            href={{uri: imageUri}}
            width={width}
            height={height}
            clipPath={`url(#${clipId})`}
            preserveAspectRatio="xMidYMid slice"
          />
        )}
      </Svg>

      {/* Ảnh Local (require) */}
      {imageSource && (
        <View style={StyleSheet.absoluteFill}>
          <MaskedView
            style={{flex: 1}}
            maskElement={
              <Svg width={width} height={height}>
                <Polygon points={points} fill="white" />
              </Svg>
            }>
            <Image
              source={imageSource}
              style={{width, height}}
              resizeMode="cover"
            />
          </MaskedView>
        </View>
      )}
      
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});

export default Hexagon;