import React, {useMemo} from 'react';
import {View, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Hexagon from '@screens/detail/components/Hexagon';
import ThreeStars from '@shared-components/three-stars/ThreeStars';
import type {ICompositionUnit} from '@services/models/composition';
import {getUnitAvatarImageSource} from '../../../../utils/champion-images';
import getUnitAvatar from '../../../../utils/unit-avatar';
import {getItemIconImageSource} from '../../../../utils/item-images';
import {getUnitCostBorderColor} from '../../../../utils/unitCost';
import createStyles from './UnitHexagonItem.style';

interface UnitHexagonItemProps {
  unit: ICompositionUnit;
  index: number;
}

const UnitHexagonItem: React.FC<UnitHexagonItemProps> = ({unit, index}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Prefer local image; fallback to CDN URL via getUnitAvatar
  const avatar = getUnitAvatar(unit.championKey, 64);
  const imageSource = { local: avatar.local };
  const unitImage = avatar.local ? undefined : (avatar.uri || unit.image || '');

  const getItemIcon = (apiName: string) => {
    const imageSource = getItemIconImageSource(null, apiName, 48);
    // Only use local image, no URL fallback
    return imageSource.local || null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Border hexagon */}
        <View style={styles.hexagonBorder}>
          <Hexagon
            size={50}
            backgroundColor="transparent"
            borderColor={getUnitCostBorderColor(unit.cost, colors.primary || '#94a3b8')}
            borderWidth={1}
          />
        </View>
        {/* Main hexagon with image */}
        <View style={styles.hexagonInner}>
          <Hexagon
            size={46}
            backgroundColor={colors.card}
            borderColor={colors.border}
            borderWidth={2}
            imageUri={unitImage}
            imageSource={imageSource.local}>
            {/* Items inside hexagon */}
            {unit.items && unit.items.length > 0 && (
              <View style={styles.itemsRow}>
                {unit.items.map((itemApiName, itemIndex) => {
                  const itemIcon = getItemIcon(itemApiName);
                  // Only render if we have a valid source
                  if (!itemIcon) return null;
                  
                  return (
                    <Image
                      key={`unit-${index}-item-${itemIndex}`}
                      source={itemIcon}
                      style={styles.itemIcon}
                      resizeMode="contain"
                    />
                  );
                })}
              </View>
            )}
          </Hexagon>
        </View>
        {(unit.need3Star || (unit.cost <= 3 && unit.carry)) && (
          <View style={styles.tier3Icon}>
            <ThreeStars size={36} color="#fbbf24" />
          </View>
        )}
        {unit.needUnlock && (
          <View style={styles.unlockBadge}>
            <Image
              source={require('@assets/icons/unlock.png')}
              style={styles.unlockIcon}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(UnitHexagonItem);

