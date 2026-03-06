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
const ROWS_PER_PAGE = 2; 
const ITEMS_PER_PAGE = COLUMNS * ROWS_PER_PAGE;
const GRID_PADDING = 8;
const GAP = 4;

// FIX CHÍNH: Dùng Math.floor để làm tròn xuống, tránh sai số thập phân khiến item thứ 7 bị rớt dòng
const UNIT_SIZE = Math.floor((SCREEN_WIDTH - GRID_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS);

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

  // Số trang slider
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
          <View style={styles.itemWrapper}>
            <View pointerEvents="none" style={styles.innerContainer}>
              <UnitHexagonItem
                unit={unit}
                size={UNIT_SIZE} // Giữ nguyên kích thước to nhất, không trừ hao nữa
                shape="square"
                customStyleStar={{ display: 'none' }}
              />
            </View>

            {/* Chuyển Border vào chung với lớp phủ để không bóp méo hình ảnh */}
            {isSelected && (
              <View style={[styles.selectedOverlay, { borderColor: colors.primary, borderWidth: 2 }]}>
                <Icon name="check" type={IconType.Ionicons} size={16} color="#fff" />
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
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                setCurrentPageIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
              }}
              keyExtractor={(_, index) => `page-${index}`}
              snapToAlignment="center"
              decelerationRate="fast"
            />
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
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: GAP, 
    justifyContent: 'center', // FIX CHÍNH: Căn giữa phần grid để chia đều khoảng trống nếu có số dư pixel
    height: UNIT_SIZE * ROWS_PER_PAGE + GAP * (ROWS_PER_PAGE - 1) 
  },
  itemWrapper: { flex: 1, borderRadius: 6, overflow: 'hidden', position: 'relative' },
  innerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  selectedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderRadius: 6 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  activeDot: { width: 12 },
});

export default SmartBuilderUnitsTab;