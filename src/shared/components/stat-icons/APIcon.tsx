import React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

interface APIconProps {
  size?: number;
  color?: string;
}

const APIcon: React.FC<APIconProps> = ({size = 14, color = '#c084fc'}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Magic/Ability Power icon */}
      <Circle cx="12" cy="12" r="8" stroke={color} strokeWidth="2" fill="none" />
      <Path
        d="M12 4v16M4 12h16M8.93 8.93l6.14 6.14M15.07 8.93l-6.14 6.14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default APIcon;

