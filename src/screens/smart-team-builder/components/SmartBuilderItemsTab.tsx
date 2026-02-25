import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTftItemsWithPagination } from '@services/api/hooks/listQueryHooks';
import GuideItemItem from '@screens/guide/tabs/components/GuideItemItem';
import Icon, { IconType } from '@shared-components/icon/Icon';
import { translations } from '../../../shared/localization';

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- CẤU HÌNH GRID ---
const COLUMNS = 8;
const ROWS_PER_PAGE = 3; // Giảm xuống 2 hàng để vừa với TabView ở màn hình cha
const ITEMS_PER_PAGE = COLUMNS * ROWS_PER_PAGE; // 14 items mỗi trang
const GRID_PADDING = 6;
const GAP = 2;
const ITEM_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

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
  } = useTftItemsWithPagination(42, enabled, { hasComposition: true });

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

  // 4. Render từng Item kèm cơ chế Select (ĐÃ ĐỔI SANG DÙNG apiName)
  const renderGridItem = useCallback(
    (item: any, index: number) => {
      // Lấy apiName trang bị (thay vì id)
      const itemApiName = item?.apiName;
      const isSelected = selectedItemIds.includes(itemApiName);

      return (
        <TouchableOpacity
          key={itemApiName || index}
          onPress={() => itemApiName && onToggleItem(itemApiName)}
          activeOpacity={0.7}
          style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
        >
          <View style={[styles.itemWrapper, isSelected && { borderColor: colors.primary, borderWidth: 2 }]}>
            {/* Vô hiệu hoá click bên trong thẻ con để ưu tiên TouchableOpacity bọc ngoài */}
            <View pointerEvents="none" style={{ flex: 1 }}>
              <GuideItemItem data={item} onPress={() => {}} />
            </View>

            {/* Lớp phủ khi đang được chọn */}
            {isSelected && (
              <View style={styles.selectedOverlay}>
                <Icon name="checkmark" type={IconType.Ionicons} size={16} color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [selectedItemIds, onToggleItem, colors.primary]
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
  itemWrapper: {
    flex: 1,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
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
