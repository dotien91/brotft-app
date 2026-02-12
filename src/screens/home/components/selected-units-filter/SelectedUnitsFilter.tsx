import React, {useMemo, useCallback, useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon, {IconType} from '@shared-components/icon/Icon';
// Bỏ import Text vì không dùng nữa
import {getCachedUnits} from '@services/api/data';
import useStore from '@services/zustand/store';
import type {ITftUnit} from '@services/models/tft-unit';

// Import component Hexagon chung
import UnitHexagonItem from '../unit-hexagon-item/UnitHexagonItem';

interface SelectedUnitsFilterProps {
  selectedUnits: string[];
  onRemoveUnit: (unitKey: string) => void;
  onClearAll: () => void;
}

// Định nghĩa kích thước chung cho đồng bộ
const ITEM_SIZE = 48;

const SelectedUnitsFilter: React.FC<SelectedUnitsFilterProps> = React.memo(({
  selectedUnits,
  onRemoveUnit,
  onClearAll,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);
  const [allUnits, setAllUnits] = useState<ITftUnit[]>([]);

  const normalizeToChampionKey = useCallback((apiName: string): string => {
    if (!apiName) return '';
    let normalized = apiName.replace(/^TFT\d*_?/i, '');
    normalized = normalized.toLowerCase();
    return normalized;
  }, []);

  useEffect(() => {
    if (!language) {
      setAllUnits([]);
      return;
    }
    try {
      const unitsData = getCachedUnits(language);
      if (!unitsData) return;
      const unitsArray = Object.values(unitsData);
      const formattedUnits: ITftUnit[] = unitsArray.map((unit: any) => ({
        id: unit.id || unit.apiName || '',
        apiName: unit.apiName || '',
        name: unit.name || '',
        cost: unit.cost ?? null,
        image: unit.image || null,
      }));
      setAllUnits(formattedUnits);
    } catch (error) {
      console.warn('Error loading units:', error);
      setAllUnits([]);
    }
  }, [language]);

  if (selectedUnits.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Nút Clear All: Hình vuông, kích thước bằng Unit */}
        <RNBounceable
          onPress={onClearAll}
          style={[styles.clearFilterButton, { width: ITEM_SIZE+4, height: ITEM_SIZE+4 }]}
        >
          <Icon
            name="trash" // Hoặc "eraser", "broom"
            type={IconType.Phosphor} 
            color={colors.primary} // Hoặc màu đỏ (notification) nếu muốn nổi bật
            size={24} // Kích thước icon bên trong
            weight="regular"
          />
        </RNBounceable>

        {/* Danh sách Unit đã chọn */}
        {selectedUnits.map((unitKey, index) => {
          const foundUnit = allUnits.find(u => {
            const championKey = normalizeToChampionKey(u.apiName || '');
            return championKey === unitKey || u.apiName === unitKey;
          });

          const unitForDisplay = {
            apiName: foundUnit?.apiName || unitKey,
            cost: foundUnit?.cost,
            name: foundUnit?.name,
            image: foundUnit?.image,
            items: [],
            need3Star: false,
            carry: false,
          };

          return (
            <RNBounceable
              key={`${unitKey}-${index}`}
              onPress={() => onRemoveUnit(unitKey)}
              style={styles.unitChip}
            >
              <View style={styles.unitWrapper}>
                <UnitHexagonItem
                  shape="square"
                  unit={unitForDisplay}
                  size={ITEM_SIZE} // Dùng kích thước chung
                  itemsPosition="bottom"
                  customStyleStar={{ display: 'none' }} 
                  unlockPosition='topLeft'
                  // Tùy chỉnh bo góc cho giống nút Clear bên cạnh
                  // customStyleItem={{ borderRadius: 12 }} 
                />
                
                <View style={styles.removeIconOverlay}>
                  <View style={styles.removeIconBg}>
                    <Icon
                      name="x"
                      color="#fff"
                      size={10}
                      weight="bold"
                    />
                  </View>
                </View>
              </View>
            </RNBounceable>
          );
        })}
      </ScrollView>
    </View>
  );
});

SelectedUnitsFilter.displayName = 'SelectedUnitsFilter';

const createStyles = (theme: any) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      marginTop: 6,
    },
    scrollContent: {
      alignItems: 'center',
      gap: 6, 
    },
    // Style nút Clear All
    clearFilterButton: {
      // Width/Height được set inline theo ITEM_SIZE
      borderRadius: 12, // Bo góc tương đương với UnitHexagonItem dạng square
      backgroundColor: 'rgba(255, 255, 255, 0.08)', // Nền tối nhẹ
      borderWidth: 1,
      borderColor: colors.border, // Màu viền
      borderStyle: 'dashed', // (Option) Viền nét đứt để phân biệt với Unit
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 4,
    },
    unitChip: {},
    unitWrapper: {
      position: 'relative',
    },
    removeIconOverlay: {
      position: 'absolute',
      top: -5,
      right: -5,
      zIndex: 10,
    },
    removeIconBg: {
      backgroundColor: colors.notification || '#ef4444',
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.background, 
    },
  });
};

export default SelectedUnitsFilter;