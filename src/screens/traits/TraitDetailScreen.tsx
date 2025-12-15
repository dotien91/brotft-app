import React, {useMemo, useEffect, useState} from 'react';
import {View, ScrollView, ActivityIndicator, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import createStyles from './TraitDetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTftTraitById, useTftUnits} from '@services/api/hooks/listQueryHooks';
import {SCREENS} from '@shared-constants';
import {getTraitIconUrl} from '../../utils/metatft';
import BackButton from '@shared-components/back-button/BackButton';
import * as NavigationService from 'react-navigation-helpers';
import useStore from '@services/zustand/store';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import GuideUnitItem from '../guide/tabs/components/GuideUnitItem';
import {translations} from '../../shared/localization';

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
  const language = useStore((state) => state.language);

  // Update translations when language changes
  useEffect(() => {
    if (language && translations.getLanguage() !== language) {
      translations.setLanguage(language);
    }
  }, [language]);

  const [localizedName, setLocalizedName] = useState<string | null>(null);
  const [localizedDesc, setLocalizedDesc] = useState<string | null>(null);
  const [localizedIcon, setLocalizedIcon] = useState<string | null>(null);
  const [localizedEffects, setLocalizedEffects] = useState<any[] | null>(null);

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

  // Get localized data from LocalStorage
  useEffect(() => {
    if (!trait || !language) {
      setLocalizedName(null);
      setLocalizedDesc(null);
      setLocalizedIcon(null);
      setLocalizedEffects(null);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const traitsKey = `data_traits_${locale}`;
      const traitsDataString = LocalStorage.getString(traitsKey);
      
      if (!traitsDataString) {
        // Fallback to API data
        setLocalizedName(trait.name || null);
        setLocalizedDesc(trait.desc || null);
        setLocalizedIcon(trait.icon || null);
        setLocalizedEffects(trait.effects || null);
        return;
      }

      const traitsData = JSON.parse(traitsDataString);
      let localizedTrait: any = null;

      // Find trait from local storage
      if (traitsData) {
        if (Array.isArray(traitsData)) {
          localizedTrait = traitsData.find((t: any) => 
            (trait.apiName && (t.apiName === trait.apiName || t.apiName === trait.name)) ||
            (trait.name && t.name === trait.name)
          );
        } else if (typeof traitsData === 'object' && traitsData !== null) {
          // Try by apiName first
          if (trait.apiName && traitsData[trait.apiName]) {
            localizedTrait = traitsData[trait.apiName];
          } else {
            // Search through values
            const traitsArray = Object.values(traitsData) as any[];
            localizedTrait = traitsArray.find((t: any) => 
              (trait.apiName && (t.apiName === trait.apiName || t.apiName === trait.name)) ||
              (trait.name && t.name === trait.name)
            );
          }
        }
      }

      if (localizedTrait) {
        setLocalizedName(localizedTrait.name || trait.name || null);
        setLocalizedDesc(localizedTrait.desc || localizedTrait.description || trait.desc || null);
        setLocalizedIcon(localizedTrait.icon || trait.icon || null);
        setLocalizedEffects(localizedTrait.effects || trait.effects || null);
      } else {
        // Fallback to API data
        setLocalizedName(trait.name || null);
        setLocalizedDesc(trait.desc || null);
        setLocalizedIcon(trait.icon || null);
        setLocalizedEffects(trait.effects || null);
      }
    } catch (error) {
      // Fallback to API data on error
      setLocalizedName(trait.name || null);
      setLocalizedDesc(trait.desc || null);
      setLocalizedIcon(trait.icon || null);
      setLocalizedEffects(trait.effects || null);
    }
  }, [trait, language]);

  const renderHeader = () => (
    <View style={styles.header}>
      <BackButton />
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
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
      <Text style={styles.errorText}>
        {translations.errorLoadingTrait}
      </Text>
      <Text style={styles.errorDescription}>
        {error?.message || translations.somethingWentWrong}
      </Text>
      <RNBounceable style={styles.retryButton} onPress={() => refetch()}>
        <Text style={styles.retryButtonText}>
          {translations.retry}
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
    const effects = localizedEffects || trait?.effects;
    if (!effects || effects.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {translations.traitEffects}
        </Text>
        {effects.map((effect, index) => (
          <View key={index} style={styles.tierCard}>
            <View style={styles.tierHeader}>
              <View style={styles.tierCountBadge}>
                <Text style={styles.tierCountText}>
                  {effect.minUnits || 0}
                  {effect.maxUnits ? `-${effect.maxUnits}` : '+'}
                </Text>
                <Text style={styles.tierCountLabel}>{translations.units.toLowerCase()}</Text>
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
                {effect.variableMatches.map((match: any, matchIndex: number) => (
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

    const handleUnitPress = (unitId: string | number) => {
      const unit = units.find(u => String(u.id) === String(unitId));
      if (unit) {
        if (unit.apiName) {
          NavigationService.push(SCREENS.UNIT_DETAIL, {unitApiName: unit.apiName});
        } else if (unit.id) {
          NavigationService.push(SCREENS.UNIT_DETAIL, {unitId: String(unit.id)});
        }
      }
    };

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {translations.units} ({unitsCount})
        </Text>
        {isLoadingUnits ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : isErrorUnits ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorDescription, {color: colors.danger, opacity: 1}]}>
              {translations.errorLoadingUnits}
            </Text>
          </View>
        ) : unitsCount === 0 ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorDescription}>
              {translations.noUnitsFound}
            </Text>
          </View>
        ) : (
          <View style={styles.unitsContainer}>
            {units.map((unit) => (
              <GuideUnitItem
                key={unit.id || unit.apiName}
                data={unit}
                onPress={() => handleUnitPress(unit.id)}
                compact={true}
              />
            ))}
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
            {localizedIcon || trait.icon || trait.apiName ? (
              <Image
                source={{
                  uri: (localizedIcon || trait.icon)?.startsWith('http')
                    ? (localizedIcon || trait.icon) || ''
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
            <Text style={styles.title}>
              {localizedName || trait.name}
            </Text>
            {trait.enName && trait.enName !== (localizedName || trait.name) && (
              <Text style={styles.enName}>
                {trait.enName}
              </Text>
            )}
            <View style={styles.badgesRow}>
              {renderApiNameBadge()}
            </View>
          </View>

          {/* Description */}
          {(localizedDesc || trait.desc) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {translations.description}
              </Text>
              <Text style={styles.description}>
                {localizedDesc || trait.desc}
              </Text>
            </View>
          )}

          {/* Effects */}
          {renderEffects()}

          {/* Units */}
          {renderUnits()}
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

