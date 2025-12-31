import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {ADMOB_CONFIG, USE_TEST_ADS} from '@config/admob';

interface BannerAdProps {
  style?: any;
}

const AdBanner: React.FC<BannerAdProps> = ({style}) => {
  const adUnitId = USE_TEST_ADS 
    ? TestIds.BANNER 
    : ADMOB_CONFIG.AD_UNIT_IDS.BANNER;

  // Sử dụng LARGE_BANNER (320x100) để có chiều cao tương đương với composition card
  // Composition card thường có chiều cao khoảng 100-140px
  const adSize = BannerAdSize.LARGE_BANNER;

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitId}
        size={adSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
    height: 100, // Chiều cao bằng với LARGE_BANNER (100px)
  },
});

export default AdBanner;

