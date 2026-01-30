import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {BannerAd, BannerAdSize, MobileAds} from 'react-native-google-mobile-ads';
import {AD_UNIT_IDS} from '@shared-constants';
import LoadingList from '@shared-components/loading.list.component';

interface BannerAdItemProps {
  height?: number;
}

const BannerAdItem: React.FC<BannerAdItemProps> = () => {
  const theme = useTheme();
  const {colors} = theme;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  

  const handleAdLoaded = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleAdFailedToLoad = () => {
    setIsLoading(false);
    setHasError(true);
  };
  return (
    <View style={styles.container}>
      {isLoading && !hasError &&
        <LoadingList numberItem={1} />
        }
      {!hasError && (
        <BannerAd
          unitId={AD_UNIT_IDS.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailedToLoad}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    justifyContent: 'center',
  },
});

export default BannerAdItem;
