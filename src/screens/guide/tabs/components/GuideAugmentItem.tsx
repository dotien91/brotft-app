import React, {useMemo, useState, useEffect} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import type {ITftAugment} from '@services/models/tft-augment';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './GuideItemItem.style';
import {getAugmentIconUrlFromPath} from '../../../../utils/metatft';
import {parseAugmentDescription} from '../../../../shared/utils/parseAugmentDescription';
import {translations} from '../../../../shared/localization';
import useStore from '@services/zustand/store';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';

interface GuideAugmentItemProps {
  data: ITftAugment;
  onPress: () => void;
}

const GuideAugmentItem: React.FC<GuideAugmentItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);
  const [localizedName, setLocalizedName] = useState<string | null>(null);
  const [localizedDesc, setLocalizedDesc] = useState<string | null>(null);
  const [localizedEffects, setLocalizedEffects] = useState<any | null>(null);
  const [localizedVariableMatches, setLocalizedVariableMatches] = useState<any | null>(null);

  const {name, icon, stage, trait, unique, desc, tags, effects, variableMatches, apiName} = data;

  // Get localized augment name and description from storage
  useEffect(() => {
    if (!apiName || !language) {
      setLocalizedName(null);
      setLocalizedDesc(null);
      setLocalizedEffects(null);
      setLocalizedVariableMatches(null);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const augmentsKey = `data_augments_${locale}`;
      const augmentsDataString = LocalStorage.getString(augmentsKey);
      
      if (!augmentsDataString) {
        setLocalizedName(null);
        setLocalizedDesc(null);
        setLocalizedEffects(null);
        setLocalizedVariableMatches(null);
        return;
      }

      const augmentsData = JSON.parse(augmentsDataString);
      let localizedAugment: any = null;

      // Find augment by apiName from local storage
      if (augmentsData) {
        if (Array.isArray(augmentsData)) {
          localizedAugment = augmentsData.find((augment: any) => 
            augment.apiName === apiName || augment.apiName === name || augment.name === name
          );
        } else if (typeof augmentsData === 'object' && augmentsData !== null) {
          // Try by apiName as key first
          if (augmentsData[apiName]) {
            localizedAugment = augmentsData[apiName];
          } else {
            // Search through object values
            const augmentsArray = Object.values(augmentsData) as any[];
            localizedAugment = augmentsArray.find((augment: any) => 
              augment.apiName === apiName || augment.apiName === name || augment.name === name
            );
          }
        }
      }

      if (localizedAugment) {
        setLocalizedName(localizedAugment.name || null);
        setLocalizedDesc(localizedAugment.desc || localizedAugment.description || null);
        setLocalizedEffects(localizedAugment.effects || null);
        setLocalizedVariableMatches(localizedAugment.variableMatches || null);
      } else {
        setLocalizedName(null);
        setLocalizedDesc(null);
        setLocalizedEffects(null);
        setLocalizedVariableMatches(null);
      }
    } catch (error) {
      console.error('Error loading localized augment:', error);
      setLocalizedName(null);
      setLocalizedDesc(null);
      setLocalizedEffects(null);
      setLocalizedVariableMatches(null);
    }
  }, [apiName, name, language]);

  // Use localized or fallback to API data
  const displayName = localizedName || name || '---';
  const displayDesc = localizedDesc || desc;
  const displayEffects = localizedEffects || effects;
  const displayVariableMatches = localizedVariableMatches || variableMatches;

  // Parse description with variables
  const parsedDescription = useMemo(() => {
    if (!displayDesc) return null;
    return parseAugmentDescription(displayDesc, displayEffects, displayVariableMatches);
  }, [displayDesc, displayEffects, displayVariableMatches]);

  // Get augment image URL - memoized
  const imageUri = useMemo(() => {
    // Try parsing icon path from API first (e.g., ASSETS/Maps/TFT/Icons/Augments/...)
    if (icon) {
      // If it's already a full URL, use it
      if (icon.startsWith('http')) {
        return icon;
      }
      
      // Try to parse icon path and get MetaTFT URL
      const metatftUrl = getAugmentIconUrlFromPath(icon);
      if (metatftUrl) {
        return metatftUrl;
      }
    }
    
    // Fallback - could use a default augment icon
    return null;
  }, [icon]);

  // Memoize inline styles
  const titleRowStyle = useMemo(() => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
    flexWrap: 'wrap' as const,
  }), []);

  const tagsContainerStyle = useMemo(() => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginLeft: 8,
    flexWrap: 'wrap' as const,
    gap: 6,
  }), []);

  const placeholderIconStyle = useMemo(() => ({
    backgroundColor: colors.primary + '20',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  }), [colors.primary]);

  const placeholderTextStyle = useMemo(() => ({
    color: colors.primary,
    fontSize: 20,
  }), [colors.primary]);

  // Memoize badge styles
  const stageBadgeStyle = useMemo(() => ({
    backgroundColor: colors.card,
    borderColor: colors.border,
  }), [colors.card, colors.border]);

  const traitBadgeStyle = useMemo(() => ({
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary + '40',
  }), [colors.primary]);

  const uniqueBadgeStyle = useMemo(() => ({
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary + '40',
  }), [colors.primary]);

  const tagBadgeStyle = useMemo(() => ({
    backgroundColor: colors.card,
    borderColor: colors.border,
  }), [colors.card, colors.border]);

  const stageTextStyle = useMemo(() => ({
    color: colors.placeholder,
    fontSize: 11,
  }), [colors.placeholder]);

  const traitTextStyle = useMemo(() => ({
    color: colors.primary,
    fontSize: 11,
  }), [colors.primary]);

  const tagTextStyle = useMemo(() => ({
    color: colors.text,
    fontSize: 11,
  }), [colors.text]);
  return (
    <View style={styles.container}>
      {/* Augment Icon */}
      <View style={styles.iconContainer}>
        {imageUri ? (
          <Image
            source={{uri: imageUri}}
            style={styles.icon}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.icon, placeholderIconStyle]}>
            <Text style={placeholderTextStyle}>★</Text>
          </View>
        )}
      </View>

      {/* Augment Info */}
      <View style={styles.infoContainer}>
        {/* Title and Tags */}
        <View style={titleRowStyle}>
          <Text style={styles.itemName} numberOfLines={1}>
            {displayName}
          </Text>
          {(stage || trait || unique || (tags && tags.length > 0)) && (
            <View style={tagsContainerStyle}>
              {stage && (
                <View style={[styles.componentBadge, stageBadgeStyle]}>
                  <Text style={[styles.componentText, stageTextStyle]}>
                    {stage}
                  </Text>
                </View>
              )}
              {trait && (
                <View style={[styles.componentBadge, traitBadgeStyle]}>
                  <Text style={[styles.componentText, traitTextStyle]}>
                    {trait}
                  </Text>
                </View>
              )}
              {unique && (
                <View style={[styles.componentBadge, uniqueBadgeStyle]}>
                  <Text style={[styles.componentText, traitTextStyle]}>
                    {translations.unique}
                  </Text>
                </View>
              )}
              {tags && tags.length > 0 && tags.map((tag, index) => (
                <View 
                  key={index}
                  style={[styles.componentBadge, tagBadgeStyle]}>
                  <Text style={[styles.componentText, tagTextStyle]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Description */}
        {parsedDescription && (
          <Text style={styles.itemDescription}>
            {parsedDescription}
          </Text>
        )}
      </View>
    </View>
  );
};

export default React.memo(GuideAugmentItem, (prevProps, nextProps) => {
  // Only re-render if data.id changes, ignore onPress changes
  return prevProps.data?.id === nextProps.data?.id;
});






