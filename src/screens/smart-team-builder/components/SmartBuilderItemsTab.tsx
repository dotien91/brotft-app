import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@react-navigation/native';
import { useTftItemsWithPagination } from '@services/api/hooks/listQueryHooks';
import Icon from '@shared-components/icon/Icon';
import { translations } from '../../../shared/localization';
import { getItemIconImageSource } from '../../../utils/item-images';
import {
  TFT_ITEM_TYPE_LABELS,
  type TftItemType,
} from '@services/models/tft-item';

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- CẤU HÌNH GRID ---
const COLUMNS = 8;
const ROWS_PER_PAGE = 3; // Giảm xuống 2 hàng để vừa với TabView ở màn hình cha
const ITEMS_PER_PAGE = COLUMNS * ROWS_PER_PAGE; // 14 items mỗi trang
const GRID_PADDING = 6;
const GAP = 2;
const ITEM_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
const ITEM_TYPES = Object.keys(TFT_ITEM_TYPE_LABELS) as TftItemType[];

export interface SmartBuilderItemsTabProps {
  enabled?: boolean;
  selectedItemIds: string[];
  onToggleItem: (itemId: string) => void;
}

const SmartBuilderItemsTab: React.FC<SmartBuilderItemsTabProps> = ({
  enabled = true,
  selectedItemIds,
  onToggleItem,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const flatListRef = useRef<FlatList>(null);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedType, setSelectedType] =
    useState<TftItemType>('combined');

  // 1. Sử dụng API Pagination (Load 42 items = 3 trang full hiển thị mượt)
  const {
    data: allItems,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
    totalCount,
  } = useTftItemsWithPagination(42, enabled, {type: selectedType});

  const itemsList = allItems || [];

  // 2. Chia dữ liệu từ API thành các trang Slide (14 items/page)
  const paginatedItems = useMemo(() => {
    const pages: any[][] = [];
    for (let i = 0; i < itemsList.length; i += ITEMS_PER_PAGE) {
      pages.push(itemsList.slice(i, i + ITEMS_PER_PAGE));
    }
    return pages;
  }, [itemsList]);

  // Số trang slider theo total_count từ API
  const totalPages = useMemo(() => {
    if (totalCount != null && totalCount > 0) {
      return Math.ceil(totalCount / ITEMS_PER_PAGE);
    }
    return Math.max(1, paginatedItems.length);
  }, [totalCount, paginatedItems.length]);

  // 3. Xử lý load thêm dữ liệu khi vuốt đến trang cuối của Slide hiện tại
  const handleMomentumScrollEnd = useCallback((e: any) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SCREEN_WIDTH);
    setCurrentPageIndex(index);

    // Nếu vuốt đến trang cuối cùng hiện có và API vẫn còn dữ liệu, hãy load thêm
    if (index >= paginatedItems.length - 1 && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [paginatedItems.length, hasMore, isLoadingMore, loadMore]);

  // 4. Render ô vuông chỉ icon, chọn thì viền xanh lá
  const renderGridItem = useCallback(
    (item: any, index: number) => {
      const itemApiName = item?.apiName;
      const isSelected = selectedItemIds.includes(itemApiName);
      const imageSource = getItemIconImageSource(
        item?.icon,
        itemApiName,
        Math.round(ITEM_SIZE),
        item,
      );

      return (
        <TouchableOpacity
          key={itemApiName || index}
          onPress={() => itemApiName && onToggleItem(itemApiName)}
          activeOpacity={0.7}
          style={styles.cellTouchable}
        >
          <View style={[styles.itemWrapper, isSelected && styles.itemWrapperSelected]}>
            {imageSource.local ? (
              <Image source={imageSource.local} style={styles.iconSquare} resizeMode="cover" />
            ) : imageSource.uri ? (
              <FastImage source={{ uri: imageSource.uri }} style={styles.iconSquare} resizeMode={FastImage.resizeMode.cover} />
            ) : (
              <View style={styles.iconPlaceholder} />
            )}
            {isSelected && (
              <View style={styles.selectedOverlay}>
                <Icon name="check" size={16} color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [selectedItemIds, onToggleItem]
  );

  const renderPage = useCallback(
    ({ item: pageData }: { item: any[] }) => (
      <View style={styles.pageContainer}>
        <View style={styles.gridContainer}>
          {pageData.map(renderGridItem)}
        </View>
      </View>
    ),
    [renderGridItem],
  );

  // --- XỬ LÝ CÁC TRẠNG THÁI (LOADING, LỖI, TRỐNG) ---
  if (isLoading && itemsList.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError && itemsList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.notification }}>{translations.errorLoadingItems}{error?.message ? `: ${error.message}` : ''}</Text>
      </View>
    );
  }

  if (isNoData) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.placeholder }}>{translations.noItemsFound}</Text>
      </View>
    );
  }

  // --- RENDER GIAO DIỆN CHÍNH ---
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeTabs}>
        {ITEM_TYPES.map(type => {
          const selected = selectedType === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => {
                setSelectedType(type);
                setCurrentPageIndex(0);
                flatListRef.current?.scrollToOffset({
                  offset: 0,
                  animated: false,
                });
              }}
              style={[
                styles.typeTab,
                {
                  backgroundColor: selected
                    ? colors.primary
                    : colors.card,
                },
              ]}>
              <Text
                style={{
                  color: selected ? '#fff' : colors.text,
                  fontSize: 10,
                }}>
                {TFT_ITEM_TYPE_LABELS[type]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <FlatList
        ref={flatListRef}
        data={paginatedItems}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        keyExtractor={(_, index) => `item-slide-${index}`}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        // Tối ưu hóa render
        removeClippedSubviews={true}
        windowSize={3}
      />

      {/* Pagination Dots & Loading More Indicator - số trang theo total_count từ API */}
      <View style={styles.footer}>
        {totalPages > 1 && (
          <View style={styles.dotsContainer}>
            {Array.from({ length: totalPages }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === currentPageIndex ? colors.primary : colors.border },
                  i === currentPageIndex && styles.activeDot
                ]}
              />
            ))}
          </View>
        )}
        {isLoadingMore && (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  typeTabs: {
    gap: 5,
    paddingBottom: 6,
    paddingHorizontal: 6,
  },
  typeTab: {
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  center: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: GRID_PADDING,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    height: ITEM_SIZE * ROWS_PER_PAGE + GAP * (ROWS_PER_PAGE - 1),
  },
  cellTouchable: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  itemWrapper: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#000',
  },
  itemWrapperSelected: {
    borderColor: '#22c55e',
  },
  iconSquare: {
    width: '100%',
    height: '100%',
  },
  iconPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 12,
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 12, // Kéo dài dot hiện tại để tạo hiệu ứng đẹp mắt hơn
  },
  loader: {
    position: 'absolute',
    right: 20,
  },
});

export default SmartBuilderItemsTab;
