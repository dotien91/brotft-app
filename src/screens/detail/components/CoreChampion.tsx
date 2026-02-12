import React, { useMemo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';

// --- IMPORTS: DATA & CONSTANTS ---
import { getCachedUnits, getCachedTraits } from '@services/api/data';
import { SCREENS } from '@shared-constants';
import { translations } from '../../../shared/localization';

// --- IMPORTS: UTILS & COMPONENTS ---
import Hexagon from './Hexagon';
import { getTraitIconUrl } from '../../../utils/metatft';
import getUnitAvatar from '../../../utils/unit-avatar';
import { getItemIconImageSource } from '../../../utils/item-images';
import { getUnitCostBorderColor } from '../../../utils/unitCost';

interface CoreChampionCardProps {
  coreChampion: any;
}

const CoreChampionCard: React.FC<CoreChampionCardProps> = ({ coreChampion }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Guard clause
  if (!coreChampion) return null;

  const championKey = coreChampion.championKey || coreChampion.championId;
  const defaultName = coreChampion.name;

  // 1. TÌM KIẾM LOCAL UNIT (Chứa Tên và Traits đã Localize)
  const localUnitData = useMemo(() => {
    if (!championKey) return null;
    try {
      const unitsData = getCachedUnits();
      if (!unitsData) return null;

      // Ưu tiên tìm trực tiếp bằng key (O(1))
      const directUnit = unitsData[championKey];
      if (directUnit) return directUnit;

      // Fallback: Tìm trong mảng (O(n))
      return Object.values(unitsData).find((u: any) => u.apiName === championKey);
    } catch (e) {
      return null;
    }
  }, [championKey]);

  // 2. Lấy tên hiển thị tướng (Ưu tiên local -> fallback default)
  const displayName = localUnitData?.name || defaultName;

  // 3. Helper: Lấy tên hiển thị cho Trait (Localize) từ Cache Traits toàn cục
  // Dùng khi không map được từ localUnitData
  const getLocalizedTraitName = (traitKey: string) => {
    try {
      const traitsData = getCachedTraits();
      if (!traitsData) return traitKey;

      // Tìm trait data khớp với traitKey
      const traitData = Object.values(traitsData).find((t: any) => 
        t.apiName === traitKey || 
        t.key === traitKey || 
        t.name === traitKey
      );
      
      return (traitData as any)?.name || traitKey;
    } catch (e) {
      return traitKey;
    }
  };

  // 4. Chuẩn bị hình ảnh và màu sắc
  const avatar = getUnitAvatar(championKey, 64);
  const imageSource = { local: avatar.local };
  const unitImageUri = avatar.local ? undefined : (avatar.uri || coreChampion.image);
  const borderColor = getUnitCostBorderColor(coreChampion.cost);

  const handlePress = () => {
    NavigationService.push(SCREENS.UNIT_DETAIL, { unitApiName: championKey });
  };

  // 5. Render Items
  const renderItems = () => {
    if (!coreChampion.items || coreChampion.items.length === 0) return null;

    return (
      <View style={styles.itemsRow}>
        {coreChampion.items.map((itemApiName: string, index: number) => {
          const itemSource = getItemIconImageSource(null, itemApiName, 48);
          if (!itemSource.local && !itemSource.uri) return null;

          return (
            <View key={`${itemApiName}-${index}`} style={styles.itemContainer}>
              <Image
                source={itemSource.local || { uri: itemSource.uri }}
                style={styles.itemIcon}
                resizeMode="contain"
              />
            </View>
          );
        })}
      </View>
    );
  };

  // 6. Render Traits (QUAN TRỌNG: Icon gốc + Tên Local)
  const renderTraits = () => {
    // List Key gốc (Tiếng Anh) -> Dùng lấy Icon
    const originalTraits = coreChampion.traits || [];
    
    // List Tên đã dịch (Tiếng Việt/...) -> Dùng lấy Text
    // Giả định API trả về traits của localUnitData khớp thứ tự với traits gốc
    const localTraitsList = localUnitData?.traits;

    if (!originalTraits || originalTraits.length === 0) return null;

    return (
      <View style={styles.traitsRow}>
        {originalTraits.map((traitKey: string, index: number) => {
          // A. ICON: Lấy từ Key gốc (vd: "Vanquisher")
          const traitIconUrl = getTraitIconUrl(traitKey);

          // B. NAME: Lấy từ Local Data
          let traitDisplayName = traitKey;

          if (localTraitsList && localTraitsList[index]) {
            // Ưu tiên 1: Map theo index từ local unit
            traitDisplayName = localTraitsList[index];
          } else {
            // Ưu tiên 2: Tìm trong Global Cache Traits
            traitDisplayName = getLocalizedTraitName(traitKey);
          }

          return (
            <View key={`${traitKey}-${index}`} style={styles.traitBadge}>
              {traitIconUrl && (
                <Image
                  source={{ uri: traitIconUrl }}
                  style={styles.traitIcon}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.traitText}>{traitDisplayName}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{translations.coreChampion || 'CORE CHAMPION'}</Text>
      </View>

      <RNBounceable style={styles.cardContent} onPress={handlePress}>
        {/* LEFT SECTION: Avatar Hexagon + Cost */}
        <View style={styles.leftSection}>
          <View style={styles.hexagonWrapper}>
            {/* Viền Cost (Outer) */}
            <View style={styles.hexBorder}>
              <Hexagon
                size={68}
                backgroundColor="transparent"
                borderColor={borderColor}
                borderWidth={2}
              />
            </View>
            {/* Ảnh Tướng (Inner) */}
            <View style={styles.hexInner}>
              <Hexagon
                size={60}
                borderColor="transparent" 
                borderWidth={0}
                imageUri={unitImageUri}
                imageSource={imageSource.local}
              />
            </View>
            {/* Cost Badge (Circle) */}
            <View style={[styles.costBadge, { backgroundColor: borderColor }]}>
                <Text style={styles.costText}>{coreChampion.cost}</Text>
            </View>
          </View>
        </View>

        {/* RIGHT SECTION: Info + Traits + Items */}
        <View style={styles.rightSection}>
            <View style={styles.nameRow}>
                <Text style={styles.championName}>{displayName}</Text>
            </View>
            {renderTraits()}
            {renderItems()}
        </View>
      </RNBounceable>
    </View>
  );
};

// --- STYLES ---
const createStyles = (theme: any) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      marginVertical: 12,
      marginHorizontal: 6,
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '900',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    cardContent: {
      flexDirection: 'row',
      padding: 12,
      alignItems: 'center',
    },
    // --- LEFT SECTION ---
    leftSection: {
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    hexagonWrapper: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      width: 70,
      height: 70 * 1.15,
    },
    hexBorder: {
      position: 'absolute',
    },
    hexInner: {
      position: 'absolute',
    },
    costBadge: {
      position: 'absolute',
      bottom: 0,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 10,
    },
    costText: {
      color: '#fff', // Luôn trắng để nổi bật trên nền màu cost
      fontSize: 12,
      fontWeight: 'bold',
    },
    // --- RIGHT SECTION ---
    rightSection: {
      flex: 1,
      justifyContent: 'center',
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    championName: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    // --- TRAITS ---
    traitsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 10,
      gap: 12, // Khoảng cách thoáng
      alignItems: 'center',
    },
    traitBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      // Không background, không border
    },
    traitIcon: {
      width: 14,
      height: 14,
      marginRight: 6,
    },
    traitText: {
      color: colors.placeholder, // Text màu phụ (xám nhạt)
      fontSize: 12,
      fontWeight: '500',
    },
    // --- ITEMS ---
    itemsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    itemContainer: {
      width: 34,
      height: 34,
      borderRadius: 4,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemIcon: {
      width: 30,
      height: 30,
      borderRadius: 4,
    },
  });
};

export default CoreChampionCard;