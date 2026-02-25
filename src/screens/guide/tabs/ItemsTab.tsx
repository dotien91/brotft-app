import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import { SCREENS } from '@shared-constants';
import EmptyList from '@shared-components/empty-list/EmptyList';
import { translations } from '../../../shared/localization';
import BannerAdItem from '../../home/components/banner-ad-item/BannerAdItem';
import { getCachedItems } from '@services/api/data';
import { getItemIconImageSource } from '../../../utils/item-images';
import FastImage from 'react-native-fast-image';

// GIẢ ĐỊNH: Import hàm getCachedItems của bạn từ đúng đường dẫn
// import { getCachedItems } from '@services/cache/itemCache'; 

const BASE_ITEM_IDS = [
  'TFT_Item_BFSword',
  'TFT_Item_RecurveBow',
  'TFT_Item_NeedlesslyLargeRod',
  'TFT_Item_TearOfTheGoddess',
  'TFT_Item_ChainVest',
  'TFT_Item_NegatronCloak',
  'TFT_Item_GiantsBelt',
  'TFT_Item_SparringGloves',
  'TFT_Item_Spatula',
  'TFT_Item_FryingPan',
];

// --- TÍNH TOÁN KÍCH THƯỚC MA TRẬN GRID ---
const screenWidth = Dimensions.get('window').width;
const PADDING_HORIZONTAL = 12;
const GRID_LINE_WIDTH = 1; // Độ dày đường kẻ lưới

// Width khả dụng cho ma trận (Trừ padding 2 bên)
const AVAILABLE_WIDTH = screenWidth - (PADDING_HORIZONTAL * 2);
// Kích thước từng ô: Trừ đi 10 đường kẻ lưới ở giữa và 2 viền ngoài cùng
const CELL_SIZE = (AVAILABLE_WIDTH - (GRID_LINE_WIDTH * 10) - 2) / 11;
// Kích thước icon bên ngoài ma trận (To hơn ô một chút cho đẹp)
const ICON_SIZE = CELL_SIZE * 1.1;

interface ItemsTabProps {
  enabled?: boolean;
}

const ItemsTab: React.FC<ItemsTabProps> = ({ enabled = true }) => {
  const theme = useTheme();
  const { colors } = theme;

  const [rawItemsData, setRawItemsData] = useState<Record<string, any>>(() => getCachedItems());

  // Retry mỗi giây nếu chưa có items
  useEffect(() => {
    const tryLoad = () => {
      const data = getCachedItems();
      if (Object.keys(data).length > 0) {
        setRawItemsData(data);
        return true;
      }
      return false;
    };
    if (tryLoad()) return;
    const id = setInterval(() => {
      if (tryLoad()) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const itemsList = Object.values(rawItemsData);
  
  // XỬ LÝ PHÂN LOẠI DỮ LIỆU
  const {
    baseItems,
    craftLookup,
    radiantItems,
    artifactItems,
    emblemItems,
  } = useMemo(() => {
    const baseList = BASE_ITEM_IDS.map(id => rawItemsData?.[id]);
    const lookup: Record<string, any> = {};
    const radiants: any[] = [];
    const artifacts: any[] = [];
    const emblems: any[] = [];

    itemsList.forEach((item: any) => {
      if (!item || item.disabled) return;
      const apiName = item.apiName || '';

      // 1. Lọc Đồ Ghép (Có đúng 2 mảnh composition)
      if (item.composition && item.composition.length === 2) {
        const id1 = item.composition[0];
        const id2 = item.composition[1];
        lookup[`${id1}_${id2}`] = item;
        lookup[`${id2}_${id1}`] = item; // Chiều ngược lại
      }

      // 2. Lọc Đồ Ánh Sáng
      if (apiName.includes('Radiant') || item.en_name?.includes('Radiant')) {
        radiants.push(item);
      }
      // 3. Lọc Đồ Ornn / Artifact
      else if (apiName.includes('Artifact') || apiName.includes('Ornn') || item.tags?.includes('Artifact')) {
        artifacts.push(item);
      }
      // 4. Lọc Ấn Tộc Hệ (Các đồ có chứa Emblem)
      else if (apiName.includes('Emblem')) {
        emblems.push(item);
      }
    });

    return { 
      baseItems: baseList, 
      craftLookup: lookup, 
      radiantItems: radiants, 
      artifactItems: artifacts,
      emblemItems: emblems
    };
  }, [rawItemsData, itemsList.length]);

  // Ưu tiên ảnh local, không có mới dùng URL
  const getImageSource = useCallback((rawItem: any) => {
    const src = getItemIconImageSource(null, rawItem?.apiName, 48);
    if (src.local) return { local: src.local, uri: '' };
    if (!rawItem?.icon) return { local: null, uri: '' };
    const lowerPath = String(rawItem.icon).toLowerCase().replace('.tex', '.png');
    return { local: null, uri: `https://raw.communitydragon.org/latest/game/${lowerPath}` };
  }, []);

  // XỬ LÝ CLICK ĐỂ ĐIỀU HƯỚNG
  const handleItemPress = useCallback((item: any) => {
    if (item && (item.id || item.apiName)) {
      NavigationService.push(SCREENS.ITEM_DETAIL, { 
        itemId: String(item.id || item.apiName) 
      });
    }
  }, []);

  // COMPONENT RENDER ICON
  // Thêm prop isMatrix để scale nhỏ icon lại khi nằm trong bảng
  const RenderIcon = useCallback(({ item, isMatrix = false }: { item: any, isMatrix?: boolean }) => {
    if (!item) {
      return <View style={[styles.iconWrapper, isMatrix && styles.matrixIconWrapper, styles.emptyIcon]} />;
    }
    const { local, uri } = getImageSource(item);
    const source = local ? local : (uri ? { uri } : undefined);

    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        // onPress={() => handleItemPress(item)}
        style={[styles.iconWrapper, isMatrix && styles.matrixIconWrapper]}
      >
        {source ? (
          <FastImage source={source} style={styles.icon} resizeMode='cover' />
        ) : (
          <View style={[styles.icon, styles.emptyIcon]} />
        )}
      </TouchableOpacity>
    );
  }, [getImageSource, handleItemPress]);

  // TRẠNG THÁI TRỐNG
  if (!itemsList || itemsList.length === 0) {
    return <EmptyList message={translations.noItemsFound} />;
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* QUẢNG CÁO */}
      <View style={styles.adContainer}>
        <BannerAdItem />
      </View>

      {/* --- MẢNH GHÉP CƠ BẢN --- */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {translations.itemsBaseComponents}
        </Text>
        <View style={styles.wrapContainer}>
          {baseItems.map(item => (
            <RenderIcon key={item?.apiName || Math.random().toString()} item={item} />
          ))}
        </View>
      </View>

      {/* --- MA TRẬN GHÉP ĐỒ --- */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {translations.itemsCraftMatrix}
        </Text>
        
        {/* Bảng ma trận: Dùng gap để lộ màu nền tạo thành đường kẻ lưới */}
        <View style={[
          styles.matrixTable, 
          { 
            backgroundColor: theme.dark ? '#4b5563' : '#d1d5db',
            borderColor: theme.dark ? '#4b5563' : '#d1d5db',
          } 
        ]}>
          
          {/* HÀNG HEADER (Trục X) */}
          <View style={styles.matrixRow}>
            {/* Ô góc cùng bên trái */}
            <View style={[styles.cell, { backgroundColor: theme.dark ? '#374151' : '#f3f4f6' }]}>
              <Text style={{ fontSize: 9, color: colors.placeholder, textAlign: 'center' }}>{translations.itemsMix}</Text>
            </View>
            {BASE_ITEM_IDS.map(xId => (
              <View key={`header_x_${xId}`} style={[styles.cell, { backgroundColor: theme.dark ? '#374151' : '#f3f4f6' }]}>
                <RenderIcon item={rawItemsData[xId]} isMatrix />
              </View>
            ))}
          </View>

          {/* CÁC HÀNG THÂN BẢNG */}
          {BASE_ITEM_IDS.map(yId => (
            <View key={`row_${yId}`} style={styles.matrixRow}>
              {/* Cột Header (Trục Y) */}
              <View style={[styles.cell, { backgroundColor: theme.dark ? '#374151' : '#f3f4f6' }]}>
                <RenderIcon item={rawItemsData[yId]} isMatrix />
              </View>
              
              {/* Các ô kết quả ghép */}
              {BASE_ITEM_IDS.map(xId => {
                const craftedItem = craftLookup[`${yId}_${xId}`];
                return (
                  <View key={`craft_${yId}_${xId}`} style={[styles.cell, { backgroundColor: theme.dark ? '#1f2937' : '#ffffff' }]}>
                    <RenderIcon item={craftedItem} isMatrix />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* --- TRANG BỊ ĐẶC THÙ --- */}
      {/* Tạo Tác Ornn */}
      {artifactItems.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{translations.itemsOrnnArtifact}</Text>
          <View style={styles.wrapContainer}>
            {artifactItems.map(item => (
              <View key={item.apiName} style={styles.artifactBorder}>
                <RenderIcon item={item} />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Trang Bị Ánh Sáng */}
      {radiantItems.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{translations.itemsRadiant}</Text>
          <View style={styles.wrapContainer}>
            {radiantItems.map(item => (
              <View key={item.apiName} style={styles.radiantBorder}>
                <RenderIcon item={item} />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Các loại Ấn (Emblems) */}
      {emblemItems.length > 0 && (
        <View style={[styles.section, { borderBottomWidth: 0, paddingBottom: 40 }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{translations.itemsEmblem}</Text>
          <View style={styles.wrapContainer}>
            {emblemItems.map(item => (
              <RenderIcon key={item.apiName} item={item} />
            ))}
          </View>
        </View>
      )}

    </ScrollView>
  );
};

// --- STYLES CỤC BỘ ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adContainer: {
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: 12,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.05)', 
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, 
  },
  
  // --- STYLES MA TRẬN GRID ---
  matrixTable: {
    borderRadius: 6,
    borderWidth: 1,
    gap: GRID_LINE_WIDTH, // Đường kẻ ngang
    overflow: 'hidden',
  },
  matrixRow: {
    flexDirection: 'row',
    gap: GRID_LINE_WIDTH, // Đường kẻ dọc
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // --- STYLES ICON ---
  iconWrapper: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 4,
    backgroundColor: '#000000', 
    overflow: 'hidden',
  },
  // Thu nhỏ icon lại 85% so với ô cell để tạo viền thở (padding)
  matrixIconWrapper: {
    width: CELL_SIZE * 0.85,
    height: CELL_SIZE * 0.85,
  },
  icon: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyIcon: {
    backgroundColor: 'transparent',
  },
  
  // Viền đặc trưng cho nhóm
  artifactBorder: {
    borderWidth: 1,
    borderColor: '#ef4444', // Viền đỏ Ornn
    borderRadius: 5,
  },
  radiantBorder: {
    borderWidth: 1,
    borderColor: '#fbbf24', // Viền vàng Radiant
    borderRadius: 5,
  },
});

export default ItemsTab;