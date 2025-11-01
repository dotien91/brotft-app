import React, {useMemo} from 'react';
import {View, Image, ScrollView, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './DetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useChampionById} from '@services/api/hooks/listQueryHooks';

interface DetailScreenProps {
  route?: {
    params?: {
      championId?: string;
    };
  };
}

const DetailScreen: React.FC<DetailScreenProps> = ({route: routeProp}) => {
  const theme = useTheme();
  const route = useRoute();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const championId =
    (routeProp?.params?.championId ||
      (route?.params as any)?.championId) as string;

  const {
    data: champion,
    isLoading,
    isError,
    error,
    refetch,
  } = useChampionById(championId || '');

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

  const renderHeader = () => (
    <View style={styles.header}>
      {renderBackButton()}
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.loadingText}>
        Loading champion...
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
        Error loading champion
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

  const renderCostBadge = () => {
    if (!champion?.cost) return null;
    return (
      <View style={styles.badge}>
        <Icon
          name="diamond"
          type={IconType.FontAwesome}
          color={colors.primary}
          size={18}
        />
        <Text style={styles.badgeText}>Cost: {champion.cost}</Text>
      </View>
    );
  };

  const renderSetBadge = () => {
    if (!champion?.set) return null;
    return (
      <View style={[styles.badge, styles.badgeSecondary]}>
        <Icon
          name="tag"
          type={IconType.FontAwesome}
          color={colors.text}
          size={16}
        />
        <Text style={styles.badgeTextSecondary}>{champion.set}</Text>
      </View>
    );
  };

  const renderTraits = () => {
    if (!champion?.traits || champion.traits.length === 0) return null;
    // Handle both string array and object array formats
    const getTraitName = (trait: any): string => {
      if (typeof trait === 'string') return trait;
      if (typeof trait === 'object' && trait !== null) {
        return trait.name || trait.key || String(trait);
      }
      return String(trait);
    };
    return (
      <View style={styles.section}>
        <Text h4 bold color={colors.text} style={styles.sectionTitle}>
          Traits
        </Text>
        <View style={styles.traitsContainer}>
          {champion.traits.map((trait, index) => (
            <View key={index} style={styles.traitBadge}>
              <Text style={styles.traitText}>{getTraitName(trait)}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading && !champion) {
      return renderLoading();
    }

    if (isError || !champion) {
      return renderError();
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        {champion.imageUrl && (
          <Image
            source={{uri: champion.imageUrl}}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Name and Badges */}
          <View style={styles.titleSection}>
            <Text h1 bold color={colors.text} style={styles.title}>
              {champion.name}
            </Text>
            <View style={styles.badgesRow}>
              {renderCostBadge()}
              {renderSetBadge()}
            </View>
          </View>

          {/* Description */}
          {champion.description && (
            <View style={styles.section}>
              <Text h4 bold color={colors.text} style={styles.sectionTitle}>
                Description
              </Text>
              <Text color={colors.placeholder} style={styles.description}>
                {champion.description}
              </Text>
            </View>
          )}

          {/* Traits */}
          {renderTraits()}

          {/* Additional Info */}
          <View style={styles.section}>
            <Text h4 bold color={colors.text} style={styles.sectionTitle}>
              Information
            </Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Key:</Text>
              <Text style={styles.infoValue}>{champion.key}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={styles.infoValue}>{champion.id}</Text>
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

export default DetailScreen;
