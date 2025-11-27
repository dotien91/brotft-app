import React, {useMemo} from 'react';
import {View, ScrollView, ActivityIndicator, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './TraitDetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTftTraitById} from '@services/api/hooks/listQueryHooks';
import {SCREENS} from '@shared-constants';
import {getTraitIconUrl} from '../../utils/metatft';

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
    const units = trait?.units || [];
    const unitsCount = units.length;

    if (unitsCount === 0) return null;

    const handleUnitPress = (unitApiName: string) => {
      NavigationService.push(SCREENS.UNIT_DETAIL, {unitApiName});
    };

    return (
      <View style={styles.section}>
        <Text h4 bold color={colors.text} style={styles.sectionTitle}>
          Units ({unitsCount})
        </Text>
        <View style={styles.championsContainer}>
          {units.map((unit, index) => (
            <RNBounceable
              key={unit.unit || index}
              style={styles.championBadge}
              onPress={() => handleUnitPress(unit.unit)}>
              <View style={styles.championContent}>
                {unit.unit_cost && (
                  <View style={styles.championCostBadge}>
                    <Icon
                      name="diamond"
                      type={IconType.FontAwesome}
                      color={colors.primary}
                      size={12}
                    />
                    <Text style={styles.championCostText}>
                      {unit.unit_cost}
                    </Text>
                  </View>
                )}
                <Icon
                  name="person"
                  type={IconType.Ionicons}
                  color={colors.primary}
                  size={16}
                />
                <Text style={styles.championText} numberOfLines={1}>
                  {unit.unit}
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
            {trait.units && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Units Count:</Text>
                <Text style={styles.infoValue}>{trait.units.length}</Text>
              </View>
            )}
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

