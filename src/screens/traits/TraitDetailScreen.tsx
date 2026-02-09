import React, {useMemo, useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme, useRoute} from '@react-navigation/native';
import createStyles from './TraitDetailScreen.style';
import {DetailHeader} from '@shared-components/detail-header';
import useStore from '@services/zustand/store';
import {getCachedTraits} from '@services/api/data';
import {useTftTraitById, useTftUnits} from '@services/api/hooks/listQueryHooks';
import {
  TraitHeader,
  TraitDescription,
  TraitUnits,
  TraitLoading,
  TraitError,
} from './components/trait-detail';
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

  useEffect(() => {
    if (!trait || !language) {
      setLocalizedName(null);
      setLocalizedDesc(null);
      setLocalizedIcon(null);
      setLocalizedEffects(null);
      return;
    }

    try {
      const traitsData = getCachedTraits(language);
      const localizedTrait =
        (trait.apiName && traitsData[trait.apiName]) ||
        Object.values(traitsData).find(
          (t: any) =>
            (trait.apiName && (t.apiName === trait.apiName || t.apiName === trait.name)) ||
            (trait.name && t.name === trait.name)
        );

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


  const renderContent = () => {
    if (isLoading && !trait) {
      return <TraitLoading />;
    }

    if (isError || !trait) {
      return <TraitError error={error} onRetry={() => refetch()} />;
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Content */}
        <View style={styles.content}>
          {/* Header with Icon, Name and Badges */}
          <TraitHeader
            trait={trait}
            localizedName={localizedName}
            localizedIcon={localizedIcon}
          />

          {/* Description */}
          <TraitDescription
            description={localizedDesc || trait.desc}
            effects={localizedEffects || trait.effects}
          />

          {/* Units */}
          <TraitUnits
            units={units}
            isLoading={isLoadingUnits}
            isError={isErrorUnits}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <DetailHeader />
      {renderContent()}
    </SafeAreaView>
  );
};

export default TraitDetailScreen;

