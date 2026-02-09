import React, {useMemo, useEffect, useState} from 'react';
import {View, ScrollView, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from '@shared-components/icon/Icon';
import createStyles from './UnitDetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTftUnitById, useTftUnitByApiName} from '@services/api/hooks/listQueryHooks';
import Hexagon from '@screens/detail/components/Hexagon';
import {getUnitSplashUrl, getUnitAbilityIconUrlFromPath} from '../../utils/metatft';
import getUnitAvatar from '../../utils/unit-avatar';
import {getUnitCostBorderColor as getUnitCostBorderColorUtil} from '../../utils/unitCost';
import useStore from '@services/zustand/store';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import AbilityDescription from '../../shared/components/ability-description/AbilityDescription';
import TooltipElements from '../../shared/components/tooltip-elements/TooltipElements';
import {parseTextWithVariables} from '../../shared/utils/parseTextWithVariables';
import {translations} from '../../shared/localization';
import UnitCostBadge from '@screens/detail/components/UnitCostBadge';
import BackButton from '@shared-components/back-button/BackButton';
import UnitTraitsDisplay from './components/UnitTraitsDisplay';
import ReferenceCompositionsSection from './components/ReferenceCompositionsSection';
import PopularItemsSection from './components/PopularItemsSection';

// Popular items list
const POPULAR_ITEMS = [
  'TFT_Item_InfinityEdge',
  'TFT_Item_GuinsoosRageblade',
  'TFT_Item_SpearOfShojin',
  'TFT_Item_MadredsBloodrazor',
  'TFT_Item_RunaansHurricane',
  'TFT_Item_Deathblade',
  'TFT_Item_LastWhisper',
  'TFT_Item_RapidFireCannon',
  'TFT_Item_PowerGauntlet',
  'TFT_Item_BlueBuff',
];

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
  // Có thể là string hoặc object (chứa levelRequired, conditions,...)
  const [localizedUnlockText, setLocalizedUnlockText] = useState<any | null>(null);

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
  } = useTftUnitById(unitId || '');
console.log("unitById" , unitApiName, unitId);
  const {
    data: unitByApiName,
    isLoading: isLoadingByApiName,
    isError: isErrorByApiName,
    error: errorByApiName,
    refetch: refetchByApiName,
  } = useTftUnitByApiName(unitApiName || '');

  const unit = unitApiName ? unitByApiName : unitById;
  const isLoading = unitApiName ? isLoadingByApiName : isLoadingById;
  const isError = unitApiName ? isErrorByApiName : isErrorById;
  const error = unitApiName ? errorByApiName : errorById;
  const refetch = unitApiName ? refetchByApiName : refetchById;

  // Flag từ API: chỉ show unlock khi needUnlock = true
  const needUnlock = !!(unit && (unit as any).needUnlock);
  // Get localized name, ability & unlock info from storage (per language)
  useEffect(() => {
    if (!unit || !language) {
      setLocalizedName(null);
      setLocalizedUnlockText(null);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const unitsKey = `data_units_${locale}`;
      const unitsDataString = LocalStorage.getString(unitsKey);
      
      if (!unitsDataString) {
        setLocalizedName(null);
        setLocalizedUnlockText(null);
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

        // Set localized unlock info (from local data)
        if (
          localizedUnit.unlockInfo ||
          localizedUnit.unlock ||
          localizedUnit.unlock_text
        ) {
          setLocalizedUnlockText(
            localizedUnit.unlockInfo ||
              localizedUnit.unlock ||
              localizedUnit.unlock_text,
          );
        } else {
          setLocalizedUnlockText(null);
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
        setLocalizedUnlockText(null);
        setLocalizedAbilityName(null);
        setLocalizedAbilityDesc(null);
        setLocalizedTooltipElements(null);
      }
    } catch (error) {
      console.error('Error loading localized unit data:', error);
      setLocalizedName(null);
      setLocalizedUnlockText(null);
      setLocalizedAbilityName(null);
      setLocalizedAbilityDesc(null);
      setLocalizedTooltipElements(null);
    }
  }, [unit, language]);


  // Unlock info ưu tiên lấy từ data local theo ngôn ngữ,
  // fallback nhẹ sang field từ API nếu local không có.
  // Đảm bảo luôn convert sang string trước khi render.
  const unlockText: string | null = useMemo(() => {
    const rawFromLocal = localizedUnlockText;

    const getRawFromApi = () => {
      if (!unit) {
        return null;
      }
      const anyUnit: any = unit;
      return (
        anyUnit.unlockInfo ??
        anyUnit.unlock_text ??
        anyUnit.unlockKey ??
        anyUnit.unlock ??
        null
      );
    };

    const raw = rawFromLocal ?? getRawFromApi();
    if (raw == null) {
      return null;
    }

    if (typeof raw === 'string') {
      return raw;
    }

    if (typeof raw === 'number' || typeof raw === 'boolean') {
      return String(raw);
    }

    if (typeof raw === 'object') {
      try {
        const {levelRequired, manual_conditions, conditions} = raw as any;
        const parts: string[] = [];

        if (levelRequired != null) {
          parts.push(`${translations.level} ${levelRequired}`);
        }

        if (manual_conditions) {
          parts.push(String(manual_conditions));
        }

        if (Array.isArray(conditions) && conditions.length > 0) {
          const conditionTexts = conditions
            .map((c: any) => {
              if (!c) {
                return null;
              }
              // Ưu tiên mô tả dễ đọc
              if (c.description) {
                return String(c.description);
              }
              if (c.milestoneName) {
                return String(c.milestoneName);
              }
              if (c.DescriptionTra) {
                return String(c.DescriptionTra);
              }
              // Fallback: stringify gọn
              try {
                return JSON.stringify(c);
              } catch {
                return null;
              }
            })
            .filter(Boolean) as string[];

          if (conditionTexts.length > 0) {
            parts.push(conditionTexts.join(' • '));
          }
        }

        if (parts.length > 0) {
          return parts.join(' • ');
        }
      } catch (e) {
        // ignore and fallback to JSON stringify
      }

      try {
        return JSON.stringify(raw);
      } catch {
        return null;
      }
    }

    return null;
  }, [localizedUnlockText, unit]);


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


  const renderContent = () => {
    if (isLoading && !unit) {
      return renderLoading();
    }

    if (isError || !unit) {
      return renderError();
    }

    // Get TFT unit avatar image source (local only)
    // Size: 80x80 for hexagon display (70px hexagon needs ~80px image)
    const getTftUnitAvatarSource = () => {
      // Try API icon fields first (if they're local paths)
      if (unit?.icon && !unit.icon.startsWith('http')) {
        // Could be a local path, but we'll use apiName for consistency
      }
      if (unit?.squareIcon && !unit.squareIcon.startsWith('http')) {
        // Could be a local path, but we'll use apiName for consistency
      }
      
      // Use local image only
      const apiName = unit?.apiName || unit?.name || '';
      return getUnitAvatar(apiName, 80);
    };

    const avatarSource = getTftUnitAvatarSource();
    const avatarUri = avatarSource.local ? undefined : avatarSource.uri;
    // Get splash art for background from metatft.com
    // Size: 768x456 for better quality on larger screens
    const getSplashArtUrl = () => {
      const apiName = unit?.apiName || unit?.name || '';
      return getUnitSplashUrl(apiName, 768, 456);
    };
    
    const splashUri = getSplashArtUrl();

    // Get unit border color based on cost
    const getUnitCostBorderColor = (cost?: number | null): string => {
      return getUnitCostBorderColorUtil(cost, colors.highlight || '#94a3b8');
    };

    const borderColor = getUnitCostBorderColor(unit.cost);

    // Parse variables in ability description
    const parseAbilityDescription = (desc?: string | null) => {
      if (!unit || !unit.ability) return parseTextWithVariables(desc, undefined, unit);
      return parseTextWithVariables(desc, unit.ability.variables, unit);
    };

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Hero Section with overlay */}
        <View style={styles.heroSection}>
          <FastImage
            source={{
              uri: splashUri,
              priority: FastImage.priority.high,
            }}
            style={styles.heroImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.heroOverlay} />
          
          {/* Unit info overlay */}
          <View style={styles.heroContent}>
            <View style={styles.unitHeader}>
              <View style={styles.unitAvatarContainer}>
                <Hexagon
                  size={70}
                  borderColor={borderColor} 
                  borderWidth={2}
                  imageUri={avatarUri}
                  imageSource={avatarSource.local}
                />
              </View>
              <View style={styles.unitInfo}>
                <View style={styles.unitNameRow}>
                  <Text h1 bold color={colors.text} style={styles.unitName}>
                    {localizedName || unit.name}
                  </Text>
                  {needUnlock && (
                    <FastImage
                      source={require('@assets/icons/unlock.png')}
                      style={styles.unlockIcon}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  )}
                </View>
                <UnitTraitsDisplay  fromDetailScreen={true} unit={unit} />
                {unit.cost !== null && unit.cost !== undefined && (
                  <UnitCostBadge cost={unit.cost} />
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
                  {(() => {
                    // Priority 1: Parse icon path from API and get URL from metatft.com
                    // Example: "ASSETS/Characters/TFT16_Sona/HUD/Icons2D/TFT16_Sona_Passive_Charged.TFT_Set16.tex"
                    // -> "https://cdn.metatft.com/file/metatft/champions/tft16_sona_passive_charged.png"
                    if (unit.ability?.icon) {
                      const abilityIconUrl = getUnitAbilityIconUrlFromPath(unit.ability.icon);
                      if (abilityIconUrl) {
                        return (
                    <FastImage
                            source={{uri: abilityIconUrl, priority: FastImage.priority.normal}}
                      style={styles.abilityIcon}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                        );
                      }
                    }
                    
                    // Fallback to unit avatar
                    if (avatarUri) {
                      return (
                    <FastImage
                      source={{uri: avatarUri, priority: FastImage.priority.normal}}
                      style={styles.abilityIcon}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                      );
                    }
                    
                    return null;
                  })()}
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
              {localizedTooltipElements && localizedTooltipElements.length > 0 && (
                <TooltipElements
                  tooltipElements={localizedTooltipElements}
                  unit={unit}
                  styles={{
                    abilityVariables: styles.abilityVariables,
                    variableItem: styles.variableItem,
                    variableValue: styles.variableValue,
                  }}
                />
              )}
            </View>
          </View>
        )}

        {/* Unlock Section riêng - chỉ hiển thị khi API đánh dấu needUnlock */}
        {needUnlock && unlockText && (
          <View style={styles.unlockSection}>
            <Text h3 bold color={colors.text} style={styles.sectionTitle}>
              {translations.unlock}
            </Text>
            <View style={styles.unlockCard}>
              <View style={styles.unlockRow}>
                <FastImage
                  source={require('@assets/icons/unlock.png')}
                  style={styles.unlockIcon}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <Text style={styles.unlockText}>{unlockText}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Reference Compositions Section */}
        <ReferenceCompositionsSection
          unitApiName={unitApiName}
          unitApiNameFromUnit={unit?.apiName}
        />

        {/* Popular Items Section */}
        <PopularItemsSection popularItems={POPULAR_ITEMS} />

        {/* Suggested Items Section */}
        {/* <View style={styles.augmentsSection}>
          <Text h3 bold color={colors.text} style={styles.sectionTitle}>
            {translations.suggestedItems}
          </Text>
          
          <View style={styles.augmentCard}>
            <View style={styles.augmentHeader}>
              <View style={styles.augmentIconContainer}>
                <Image
                  source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_GuinsoosRageblade.png'}}
                  style={styles.augmentIcon}
                  resizeMode="cover"
                />
                <View style={styles.augmentItemBadges}>
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_RecurveBow.png'}}
                    style={styles.augmentItemBadge}
                    resizeMode="cover"
                  />
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_NeedlesslyLargeRod.png'}}
                    style={styles.augmentItemBadge}
                    resizeMode="cover"
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
        </View> */}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <View style={styles.header}>
          <BackButton />
        </View>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default UnitDetailScreen;

