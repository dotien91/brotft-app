import React from 'react';
import {View, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getTraitIconUrl} from '../../../utils/metatft';
import {SCREENS} from '@shared-constants';
import createStyles from '../DetailScreen.style';
import type {TraitData} from './TraitsSection';

interface TraitItemProps {
  trait: TraitData;
  index: number;
}

const TraitItem: React.FC<TraitItemProps> = ({trait, index}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const handleTraitPress = () => {
    if (trait.id) {
      NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId: trait.id});
    }
  };

  // Determine trait tier based on count and breakpoints
  const getTraitTierColor = (): string => {
    if (!trait.breakpoints || trait.breakpoints.length === 0) {
      return colors.border; // Default border color
    }

    // Find the highest breakpoint achieved
    const achievedBreakpoints = trait.breakpoints.filter(bp => trait.count >= bp);
    if (achievedBreakpoints.length === 0) {
      return '#cd7f32'; // Bronze/Đồng - chưa đạt breakpoint nào
    }

    const highestBreakpoint = Math.max(...achievedBreakpoints);
    const breakpointIndex = trait.breakpoints.indexOf(highestBreakpoint);

    // Determine tier based on breakpoint index
    // Bronze: first breakpoint, Silver: second, Gold: third, Diamond: fourth or higher
    if (breakpointIndex === 0) {
      return '#cd7f32'; // Bronze/Đồng
    } else if (breakpointIndex === 1) {
      return '#c0c0c0'; // Silver/Bạc
    } else if (breakpointIndex === 2) {
      return '#ffd700'; // Gold/Vàng
    } else {
      return '#b9f2ff'; // Diamond/Kim cương
    }
  };

  const traitIconUrl = getTraitIconUrl(trait.apiName);
  const tierColor = getTraitTierColor();

  return (
    <RNBounceable
      key={trait.name || index}
      style={styles.traitCardNew}
      onPress={handleTraitPress}
      disabled={!trait.id}>
      {/* Left: Icon */}
      <View style={styles.traitCardIconContainer}>
        <Image
          source={{uri: traitIconUrl}}
          style={[styles.traitCardIconNew, {tintColor: tierColor}]}
          resizeMode="contain"
        />
      </View>
      {/* Right: Name and Breakpoints */}
      <View style={styles.traitCardInfoContainer}>
        <View style={styles.traitCardNameRow}>
          <Text style={[styles.traitCardNameNew, {color: colors.text}]} numberOfLines={1}>
            {trait.name}
          </Text>
        </View>
        {trait.breakpoints && trait.breakpoints.length > 0 && (
          <View style={styles.traitBreakpointsRow}>
            {trait.breakpoints.map((bp, bpIndex) => {
              const isActive = trait.count >= bp;
              return (
                <View key={bpIndex} style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[
                    styles.traitBreakpoint,
                    {color: isActive ? colors.primary : colors.text}
                  ]}>
                    {bp}
                  </Text>
                  {bpIndex < trait.breakpoints.length - 1 && (
                    <Text style={[
                      styles.traitBreakpointSeparator,
                      {color: isActive ? colors.primary : colors.placeholder}
                    ]}>
                      ►
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </RNBounceable>
  );
};

export default TraitItem;

