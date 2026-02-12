import React, { useMemo } from 'react';
import { View, Image, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Hexagon from '@screens/detail/components/Hexagon';
import ThreeStars from '@shared-components/three-stars/ThreeStars';
import getUnitAvatar from '../../../../utils/unit-avatar';
import { getItemIconImageSource } from '../../../../utils/item-images';
import { getUnitCostBorderColor } from '../../../../utils/unitCost';
import { getCachedUnits } from '@services/api/data';

export type UnitHexagonItemUnit = {
  championKey?: string;
  championId?: string;
  apiName?: string;
  name?: string;
  cost?: number | null;
  image?: string;
  items?: string[];
  need3Star?: boolean;
  carry?: boolean;
  needUnlock?: boolean;
};

interface UnitHexagonItemProps {
  unit: UnitHexagonItemUnit;
  size?: number;
  style?: ViewStyle;
  itemsPosition?: 'top' | 'bottom';
  shape?: 'hexagon' | 'square';
  customStyleItem?: ViewStyle;
  customStyleStar?: ViewStyle;
  borderWidth?: number;
  
  /** * Vị trí icon Unlock: 
   * - 'left': Giữa cạnh trái 
   * - 'top': Giữa cạnh trên 
   * - 'topLeft': Góc trên trái (mặc định cũ)
   */
  unlockPosition?: 'top' | 'left' | 'topLeft';
}

const ITEM_BORDER_COLOR = '#a3a3a3'; 
const ITEM_BG_COLOR = '#000000';     

const UnitHexagonItem: React.FC<UnitHexagonItemProps> = ({
  unit,
  size = 40,
  style,
  itemsPosition = 'bottom',
  shape = 'hexagon',
  customStyleItem,
  customStyleStar,
  borderWidth = 2,
  unlockPosition = 'topLeft', // Mặc định là giữa lề trái
}) => {
  const theme = useTheme();
  const { colors } = theme;

  const unitKey = unit.championKey ?? unit.apiName ?? '';
  
  const itemLocal = useMemo(() => {
    return getCachedUnits()?.[unitKey];
  }, [unitKey]);

  const metrics = useMemo(() => {
    // Kích thước icon unlock
    const unlockSize = size * 0.35;
    
    // Offset cho trường hợp topLeft
    const isSquare = shape === 'square';
    const cornerOffset = isSquare ? -size * 0.05 : -size * 0.12; 

    // Tính toán vị trí Unlock dựa trên prop unlockPosition
    let unlockTop = 0;
    let unlockLeft = 0;

    switch (unlockPosition) {
      case 'top':
        // Căn giữa theo chiều ngang
        unlockLeft = (size - unlockSize) / 2;
        // Đẩy lên trên mép (offset âm)
        unlockTop = -size * 0.15;
        break;
        
      case 'left':
        // Căn giữa theo chiều dọc
        unlockTop = (size - unlockSize) / 2;
        // Đẩy sang trái mép (offset âm)
        unlockLeft = -size * 0.15;
        break;
        
      case 'topLeft':
      default:
        // Vị trí góc cũ
        unlockTop = cornerOffset+2;
        unlockLeft = cornerOffset;
        break;
    }

    return {
      innerSize: size,
      outerSize: size, 
      itemSize: size * 0.28,
      itemRadius: 99, 
      unlockSize: unlockSize,
      itemsOffset: 0, 
      
      // Badge Star
      badgeTop: cornerOffset,
      badgeBottom: cornerOffset,
      
      // Badge Unlock (Dynamic)
      unlockTop,
      unlockLeft,

      squareRadius: size * 0.15,
    };
  }, [size, shape, unlockPosition]);

  const avatar = getUnitAvatar(unitKey, 64);
  const imageSource = { local: avatar.local };
  const unitImage = avatar.local ? undefined : (avatar.uri || unit.image || '');
  const itemsToShow = unit.items?.slice(0, 3) ?? [];
  const unitIdForKey = unit.championId ?? unit.championKey ?? unit.apiName ?? '';
  const borderColor = getUnitCostBorderColor(unit.cost, colors.primary || '#94a3b8');

  return (
    <View
      style={[
        styles.container,
        { width: metrics.outerSize, height: metrics.outerSize },
        style,
      ]}>

      {/* 1. Nội dung chính */}
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
            borderRadius: metrics.squareRadius,
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

      {/* 2. ITEMS */}
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
                key={`${unitIdForKey}-item-${idx}`}
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

      {/* 3. Icon 3 Sao */}
      {((unit.need3Star || ((unit.cost ?? 0) <= 3 && unit.carry))) && (
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
                : { top: shape === 'hexagon' ? 4 : 0 } 
              ),
              zIndex: 25,
            },
            customStyleStar && customStyleStar
          ]}>
          <ThreeStars size={18} color="#fbbf24" />
        </View>
      )}

      {/* 4. Icon Mở khoá (Vị trí Dynamic) */}
      {(unit.needUnlock || itemLocal?.unlock) && (
        <View
          style={[
            styles.absoluteBadge,
            {
              top: metrics.unlockTop,   
              left: metrics.unlockLeft, 
              zIndex: 40,
              width: metrics.unlockSize,
              height: metrics.unlockSize,
              borderRadius: 99,
              overflow: 'hidden',
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