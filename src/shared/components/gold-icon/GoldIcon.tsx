import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface GoldIconProps {
  size?: number;
  color?: string;
}

const GoldIcon: React.FC<GoldIconProps> = ({size = 16, color = '#fbbf24'}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Gold coin icon */}
      <Path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill={color}
        opacity={0.3}
      />
      <Path
        d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
        fill={color}
        opacity={0.5}
      />
      <Path
        d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
        fill={color}
      />
      {/* Shine effect */}
      <Path
        d="M9 9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"
        fill="#fff"
        opacity={0.4}
      />
    </Svg>
  );
};

export default GoldIcon;

