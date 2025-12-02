import React from 'react';
import Svg, {Path, G} from 'react-native-svg';

interface ThreeStarsProps {
  size?: number;
  color?: string;
}

const ThreeStars: React.FC<ThreeStarsProps> = ({
  size = 36,
  color = '#fbbf24',
}) => {
  // Star path (5-pointed star) - viewBox 0 0 24 24
  const starPath =
    'M12 2l2.4 7.2h7.6l-6.2 4.5 2.4 7.2L12 17.4l-6.2 4.5 2.4-7.2L2 9.2h7.6L12 2z';

  const starSize = 12; // Kích thước mỗi sao
  const spacing = 10; // Khoảng cách giữa các sao
  const centerX = size / 3;
  const centerY = size / 2;
  const scale = starSize / 24;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      {/* Star 1 (left) */}
      <G
        transform={`translate(${centerX - spacing}, ${centerY}) scale(${scale})`}>
        <Path d={starPath} fill={color} />
      </G>
      {/* Star 2 (center) */}
      <G transform={`translate(${centerX}, ${centerY}) scale(${scale})`}>
        <Path d={starPath} fill={color} />
      </G>
      {/* Star 3 (right) */}
      <G
        transform={`translate(${centerX + spacing}, ${centerY}) scale(${scale})`}>
        <Path d={starPath} fill={color} />
      </G>
    </Svg>
  );
};

export default ThreeStars;

