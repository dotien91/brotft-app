import React from 'react';
import Svg, {Path, G} from 'react-native-svg';

interface StatIconProps {
  name: 'AD' | 'AP' | 'AR' | 'MR' | 'HP' | 'AS' | 'MANA' | 'CRIT' | 'LS' | 'OMNIVAMP' | 'CDR' | 'MS' | 'RANGE' | 'DODGE' | 'TENACITY' | 'HEAL' | 'SHIELD' | 'DMG' | 'TRUE' | 'MAGIC' | 'PHYSICAL';
  size?: number;
  color?: string;
}

const StatIcon: React.FC<StatIconProps> = ({name, size = 14, color}) => {
  // SVG paths for each icon
  const iconPaths: Record<string, {viewBox: string; path: string; fill?: string}> = {
    AD: {
      viewBox: '0 0 32 32',
      path: 'M17.1,1.3h3.5v3.5L1.3,24.4v-7.1L17.1,1.3L17.1,1.3z M11.5,17.4l8.2-8.3c0,0,7.7,0,10-5.8 c3.3,13-0.9,28-22.4,27.3C10,27.7,11.9,21.5,11.5,17.4z',
      fill: color || '#BD7E4C',
    },
    AP: {
      viewBox: '0 0 32 32',
      path: 'M28.5,15.5c3.1-3.1,2.9-8.3-0.4-11.5s-8.5-3.5-11.6-0.4L3.3,16.8l6.9-0.2L1.3,30.7l14.1-8.8l-0.1,6.9L28.5,15.5 L28.5,15.5z',
      fill: color || '#9BFFF7',
    },
  };

  const icon = iconPaths[name];
  if (!icon) {
    return null;
  }

  return (
    <Svg width={size} height={size} viewBox={icon.viewBox} fill="none">
      <Path d={icon.path} fill={icon.fill} />
    </Svg>
  );
};

export default StatIcon;

