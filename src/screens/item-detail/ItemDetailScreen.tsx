import React, {useMemo, useEffect, useState} from 'react';
import {View, ScrollView, ActivityIndicator, Image} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import createStyles from './ItemDetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTftItemById} from '@services/api/hooks/listQueryHooks';
import useStore from '@services/zustand/store';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import BackButton from '@shared-components/back-button/BackButton';
import {getItemImageUrlWithCDN} from '../../utils/metatft';
import {translations} from '../../shared/localization';
import RecommendedUnitsSection from './components/RecommendedUnitsSection';
import ScreenHeaderWithBack from '@shared-components/screen-header-with-back/ScreenHeaderWithBack';

interface ItemDetailScreenProps {
  route?: {
    params?: {
      itemId?: string;
    };
  };
}

const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({route: routeProp}) => {
  const theme = useTheme();
  const route = useRoute();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const language = useStore((state) => state.language);
  
  // Update translations when language changes
  useEffect(() => {
    if (language && translations.getLanguage() !== language) {
      translations.setLanguage(language);
    }
  }, [language]);

  const [localizedDesc, setLocalizedDesc] = useState<string | null>(null);
  const [localizedName, setLocalizedName] = useState<string | null>(null);
  const [localizedIcon, setLocalizedIcon] = useState<string | null>(null);
  const [localizedComposition, setLocalizedComposition] = useState<string[] | null>(null);
  const [localizedEffects, setLocalizedEffects] = useState<any>(null);
  const [localizedUnits, setLocalizedUnits] = useState<string[] | null>(null);

  const itemId =
    (routeProp?.params?.itemId ||
      (route?.params as any)?.itemId) as string;

  const {
    data: item,
    isLoading,
    isError,
    error,
    refetch,
  } = useTftItemById(itemId || '');

  // Get localized name and description from storage
  useEffect(() => {
      if (!item || !language) {
        setLocalizedDesc(null);
        setLocalizedName(null);
        setLocalizedIcon(null);
        setLocalizedComposition(null);
        setLocalizedEffects(null);
        setLocalizedUnits(null);
        return;
      }

    try {
      const locale = getLocaleFromLanguage(language);
      const itemsKey = `data_items_${locale}`;
      const itemsDataString = LocalStorage.getString(itemsKey);
      
      if (!itemsDataString) {
        setLocalizedDesc(null);
        setLocalizedName(null);
        setLocalizedIcon(null);
        setLocalizedComposition(null);
        setLocalizedEffects(null);
        setLocalizedUnits(null);
        return;
      }

      const itemsData = JSON.parse(itemsDataString);
      let localizedItem: any = null;

      // Handle both array and object formats
      if (Array.isArray(itemsData)) {
        // If it's an array, find the item
        localizedItem = itemsData.find((localItem: any) => {
          // Try to match by apiName first
          if (item.apiName && localItem.apiName.toLowerCase() === item.apiName.toLowerCase()) {
            return true;
          }
          // Fallback to name matching (case insensitive)
          if (item.name && localItem.name) {
            return item.name.toLowerCase() === localItem.name.toLowerCase();
          }
          // Try enName matching
          if (item.enName && localItem.enName) {
            return item.enName.toLowerCase() === localItem.enName.toLowerCase();
          }
          return false;
        });
      } else if (typeof itemsData === 'object' && itemsData !== null) {
        // If it's an object, try to find by apiName as key first
        if (item.apiName && itemsData[item.apiName]) {
          localizedItem = itemsData[item.apiName];
        } else {
          // Otherwise, search through object values
          const itemsArray = Object.values(itemsData) as any[];
          localizedItem = itemsArray.find((localItem: any) => {
            // Try to match by apiName first
            if (item.apiName && localItem.apiName === item.apiName) {
              return true;
            }
            // Fallback to name matching (case insensitive)
            if (item.name && localItem.name) {
              return item.name.toLowerCase() === localItem.name.toLowerCase();
            }
            // Try enName matching
            if (item.enName && localItem.enName) {
              return item.enName.toLowerCase() === localItem.enName.toLowerCase();
            }
            return false;
          });
        }
      }

      if (localizedItem) {
        // Set localized name
        if (localizedItem.name) {
          setLocalizedName(localizedItem.name);
        } else {
          setLocalizedName(null);
        }
        
        // Set localized description
        if (localizedItem.desc || localizedItem.description) {
          setLocalizedDesc(localizedItem.desc || localizedItem.description);
        } else {
          setLocalizedDesc(null);
        }
        
        // Set localized icon if available
        if (localizedItem.icon) {
          setLocalizedIcon(localizedItem.icon);
        } else {
          setLocalizedIcon(null);
        }
        
        // Set localized composition if available
        if (localizedItem.composition && Array.isArray(localizedItem.composition)) {
          setLocalizedComposition(localizedItem.composition);
        } else {
          setLocalizedComposition(null);
        }
        
        // Set localized effects if available
        if (localizedItem.effects && typeof localizedItem.effects === 'object') {
          setLocalizedEffects(localizedItem.effects);
        } else {
          setLocalizedEffects(null);
        }
        
        // Set localized units if available
        if (localizedItem.units && Array.isArray(localizedItem.units)) {
          setLocalizedUnits(localizedItem.units);
        } else {
          setLocalizedUnits(null);
        }
      } else {
        // Fallback to API data if no localized item found
        setLocalizedName(item.name || null);
        setLocalizedDesc(item.desc || null);
        setLocalizedIcon(item.icon || null);
        setLocalizedComposition(item.composition || null);
        setLocalizedEffects(item.effects || null);
        // Check if item has units field (may not be in interface but could be in response)
        setLocalizedUnits((item as any).units || null);
      }
    } catch (error) {
      setLocalizedDesc(null);
      setLocalizedName(null);
      setLocalizedIcon(null);
      setLocalizedComposition(null);
      setLocalizedEffects(null);
      setLocalizedUnits(null);
    }
  }, [item, language]);


  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.loadingText}>
        {translations.loadingItem}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Icon
        name="alert-circle"
        type={IconType.Ionicons}
        color={colors.danger}
        size={48}
      />
      <Text h4 color={colors.danger} style={styles.errorText}>
        {translations.errorLoadingItem}
      </Text>
      <Text color={colors.placeholder} style={styles.errorDescription}>
        {error?.message || translations.somethingWentWrong}
      </Text>
      <RNBounceable style={styles.retryButton} onPress={() => refetch()}>
        <Text color={colors.white} style={styles.retryButtonText}>
          {translations.retry}
        </Text>
      </RNBounceable>
    </View>
  );

  const renderContent = () => {
    if (isLoading && !item) {
      return renderLoading();
    }

    if (isError || !item) {
      return renderError();
    }

    // Get item image URL with CDN optimization - chỉ dùng MetaTFT
    // Dùng apiName từ API, icon và name từ localizedItem
    const imageUri = getItemImageUrlWithCDN(
      localizedIcon || item.icon, 
      item.apiName, 
      localizedName || item.name, 
      80
    );
    // Get components to display - prefer composition from localizedItem
    const displayComponents = localizedComposition || item.composition || [];

    // Get component image URL
    const getComponentImageUrl = (component: string) => {
      // Components in ITftItem are strings (apiName)
        return `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/${component}.png`;
    };

    // Parse variables in description (replace @...@ with values from effects)
    const parseDescription = (desc?: string | null) => {
      if (!desc) return null;
      
      let parsed = desc;
      
      // Remove HTML tags first
      parsed = parsed.replace(/<[^>]*>/g, '');
      // Replace <br> with newline
      parsed = parsed.replace(/<br\s*\/?>/gi, '\n');

      // Parse @ variables from effects - dùng localizedEffects nếu có
      const effects = localizedEffects || item.effects;
      if (effects && typeof effects === 'object') {
        // Find all @...@ patterns
        const variablePattern = /@([^@]+)@/g;
        const matches = [...parsed.matchAll(variablePattern)];
        
        matches.forEach((match) => {
          const fullMatch = match[0]; // e.g., "@TFTUnitProperty:AP@"
          const variableKey = match[1]; // e.g., "TFTUnitProperty:AP"
          
          // Try different patterns to extract the key
          let value: any = null;
          
          // Pattern 1: @TFTUnitProperty:KEY@ -> look for KEY in effects
          if (variableKey.startsWith('TFTUnitProperty:')) {
            const key = variableKey.replace('TFTUnitProperty:', '');
            value = effects[key];
          }
          // Pattern 2: @KEY@ -> look for KEY directly in effects
          else {
            value = effects[variableKey];
          }
          
          // Pattern 3: Try with different case variations
          if (value === undefined || value === null) {
            const keys = Object.keys(effects);
            const foundKey = keys.find(k => 
              k.toLowerCase() === variableKey.toLowerCase() ||
              k.toLowerCase() === variableKey.replace('TFTUnitProperty:', '').toLowerCase()
            );
            if (foundKey) {
              value = effects[foundKey];
            }
          }
    
          // Handle stage values (arrays)
          if (Array.isArray(value)) {
            // If it's an array, show as range or all values
            if (value.length > 0) {
              const uniqueValues = [...new Set(value)];
              if (uniqueValues.length === 1) {
                value = uniqueValues[0];
              } else {
                // Show as range: "10/20/30" or "10-30"
                const min = Math.min(...value);
                const max = Math.max(...value);
                if (min === max) {
                  value = min;
                } else {
                  value = `${min}/${max}`;
        }
              }
            } else {
              value = null;
            }
          }
          
          // Replace the variable with the value
          if (value !== undefined && value !== null) {
            // Format the value
            let formattedValue = String(value);
            
            // If it's a number, format it nicely
            if (typeof value === 'number') {
              // If it's a percentage (between 0 and 1), show as percentage
              if (value < 1 && value > 0) {
                formattedValue = `${Math.round(value * 100)}%`;
              } else if (value >= 1) {
                formattedValue = String(Math.round(value));
              }
            }
            
            // Replace all occurrences of this pattern
            parsed = parsed.replace(new RegExp(fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), formattedValue);
          } else {
            // If value not found, remove the variable
            parsed = parsed.replace(new RegExp(fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
          }
        });
      } else {
        // If no effects, remove all @...@ patterns
        parsed = parsed.replace(/@[^@]*@/g, '');
      }
      
      // Clean up whitespace
      parsed = parsed.trim();
      // Remove multiple spaces
      parsed = parsed.replace(/\s+/g, ' ');
      // Remove multiple newlines
      parsed = parsed.replace(/\n\s*\n/g, '\n');
      
      return parsed || null;
    };
    
    // Use localized description if available, otherwise fallback to item.desc
    const description = parseDescription(localizedDesc || item.desc);

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Main Content: Icon + Recipe + Stats */}
        <View style={styles.mainContent}>
          {/* Item Icon - Left */}
          <View style={styles.itemIconContainer}>
            <Image
              source={{uri: imageUri}}
              style={styles.itemIcon}
              resizeMode="cover"
            />
          </View>

          {/* Recipe + Stats - Right */}
          <View style={styles.rightContent}>
            {/* Recipe Section */}
            {displayComponents.length > 0 && (
              <View style={styles.recipeSection}>
                <Text style={styles.recipeLabel}>{translations.recipe}</Text>
                <View style={styles.recipeRow}>
                  {displayComponents.slice(0, 2).map((component, index) => {
                    const componentImage = getComponentImageUrl(component);
                    return (
                      <React.Fragment key={index}>
                        <View style={styles.componentIconContainer}>
                          <Image
                            source={{uri: componentImage}}
                            style={styles.componentIcon}
                            resizeMode="cover"
                          />
                        </View>
                        {index === 0 && displayComponents.length > 1 && (
                          <Text style={styles.plusSign}>+</Text>
                        )}
                      </React.Fragment>
                    );
                  })}
                </View>
              </View>
            )}

          </View>
        </View>

        {/* Description Section */}
        {description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              {description}
            </Text>
          </View>
        )}

        {/* Recommended Units Section */}
        {(localizedUnits || (item as any).units) && (
          <RecommendedUnitsSection 
            units={localizedUnits || (item as any).units || []} 
          />
        )}
      </ScrollView>
    );
  };

  const displayName = item ? (localizedName || item.name || '') : '';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeaderWithBack title={displayName} />
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default ItemDetailScreen;

