import React, {useMemo, useState, useEffect} from 'react';
import {View, Image} from 'react-native';
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

const GuideTraitItem: React.FC<GuideTraitItemProps> = ({data}) => { // Removed onPress if not used, or keep if needed for parent
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);
  
  // Local state for localized data
  const [localizedName, setLocalizedName] = useState<string | null>(null);
  const [localizedDesc, setLocalizedDesc] = useState<string | null>(null);
  const [localizedEffects, setLocalizedEffects] = useState<any[] | null>(null);
  const [localizedType, setLocalizedType] = useState<'origin' | 'class' | null>(null);

  const {name, desc, icon, apiName, effects, enName} = data;

  // --- LOGIC MỚI: Truy vấn O(1) từ Object Map ---
  useEffect(() => {
    // Reset state nếu thiếu key định danh
    if ((!apiName && !name) || !language) {
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
        return; // Không có data cache thì giữ nguyên props gốc
      }

      const traitsMap = JSON.parse(traitsDataString);
      
      // OPTIMIZATION: Truy xuất trực tiếp theo apiName (O(1))
      // Nếu không có apiName thì fallback sang name
      const traitDetail = traitsMap[apiName] || (name ? traitsMap[name] : null);

      if (traitDetail) {
        setLocalizedName(traitDetail.name || null);
        setLocalizedDesc(traitDetail.desc || traitDetail.description || null);
        setLocalizedEffects(traitDetail.effects || null);
        
        const t = traitDetail.type?.toLowerCase();
        setLocalizedType(
          t === 'origin' || t === 'class' ? t : null
        );
      } else {
        // Fallback: Nếu không tìm thấy trong cache map, clear localized data để dùng data gốc từ props
        setLocalizedName(null);
        setLocalizedDesc(null);
        setLocalizedEffects(null);
        setLocalizedType(null);
      }
    } catch (error) {
      console.warn('Error parsing trait localized data:', error);
      setLocalizedName(null);
      setLocalizedDesc(null);
      setLocalizedEffects(null);
      setLocalizedType(null);
    }
  }, [name, apiName, language]);

  // Ưu tiên type từ API, sau đó đến LocalStorage
  const traitType = (data as {type?: 'origin' | 'class'}).type ?? localizedType ?? null;

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

  // Fetch units có trait này
  const {
    data: unitsData,
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
  } = useTftUnits(
    {
      filters: {trait: name}, // API thường lọc theo English name hoặc ID gốc
      limit: 100,
    },
    {enabled: !!name},
  );
  
  const units = unitsData?.data ?? [];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
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
            <Text>
              <Text style={styles.title}>{displayName}{'   '}</Text>
              {enName && enName !== displayName && (
                <Text style={styles.enName}>{enName}</Text>
              )}
            </Text>
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

        {/* Description Section */}
        {displayDescription ? (
          <View style={styles.section}>
            <Text style={styles.description}>{displayDescription}</Text>
          </View>
        ) : null}

        {/* Units Section */}
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
  // So sánh kỹ hơn để tránh re-render không cần thiết
  return (
    prevProps.data?.apiName === nextProps.data?.apiName &&
    prevProps.data?.name === nextProps.data?.name
  );
});