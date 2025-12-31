import React, {useMemo} from 'react';
import {View, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from '@react-navigation/native';
import Hexagon from '@screens/detail/components/Hexagon';
import ThreeStars from '@shared-components/three-stars/ThreeStars';
import type {ICompositionUnit} from '@services/models/composition';
import {getUnitAvatarUrl, getItemIconUrlFromPath} from '../../../../utils/metatft';
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

  const unitImage = getUnitAvatarUrl(unit.championKey, 64) || unit.image || '';

  const getItemIcon = (apiName: string) => {
    const iconUrl = getItemIconUrlFromPath(null, apiName);
    return iconUrl;
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
            imageUri={unitImage}>
            {/* Items inside hexagon */}
            {unit.items && unit.items.length > 0 && (
              <View style={styles.itemsRow}>
                {unit.items.map((itemApiName, itemIndex) => (
                  <FastImage
                    key={`unit-${index}-item-${itemIndex}`}
                    source={{uri: getItemIcon(itemApiName)}}
                    style={styles.itemIcon as any}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                ))}
              </View>
            )}
          </Hexagon>
        </View>
        {unit.need3Star && (
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

