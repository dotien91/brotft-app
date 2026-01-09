import React, {useMemo} from 'react';
import {View, StyleSheet, ViewStyle, TextStyle, Image, ImageStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useTftUnitByApiName} from '@services/api/hooks/listQueryHooks';
import {getUnitAvatarImageSource} from '../../../utils/champion-images';
import {getUnitCostBorderColor} from '../../../utils/unitCost';
import Hexagon from '@screens/detail/components/Hexagon';
import Text from '@shared-components/text-wrapper/TextWrapper';

interface UnitAvatarProps {
  apiName: string;
  hexSize?: number;
}

const UnitAvatar: React.FC<UnitAvatarProps> = ({
  apiName,
  hexSize = 46,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {data: unit, isLoading} = useTftUnitByApiName(apiName);

  if (isLoading || !unit) {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.hexagonBorder}>
            <Hexagon
              size={hexSize + 4}
              backgroundColor="transparent"
              borderColor={colors.border}
              borderWidth={1}
            />
          </View>
          <View style={styles.hexagonInner}>
            <Hexagon
              size={hexSize}
              backgroundColor={colors.card}
              borderColor={colors.border}
              borderWidth={2}
            />
          </View>
        </View>
      </View>
    );
  }

  const imageSource = getUnitAvatarImageSource(unit.apiName || apiName, 64);
  const unitImage = imageSource.local ? undefined : imageSource.uri;
  const borderColor = getUnitCostBorderColor(unit.cost ?? undefined, colors.primary);
  const unitName = unit.name || '';
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Border hexagon */}
        <View style={styles.hexagonBorder}>
          <Hexagon
            size={hexSize + 4}
            backgroundColor="transparent"
            borderColor={borderColor}
            borderWidth={1}
          />
        </View>
        {/* Main hexagon with image */}
        <View style={styles.hexagonInner}>
          <Hexagon
            size={hexSize}
            backgroundColor={colors.card}
            borderColor={colors.border}
            borderWidth={2}
            imageUri={unitImage}
            imageSource={imageSource.local}
          />
          {/* Unit name absolute position inside hexagon */}
          {unitName && (
            <View style={styles.unitNameContainer}>
              <View style={styles.unitNameBackground}>
                <Text style={styles.unitName} numberOfLines={1}>
                  {unitName}
                </Text>
              </View>
            </View>
          )}
        </View>
        {/* Unlock badge */}
        {unit.needUnlock && (
          <View style={[styles.unlockBadge, {
            width: hexSize * 0.3,
            height: hexSize * 0.3,
            borderRadius: hexSize * 0.3 / 2,
          }]}>
            <Image
              source={require('@assets/icons/unlock.png')}
              style={[styles.unlockIcon, {
                width: hexSize * 0.18,
                height: hexSize * 0.18,
              }]}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: any) => {
  const {colors} = theme;
  return StyleSheet.create<{
    container: ViewStyle;
    wrapper: ViewStyle;
    hexagonBorder: ViewStyle;
    hexagonInner: ViewStyle;
    unitNameContainer: ViewStyle;
    unitNameBackground: ViewStyle;
    unitName: TextStyle;
    unlockBadge: ViewStyle;
    unlockIcon: ImageStyle;
  }>({
    container: {
      alignItems: 'center',
      marginRight: 2,
      marginBottom: 2,
    },
    wrapper: {
      position: 'relative',
      marginBottom: 2,
      overflow: 'visible',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hexagonBorder: {
      position: 'absolute',
      zIndex: 1,
    },
    hexagonInner: {
      position: 'relative',
      zIndex: 2,
    },
    unitNameContainer: {
      position: 'absolute',
      bottom: 2,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      width: '100%',
      paddingHorizontal: 4,
    },
    unitNameBackground: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    unitName: {
      fontSize: 9,
      fontWeight: '600',
      color: '#ffffff',
      textAlign: 'center',
    },
    unlockBadge: {
      position: 'absolute',
      top: 0,
      right: -4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 9,
    },
    unlockIcon: {
      // Size will be set dynamically
    },
  });
};

export default UnitAvatar;

