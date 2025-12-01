import React, {useMemo} from 'react';
import {View, ScrollView, ActivityIndicator, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './TraitDetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTftTraitById, useTftUnits} from '@services/api/hooks/listQueryHooks';
import {SCREENS} from '@shared-constants';
import {getTraitIconUrl, getUnitAvatarUrl} from '../../utils/metatft';
import Hexagon from '../detail/components/Hexagon';
import type {ITftUnit} from '@services/models/tft-unit';

interface TraitDetailScreenProps {
  route?: {
    params?: {
      traitId?: string;
    };
  };
}

const TraitDetailScreen: React.FC<TraitDetailScreenProps> = ({
  route: routeProp,
}) => {
  const theme = useTheme();
  const route = useRoute();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const traitId =
    (routeProp?.params?.traitId ||
      (route?.params as any)?.traitId) as string;

  const {
    data: trait,
    isLoading,
    isError,
    error,
    refetch,
  } = useTftTraitById(traitId || '');

  // Fetch all units with this trait
  const {
    data: unitsData,
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
  } = useTftUnits(
    {
      filters: {
        trait: trait?.name || undefined,
      },
      limit: 100, // Get all units with this trait
    },
    {
      enabled: !!trait?.name,
    },
  );

  const units = unitsData?.data || [];

  const renderBackButton = () => (
    <RNBounceable
      style={styles.backButton}
      onPress={() => NavigationService.goBack()}>
      <Icon
        name="arrow-back"
        type={IconType.Ionicons}
        color={colors.text}
        size={24}
      />
    </RNBounceable>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {renderBackButton()}
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.loadingText}>
        Loading trait...
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
        Error loading trait
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

  const renderApiNameBadge = () => {
    if (!trait?.apiName) return null;
    return (
      <View style={[styles.badge, styles.badgeSecondary]}>
        <Icon
          name="code"
          type={IconType.Ionicons}
          color={colors.text}
          size={16}
        />
        <Text style={styles.badgeTextSecondary}>{trait.apiName}</Text>
      </View>
    );
  };

  const renderEffects = () => {
    if (!trait?.effects || trait.effects.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text h4 bold color={colors.text} style={styles.sectionTitle}>
          Hiệu ứng Trait
        </Text>
        {trait.effects.map((effect, index) => (
          <View key={index} style={styles.tierCard}>
            <View style={styles.tierHeader}>
              <View style={styles.tierCountBadge}>
                <Text style={styles.tierCountText}>
                  {effect.minUnits || 0}
                  {effect.maxUnits ? `-${effect.maxUnits}` : '+'}
                </Text>
                <Text style={styles.tierCountLabel}>units</Text>
              </View>
              <View style={styles.tierEffectContainer}>
                <Icon
                  name="flash"
                  type={IconType.Ionicons}
                  color={colors.primary}
                  size={20}
                />
                <Text style={styles.tierEffectText}>
                  Style: {effect.style || 'N/A'}
                </Text>
              </View>
            </View>
            {effect.variableMatches && effect.variableMatches.length > 0 && (
              <View style={styles.variablesContainer}>
                {effect.variableMatches.map((match, matchIndex) => (
                  <View key={matchIndex} style={styles.variableItem}>
                    <Text style={styles.variableText}>
                      {match.match || match.type}: {match.value || 'N/A'}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderUnits = () => {
    const unitsCount = units.length;

    const handleUnitPress = (unit: ITftUnit) => {
      if (unit.apiName) {
        NavigationService.push(SCREENS.UNIT_DETAIL, {unitApiName: unit.apiName});
      } else if (unit.id) {
        NavigationService.push(SCREENS.UNIT_DETAIL, {unitId: String(unit.id)});
      }
    };

    // Get unit avatar URL
    const getUnitAvatar = (unit: ITftUnit) => {
      if (unit.icon && unit.icon.startsWith('http')) {
        return unit.icon;
      }
      if (unit.squareIcon && unit.squareIcon.startsWith('http')) {
        return unit.squareIcon;
      }
      return getUnitAvatarUrl(unit.apiName || unit.name, 48);
    };

    return (
      <View style={styles.section}>
        <Text h4 bold color={colors.text} style={styles.sectionTitle}>
          Units ({unitsCount})
        </Text>
        {isLoadingUnits ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text color={colors.placeholder} style={styles.loadingText}>
              Loading units...
            </Text>
          </View>
        ) : isErrorUnits ? (
          <View style={styles.errorContainer}>
            <Text color={colors.danger} style={styles.errorDescription}>
              Error loading units
            </Text>
          </View>
        ) : unitsCount === 0 ? (
          <View style={styles.errorContainer}>
            <Text color={colors.placeholder} style={styles.errorDescription}>
              No units found with this trait
            </Text>
          </View>
        ) : (
          <View style={styles.championsContainer}>
            {units.map((unit, index) => {
              const avatarUri = getUnitAvatar(unit);
              return (
                <RNBounceable
                  key={unit.id || unit.apiName || index}
                  style={styles.championBadge}
                  onPress={() => handleUnitPress(unit)}>
                  <View style={styles.championContent}>
                    <View style={styles.championAvatarContainer}>
                      <Hexagon
                        size={40}
                        backgroundColor={colors.card}
                        borderColor={colors.border}
                        borderWidth={2}
                        imageUri={avatarUri}
                      />
                    </View>
                    <View style={styles.championInfo}>
                      {unit.cost !== null && unit.cost !== undefined && (
                        <View style={styles.championCostBadge}>
                          <Icon
                            name="diamond"
                            type={IconType.FontAwesome}
                            color={colors.primary}
                            size={10}
                          />
                          <Text style={styles.championCostText}>
                            {unit.cost}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.championText} numberOfLines={1}>
                        {unit.name || unit.apiName}
                      </Text>
                    </View>
                  </View>
                </RNBounceable>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading && !trait) {
      return renderLoading();
    }

    if (isError || !trait) {
      return renderError();
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={[styles.typeIndicator, {backgroundColor: colors.primary + '15'}]}>
            {trait.icon || trait.apiName ? (
              <Image
                source={{
                  uri: trait.icon?.startsWith('http')
                    ? trait.icon
                    : getTraitIconUrl(trait.apiName || trait.name, 64),
                }}
                style={styles.traitIcon}
                resizeMode="contain"
              />
            ) : (
              <Icon
                name="shield"
                type={IconType.Ionicons}
                color={colors.primary}
                size={32}
              />
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name and Badges */}
          <View style={styles.titleSection}>
            <Text h1 bold color={colors.text} style={styles.title}>
              {trait.name}
            </Text>
            {trait.enName && trait.enName !== trait.name && (
              <Text h5 color={colors.placeholder} style={styles.enName}>
                {trait.enName}
              </Text>
            )}
            <View style={styles.badgesRow}>
              {renderApiNameBadge()}
            </View>
          </View>

          {/* Description */}
          {trait.desc && (
            <View style={styles.section}>
              <Text h4 bold color={colors.text} style={styles.sectionTitle}>
                Mô tả
              </Text>
              <Text color={colors.placeholder} style={styles.description}>
                {trait.desc}
              </Text>
            </View>
          )}

          {/* Effects */}
          {renderEffects()}

          {/* Units */}
          {renderUnits()}

          {/* Additional Info */}
          <View style={styles.section}>
            <Text h4 bold color={colors.text} style={styles.sectionTitle}>
              Thông tin
            </Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>{trait.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>API Name:</Text>
              <Text style={styles.infoValue}>{trait.apiName}</Text>
            </View>
            {trait.enName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>English Name:</Text>
                <Text style={styles.infoValue}>{trait.enName}</Text>
              </View>
            )}
            {trait.effects && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Effects Count:</Text>
                <Text style={styles.infoValue}>{trait.effects.length}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Units Count:</Text>
              <Text style={styles.infoValue}>
                {isLoadingUnits ? 'Loading...' : units.length}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default TraitDetailScreen;

