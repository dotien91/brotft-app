import React, {useState, useEffect} from 'react';
import {View, Image, ViewStyle, ImageStyle, TextStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getTraitIconUrl} from '../../../utils/metatft';
import {SCREENS} from '@shared-constants';
import createStyles from '../DetailScreen.style';
import type {TraitData} from './TraitsSection';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import useStore from '@services/zustand/store';

interface TraitItemProps {
  trait: TraitData | (string | {
    name: string;
    apiName?: string;
    id?: string;
  });
  index: number;
  variant?: 'card' | 'badge'; // 'card' for detail composition, 'badge' for tab unit
  badgeStyle?: ViewStyle;
  badgeIconStyle?: ImageStyle;
  badgeTextStyle?: TextStyle;
}

const TraitItem: React.FC<TraitItemProps> = ({
  trait,
  index,
  variant = 'card',
  badgeStyle,
  badgeIconStyle,
  badgeTextStyle,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const language = useStore(state => state.language);
  const [localizedName, setLocalizedName] = useState<string | null>(null);

  // Normalize trait data
  const isTraitData = (t: any): t is TraitData => {
    return typeof t === 'object' && 'count' in t && 'breakpoints' in t;
  };

  const isString = typeof trait === 'string';
  const traitData: TraitData | null = isTraitData(trait) ? trait : null;
  const traitObj = isString ? null : (trait as any);
  
  const initialTraitName = isString ? trait : (traitData?.name || traitObj?.name || '');
  const traitApiName = traitData?.apiName || traitObj?.apiName || initialTraitName;
  const traitId = traitData?.id || traitObj?.id;
  const traitBreakpoints = traitData?.breakpoints;
  const traitCount = traitData?.count;

  // Get localized trait name from localstorage
  useEffect(() => {
    if (!initialTraitName || !traitApiName || !language) {
      setLocalizedName(null);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const traitsKey = `data_traits_${locale}`;
      const traitsDataString = LocalStorage.getString(traitsKey);
      
      if (!traitsDataString) {
        setLocalizedName(null);
        return;
      }

      const traitsData = JSON.parse(traitsDataString);
      let traitDetail: any = null;

      // Find trait detail from local storage
      if (traitsData) {
        if (Array.isArray(traitsData)) {
          traitDetail = traitsData.find((t: any) => 
            t.name === initialTraitName || t.apiName === traitApiName || t.apiName === initialTraitName
          );
        } else if (typeof traitsData === 'object' && traitsData !== null) {
          traitDetail = Object.values(traitsData).find((t: any) => 
            t.name === initialTraitName || t.apiName === traitApiName || t.apiName === initialTraitName
          );
        }
      }

      if (traitDetail?.name) {
        setLocalizedName(traitDetail.name);
      } else {
        setLocalizedName(null);
      }
    } catch (error) {
      console.error('Error loading localized trait name:', error);
      setLocalizedName(null);
    }
  }, [initialTraitName, traitApiName, language]);

  // Use localized name if available, otherwise use initial name
  const traitName = localizedName || initialTraitName;

  const handleTraitPress = () => {
    if (traitId) {
      NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId});
    }
  };
  // Determine trait tier based on count and breakpoints (only for card variant)
  const getTraitTierColor = (): string => {
    if (variant === 'badge' || !traitBreakpoints || traitBreakpoints.length === 0) {
      return colors.border; // Default border color
    }

    // Find the highest breakpoint achieved
    const achievedBreakpoints = traitBreakpoints.filter(bp => (traitCount || 0) >= bp);
    if (achievedBreakpoints.length === 0) {
      return '#cd7f32'; // Bronze/Đồng - chưa đạt breakpoint nào
    }

    const highestBreakpoint = Math.max(...achievedBreakpoints);
    const breakpointIndex = traitBreakpoints.indexOf(highestBreakpoint);

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

  const traitIconUrl = getTraitIconUrl(traitApiName);
  const tierColor = getTraitTierColor();
  const hasId = traitId !== undefined;

  // Badge variant (for tab unit)
  if (variant === 'badge') {
    return (
      <RNBounceable
        key={traitName || index}
        style={[styles.traitBadge, badgeStyle]}
        onPress={handleTraitPress}
        disabled={!hasId}>
        {traitIconUrl ? (
          <Image
            source={{uri: traitIconUrl}}
            style={[styles.traitIcon, badgeIconStyle]}
            resizeMode="contain"
          />
        ) : null}
        <Text style={[styles.traitText, badgeTextStyle]} numberOfLines={1}>
          {traitName}
        </Text>
      </RNBounceable>
    );
  }
  return (
    <RNBounceable
      key={traitName || index}
      style={styles.traitCardNew}
      onPress={handleTraitPress}
      disabled={!hasId}>
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
            {traitName}
          </Text>
        </View>
        {traitBreakpoints && traitBreakpoints.length > 0 && (
          <View style={styles.traitBreakpointsRow}>
            {traitBreakpoints.map((bp, bpIndex) => {
              const isActive = (traitCount || 0) >= bp;
              return (
                <View key={bpIndex} style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[
                    styles.traitBreakpoint,
                    {color: isActive ? colors.primary : colors.text}
                  ]}>
                    {bp}
                  </Text>
                  {bpIndex < traitBreakpoints.length - 1 && (
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

