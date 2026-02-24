import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import { useTftAugmentsWithPagination } from '@services/api/hooks/listQueryHooks';
import type { ITftAugmentsSort } from '@services/models/tft-augment';
import GuideAugmentItem from '@screens/guide/tabs/components/GuideAugmentItem';
import EmptyList from '@shared-components/empty-list/EmptyList';
import Icon, { IconType } from '@shared-components/icon/Icon';
import { translations } from '../../../shared/localization';

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- CẤU HÌNH GRID ĐỂ GIỐNG Y HỆT PAGE ITEMS ---
const COLUMNS = 7; 
const ROWS_PER_PAGE = 2; 
const ITEMS_PER_PAGE = COLUMNS * ROWS_PER_PAGE; // 14 augments mỗi trang
const GRID_PADDING = 16;
const GAP = 8;
const ITEM_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;
const ITEM_HEIGHT = ITEM_WIDTH; // Set bằng ITEM_WIDTH để tạo thành hình vuông

export interface SmartBuilderAugmentsTabProps {
  enabled?: boolean;
  selectedAugmentIds?: string[]; // Thêm dấu ? để an toàn
  onToggleAugment: (augmentId: string) => void;
}

const SmartBuilderAugmentsTab: React.FC<SmartBuilderAugmentsTabProps> = ({
  enabled = true,
  selectedAugmentIds = [], // KHẮC PHỤC LỖI UNDEFINED Ở ĐÂY
  onToggleAugment,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const flatListRef = useRef<FlatList>(null);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Default Sort
  const sort = useMemo<ITftAugmentsSort[]>(() => [
    { orderBy: 'name', order: 'asc' },
  ], []);

  // 1. Fetch dữ liệu (Load 42 items = 3 trang hiển thị mượt giống Items)
  const {
    data: augments,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
    totalCount,
  } = useTftAugmentsWithPagination(ITEMS_PER_PAGE * 3, undefined, sort, enabled);

  const augmentsList = augments || [];

  // 2. Chia dữ liệu thành các trang Slide
  const paginatedAugments = useMemo(() => {
    const pages: any[][] = [];
    for (let i = 0; i < augmentsList.length; i += ITEMS_PER_PAGE) {
      pages.push(augmentsList.slice(i, i + ITEMS_PER_PAGE));
    }
    return pages;
  }, [augmentsList]);

  // Số trang slider theo total_count từ API
  const totalPages = useMemo(() => {
    if (totalCount != null && totalCount > 0) {
      return Math.ceil(totalCount / ITEMS_PER_PAGE);
    }
    return Math.max(1, paginatedAugments.length);
  }, [totalCount, paginatedAugments.length]);

  // 3. Xử lý vuốt trang & Load thêm
  const handleMomentumScrollEnd = useCallback((e: any) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SCREEN_WIDTH);
    setCurrentPageIndex(index);

    if (index >= paginatedAugments.length - 1 && hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [paginatedAugments.length, hasMore, isLoadingMore, loadMore]);

  // 4. Render từng Augment Item
  const renderGridItem = useCallback(
    (item: any, index: number) => {
      const itemApiName = item?.apiName;
      // An toàn: Đảm bảo selectedAugmentIds luôn là mảng
      const isSelected = (selectedAugmentIds || []).includes(itemApiName);

      return (
        <TouchableOpacity
          key={itemApiName || index}
          onPress={() => itemApiName && onToggleAugment(itemApiName)}
          activeOpacity={0.7}
          style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT }}
        >
          <View style={[styles.itemWrapper, isSelected && { borderColor: colors.primary, borderWidth: 2 }]}>
            {/* THÊM innerItemContainer ĐỂ CĂN GIỮA VÀ isCompact={true} ĐỂ DÙNG UI NHỎ */}
            <View pointerEvents="none" style={styles.innerItemContainer}>
              <GuideAugmentItem data={item} onPress={() => {}} isCompact={true} />
            </View>

            {isSelected && (
              <View style={styles.selectedOverlay}>
                <Icon name="checkmark" type={IconType.Ionicons} size={16} color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [selectedAugmentIds, onToggleAugment, colors.primary]
  );

  // Render nguyên một page (nhóm các items theo cấu hình Grid)
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

  // --- XỬ LÝ TRẠNG THÁI ---
  if (isLoading && augmentsList.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError && augmentsList.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.notification }}>{translations.errorLoadingAugments}</Text>
        <Text style={[styles.errorSubtext, { color: colors.placeholder }]}>
          {error?.message || translations.somethingWentWrong}
        </Text>
      </View>
    );
  }

  if (isNoData) {
    return (
      <View style={styles.center}>
        <EmptyList message={translations.noAugmentsFound} />
      </View>
    );
  }

  // --- RENDER GIAO DIỆN CHÍNH ---
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={paginatedAugments}
        renderItem={renderPage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        keyExtractor={(_, index) => `augment-slide-${index}`}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        removeClippedSubviews={true}
        windowSize={3}
      />

      {/* Pagination Dots & Loading More - số trang theo total_count từ API */}
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
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
  },
  pageContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: GRID_PADDING,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    height: ITEM_HEIGHT * ROWS_PER_PAGE + GAP * (ROWS_PER_PAGE - 1),
  },
  itemWrapper: {
    flex: 1,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.1)', // Thêm background nhẹ để dễ thấy viền khung
  },
  innerItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    width: 12,
  },
  loader: {
    position: 'absolute',
    right: 20,
  },
});

export default SmartBuilderAugmentsTab;