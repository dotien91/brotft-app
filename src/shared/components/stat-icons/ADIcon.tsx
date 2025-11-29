import React from 'react';
import Svg, {Path} from 'react-native-svg';

interface ADIconProps {
  size?: number;
  color?: string;
}

const ADIcon: React.FC<ADIconProps> = ({size = 14, color = '#fb923c'}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Sword/Attack Damage icon */}
      <Path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
};

export default ADIcon;

