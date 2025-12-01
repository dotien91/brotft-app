import React, {useMemo} from 'react';
import {View, Image, StyleSheet, ViewStyle, ImageStyle, TextStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';

interface AugmentTierProps {
  tier: number; // 1 = Silver, 2 = Gold, 3 = Prismatic
  size?: number;
  active?: boolean; // For filter chips
  showLabel?: boolean;
  noBackground?: boolean; // If true, don't show background container (for use in active filter chips)
}

const AugmentTier: React.FC<AugmentTierProps> = ({
  tier,
  size = 20,
  active = false,
  showLabel = true,
  noBackground = false,
}) => {
  const theme = useTheme();
  const {colors} = theme;

  const tierConfig = useMemo(() => {
    switch (tier) {
      case 1:
        return {
          label: 'Silver',
          roman: 'I',
          iconUrl: 'https://cdn.metatft.com/file/metatft/augments/missing-t1.png',
          color: '#c0c0c0', // Silver
        };
      case 2:
        return {
          label: 'Gold',
          roman: 'II',
          iconUrl: 'https://cdn.metatft.com/file/metatft/augments/missing-t2.png',
          color: '#ffd700', // Gold
        };
      case 3:
        return {
          label: 'Prismatic',
          roman: 'III',
          iconUrl: 'https://cdn.metatft.com/file/metatft/augments/missing-t3.png',
          color: '#9d4edd', // Prismatic purple
        };
      default:
        return {
          label: 'Unknown',
          roman: '?',
          iconUrl: null,
          color: colors.placeholder,
        };
    }
  }, [tier, colors.placeholder]);

  const dynamicStyles = useMemo(() => {
    const baseColor = tierConfig.color;
    const activeBgColor = baseColor + '20';
    const activeBorderColor = baseColor + '40';
    const activeTextColor = baseColor + '80';

    return StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: noBackground ? 'transparent' : (active ? activeBgColor : 'transparent'),
        paddingHorizontal: noBackground ? 0 : 8,
        paddingVertical: noBackground ? 0 : 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        gap: 6,
        borderWidth: noBackground ? 0 : (active ? 1 : 0),
        borderColor: noBackground ? 'transparent' : (active ? activeBorderColor : 'transparent'),
        opacity: active ? 0.8 : 1,
      },
      iconContainer: {
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: colors.background,
      },
      icon: {
        width: '100%',
        height: '100%',
      },
      text: {
        fontSize: size * 0.7,
        fontWeight: active ? '600' : '700',
        color: active ? activeTextColor : baseColor,
        letterSpacing: 0.2,
      },
    });
  }, [size, active, noBackground, tierConfig.color, colors.background]);

  return (
    <View style={dynamicStyles.container}>
      {tierConfig.iconUrl && (
        <View style={dynamicStyles.iconContainer}>
          <Image
            source={{uri: tierConfig.iconUrl}}
            style={dynamicStyles.icon}
            resizeMode="cover"
          />
        </View>
      )}
      {showLabel && (
        <Text style={dynamicStyles.text}>
          {tierConfig.label} {tierConfig.roman}
        </Text>
      )}
    </View>
  );
};

export default AugmentTier;

