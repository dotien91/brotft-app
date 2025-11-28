import React, {useMemo} from 'react';
import {View, Image, ScrollView, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './UnitDetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTftUnitById} from '@services/api/hooks/listQueryHooks';
import Hexagon from '@screens/detail/components/Hexagon';
import {getUnitAvatarUrl, getUnitSplashUrl} from '../../utils/metatft';
import {API_BASE_URL} from '@shared-constants';

interface UnitDetailScreenProps {
  route?: {
    params?: {
      unitId?: string;
    };
  };
}

const UnitDetailScreen: React.FC<UnitDetailScreenProps> = ({route: routeProp}) => {
  const theme = useTheme();
  const route = useRoute();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const unitId =
    (routeProp?.params?.unitId ||
      (route?.params as any)?.unitId) as string;

  // Debug logging
  React.useEffect(() => {
    console.log('[UnitDetailScreen] unitId:', unitId);
  }, [unitId]);

  const {
    data: unit,
    isLoading,
    isError,
    error,
    refetch,
  } = useTftUnitById(unitId || '');

  // Debug logging for unit data
  React.useEffect(() => {
    console.log('[UnitDetailScreen] Unit data:', {
      hasUnit: !!unit,
      unitId: unit?.id,
      unitName: unit?.name,
      isLoading,
      isError,
      error: error?.message,
    });
  }, [unit, isLoading, isError, error]);

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
        Loading unit...
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
        Error loading unit
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

  const renderTraits = () => {
    // TFT units have traits as string array
    const displayTraits = unit?.traits || [];
    
    if (!displayTraits || displayTraits.length === 0) return null;

    return displayTraits.map((trait, index) => {
      const traitName = typeof trait === 'string' ? trait : String(trait);

      return (
        <RNBounceable
          key={index}
          style={styles.traitBadge}>
          <Icon
            name="shield"
            type={IconType.Ionicons}
            color={colors.primary}
            size={16}
          />
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
    console.log('avatarUri', avatarUri);
    // Get splash art for background from metatft.com
    // Size: 768x456 for better quality on larger screens
    const getSplashArtUrl = () => {
      const apiName = unit?.apiName || unit?.name || '';
      return getUnitSplashUrl(apiName, 768, 456);
    };
    
    const splashUri = getSplashArtUrl();

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
                  {unit.name}
                </Text>
                <View style={styles.traitsRow}>
                  {renderTraits()}
                </View>
                {unit.cost !== null && unit.cost !== undefined && (
                  <View style={styles.costBadgeContainer}>
                    <Icon
                      name="diamond"
                      type={IconType.FontAwesome}
                      color={colors.primary}
                      size={16}
                    />
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
                  <Text style={styles.statItemLabel}>Máu</Text>
                </View>
                <Text style={styles.statItemValue}>
                  {unit.stats.hp ? `${unit.stats.hp} / ${Math.floor(unit.stats.hp * 1.8)} / ${Math.floor(unit.stats.hp * 3.24)}` : '---'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="flash" type={IconType.Ionicons} color="#fbbf24" size={16} />
                  <Text style={styles.statItemLabel}>Tốc Độ Đánh</Text>
                </View>
                <Text style={styles.statItemValue}>{unit.stats.attackSpeed ?? '---'}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="fitness" type={IconType.Ionicons} color="#fb923c" size={16} />
                  <Text style={styles.statItemLabel}>Sức Mạnh Công Kích</Text>
                </View>
                <Text style={styles.statItemValue}>
                  {unit.stats.damage ? `${unit.stats.damage} / ${Math.floor(unit.stats.damage * 1.5)} / ${Math.floor(unit.stats.damage * 2.25)}` : '---'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="shield" type={IconType.Ionicons} color="#fb7185" size={16} />
                  <Text style={styles.statItemLabel}>Giáp</Text>
                </View>
                <Text style={styles.statItemValue}>{unit.stats.armor ?? '---'}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="sparkles" type={IconType.Ionicons} color="#c084fc" size={16} />
                  <Text style={styles.statItemLabel}>DPS</Text>
                </View>
                <Text style={styles.statItemValue}>
                  {unit.stats.damage && unit.stats.attackSpeed ? `${Math.floor(unit.stats.damage * unit.stats.attackSpeed)} / ${Math.floor(unit.stats.damage * 1.5 * unit.stats.attackSpeed * 1.5)} / ${Math.floor(unit.stats.damage * 2.25 * unit.stats.attackSpeed * 2.25)}` : '---'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="color-wand" type={IconType.Ionicons} color="#ec4899" size={16} />
                  <Text style={styles.statItemLabel}>Kháng Phép</Text>
                </View>
                <Text style={styles.statItemValue}>{unit.stats.magicResist ?? '---'}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statItemHeader}>
                  <Icon name="radio-button-on" type={IconType.Ionicons} color="#60a5fa" size={16} />
                  <Text style={styles.statItemLabel}>Tầm Đánh</Text>
                </View>
                <Text style={styles.statItemValue}>{unit.stats.range ? '■'.repeat(unit.stats.range) : '---'}</Text>
              </View>
              {unit.stats.mana !== null && unit.stats.mana !== undefined && (
                <View style={styles.statItem}>
                  <View style={styles.statItemHeader}>
                    <Icon name="water" type={IconType.Ionicons} color="#60a5fa" size={16} />
                    <Text style={styles.statItemLabel}>Mana</Text>
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
              Kỹ Năng
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
                  <Text style={styles.abilityName}>{unit.ability.name || 'Kỹ năng'}</Text>
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
              
              {unit.ability.desc && (
                <Text style={styles.abilityDescription}>
                  {unit.ability.desc}
                </Text>
              )}

              {/* Ability Variables */}
              {unit.ability.variables && unit.ability.variables.length > 0 && (
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
              )}
            </View>
          </View>
        )}

        {/* Suggested Items Section */}
        <View style={styles.augmentsSection}>
          <Text h3 bold color={colors.text} style={styles.sectionTitle}>
            Đề xuất Trang bị
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
                  Kỹ năng có thể gây chí mạng.
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

