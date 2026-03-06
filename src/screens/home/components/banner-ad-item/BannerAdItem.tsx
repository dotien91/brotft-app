import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {AD_UNIT_IDS} from '@shared-constants';
import LoadingList from '@shared-components/loading.list.component';
import useStore from '@services/zustand/store';

interface BannerAdItemProps {
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const BannerAdItem: React.FC<BannerAdItemProps> = ({ style }) => {
  const adsSdkInitAttempted = useStore((state) => state.adsSdkInitAttempted);
  const adsSdkInitialized = useStore((state) => state.adsSdkInitialized);
  const hasTrackingPermission = useStore((state) => state.hasTrackingPermission);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleAdLoaded = (e: any) => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleAdFailedToLoad = (e: any) => {
    setIsLoading(false);
    setHasError(true);
  };
  // Chỉ show banner khi đã attempt init và init thành công
  if (!adsSdkInitAttempted || !adsSdkInitialized) {
    return null;
  }
  return (
    <View style={[styles.container, style && style]}>
      {isLoading && !hasError && <LoadingList numberItem={1} />}
      {!hasError && (
        <BannerAd
          unitId={AD_UNIT_IDS.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: !hasTrackingPermission,
          }}
          onAdLoaded={(e) => handleAdLoaded(e)}
          onAdFailedToLoad={handleAdFailedToLoad}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    justifyContent: 'center',
    height: 60,
  },
});

export default BannerAdItem;
