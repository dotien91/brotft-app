import React from 'react';
import {View, type ViewStyle} from 'react-native';
import {Star} from 'phosphor-react-native';

interface ThreeStarsProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

const ThreeStars: React.FC<ThreeStarsProps> = ({
  size = 36,
  color = '#fbbf24',
  style,
}) => {
  // `size` is the overall square box size (width/height).
  // Each star is scaled to fit 3 stars inside the square.
  const starSize = Math.max(6, Math.floor(size * 0.55));
  const spacing = Math.max(1, Math.floor(size * 0.05));

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Star size={starSize} color={color} weight="fill" style={{marginRight: spacing}} />
        <Star size={starSize} color={color} weight="fill" style={{marginRight: spacing}} />
        <Star size={starSize} color={color} weight="fill" />
      </View>
    </View>
  );
};

export default ThreeStars;

