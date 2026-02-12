import React, { useMemo } from 'react';
import { View, Image, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Hexagon from '@screens/detail/components/Hexagon';
import ThreeStars from '@shared-components/three-stars/ThreeStars';
import type { ICompositionUnit } from '@services/models/composition';
import getUnitAvatar from '../../../../utils/unit-avatar';
import { getItemIconImageSource } from '../../../../utils/item-images';
import { getUnitCostBorderColor } from '../../../../utils/unitCost';

interface UnitHexagonItemProps {
  unit: ICompositionUnit;
  size?: number;
  style?: ViewStyle;
  /** Vị trí hàng item: 'top' | 'bottom'. Mặc định 'bottom'. */
  itemsPosition?: 'top' | 'bottom';
  /** Hình dạng của unit: 'hexagon' | 'square'. Mặc định 'hexagon'. */
  shape?: 'hexagon' | 'square';
  customStyleItem?: ViewStyle;
  customStyleStar?: ViewStyle;
  borderWidth?: number;
}

const ITEM_BORDER_COLOR = '#a3a3a3'; 
const ITEM_BG_COLOR = '#000000';     

const UnitHexagonItem: React.FC<UnitHexagonItemProps> = ({
  unit,
  size = 40,
  style,
  itemsPosition = 'bottom',
  shape = 'hexagon', // Mặc định là hình lục giác
  customStyleItem,
  customStyleStar,
  borderWidth = 4,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  const metrics = useMemo(() => {
    // Offset badge: Hình vuông cần offset ít hơn hình lục giác để không bị bay quá xa góc
    const isSquare = shape === 'square';
    const badgeOffset = isSquare ? -size * 0.05 : -size * 0.12; 

    return {
      innerSize: size,
      outerSize: size, 
      itemSize: size * 0.28,
      itemRadius: 99, 
      unlockSize: size * 0.35,
      itemsOffset: 0, 
      badgeTop: badgeOffset,
      badgeBottom: badgeOffset,
      badgeLeft: badgeOffset,
      // Bo góc cho hình vuông (khoảng 10-15% size)
      squareRadius: size * 0.15,
    };
  }, [size, shape]);

  const avatar = getUnitAvatar(unit.championKey, 64);
  const imageSource = { local: avatar.local };
  const unitImage = avatar.local ? undefined : (avatar.uri || unit.image || '');
  const itemsToShow = unit.items?.slice(0, 3) ?? [];

  const borderColor = getUnitCostBorderColor(unit.cost, colors.primary || '#94a3b8');

  return (
    <View
      style={[
        styles.container,
        { width: metrics.outerSize, height: metrics.outerSize },
        style,
      ]}>

      {/* 1. Nội dung chính: Hexagon hoặc Square */}
      <View style={styles.centerAbsolute}>
        {shape === 'hexagon' ? (
          <Hexagon
            size={metrics.innerSize}
            borderColor={borderColor}
            borderWidth={borderWidth}
            imageUri={unitImage}
            imageSource={imageSource.local}
            backgroundColor="transparent"
          />
        ) : (
          <View style={{
            width: metrics.innerSize,
            height: metrics.innerSize,
            borderWidth: borderWidth,
            borderColor: borderColor,
            overflow: 'hidden',
            backgroundColor: colors.card
          }}>
            <Image 
              source={imageSource.local || { uri: unitImage }}
              style={styles.fullImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>

      {/* 2. ITEMS (Bo tròn & Sát mép) */}
      {itemsToShow.length > 0 && (
        <View
          style={[
            styles.itemsRow,
            {
              [itemsPosition]: metrics.itemsOffset,
              zIndex: itemsPosition === 'top' ? 30 : 10,
              gap: 1.5,
            },
            customStyleItem && customStyleItem
          ]}>
          {itemsToShow.map((item, idx) => {
            const icon = getItemIconImageSource(null, item, 48).local;
            if (!icon) return null;
            return (
              <Image
                key={`${unit.championId}-item-${idx}`}
                source={icon}
                style={{
                  width: metrics.itemSize,
                  height: metrics.itemSize,
                  borderWidth: 1,
                  borderColor: ITEM_BORDER_COLOR,
                  backgroundColor: ITEM_BG_COLOR,
                  borderRadius: metrics.itemRadius, 
                }}
                resizeMode="contain"
              />
            );
          })}
        </View>
      )}

      {/* 3. Icon 3 Sao - CĂN GIỮA TUYỆT ĐỐI */}
      {(unit.need3Star || (unit.cost <= 3 && unit.carry)) && (
        <View
          style={[
            styles.absoluteBadge,
            {
              left: 0,
              right: 0,
              height: 10,
              alignItems: 'center',
              ...(itemsPosition === 'top' 
                ? { bottom: metrics.badgeBottom } 
                : { top: shape === 'hexagon' ? 4 : 0 } // Hình vuông không cần đẩy xuống 4px như lục giác
              ),
              zIndex: 25,
            },
            customStyleStar && customStyleStar
          ]}>
          <ThreeStars size={18} color="#fbbf24" />
        </View>
      )}

      {/* 4. Icon Mở khoá */}
      {unit.needUnlock && (
        <View
          style={[
            styles.absoluteBadge,
            {
              top: metrics.badgeTop,
              left: metrics.badgeLeft,
              zIndex: 40,
            },
          ]}>
          <Image
            source={require('@assets/icons/unlock.png')}
            style={{
              width: metrics.unlockSize,
              height: metrics.unlockSize,
            }}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  centerAbsolute: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
  },
  absoluteBadge: {
    position: 'absolute',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  }
});

export default React.memo(UnitHexagonItem);