import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getTraitIconUrl} from '../../../utils/metatft';
import {SCREENS} from '@shared-constants';
import createStyles from '../DetailScreen.style';

const TraitItem = ({trait}: any) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);
  const {count, breakpoints, apiName, id} = trait;

  // Kiểm tra an toàn cho breakpoints và count
  const safeBreakpoints = Array.isArray(breakpoints) ? breakpoints : [];
  const safeCount = typeof count === 'number' ? count : 0;

  const getTierColor = () => {
    if (!safeBreakpoints || safeBreakpoints.length === 0) {
      return colors.border || '#94a3b8'; // Default color khi không có breakpoints
    }

    const achieved = safeBreakpoints.filter((bp: number) => safeCount >= bp);
    if (achieved.length === 0) {
      return '#cd7f32'; // Bronze khi chưa đạt breakpoint nào
    }

    const highestIdx = achieved.length - 1;
    const isMax = safeCount >= safeBreakpoints[safeBreakpoints.length - 1];
    const isUnique = safeBreakpoints.length === 1;

    // Ưu tiên màu Cam cho hệ Unique (1/1)
    if (isUnique) return '#ff8000'; 
    
    // Nếu đạt mốc tối đa (nhưng không phải unique 1/1) -> Vàng
    if (isMax) return '#ffbb00';

    // Các mốc dở dang: Bạc, Đồng
    const tierColors = ['#cd7f32', '#c0c0c0', '#ffbb00', '#b9f2ff'];
    return tierColors[Math.min(highestIdx, tierColors.length - 1)] || tierColors[0];
  };

  const tierColor = getTierColor();
  const highestBP = safeBreakpoints && safeBreakpoints.length > 0
    ? Math.max(...safeBreakpoints.filter((bp: number) => safeCount >= bp), 0)
    : 0;

  return (
    <RNBounceable 
      style={styles.traitCardNew} 
      onPress={() => id && NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId: id})}
    >
      <FastImage
        source={{uri: getTraitIconUrl(apiName)}}
        style={[styles.traitCardIconNew, {tintColor: tierColor}]}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.traitCardInfoContainer}>
        {highestBP > 0 && (
          <Text style={[styles.traitBreakpoint, {color: tierColor, fontWeight: 'bold'}]}>
            {highestBP}
          </Text>
        )}
      </View>
    </RNBounceable>
  );
};

export default TraitItem;