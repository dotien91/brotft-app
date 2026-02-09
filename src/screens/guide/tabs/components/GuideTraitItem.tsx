import React, {useMemo, useState, useEffect} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from '@shared-components/icon/Icon';
import type {ITftTrait} from '@services/models/tft-trait';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getTraitIconUrl} from '../../../../utils/metatft';
import {parseTraitDescription} from '../../../../utils/traitParser';
import createStyles from './GuideTraitItem.style';
import useStore from '@services/zustand/store';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import {translations} from '../../../../shared/localization';
import {useTftUnits} from '@services/api/hooks/listQueryHooks';
import {TraitUnits} from '../../../traits/components/trait-detail';

interface GuideTraitItemProps {
  data: ITftTrait;
  onPress: () => void;
}

const GuideTraitItem: React.FC<GuideTraitItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);
  const [localizedName, setLocalizedName] = useState<string | null>(null);
  const [localizedDesc, setLocalizedDesc] = useState<string | null>(null);
  const [localizedEffects, setLocalizedEffects] = useState<any[] | null>(null);
  const [localizedType, setLocalizedType] = useState<'origin' | 'class' | null>(null);

  const {name, desc, icon, apiName, effects, enName} = data;
  // Ưu tiên type từ API, không có thì dùng type từ LocalStorage (data_traits thường có từ Riot CDN)
  const traitType =
    (data as {type?: 'origin' | 'class'}).type ??
    localizedType ??
    null;

  // Get localized trait name, description and type from storage (data_traits_xxx có thể chứa type)
  useEffect(() => {
    if (!name || !apiName || !language) {
      setLocalizedName(null);
      setLocalizedDesc(null);
      setLocalizedEffects(null);
      setLocalizedType(null);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const traitsKey = `data_traits_${locale}`;
      const traitsDataString = LocalStorage.getString(traitsKey);

      if (!traitsDataString) {
        setLocalizedName(null);
        setLocalizedDesc(null);
        setLocalizedEffects(null);
        setLocalizedType(null);
        return;
      }

      const traitsData = JSON.parse(traitsDataString);
      let traitDetail: any = null;

      if (traitsData) {
        if (Array.isArray(traitsData)) {
          traitDetail = traitsData.find((trait: any) =>
            trait.name === name || trait.apiName === apiName || trait.apiName === name
          );
        } else if (typeof traitsData === 'object' && traitsData !== null) {
          traitDetail = Object.values(traitsData).find((trait: any) =>
            trait.name === name || trait.apiName === apiName || trait.apiName === name
          );
        }
      }

      if (traitDetail) {
        setLocalizedName(traitDetail.name || null);
        setLocalizedDesc(traitDetail.desc || traitDetail.description || null);
        setLocalizedEffects(traitDetail.effects || null);
        const t = traitDetail.type?.toLowerCase();
        setLocalizedType(
          t === 'origin' || t === 'class' ? t : null
        );
      } else {
        setLocalizedName(null);
        setLocalizedDesc(null);
        setLocalizedEffects(null);
        setLocalizedType(null);
      }
    } catch (error) {
      setLocalizedName(null);
      setLocalizedDesc(null);
      setLocalizedEffects(null);
      setLocalizedType(null);
    }
  }, [name, apiName, language]);

  const traitIconUrl = useMemo(() => {
    if (icon && icon.startsWith('http')) return icon;
    return getTraitIconUrl(apiName || name, 56);
  }, [icon, apiName, name]);

  const displayDescription = useMemo(() => {
    const description = localizedDesc || desc;
    const traitEffects = localizedEffects || effects;
    if (!description) return null;
    if (traitEffects && traitEffects.length > 0) {
      return parseTraitDescription(description, traitEffects);
    }
    return description;
  }, [localizedDesc, desc, localizedEffects, effects]);

  const displayName = localizedName || name;

  // Fetch units có trait này (giống TraitDetailScreen)
  const {
    data: unitsData,
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
  } = useTftUnits(
    {
      filters: {trait: name},
      limit: 100,
    },
    {enabled: !!name},
  );
  const units = unitsData?.data ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header - giống TraitDetailScreen TraitHeader */}
        <View style={styles.headerSection}>
          <View style={[styles.typeIndicator, {backgroundColor: colors.primary + '15'}]}>
            {traitIconUrl ? (
              <Image
                source={{uri: traitIconUrl}}
                style={styles.traitIcon}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.iconPlaceholder}>
                <Icon
                  name="shield"
                  type={IconType.Ionicons}
                  color={colors.primary}
                  size={28}
                />
              </View>
            )}
          </View>
          <View style={styles.titleSection}>
            <Text><Text style={styles.title}>{displayName}{'   '}</Text>
            {enName && enName !== displayName && (
              <Text style={styles.enName}>{enName}</Text>
            )}</Text>
            {traitType && (
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor:
                      traitType === 'origin'
                        ? colors.primary + '20'
                        : '#A8A8A820',
                    borderColor:
                      traitType === 'origin'
                        ? colors.primary + '40'
                        : '#A8A8A850',
                  },
                ]}>
                <Text
                  style={[
                    styles.typeBadgeText,
                    {
                      color:
                        traitType === 'origin' ? colors.primary : '#B8B8B8',
                    },
                  ]}>
                  {traitType === 'origin' ? translations.origin : translations.class}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Description - full như trang detail */}
        {displayDescription ? (
          <View style={styles.section}>
            <Text style={styles.description}>{displayDescription}</Text>
          </View>
        ) : null}

        {/* Units - giống TraitDetailScreen TraitUnits */}
        <TraitUnits
          units={units}
          isLoading={isLoadingUnits}
          isError={isErrorUnits}
        />
      </View>
    </View>
  );
};

export default React.memo(GuideTraitItem, (prevProps, nextProps) => {
  return prevProps.data?.id === nextProps.data?.id;
});
