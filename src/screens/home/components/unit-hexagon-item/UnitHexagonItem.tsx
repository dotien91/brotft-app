import React, {useMemo} from 'react';
import {View, Image, useWindowDimensions} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Hexagon from '@screens/detail/components/Hexagon';
import ThreeStars from '@shared-components/three-stars/ThreeStars';
import type {ICompositionUnit} from '@services/models/composition';
import getUnitAvatar from '../../../../utils/unit-avatar';
import {getItemIconImageSource} from '../../../../utils/item-images';
import {getUnitCostBorderColor} from '../../../../utils/unitCost';
import createStyles from './UnitHexagonItem.style';

/** Số ô unit trên một hàng (board 7 cột) */
const UNITS_PER_ROW = 7;
/** Card padding 12*2 + margin giữa các ô 2*(7-1) + buffer */
const TOTAL_HORIZONTAL_OFFSET = 24 + 12 + 4;
const MIN_HEX_SIZE = 36;
const MAX_HEX_SIZE = 52;

interface UnitHexagonItemProps {
  unit: ICompositionUnit;
  index: number;
}

const UnitHexagonItem: React.FC<UnitHexagonItemProps> = ({unit, index}) => {
  const theme = useTheme();
  const {colors} = theme;
  const {width: windowWidth} = useWindowDimensions();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Tính chính xác: 7 * (hexSize + 4 border + 2 marginRight) <= windowWidth - TOTAL_HORIZONTAL_OFFSET
  const {hexSize, borderSize, itemIconSize, itemsRowBottom, tier3Size, tier3Top, tier3Right, unlockSize, unlockRight} = useMemo(() => {
    const available = windowWidth - TOTAL_HORIZONTAL_OFFSET;
    const hex = Math.floor(available / UNITS_PER_ROW) - 6; // 6 = border 4 + margin 2
    const clamped = Math.max(MIN_HEX_SIZE, Math.min(MAX_HEX_SIZE, hex));
    const border = clamped + 4;
    const itemSize = Math.max(10, Math.min(14, Math.floor(clamped * 0.24)));
    const rowBottom = -Math.floor(clamped * 0.52);
    const starSize = Math.max(26, Math.min(38, Math.floor(clamped * 0.72)));
    const ulSize = Math.max(12, Math.min(18, Math.floor(clamped * 0.36)));
    const unlockRight = -Math.floor(ulSize * 0.22);
    return {
      hexSize: clamped,
      borderSize: border,
      itemIconSize: itemSize,
      itemsRowBottom: rowBottom,
      tier3Size: starSize,
      tier3Top: -Math.floor(clamped * 0.24),
      tier3Right: Math.floor(clamped * 0.1),
      unlockSize: ulSize,
      unlockRight,
    };
  }, [windowWidth]);

  // Prefer local image; fallback to CDN URL via getUnitAvatar
  const avatar = getUnitAvatar(unit.championKey, 64);
  const imageSource = { local: avatar.local };
  const unitImage = avatar.local ? undefined : (avatar.uri || unit.image || '');

  const getItemIcon = (apiName: string) => {
    const img = getItemIconImageSource(null, apiName, 48);
    return img.local || null;
  };

  const itemCount = unit.items?.length ?? 0;
  const itemsToShow = itemCount > 0 ? unit.items!.slice(0, 3) : [];

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.hexagonBorder}>
          <Hexagon
            size={borderSize}
            backgroundColor="transparent"
            borderColor={getUnitCostBorderColor(unit.cost, colors.primary || '#94a3b8')}
            borderWidth={2}
          />
        </View>
        <View style={styles.hexagonInner}>
          <Hexagon
            size={hexSize}
            borderColor={colors.border}
            borderWidth={3}
            imageUri={unitImage}
            imageSource={imageSource.local}>
            {itemsToShow.length > 0 && (
              <View style={[styles.itemsRow, {bottom: itemsRowBottom, gap: Math.max(1, Math.floor(itemIconSize / 6))}]}>
                {itemsToShow.map((itemApiName, itemIndex) => {
                  const itemIcon = getItemIcon(itemApiName);
                  if (!itemIcon) return null;
                  return (
                    <Image
                      key={`unit-${index}-item-${itemIndex}`}
                      source={itemIcon}
                      style={[styles.itemIcon, {width: itemIconSize, height: itemIconSize}]}
                      resizeMode="contain"
                    />
                  );
                })}
              </View>
            )}
          </Hexagon>
        </View>
        {(unit.need3Star || (unit.cost <= 3 && unit.carry)) && (
          <View style={[styles.tier3Icon, {top: tier3Top, right: tier3Right, width: tier3Size, height: tier3Size}]}>
            <ThreeStars size={tier3Size} color="#fbbf24" />
          </View>
        )}
        {unit.needUnlock && (
          <View style={[styles.unlockBadge, {right: unlockRight, width: unlockSize, height: unlockSize, borderRadius: unlockSize / 2}]}>
            <Image
              source={require('@assets/icons/unlock.png')}
              style={[styles.unlockIcon, {width: unlockSize * 0.65, height: unlockSize * 0.65}]}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(UnitHexagonItem);

