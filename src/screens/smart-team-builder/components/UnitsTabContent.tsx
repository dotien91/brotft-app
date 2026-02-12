import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon, { IconType } from '@shared-components/icon/Icon';
import Text from '@shared-components/text-wrapper/TextWrapper';
import UnitHexagonItem from '../../home/components/unit-hexagon-item/UnitHexagonItem';
import TeamCard from '../../home/components/team-card/TeamCard';
import useStore from '@services/zustand/store';
import { getCachedUnits } from '@services/api/data';
import CostFilter from './CostFilter';
import type { CostFilterValue } from './CostFilter';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMNS = 7;
const ROWS_PER_PAGE = 3;
const ITEMS_PER_PAGE = COLUMNS * ROWS_PER_PAGE;
const GRID_PADDING = 16;
const GAP = 4;
const UNIT_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

export interface UnitsTabContentProps {
  selectedUnitApiNames: string[];
  onToggleUnit: (apiName: string) => void;
  matchedTeams: any[];
  isSearching: boolean;
  isFetching: boolean;
}

const UnitsTabContent: React.FC<UnitsTabContentProps> = ({
  selectedUnitApiNames,
  onToggleUnit,
  matchedTeams,
  isSearching,
  isFetching,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const language = useStore((state) => state.language);

  const [allUnits, setAllUnits] = useState<any[]>([]);
  const [selectedCost, setSelectedCost] = useState<CostFilterValue>('all');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const cached = getCachedUnits();
    if (cached) {
      const unitsArray = Object.values(cached).sort((a: any, b: any) => a.cost - b.cost);
      setAllUnits(unitsArray);
    }
  }, [language]);

  const filteredUnits = useMemo(() => {
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
    <>
      <CostFilter selectedCost={selectedCost} onCostChange={setSelectedCost} />

      <View>
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
        />
        <View style={styles.dotsContainer}>
          {paginatedUnits.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === currentPageIndex ? colors.primary : colors.border }]} />
          ))}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {selectedUnitApiNames.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 16, marginBottom: 12 }]}>My Heroes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
            {selectedUnitApiNames.map((apiName) => (
              <RNBounceable key={apiName} onPress={() => onToggleUnit(apiName)}>
                <View>
                  <UnitHexagonItem
                    unit={allUnits.find((u) => u.apiName === apiName) || { apiName }}
                    size={48}
                    shape="square"
                  />
                  <View style={[styles.removeBadge, { backgroundColor: colors.notification }]}>
                    <Icon name="close" type={IconType.Ionicons} size={10} color="#fff" />
                  </View>
                </View>
              </RNBounceable>
            ))}
          </ScrollView>
          <View style={[styles.divider, { backgroundColor: colors.border, marginTop: 16 }]} />
        </View>
      )}

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended Teams</Text>
          {(isSearching || isFetching) && <ActivityIndicator size="small" color={colors.primary} />}
        </View>
        <View style={styles.teamsListContainer}>
          {matchedTeams.length === 0 ? (
            <Text style={styles.emptyText}>
              {selectedUnitApiNames.length > 0 ? 'No teams found' : 'Select units above'}
            </Text>
          ) : (
            matchedTeams.map((comp: any, idx: number) => <TeamCard key={comp.id || idx} composition={comp} />)
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  pageContainer: { width: SCREEN_WIDTH, paddingHorizontal: GRID_PADDING },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    height: UNIT_SIZE * ROWS_PER_PAGE + GAP * (ROWS_PER_PAGE - 1),
  },
  avatarWrapper: { borderRadius: 6, overflow: 'hidden', position: 'relative' },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  divider: { height: 8, marginVertical: 12, opacity: 0.15 },
  sectionContainer: { paddingBottom: 8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12, gap: 10 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold' },
  removeBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  teamsListContainer: { paddingHorizontal: 16, gap: 12 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#9ca3af' },
});

export default UnitsTabContent;
