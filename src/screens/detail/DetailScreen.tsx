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
import {SCREENS} from '@shared-constants';
import type {ITrait} from '@services/models/trait';

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
    // Use traitDetails if available, otherwise fallback to traits
    const displayTraits = champion?.traitDetails && champion.traitDetails.length > 0
      ? champion.traitDetails
      : champion?.traits || [];
    
    if (!displayTraits || displayTraits.length === 0) return null;

    const isTraitObject = (trait: string | ITrait): trait is ITrait => {
      return typeof trait === 'object' && trait !== null && 'name' in trait;
    };

    const handleTraitPress = (trait: string | ITrait) => {
      if (isTraitObject(trait)) {
        NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId: trait.id});
      }
    };

    const getTraitName = (trait: string | ITrait): string => {
      if (typeof trait === 'string') return trait;
      if (isTraitObject(trait)) return trait.name;
      return String(trait);
    };

    const getTraitType = (trait: string | ITrait): 'origin' | 'class' | null => {
      if (isTraitObject(trait)) return trait.type;
      return null;
    };

    return (
      <View style={styles.section}>
        <Text h4 bold color={colors.text} style={styles.sectionTitle}>
          Traits
        </Text>
        <View style={styles.traitsContainer}>
          {displayTraits.map((trait, index) => {
            // If traitDetails is available, traits are already ITrait objects
            const isTraitDetail = champion?.traitDetails && champion.traitDetails.length > 0;
            const traitObj = isTraitDetail ? (trait as ITrait) : null;
            const traitName = traitObj 
              ? traitObj.name 
              : getTraitName(trait as string | ITrait);
            const traitType = traitObj ? traitObj.type : getTraitType(trait as string | ITrait);
            const isOrigin = traitType === 'origin';

            return (
              <RNBounceable
                key={traitObj ? traitObj.id : index}
                onPress={() => handleTraitPress(trait as string | ITrait)}
                disabled={!traitObj}>
                <View
                  style={[
                    styles.traitBadge,
                    traitObj && {
                      backgroundColor: isOrigin
                        ? colors.primary + '20'
                        : colors.danger + '20',
                      borderColor: isOrigin
                        ? colors.primary + '40'
                        : colors.danger + '40',
                    },
                  ]}>
                  {traitObj && (
                    <View
                      style={[
                        styles.traitTypeIndicator,
                        {
                          backgroundColor: isOrigin
                            ? colors.primary
                            : colors.danger,
                        },
                      ]}
                    />
                  )}
                  <Text
                    style={[
                      styles.traitText,
                      traitObj && {
                        color: isOrigin ? colors.primary : colors.danger,
                      },
                    ]}>
                    {traitName}
                  </Text>
                </View>
              </RNBounceable>
            );
          })}
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
        {(() => {
          // Use image.path if available, otherwise fallback to imageUrl
          const imageSource = champion.image?.path || champion.imageUrl;
          if (!imageSource) return null;
          
          // If image.path is relative, prepend base URL
          const imageUri = champion.image?.path?.startsWith('http')
            ? champion.image.path
            : champion.image?.path?.startsWith('/')
              ? `http://localhost:3000${champion.image.path}`
              : champion.imageUrl || imageSource;
          
          return (
            <Image
              source={{uri: imageUri}}
              style={styles.heroImage}
              resizeMode="cover"
            />
          );
        })()}

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

          {/* Ability */}
          {champion.abilityName && (
            <View style={styles.section}>
              <Text h4 bold color={colors.text} style={styles.sectionTitle}>
                {champion.abilityName}
              </Text>
              {champion.abilityDescription && (
                <Text color={colors.placeholder} style={styles.description}>
                  {champion.abilityDescription}
                </Text>
              )}
            </View>
          )}

          {/* Traits */}
          {renderTraits()}

          {/* Stats */}
          {(champion.health || champion.armor || champion.magicResist || 
            champion.attackDamage || champion.attackSpeed || champion.attackRange ||
            champion.startingMana || champion.maxMana) && (
            <View style={styles.section}>
              <Text h4 bold color={colors.text} style={styles.sectionTitle}>
                Stats
              </Text>
              <View style={styles.statsContainer}>
                {champion.health !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Health:</Text>
                    <Text style={styles.infoValue}>{champion.health}</Text>
                  </View>
                )}
                {champion.armor !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Armor:</Text>
                    <Text style={styles.infoValue}>{champion.armor}</Text>
                  </View>
                )}
                {champion.magicResist !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Magic Resist:</Text>
                    <Text style={styles.infoValue}>{champion.magicResist}</Text>
                  </View>
                )}
                {champion.attackDamage !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Attack Damage:</Text>
                    <Text style={styles.infoValue}>{champion.attackDamage}</Text>
                  </View>
                )}
                {champion.attackSpeed !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Attack Speed:</Text>
                    <Text style={styles.infoValue}>{champion.attackSpeed}</Text>
                  </View>
                )}
                {champion.attackRange !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Attack Range:</Text>
                    <Text style={styles.infoValue}>{champion.attackRange}</Text>
                  </View>
                )}
                {champion.startingMana !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Starting Mana:</Text>
                    <Text style={styles.infoValue}>{champion.startingMana}</Text>
                  </View>
                )}
                {champion.maxMana !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Max Mana:</Text>
                    <Text style={styles.infoValue}>{champion.maxMana}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

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
