import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from '@react-navigation/native';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import EmptyList from '@shared-components/empty-list/EmptyList';
import {SCREENS} from '@shared-constants';
import {translations} from '../../../shared/localization';
import BannerAdItem from '../../home/components/banner-ad-item/BannerAdItem';
import {useTftItemsWithPagination} from '@services/api/hooks/listQueryHooks';
import {
  TFT_ITEM_TYPE_LABELS,
  type ITftItem,
  type TftItemType,
} from '@services/models/tft-item';
import {getItemIconImageSource} from '../../../utils/item-images';

const ITEM_TYPES = Object.keys(TFT_ITEM_TYPE_LABELS) as TftItemType[];

interface ItemsTabProps {
  enabled?: boolean;
}

const ItemsTab: React.FC<ItemsTabProps> = ({enabled = true}) => {
  const {colors} = useTheme();
  const [selectedType, setSelectedType] =
    useState<TftItemType>('basic');

  const {
    data: items,
    isLoading,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
  } = useTftItemsWithPagination(50, enabled, {type: selectedType});

  const handleItemPress = useCallback((item: ITftItem) => {
    NavigationService.push(SCREENS.ITEM_DETAIL, {
      itemId: String(item.id),
    });
  }, []);

  const renderItem = useCallback(
    (item: ITftItem) => {
      const imageSource = getItemIconImageSource(
        item.icon,
        item.apiName,
        52,
        item,
      );

      return (
        <TouchableOpacity
          key={String(item.id)}
          style={[styles.itemCard, {backgroundColor: colors.card}]}
          activeOpacity={0.75}
          onPress={() => handleItemPress(item)}>
          <View
            style={[
              styles.imagePlaceholder,
              {backgroundColor: colors.border},
            ]}>
            {imageSource.local || imageSource.uri ? (
              <FastImage
                source={
                  imageSource.local || {uri: imageSource.uri}
                }
                style={styles.itemImage}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : null}
          </View>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [colors.border, colors.card, handleItemPress],
  );

  return (
    <ScrollView
      style={{backgroundColor: colors.background}}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.adContainer}>
        <BannerAdItem />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}>
        {ITEM_TYPES.map(type => {
          const selected = type === selectedType;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedType(type)}
              style={[
                styles.tab,
                {
                  backgroundColor: selected
                    ? colors.primary
                    : colors.card,
                },
              ]}>
              <Text
                style={[
                  styles.tabLabel,
                  {color: selected ? '#fff' : colors.text},
                ]}>
                {TFT_ITEM_TYPE_LABELS[type]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {isLoading && items.length === 0 ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={styles.loader}
        />
      ) : isNoData ? (
        <EmptyList message={translations.noItemsFound} />
      ) : (
        <View style={styles.grid}>{items.map(renderItem)}</View>
      )}

      {hasMore && items.length > 0 ? (
        <TouchableOpacity
          disabled={isLoadingMore}
          onPress={loadMore}
          style={[styles.loadMore, {backgroundColor: colors.primary}]}>
          {isLoadingMore ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loadMoreText}>Load more</Text>
          )}
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  adContainer: {
    marginBottom: 8,
  },
  tabs: {
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tab: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 12,
  },
  itemCard: {
    alignItems: 'center',
    borderRadius: 10,
    padding: 8,
    width: '22.5%',
  },
  imagePlaceholder: {
    borderRadius: 8,
    height: 52,
    overflow: 'hidden',
    width: 52,
  },
  itemImage: {
    height: 52,
    width: 52,
  },
  itemName: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
  loader: {
    marginTop: 40,
  },
  loadMore: {
    alignSelf: 'center',
    borderRadius: 18,
    marginTop: 18,
    minWidth: 120,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ItemsTab;
