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
console.log('trait', trait);
  const handleTraitPress = () => {
    if (trait.id) {
      NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId: trait.id});
    }
  };

  const traitIconUrl = getTraitIconUrl(trait.apiName);

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
            style={styles.traitCardIconNew}
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

