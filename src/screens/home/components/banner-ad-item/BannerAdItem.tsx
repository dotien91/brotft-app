import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

interface BannerAdItemProps {
  height?: number;
}

const BannerAdItem: React.FC<BannerAdItemProps> = ({height = 190}) => {
  const theme = useTheme();
  const {colors} = theme;
return null
  return (
    <View style={[styles.container, {height, backgroundColor: colors.card, borderColor: colors.border}]}>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
});

export default BannerAdItem;
