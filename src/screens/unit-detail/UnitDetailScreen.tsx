import React, {useMemo, useEffect, useState} from 'react';
import {View, Image, ScrollView, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './UnitDetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTftUnitById, useTftUnitByApiName} from '@services/api/hooks/listQueryHooks';
import Hexagon from '@screens/detail/components/Hexagon';
import {getUnitAvatarUrl, getUnitSplashUrl, getTraitIconUrl} from '../../utils/metatft';
import {API_BASE_URL} from '@shared-constants';
import useStore from '@services/zustand/store';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import GoldIcon from '@shared-components/gold-icon/GoldIcon';
import AbilityDescription from '../../shared/components/ability-description/AbilityDescription';
import {translations} from '../../shared/localization';

interface UnitDetailScreenProps {
  route?: {
    params?: {
      unitId?: string;
      unitApiName?: string;
    };
  };
}

const UnitDetailScreen: React.FC<UnitDetailScreenProps> = ({route: routeProp}) => {
  const theme = useTheme();
  const route = useRoute();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const language = useStore((state) => state.language);
  const [localizedName, setLocalizedName] = useState<string | null>(null);
  const [localizedAbilityName, setLocalizedAbilityName] = useState<string | null>(null);
  const [localizedAbilityDesc, setLocalizedAbilityDesc] = useState<string | null>(null);
  const [localizedTooltipElements, setLocalizedTooltipElements] = useState<any[] | null>(null);

  // Update translations when language changes
  useEffect(() => {
    if (language && translations.getLanguage() !== language) {
      translations.setLanguage(language);
    }
  }, [language]);

  const unitId =
    (routeProp?.params?.unitId ||
      (route?.params as any)?.unitId) as string;
  const unitApiName =
    (routeProp?.params?.unitApiName ||
      (route?.params as any)?.unitApiName) as string;

  // Use unitApiName if available, otherwise use unitId
  const {
    data: unitById,
    isLoading: isLoadingById,
    isError: isErrorById,
    error: errorById,
    refetch: refetchById,
  } = useTftUnitById(unitId || '', {
    enabled: !!unitId && !unitApiName,
  });

  const {
    data: unitByApiName,
    isLoading: isLoadingByApiName,
    isError: isErrorByApiName,
    error: errorByApiName,
    refetch: refetchByApiName,
  } = useTftUnitByApiName(unitApiName || '', {
    enabled: !!unitApiName,
  });

  const unit = unitApiName ? unitByApiName : unitById;
  const isLoading = unitApiName ? isLoadingByApiName : isLoadingById;
  const isError = unitApiName ? isErrorByApiName : isErrorById;
  const error = unitApiName ? errorByApiName : errorById;
  const refetch = unitApiName ? refetchByApiName : refetchById;

  // Get localized name from storage
  useEffect(() => {
    if (!unit || !language) {
      setLocalizedName(null);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const unitsKey = `data_units_${locale}`;
      const unitsDataString = LocalStorage.getString(unitsKey);
      
      if (!unitsDataString) {
        setLocalizedName(null);
        return;
      }

      const unitsData = JSON.parse(unitsDataString);
      let localizedUnit: any = null;

      // Handle both array and object formats
      if (Array.isArray(unitsData)) {
        // If it's an array, find the unit
        localizedUnit = unitsData.find((localUnit: any) => {
          // Try to match by apiName first
          if (unit.apiName && localUnit.apiName === unit.apiName) {
            return true;
          }
          // Fallback to name matching (case insensitive)
          if (unit.name && localUnit.name) {
            return unit.name.toLowerCase() === localUnit.name.toLowerCase();
          }
          // Try characterName matching
          if (unit.characterName && localUnit.characterName) {
            return unit.characterName.toLowerCase() === localUnit.characterName.toLowerCase();
          }
          return false;
        });
      } else if (typeof unitsData === 'object' && unitsData !== null) {
        // If it's an object, try to find by apiName as key first
        if (unit.apiName && unitsData[unit.apiName]) {
          localizedUnit = unitsData[unit.apiName];
        } else {
          // Otherwise, search through object values
          const unitsArray = Object.values(unitsData) as any[];
          localizedUnit = unitsArray.find((localUnit: any) => {
            // Try to match by apiName first
            if (unit.apiName && localUnit.apiName === unit.apiName) {
              return true;
            }
            // Fallback to name matching (case insensitive)
            if (unit.name && localUnit.name) {
              return unit.name.toLowerCase() === localUnit.name.toLowerCase();
            }
            // Try characterName matching
            if (unit.characterName && localUnit.characterName) {
              return unit.characterName.toLowerCase() === localUnit.characterName.toLowerCase();
            }
            return false;
          });
        }
      }

      if (localizedUnit) {
        // Set localized name
        if (localizedUnit.name) {
          setLocalizedName(localizedUnit.name);
        } else {
          setLocalizedName(null);
        }
        
        // Set localized ability name and description
        if (localizedUnit.ability) {
          if (localizedUnit.ability.name) {
            setLocalizedAbilityName(localizedUnit.ability.name);
          } else {
            setLocalizedAbilityName(null);
          }
          
          if (localizedUnit.ability.desc || localizedUnit.ability.description) {
            setLocalizedAbilityDesc(localizedUnit.ability.desc || localizedUnit.ability.description);
          } else {
            setLocalizedAbilityDesc(null);
          }
          
          // Set localized tooltipElements
          if (localizedUnit.ability.tooltipElements && Array.isArray(localizedUnit.ability.tooltipElements)) {
            setLocalizedTooltipElements(localizedUnit.ability.tooltipElements);
          } else {
            setLocalizedTooltipElements(null);
          }
        } else {
          setLocalizedAbilityName(null);
          setLocalizedAbilityDesc(null);
          setLocalizedTooltipElements(null);
        }
      } else {
        setLocalizedName(null);
        setLocalizedAbilityName(null);
        setLocalizedAbilityDesc(null);
        setLocalizedTooltipElements(null);
      }
    } catch (error) {
      console.error('Error loading localized unit data:', error);
      setLocalizedName(null);
      setLocalizedAbilityName(null);
      setLocalizedAbilityDesc(null);
      setLocalizedTooltipElements(null);
    }
  }, [unit, language]);

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
        {translations.loadingUnit}
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
        {translations.errorLoadingUnit}
      </Text>
      <Text color={colors.placeholder} style={styles.errorDescription}>
        {error?.message || translations.somethingWentWrong}
      </Text>
      <RNBounceable style={styles.retryButton} onPress={() => refetch()}>
        <Text color={colors.white} bold>
          {translations.retry}
        </Text>
      </RNBounceable>
    </View>
  );

  const renderTraits = () => {
    // TFT units have traits as string array
    const displayTraits = unit?.traits || [];
    
    if (!displayTraits || displayTraits.length === 0) return null;

    return displayTraits.map((trait, index) => {
      const traitName = typeof trait === 'string' ? trait : String(trait);
      const traitIconUrl = getTraitIconUrl(traitName, 20);

      return (
        <RNBounceable
          key={index}
          style={styles.traitBadge}>
          {traitIconUrl ? (
            <Image
              source={{uri: traitIconUrl}}
              style={styles.traitIcon}
              resizeMode="contain"
            />
          ) : (
            <Icon
              name="shield"
              type={IconType.Ionicons}
              color={colors.primary}
              size={16}
            />
          )}
          <Text style={styles.traitText}>{traitName}</Text>
        </RNBounceable>
      );
    });
  };

  const renderContent = () => {
    if (isLoading && !unit) {
      return renderLoading();
    }

    if (isError || !unit) {
      return renderError();
    }

    // Get TFT unit avatar URL from metatft.com
    // Size: 80x80 for hexagon display (70px hexagon needs ~80px image)
    const getTftUnitAvatarUrl = () => {
      // Try API icon fields first
      if (unit?.icon && unit.icon.startsWith('http')) {
        return unit.icon;
      }
      if (unit?.squareIcon && unit.squareIcon.startsWith('http')) {
        return unit.squareIcon;
      }
      
      // Use metatft.com for avatar
      const apiName = unit?.apiName || unit?.name || '';
      return getUnitAvatarUrl(apiName, 80);
    };

    const avatarUri = getTftUnitAvatarUrl();
    // Get splash art for background from metatft.com
    // Size: 768x456 for better quality on larger screens
    const getSplashArtUrl = () => {
      const apiName = unit?.apiName || unit?.name || '';
      return getUnitSplashUrl(apiName, 768, 456);
    };
    
    const splashUri = getSplashArtUrl();

    // Helper function to parse text with variables and icons (reusable for both description and tooltipElements)
    const parseTextWithVariables = (text?: string | null, variables?: any[]) => {
      if (!text) return null;
      
      let parsed = String(text);
      
      // Replace &nbsp; with space first
      parsed = parsed.replace(/&nbsp;/g, ' ');
      // Replace <br> with newline
      parsed = parsed.replace(/<br\s*\/?>/gi, '\n');
      
      // Parse @ variables from ability.variables and calculations
      const varsToUse = variables || unit.ability?.variables;
      const calculations = unit.ability?.calculations;
      
      // Create a map of variable names to values (from both variables and calculations)
      const variableMap: Record<string, any> = {};
      
      // Add variables from ability.variables
      if (varsToUse && Array.isArray(varsToUse) && varsToUse.length > 0) {
        varsToUse.forEach((variable) => {
          if (variable.name) {
            variableMap[variable.name] = variable.value;
          }
        });
      }
      
      // Add calculations (merge with variables, calculations take precedence)
      if (calculations && typeof calculations === 'object') {
        Object.keys(calculations).forEach((key) => {
          variableMap[key] = calculations[key];
        });
      }
      
      if (Object.keys(variableMap).length > 0) {
        
        // Helper function to format a value (handles arrays and single values)
        const formatValue = (val: any): string => {
          if (val === undefined || val === null) return '';
          
          // Handle arrays (stage values: [1⭐, 2⭐, 3⭐])
          if (Array.isArray(val)) {
            if (val.length === 0) return '';
            
            // Check if all values are the same
            const uniqueValues = [...new Set(val)];
            if (uniqueValues.length === 1) {
              // If all values are the same, show only one value
              const singleValue = uniqueValues[0];
              if (typeof singleValue === 'number') {
                if (singleValue < 1 && singleValue > 0) {
                  return `${Math.round(singleValue * 100)}%`;
                } else if (singleValue >= 1) {
                  return String(Math.round(singleValue));
                }
                return String(singleValue);
              }
              return String(singleValue);
            } else {
              // Format each value and join with "/"
              const formattedValues = val.map((v: any) => {
                if (typeof v === 'number') {
                  if (v < 1 && v > 0) {
                    return `${Math.round(v * 100)}%`;
                  } else if (v >= 1) {
                    return String(Math.round(v));
                  }
                  return String(v);
                }
                return String(v);
              });
              return formattedValues.join('/');
            }
          }
          
          // Handle single number
          if (typeof val === 'number') {
            if (val < 1 && val > 0) {
              return `${Math.round(val * 100)}%`;
            } else if (val >= 1) {
              return String(Math.round(val));
            }
            return String(val);
          }
          
          return String(val);
        };
        
        // Helper function to find variable value by name (with various matching strategies)
        const findVariableValue = (key: string): any => {
          // Try direct match
          if (variableMap[key]) {
            return variableMap[key];
          }
          
          // Pattern 1: @ModifiedXXX@ -> look for XXX in variables
          if (key.startsWith('Modified')) {
            const baseKey = key.replace('Modified', '');
            if (variableMap[baseKey]) {
              return variableMap[baseKey];
            }
          }
          
          // Pattern 2: @TFTUnitProperty:KEY@ -> look for KEY in variables
          if (key.startsWith('TFTUnitProperty:')) {
            const baseKey = key.replace('TFTUnitProperty:', '');
            if (variableMap[baseKey]) {
              return variableMap[baseKey];
            }
          }
          
          // Pattern 3: For %i:scaleAD% -> try to find ADDamage, AD, scaleAD, etc.
          const keys = Object.keys(variableMap);
          const keyLower = key.toLowerCase();
          
          // Try exact case insensitive match
          const exactMatch = keys.find(k => k.toLowerCase() === keyLower);
          if (exactMatch) {
            return variableMap[exactMatch];
          }
          
          // Try removing "scale" prefix: scaleAD -> AD, scaleAP -> AP
          if (keyLower.startsWith('scale')) {
            const withoutScale = keyLower.replace(/^scale/, '');
            const matchWithoutScale = keys.find(k => {
              const kLower = k.toLowerCase();
              return kLower === withoutScale || 
                     kLower.includes(withoutScale) || 
                     withoutScale.includes(kLower) ||
                     kLower === `${withoutScale}damage` ||
                     kLower === `damage${withoutScale}`;
            });
            if (matchWithoutScale) {
              return variableMap[matchWithoutScale];
            }
          }
          
          // Try adding "Damage" suffix: scaleAD -> ADDamage, scaleAP -> APDamage
          if (keyLower.includes('ad') || keyLower.includes('ap')) {
            const adMatch = keys.find(k => {
              const kLower = k.toLowerCase();
              return (keyLower.includes('ad') && (kLower.includes('addamage') || kLower === 'ad' || kLower.includes('ad') && kLower.includes('damage'))) ||
                     (keyLower.includes('ap') && (kLower.includes('apdamage') || kLower === 'ap' || kLower.includes('ap') && kLower.includes('damage')));
            });
            if (adMatch) {
              return variableMap[adMatch];
            }
          }
          
          // Pattern 4: Try partial match
          const normalizedKey = keyLower.replace(/^(modified|tftunitproperty:|scale)/i, '');
          const partialMatch = keys.find(k => {
            const normalizedK = k.toLowerCase();
            return normalizedK === normalizedKey || 
                   normalizedK.includes(normalizedKey) || 
                   normalizedKey.includes(normalizedK) ||
                   (normalizedKey.includes('ad') && normalizedK.includes('ad')) ||
                   (normalizedKey.includes('ap') && normalizedK.includes('ap'));
          });
          if (partialMatch) {
            return variableMap[partialMatch];
          }
          
          return null;
        };
        
        // Parse %i:variableName% patterns (e.g., %i:scaleAD%, %i:scaleAP%)
        // First, handle adjacent patterns like (%i:scaleAD%%i:scaleAP%) that should be added together
        const adjacentPercentPattern = /\(?%i:([^%]+)%(%i:([^%]+)%)\)?/g;
        const adjacentMatches: Array<{match: string; index: number; firstKey: string; secondKey: string; firstIcon: string; secondIcon: string}> = [];
        let adjacentMatch;
        
        while ((adjacentMatch = adjacentPercentPattern.exec(parsed)) !== null) {
          const firstKey = adjacentMatch[1]; // e.g., "scaleAD"
          const secondKey = adjacentMatch[3]; // e.g., "scaleAP"
          const fullMatch = adjacentMatch[0];
          
          // Extract icon type from key (AD or AP)
          const firstIcon = firstKey.toUpperCase().includes('AD') ? 'AD' : firstKey.toUpperCase().includes('AP') ? 'AP' : '';
          const secondIcon = secondKey.toUpperCase().includes('AD') ? 'AD' : secondKey.toUpperCase().includes('AP') ? 'AP' : '';
          
          // Get both values
          const firstValue = findVariableValue(firstKey);
          const secondValue = findVariableValue(secondKey);
          
          // Always try to add if both values are found
          if (firstValue !== null && secondValue !== null && firstIcon && secondIcon) {
            adjacentMatches.push({
              match: fullMatch,
              index: adjacentMatch.index,
              firstKey,
              secondKey,
              firstIcon,
              secondIcon,
            });
          }
        }
        
        // Replace adjacent patterns from end to start to preserve indices
        adjacentMatches.reverse().forEach(({match, index, firstKey, secondKey, firstIcon, secondIcon}) => {
          const firstValue = findVariableValue(firstKey);
          const secondValue = findVariableValue(secondKey);
          
          if (firstValue !== null && secondValue !== null) {
            // Add arrays element-wise or add numbers
            let sumValue: any;
            if (Array.isArray(firstValue) && Array.isArray(secondValue)) {
              const maxLength = Math.max(firstValue.length, secondValue.length);
              sumValue = Array.from({length: maxLength}, (_, i) => {
                const val1 = firstValue[i] || 0;
                const val2 = secondValue[i] || 0;
                return (typeof val1 === 'number' ? val1 : 0) + (typeof val2 === 'number' ? val2 : 0);
              });
            } else if (typeof firstValue === 'number' && typeof secondValue === 'number') {
              sumValue = firstValue + secondValue;
            } else {
              sumValue = firstValue;
            }
            
            // Format the sum value
            const formattedSum = formatValue(sumValue);
            if (formattedSum) {
              // Replace with formatted value + icon patterns (without parentheses)
              const replacement = `${formattedSum} %i:${firstIcon}% %i:${secondIcon}%`;
              parsed = parsed.substring(0, index) + replacement + parsed.substring(index + match.length);
            }
          }
        });
        
        // Find all @...@ patterns
        const variablePattern = /@([^@]+)@/g;
        const matches = [...parsed.matchAll(variablePattern)];
        
        // Process matches from end to start to preserve indices
        const matchesArray = Array.from(matches).reverse();
        
        matchesArray.forEach((match) => {
          const fullMatch = match[0];
          const variableKey = match[1];
          const matchIndex = match.index || 0;
          
          // Find the variable value
          const value = findVariableValue(variableKey);
          
          // Format the value
          const formattedValue = formatValue(value);
          
          // Replace the pattern
          if (formattedValue) {
            parsed = parsed.substring(0, matchIndex) + formattedValue + parsed.substring(matchIndex + fullMatch.length);
          }
        });
      }
      
      // Remove HTML tags after parsing
      parsed = parsed.replace(/<[^>]*>/g, '');
      
      // Clean up whitespace
      parsed = parsed.trim();
      parsed = parsed.replace(/\s+/g, ' ');
      parsed = parsed.replace(/\n\s*\n/g, '\n');
      
      return parsed || null;
    };

    // Parse variables in ability description
    const parseAbilityDescription = (desc?: string | null) => {
      if (!unit || !unit.ability) return parseTextWithVariables(desc);
      return parseTextWithVariables(desc, unit.ability.variables);
    };

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Hero Section with overlay */}
        <View style={styles.heroSection}>
          <Image
            source={{uri: splashUri}}
            style={styles.heroImage}
            resizeMode="cover"
            defaultSource={require('@assets/splash/shifaaz-shamoon-unsplash.jpg')}
          />
          <View style={styles.heroOverlay} />
          
          {/* Unit info overlay */}
          <View style={styles.heroContent}>
            <View style={styles.unitHeader}>
              <View style={styles.unitAvatarContainer}>
                <Hexagon 
                  size={70} 
                  backgroundColor="#252836" 
                  borderColor="#3a3d4a" 
                  borderWidth={2}
                  imageUri={avatarUri}
                />
              </View>
              <View style={styles.unitInfo}>
                <Text h1 bold color={colors.text} style={styles.unitName}>
                  {localizedName || unit.name}
                </Text>
                <View style={styles.traitsRow}>
                  {renderTraits()}
                </View>
                {unit.cost !== null && unit.cost !== undefined && (
                  <View style={styles.costBadgeContainer}>
                    <GoldIcon size={18} color="#fbbf24" />
                    <Text style={styles.costBadgeText}>{unit.cost}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Unit Stats */}
        {unit.stats && (
          <View style={styles.unitStatsSection}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="heart" type={IconType.Ionicons} color="#4ade80" size={16} />
                  <Text style={styles.statItemLabel}>{translations.health}</Text>
                </View>
                <Text style={styles.statItemValue}>
                  {unit.stats.hp ? `${unit.stats.hp} / ${Math.floor(unit.stats.hp * 1.8)} / ${Math.floor(unit.stats.hp * 3.24)}` : '---'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="flash" type={IconType.Ionicons} color="#fbbf24" size={16} />
                  <Text style={styles.statItemLabel}>{translations.attackSpeed}</Text>
                </View>
                <Text style={styles.statItemValue}>{unit.stats.attackSpeed ?? '---'}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="fitness" type={IconType.Ionicons} color="#fb923c" size={16} />
                  <Text style={styles.statItemLabel}>{translations.attackDamage}</Text>
                </View>
                <Text style={styles.statItemValue}>
                  {unit.stats.damage ? `${unit.stats.damage} / ${Math.floor(unit.stats.damage * 1.5)} / ${Math.floor(unit.stats.damage * 2.25)}` : '---'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="shield" type={IconType.Ionicons} color="#fb7185" size={16} />
                  <Text style={styles.statItemLabel}>{translations.armor}</Text>
                </View>
                <Text style={styles.statItemValue}>{unit.stats.armor ?? '---'}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="sparkles" type={IconType.Ionicons} color="#c084fc" size={16} />
                  <Text style={styles.statItemLabel}>{translations.dps}</Text>
                </View>
                <Text style={styles.statItemValue}>
                  {unit.stats.damage && unit.stats.attackSpeed ? `${Math.floor(unit.stats.damage * unit.stats.attackSpeed)} / ${Math.floor(unit.stats.damage * 1.5 * unit.stats.attackSpeed * 1.5)} / ${Math.floor(unit.stats.damage * 2.25 * unit.stats.attackSpeed * 2.25)}` : '---'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="color-wand" type={IconType.Ionicons} color="#ec4899" size={16} />
                  <Text style={styles.statItemLabel}>{translations.magicResist}</Text>
                </View>
                <Text style={styles.statItemValue}>{unit.stats.magicResist ?? '---'}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="radio-button-on" type={IconType.Ionicons} color="#60a5fa" size={16} />
                  <Text style={styles.statItemLabel}>{translations.range}</Text>
                </View>
                <Text style={styles.statItemValue}>{unit.stats.range ? '■'.repeat(unit.stats.range) : '---'}</Text>
              </View>
              {unit.stats.mana !== null && unit.stats.mana !== undefined && (
                <View style={styles.statItem}>
                  <View style={styles.statItemHeader}>
                    <Icon name="water" type={IconType.Ionicons} color="#60a5fa" size={16} />
                    <Text style={styles.statItemLabel}>{translations.mana}</Text>
                  </View>
                  <Text style={styles.statItemValue}>
                    {unit.stats.initialMana != null ? `${unit.stats.initialMana} / ${unit.stats.mana}` : `${unit.stats.mana}`}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Ability Section */}
        {unit.ability && (
          <View style={styles.abilitySection}>
            <Text h3 bold color={colors.text} style={styles.sectionTitle}>
              {translations.ability}
            </Text>
            
            <View style={styles.abilityCard}>
              <View style={styles.abilityHeader}>
                <View style={styles.abilityIconContainer}>
                  {unit.ability.icon ? (
                    <Image
                      source={{uri: unit.ability.icon.startsWith('http') ? unit.ability.icon : `${API_BASE_URL}${unit.ability.icon}`}}
                      style={styles.abilityIcon}
                      resizeMode="cover"
                    />
                  ) : avatarUri ? (
                    <Image
                      source={{uri: avatarUri}}
                      style={styles.abilityIcon}
                      resizeMode="cover"
                    />
                  ) : null}
                </View>
                <View style={styles.abilityInfo}>
                  <Text style={styles.abilityName}>
                    {localizedAbilityName || unit.ability.name || translations.ability}
                  </Text>
                  <View style={styles.abilityMeta}>
                    <Icon name="water" type={IconType.Ionicons} color="#60a5fa" size={14} />
                    <Text style={styles.abilityMetaText}>
                      {unit.stats?.initialMana != null && unit.stats?.mana != null 
                        ? `${unit.stats.initialMana} / ${unit.stats.mana}` 
                        : '---'}
                    </Text>
                  </View>
                </View>
              </View>
              
              {(localizedAbilityDesc || unit.ability.desc) && (
                <AbilityDescription
                  description={parseAbilityDescription(localizedAbilityDesc || unit.ability.desc) || ''}
                  style={styles.abilityDescription}
                  textStyle={styles.abilityDescription}
                />
              )}

              {/* Ability Tooltip Elements from Localized Data */}
              {localizedTooltipElements && localizedTooltipElements.length > 0 ? (
                <View style={styles.abilityVariables}>
                  {localizedTooltipElements.map((element: any, index: number) => {
                    // Get text to parse from tooltipElement
                    const elementText = element.text || element.value || element.values || '';
                    const parsedText = parseTextWithVariables(
                      typeof elementText === 'string' ? elementText : String(elementText),
                      unit.ability?.variables
                    );
                    
                    // Get display name
                    const displayName = element.name || element.label || element.key || '';
                    
                    return (
                      <View key={index} style={styles.variableItem}>
                        {displayName && (
                          <Text style={styles.variableName}>{displayName}:</Text>
                        )}
                        {parsedText ? (
                          <AbilityDescription
                            description={parsedText}
                            style={styles.variableValue}
                            textStyle={styles.variableValue}
                          />
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              ) : unit.ability.variables && unit.ability.variables.length > 0 ? (
                // Fallback to API variables if no localized tooltipElements
                <View style={styles.abilityVariables}>
                  {unit.ability.variables.map((variable, index) => (
                    <View key={index} style={styles.variableItem}>
                      <Text style={styles.variableName}>{variable.name}:</Text>
                      <Text style={styles.variableValue}>
                        {Array.isArray(variable.value) 
                          ? variable.value.join(' / ') 
                          : variable.value}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* Suggested Items Section */}
        <View style={styles.augmentsSection}>
          <Text h3 bold color={colors.text} style={styles.sectionTitle}>
            {translations.suggestedItems}
          </Text>
          
          <View style={styles.augmentCard}>
            <View style={styles.augmentHeader}>
              <View style={styles.augmentIconContainer}>
                <Image
                  source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_GuinsoosRageblade.png'}}
                  style={styles.augmentIcon}
                />
                <View style={styles.augmentItemBadges}>
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_RecurveBow.png'}}
                    style={styles.augmentItemBadge}
                  />
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_NeedlesslyLargeRod.png'}}
                    style={styles.augmentItemBadge}
                  />
                </View>
              </View>
              <View style={styles.augmentInfo}>
                <Text style={styles.augmentName}>Vỡ Cực Kiếm</Text>
                <View style={styles.augmentStats}>
                  <View style={styles.augmentStat}>
                    <Icon name="fitness" type={IconType.Ionicons} color="#fb923c" size={14} />
                    <Text style={styles.augmentStatText}>+35%</Text>
                  </View>
                  <View style={styles.augmentStat}>
                    <Icon name="flash" type={IconType.Ionicons} color="#f87171" size={14} />
                    <Text style={styles.augmentStatText}>+35%</Text>
                  </View>
                </View>
                <Text style={styles.augmentDescription}>
                  {translations.abilityCanCrit}
                </Text>
              </View>
            </View>
          </View>
        </View>
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

export default UnitDetailScreen;

