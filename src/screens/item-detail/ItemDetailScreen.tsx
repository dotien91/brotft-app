import React, {useMemo} from 'react';
import {View, Image, ScrollView, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgUri} from 'react-native-svg';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './ItemDetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useItemById} from '@services/api/hooks/listQueryHooks';
import type {IItem} from '@services/models/item';
import {API_BASE_URL} from '@shared-constants';

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

  const itemId =
    (routeProp?.params?.itemId ||
      (route?.params as any)?.itemId) as string;

  const {
    data: item,
    isLoading,
    isError,
    error,
    refetch,
  } = useItemById(itemId || '');

  const renderBackButton = () => (
    <RNBounceable style={styles.backButton} onPress={() => NavigationService.goBack()}>
      <Icon
        name="arrow-back"
        type={IconType.Ionicons}
        color={colors.text}
        size={24}
      />
    </RNBounceable>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.loadingText}>
        Loading item...
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
        Error loading item
      </Text>
      <Text color={colors.placeholder} style={styles.errorDescription}>
        {error?.message || 'Something went wrong'}
      </Text>
      <RNBounceable style={styles.retryButton} onPress={() => refetch()}>
        <Text color={colors.white} bold>
          Retry
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

    // Get item image URL
    const getItemImageUrl = () => {
      // Try icon field first (from API)
      if (item.icon) {
        // If icon is a full URL
        if (item.icon.startsWith('http')) {
          return item.icon;
        }
        // If icon is a path, try to construct URL
        if (item.icon.startsWith('/') || item.icon.startsWith('ASSETS')) {
          // Try local server first
          if (item.icon.startsWith('/')) {
            return `${API_BASE_URL}${item.icon}`;
          }
        }
      }
      
      if (item.image?.path) {
        if (item.image.path.startsWith('http')) {
          return item.image.path;
        }
        if (item.image.path.startsWith('/')) {
          return `${API_BASE_URL}${item.image.path}`;
        }
      }
      
      if (item.imageUrl) {
        return item.imageUrl;
      }
      
      // Fallback to Data Dragon
      const itemKey = item.apiName || item.name?.toLowerCase() || '';
      return `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/${itemKey}.png`;
    };

    const imageUri = getItemImageUrl();

    // Get components to display - prefer composition from API
    const displayComponents = item.composition || item.components || item.componentDetails || [];

    // Get component image URL
    const getComponentImageUrl = (component: string | IItem) => {
      if (typeof component === 'string') {
        return `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/${component}.png`;
      }
      const componentItem = component as IItem;
      if (componentItem.image?.path) {
        if (componentItem.image.path.startsWith('http')) {
          return componentItem.image.path;
        }
        if (componentItem.image.path.startsWith('/')) {
          return `${API_BASE_URL}${componentItem.image.path}`;
        }
      }
      if (componentItem.imageUrl) {
        return componentItem.imageUrl;
      }
      const itemKey = componentItem.apiName || componentItem.name?.toLowerCase() || '';
      return `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/${itemKey}.png`;
    };

    // Get all effects only
    const effects = item.effects || {};
    
    // Map of stat keys to icon URLs from backend
    const getStatIconUrl = (key: string): string | null => {
      const keyUpper = key.toUpperCase();
      const backendBaseUrl = API_BASE_URL;
      
      // Normalize key to icon name
      let iconName = keyUpper;
      
      // Map common stat keys to icon names
      if (keyUpper === 'AP' || keyUpper === 'ABILITYPOWER') {
        iconName = 'AP';
      } else if (keyUpper === 'AD' || keyUpper === 'ATTACKDAMAGE') {
        iconName = 'AD';
      } else if (keyUpper === 'AS' || keyUpper === 'ATTACKSPEED') {
        iconName = 'AS';
      } else if (keyUpper === 'MR' || keyUpper === 'MAGICRESIST' || keyUpper === 'MAGICRESISTANCE') {
        iconName = 'MR';
      } else if (keyUpper === 'HP' || keyUpper === 'HEALTH') {
        iconName = 'HP';
      } else if (keyUpper === 'MS' || keyUpper === 'MOVEMENTSPEED') {
        iconName = 'MS';
      } else if (keyUpper === 'CD' || keyUpper === 'COOLDOWN') {
        iconName = 'CD';
      } else if (keyUpper === 'CC' || keyUpper === 'CROWDCONTROL') {
        iconName = 'CC';
      } else if (keyUpper === 'ARMOR') {
        iconName = 'Armor';
      } else if (keyUpper === 'BONUSDAMAGE') {
        iconName = 'BonusDamage';
      } else if (keyUpper.length === 2 && /^[A-Z]{2}$/.test(keyUpper)) {
        // For 2-character uppercase keys, use directly
        iconName = keyUpper;
      } else {
        // Capitalize first letter for other keys
        iconName = key.charAt(0).toUpperCase() + key.slice(1);
      }
      
      // Return icon URL from backend
      return `${backendBaseUrl}/icons/${iconName}.svg`;
    };
    
    // Format stat value
    const formatStatValue = (key: string, value: any): string => {
      if (typeof value === 'number') {
        // If it's a percentage (between 0 and 1), show as percentage
        if (value < 1 && value > 0 && (key.toLowerCase().includes('damage') || key.toLowerCase().includes('bonus'))) {
          return `+${Math.round(value * 100)}%`;
        }
        return `+${value}`;
      }
      return `+${value}`;
    };
    
    // Get list of effect keys that are already parsed into description via variableMatches
    const parsedEffectKeys = new Set<string>();
    if (item.variableMatches && item.variableMatches.length > 0) {
      item.variableMatches.forEach((match) => {
        if (match.match) {
          parsedEffectKeys.add(match.match);
        }
      });
    }
    
    // Filter out keys that look like IDs (e.g., "{1543aa48}") and keys already parsed into description
    const validEffects = Object.entries(effects).filter(([key]) => {
      // Exclude keys that look like IDs
      if (key.startsWith('{') || key.startsWith('@')) {
        return false;
      }
      // Exclude keys that are already parsed into description
      if (parsedEffectKeys.has(key)) {
        return false;
      }
      return true;
    });
    
    // Clean description - remove HTML tags and parse variableMatches
    const cleanDescription = (desc?: string, variableMatches?: IItem['variableMatches']) => {
      if (!desc) return null;
      
      let cleaned = desc;
      
      // Replace variableMatches first (before removing @ references)
      if (variableMatches && variableMatches.length > 0) {
        // Replace using full_match first (most accurate)
        variableMatches.forEach((match) => {
          const fullMatch = match.full_match;
          const value = match.value;
          
          if (fullMatch && value !== undefined) {
            // Escape special regex characters in full_match
            const escapedMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedMatch, 'g');
            cleaned = cleaned.replace(regex, String(value));
          } else if (match.match && value !== undefined) {
            // Fallback: use match field to create @match@ pattern
            const pattern = `@${match.match}@`;
            const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedPattern, 'g');
            cleaned = cleaned.replace(regex, String(value));
          }
        });
      }
      
      // Remove HTML tags
      cleaned = cleaned.replace(/<[^>]*>/g, '');
      // Replace <br> with newline
      cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
      // Remove remaining @TFTUnitProperty references that weren't matched
      cleaned = cleaned.replace(/@[^@]*@/g, '');
      // Clean up whitespace
      cleaned = cleaned.trim();
      return cleaned || null;
    };
    
    const description = cleanDescription(item.desc || item.description, item.variableMatches);

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Item Name */}
        <View style={styles.nameSection}>
          <Text h1 bold color={colors.text} style={styles.itemName}>
            {item.name}
          </Text>
        </View>

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
                <Text style={styles.recipeLabel}>Công Thức</Text>
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

            {/* Stats Section */}
            {validEffects.length > 0 && (
              <View style={styles.statsSection}>
                {validEffects.map(([key, value]) => {
                  const iconUrl = getStatIconUrl(key);
                  return (
                    <View key={key} style={styles.statItem}>
                      {iconUrl ? (
                        <SvgUri
                          uri={iconUrl}
                          width={20}
                          height={20}
                        />
                      ) : (
                        <Icon 
                          name="star" 
                          type={IconType.Ionicons} 
                          color={colors.primary} 
                          size={20} 
                        />
                      )}
                      <Text style={styles.statValue}>
                        {formatStatValue(key, value)}
                      </Text>
                    </View>
                  );
                })}
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
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <View style={styles.header}>
          {renderBackButton()}
        </View>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default ItemDetailScreen;

