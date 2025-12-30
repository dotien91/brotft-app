import React, {useMemo} from 'react';
import {View, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getAugmentIconUrlFromPath} from '../../../utils/metatft';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import useStore from '@services/zustand/store';
import {translations} from '../../../shared/localization';
import createStyles from '../DetailScreen.style';

interface Augment {
  name: string;
  tier: number;
}

const AugmentsSection: React.FC<{augments: Augment[]}> = ({augments}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);

  // Get localized augments data from LocalStorage (same as GuideAugmentItem)
  const augmentsData = useMemo(() => {
    if (!language) return null;
    try {
      const locale = getLocaleFromLanguage(language);
      const augmentsKey = `data_augments_${locale}`;
      const augmentsDataString = LocalStorage.getString(augmentsKey);
      if (augmentsDataString) {
        return JSON.parse(augmentsDataString);
      }
    } catch (error) {
      // Ignore error
    }
    return null;
  }, [language]);

  // Helper function to get augment icon URL (same logic as GuideAugmentItem)
  const getAugmentIcon = (augmentName: string): string | null => {
    if (!augmentsData) {
      return null;
    }

    // Normalize augment name for search
    // Example: "backup-bows" -> "backupbows" (lowercase, remove hyphens/underscores)
    const normalizedName = augmentName.toLowerCase()
      .replace(/-/g, '') // Remove hyphens: "backup-bows" -> "backupbows"
      .replace(/_/g, ''); // Remove underscores
    
    // Also try with "augment_" prefix
    const searchPattern1 = `augment_${normalizedName}`;
    const searchPattern2 = normalizedName;

    // Find augment in LocalStorage data
    let localizedAugment: any = null;
    if (Array.isArray(augmentsData)) {
      localizedAugment = augmentsData.find((a: any) => {
        const aName = a.name?.toLowerCase() || '';
        const aApiName = a.apiName?.toLowerCase() || '';
        
        // Exact match
        if (aName === augmentName.toLowerCase() || aApiName === augmentName.toLowerCase()) {
          return true;
        }
        
        // Include match: check if apiName includes the normalized pattern
        if (aApiName.includes(searchPattern1) || aApiName.includes(searchPattern2)) {
          return true;
        }
        
        // Also check name field
        if (aName.includes(searchPattern1) || aName.includes(searchPattern2)) {
          return true;
        }
        
        return false;
      });
    } else if (typeof augmentsData === 'object' && augmentsData !== null) {
      // Try by apiName as key (exact match)
      const augmentKey = Object.keys(augmentsData).find(key => {
        const keyLower = key.toLowerCase();
        if (keyLower === augmentName.toLowerCase()) {
          return true;
        }
        // Include match
        if (keyLower.includes(searchPattern1) || keyLower.includes(searchPattern2)) {
          return true;
        }
        return false;
      });
      if (augmentKey) {
        localizedAugment = augmentsData[augmentKey];
      } else {
        // Search in values
        const augmentsArray = Object.values(augmentsData) as any[];
        localizedAugment = augmentsArray.find((a: any) => {
          const aName = a.name?.toLowerCase() || '';
          const aApiName = a.apiName?.toLowerCase() || '';
          
          // Exact match
          if (aName === augmentName.toLowerCase() || aApiName === augmentName.toLowerCase()) {
            return true;
          }
          
          // Include match: check if apiName includes the normalized pattern
          if (aApiName.includes(searchPattern1) || aApiName.includes(searchPattern2)) {
            return true;
          }
          
          // Also check name field
          if (aName.includes(searchPattern1) || aName.includes(searchPattern2)) {
            return true;
          }
          
          return false;
        });
      }
    }

    // Get augment image URL - same logic as GuideAugmentItem
    if (localizedAugment?.icon) {
      // If icon is already a full URL, use it
      if (localizedAugment.icon.startsWith('http')) {
        return localizedAugment.icon;
      }
      
      // Try to parse icon path and get MetaTFT URL
      const metatftUrl = getAugmentIconUrlFromPath(localizedAugment.icon);
      if (metatftUrl) {
        return metatftUrl;
      }
    }
    
    // Fallback - return null (will show placeholder)
    return null;
  };

  const renderTierColumn = (tier: number, title: string) => {
    const filtered = augments.filter((a) => a.tier === tier);
    if (filtered.length === 0) return null;

    return (
      <View style={styles.augmentsColumn}>
        <Text style={styles.augmentsColumnTitle}>{title}</Text>
        {filtered.map((augment, index) => {
          const augmentIconUrl = getAugmentIcon(augment.name);

          return (
            <View key={`${augment.name}-${index}`} style={styles.augmentItem}>
              {augmentIconUrl ? (
                <Image
                  source={{uri: augmentIconUrl}}
                  style={styles.augmentIcon}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.augmentIconPlaceholder}>
                  <Icon
                    name="sparkles"
                    type={IconType.Ionicons}
                    color={colors.placeholder}
                    size={16}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.augmentsSection}>
      <Text style={styles.sectionTitle}>{translations.augments || 'Augments'}</Text>
      <View style={styles.augmentsColumnsContainer}>
        {renderTierColumn(1, 'Tier 1')}
        {renderTierColumn(2, 'Tier 2')}
        {renderTierColumn(3, 'Tier 3')}
      </View>
    </View>
  );
};

export default AugmentsSection;