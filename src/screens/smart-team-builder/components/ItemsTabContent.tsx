import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as NavigationService from 'react-navigation-helpers';
import { SCREENS } from '@shared-constants';
import { useTftItemsWithPagination } from '@services/api/hooks/listQueryHooks';
import GuideItemItem from '@screens/guide/tabs/components/GuideItemItem';

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- CẤU HÌNH GRID ---
const COLUMNS = 7;
const ROWS_PER_PAGE = 3;
const ITEMS_PER_PAGE = COLUMNS * ROWS_PER_PAGE; // 21 items mỗi trang
const GRID_PADDING = 16;
const GAP = 8;
const ITEM_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

interface ItemsTabContentProps {
  enabled?: boolean;
}

const ItemsTabContent: React.FC<ItemsTabContentProps> = ({ enabled = true }) => {
  const theme = useTheme();
  const { colors } = theme;
  const flatListRef = useRef<FlatList>(null);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // 1. Sử dụng API Pagination (Load 50-60 items mỗi lần để lấp đầy các slide nhanh hơn)
  const {
    data: allItems,
    isLoading,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useTftItemsWithPagination(63, enabled); // 63 = 3 trang slide (21 * 3)

  const itemsList = allItems || [];

  // 2. Chia dữ liệu từ API thành các trang Slide (21 items/page)
  const paginatedItems = useMemo(() => {
    const pages: any[][] = [];
    for (let i = 0; i < itemsList.length; i += ITEMS_PER_PAGE) {
      pages.push(itemsList.slice(i, i + ITEMS_PER_PAGE));
    }
    return pages;
  }, [itemsList]);

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

  const handlePress = useCallback((itemId?: string | number) => {
    NavigationService.push(SCREENS.ITEM_DETAIL, { itemId: String(itemId) });
  }, []);

  const renderGridItem = useCallback(
    (item: any) => {
      return <GuideItemItem
      data={item.data}
      onPress={() => handlePress(item.data.id)}
    />
  }, [handlePress]);

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

  if (isLoading && itemsList.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      {/* Pagination Dots & Loading More Indicator */}
      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {paginatedItems.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === currentPageIndex ? colors.primary : colors.border },
              ]}
            />
          ))}
        </View>
        {isLoadingMore && (
          <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
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
  imageWrapper: {
    borderRadius: 6,
    borderWidth: 1.5,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    marginTop: 12,
    alignItems: 'center',
    height: 20,
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
  loader: {
    position: 'absolute',
    right: 20,
  },
});

export default ItemsTabContent;