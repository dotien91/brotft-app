import React, {useMemo} from 'react';
import {View, ScrollView, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './TraitDetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTraitById} from '@services/api/hooks/listQueryHooks';
import {SCREENS} from '@shared-constants';
import type {IChampion} from '@services/models/champion';

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
  } = useTraitById(traitId || '');

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

  const renderTypeBadge = () => {
    if (!trait?.type) return null;
    const isOrigin = trait.type === 'origin';
    return (
      <View
        style={[
          styles.typeBadge,
          {
            backgroundColor: isOrigin
              ? colors.primary + '20'
              : colors.danger + '20',
            borderColor: isOrigin
              ? colors.primary + '40'
              : colors.danger + '40',
          },
        ]}>
        <Icon
          name={isOrigin ? 'people' : 'sparkles'}
          type={IconType.Ionicons}
          color={isOrigin ? colors.primary : colors.danger}
          size={18}
        />
        <Text
          style={[
            styles.typeBadgeText,
            {
              color: isOrigin ? colors.primary : colors.danger,
            },
          ]}>
          {isOrigin ? 'Tộc' : 'Hệ'}
        </Text>
      </View>
    );
  };

  const renderSetBadge = () => {
    if (!trait?.set) return null;
    return (
      <View style={[styles.badge, styles.badgeSecondary]}>
        <Icon
          name="tag"
          type={IconType.FontAwesome}
          color={colors.text}
          size={16}
        />
        <Text style={styles.badgeTextSecondary}>{trait.set}</Text>
      </View>
    );
  };

  const renderKeyBadge = () => {
    if (!trait?.key) return null;
    return (
      <View style={[styles.badge, styles.badgeSecondary]}>
        <Icon
          name="key"
          type={IconType.Ionicons}
          color={colors.text}
          size={16}
        />
        <Text style={styles.badgeTextSecondary}>{trait.key}</Text>
      </View>
    );
  };

  const renderTiers = () => {
    if (!trait?.tiers || trait.tiers.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text h4 bold color={colors.text} style={styles.sectionTitle}>
          Cấp độ Trait
        </Text>
        {trait.tiers.map((tier, index) => (
          <View key={index} style={styles.tierCard}>
            <View style={styles.tierHeader}>
              <View style={styles.tierCountBadge}>
                <Text style={styles.tierCountText}>{tier.count}</Text>
                <Text style={styles.tierCountLabel}>champions</Text>
              </View>
              <View style={styles.tierEffectContainer}>
                <Icon
                  name="flash"
                  type={IconType.Ionicons}
                  color={colors.primary}
                  size={20}
                />
                <Text style={styles.tierEffectText}>{tier.effect}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderChampions = () => {
    // Use championDetails if available, otherwise fallback to champions IDs
    const champions = trait?.championDetails || [];
    const championsCount = trait?.champions?.length || 0;

    if (championsCount === 0) return null;

    const handleChampionPress = (championId: string) => {
      NavigationService.push(SCREENS.DETAIL, {championId});
    };

    // If we have championDetails, show full info
    if (trait?.championDetails && trait.championDetails.length > 0) {
      return (
        <View style={styles.section}>
          <Text h4 bold color={colors.text} style={styles.sectionTitle}>
            Champions ({championsCount})
          </Text>
          <View style={styles.championsContainer}>
            {trait.championDetails.map((champion) => (
              <RNBounceable
                key={champion.id}
                style={styles.championBadge}
                onPress={() => handleChampionPress(champion.id)}>
                <View style={styles.championContent}>
                  <View style={styles.championCostBadge}>
                    <Icon
                      name="diamond"
                      type={IconType.FontAwesome}
                      color={colors.primary}
                      size={12}
                    />
                    <Text style={styles.championCostText}>{champion.cost}</Text>
                  </View>
                  <Icon
                    name="person"
                    type={IconType.Ionicons}
                    color={colors.primary}
                    size={16}
                  />
                  <Text style={styles.championText} numberOfLines={1}>
                    {champion.name}
                  </Text>
                </View>
              </RNBounceable>
            ))}
          </View>
        </View>
      );
    }

    // Fallback: show IDs if championDetails not available
    return (
      <View style={styles.section}>
        <Text h4 bold color={colors.text} style={styles.sectionTitle}>
          Champions ({championsCount})
        </Text>
        <View style={styles.championsContainer}>
          {trait?.champions?.map((championId, index) => (
            <RNBounceable
              key={championId || index}
              style={styles.championBadge}
              onPress={() => handleChampionPress(championId)}>
              <View style={styles.championContent}>
                <Icon
                  name="person"
                  type={IconType.Ionicons}
                  color={colors.primary}
                  size={16}
                />
                <Text style={styles.championText} numberOfLines={1}>
                  ID: {championId.slice(-8)}
                </Text>
              </View>
            </RNBounceable>
          ))}
        </View>
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
          <View
            style={[
              styles.typeIndicator,
              {
                backgroundColor:
                  trait.type === 'origin'
                    ? colors.primary + '15'
                    : colors.danger + '15',
              },
            ]}>
            <Icon
              name={trait.type === 'origin' ? 'people' : 'sparkles'}
              type={IconType.Ionicons}
              color={
                trait.type === 'origin' ? colors.primary : colors.danger
              }
              size={32}
            />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name and Badges */}
          <View style={styles.titleSection}>
            <Text h1 bold color={colors.text} style={styles.title}>
              {trait.name}
            </Text>
            <View style={styles.badgesRow}>
              {renderTypeBadge()}
              {renderSetBadge()}
              {renderKeyBadge()}
            </View>
          </View>

          {/* Description */}
          {trait.description && (
            <View style={styles.section}>
              <Text h4 bold color={colors.text} style={styles.sectionTitle}>
                Mô tả
              </Text>
              <Text color={colors.placeholder} style={styles.description}>
                {trait.description}
              </Text>
            </View>
          )}

          {/* Tiers */}
          {renderTiers()}

          {/* Champions */}
          {renderChampions()}

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
              <Text style={styles.infoLabel}>Key:</Text>
              <Text style={styles.infoValue}>{trait.key}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>
                {trait.type === 'origin' ? 'Tộc' : 'Hệ'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Set:</Text>
              <Text style={styles.infoValue}>{trait.set}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Active:</Text>
              <Text style={styles.infoValue}>
                {trait.isActive ? 'Có' : 'Không'}
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

