import React, { useState, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Icon, { IconType } from '@shared-components/icon/Icon';
import UnitHexagonItem from '../../home/components/unit-hexagon-item/UnitHexagonItem';
import CostFilter from './CostFilter';
import type { CostFilterValue } from './CostFilter';

// IMPORT LẠI HOOK FETCH VÀO ĐÂY
import { useTftUnitsWithPagination } from '@services/api/hooks/listQueryHooks';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMNS = 7;
const ROWS_PER_PAGE = 2; // Đổi từ 3 xuống 2 hàng cho mỗi page (slider)
const ITEMS_PER_PAGE = COLUMNS * ROWS_PER_PAGE;
const GRID_PADDING = 16;
const GAP = 4;
const UNIT_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

export interface SmartBuilderUnitsTabProps {
  selectedUnitApiNames: string[];
  onToggleUnit: (apiName: string) => void;
}

const SmartBuilderUnitsTab: React.FC<SmartBuilderUnitsTabProps> = ({
  selectedUnitApiNames,
  onToggleUnit,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  const [selectedCost, setSelectedCost] = useState<CostFilterValue>('all');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // TAB UNIT TỰ FETCH DATA CỦA NÓ
  const { data: fetchedUnits, isLoading: isUnitsLoading, totalCount } = useTftUnitsWithPagination(200, undefined, true);

  const allUnits = useMemo(() => {
    if (!fetchedUnits || !Array.isArray(fetchedUnits)) return [];
    return [...fetchedUnits].sort((a: any, b: any) => a.cost - b.cost);
  }, [fetchedUnits]);

  const filteredUnits = useMemo(() => {
    // Khi đổi filter cost, tự động reset slider về trang đầu tiên
    setCurrentPageIndex(0);
    if (selectedCost === 'all') return allUnits;
    return allUnits.filter((u) => u.cost === selectedCost);
  }, [allUnits, selectedCost]);

  const paginatedUnits = useMemo(() => {
    const pages: any[][] = [];
    for (let i = 0; i < filteredUnits.length; i += ITEMS_PER_PAGE) {
      pages.push(filteredUnits.slice(i, i + ITEMS_PER_PAGE));
    }
    return pages;
  }, [filteredUnits]);

  // Số trang slider: dùng total_count từ API khi không filter; khi filter cost thì theo số trang đã load
  const totalPages = useMemo(() => {
    if (selectedCost === 'all' && totalCount != null && totalCount > 0) {
      return Math.ceil(totalCount / ITEMS_PER_PAGE);
    }
    return Math.max(1, paginatedUnits.length);
  }, [selectedCost, totalCount, paginatedUnits.length]);

  const renderUnitItem = useCallback(
    (unit: any) => {
      const isSelected = selectedUnitApiNames.includes(unit.apiName);
      return (
        <TouchableOpacity
          key={unit.apiName}
          onPress={() => onToggleUnit(unit.apiName)}
          activeOpacity={0.7}
          style={{ width: UNIT_SIZE, height: UNIT_SIZE }}>
          <View style={[styles.avatarWrapper, isSelected && { borderColor: colors.primary, borderWidth: 2 }]}>
            <UnitHexagonItem
              unit={unit}
              size={UNIT_SIZE - 4}
              shape="square"
              style={{ pointerEvents: 'none' }}
              customStyleStar={{ display: 'none' }}
            />
            {isSelected && (
              <View style={styles.selectedOverlay}>
                <Icon name="checkmark" type={IconType.Ionicons} size={16} color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [selectedUnitApiNames, colors.primary, onToggleUnit],
  );

  const renderPage = useCallback(
    ({ item: pageUnits }: { item: any[] }) => (
      <View style={styles.pageContainer}>
        <View style={styles.gridContainer}>
          {pageUnits.map(renderUnitItem)}
        </View>
      </View>
    ),
    [renderUnitItem],
  );

  return (
    <View style={styles.container}>
      <CostFilter selectedCost={selectedCost} onCostChange={setSelectedCost} />
      <View>
        {isUnitsLoading ? (
          <View style={[styles.loadingContainer, { height: UNIT_SIZE * ROWS_PER_PAGE + GAP * (ROWS_PER_PAGE - 1) }]}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <FlatList
              data={paginatedUnits}
              renderItem={renderPage}
              horizontal
              pagingEnabled // Thuộc tính này biến FlatList thành Slider chuẩn
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                setCurrentPageIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
              }}
              keyExtractor={(_, index) => `page-${index}`}
              // Thêm vài props tối ưu slider
              snapToAlignment="center"
              decelerationRate="fast"
            />
            {/* Dots Indicator - số trang theo total_count từ API */}
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
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 8 },
  loadingContainer: { width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center' },
  pageContainer: { width: SCREEN_WIDTH, paddingHorizontal: GRID_PADDING },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, height: UNIT_SIZE * ROWS_PER_PAGE + GAP * (ROWS_PER_PAGE - 1) },
  avatarWrapper: { borderRadius: 6, overflow: 'hidden', position: 'relative' },
  selectedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  activeDot: { width: 12 }, // Hiệu ứng cho dot đang active kéo dài ra một chút cho đẹp
});

export default SmartBuilderUnitsTab;
