import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import FastImage from 'react-native-fast-image';
import Icon, { IconType } from '@shared-components/icon/Icon';
import Text from '@shared-components/text-wrapper/TextWrapper';
import { translations } from '../../../shared/localization';
import { getItemIconImageSource } from '../../../utils/item-images';

export interface SelectedItemsSectionProps {
  selectedItemIds: string[];
  localItemsMap: any[];
  onToggleItem: (itemId: string) => void;
}

const SelectedItemsSection: React.FC<SelectedItemsSectionProps> = ({
  selectedItemIds,
  localItemsMap,
  onToggleItem,
}) => {
  const { colors } = useTheme();

  if (selectedItemIds.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8, marginBottom: 6 }]}>
      {translations.selectedItems}
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 6, gap: 6, paddingTop: 4, paddingBottom: 4 }}
      >
        {selectedItemIds.map((itemId) => {
          const item = localItemsMap.find((i: any) => i.id === itemId || i.apiName === itemId);
          const imageSource = getItemIconImageSource(item?.icon, itemId, 48);
          return (
            <RNBounceable
              key={itemId}
              onPress={() => onToggleItem(itemId)}
              style={{ overflow: 'visible' }}
            >
              <View style={styles.itemWrapper}>
                <View style={styles.itemBox}>
                  {imageSource.local ? (
                    <Image source={imageSource.local} style={styles.iconSquare} resizeMode="cover" />
                  ) : imageSource.uri ? (
                    <FastImage source={{ uri: imageSource.uri }} style={styles.iconSquare} resizeMode={FastImage.resizeMode.cover} />
                  ) : (
                    <View style={[styles.iconSquare, styles.iconPlaceholder]} />
                  )}
                </View>
                <View style={[styles.removeBadge, { backgroundColor: colors.danger }]}>
                  <Icon name="close" type={IconType.Ionicons} size={10} color="#fff" />
                </View>
              </View>
            </RNBounceable>
          );
        })}
      </ScrollView>
      <View style={[styles.divider, { backgroundColor: colors.border, marginTop: 8, opacity: 0.1 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold' },
  itemWrapper: { 
    width: 48, 
    height: 48, 
    position: 'relative',
    overflow: 'visible', // Quan trọng: Cho phép badge trồi ra ngoài
  },
  itemBox: {
    width: 48,
    height: 48,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  iconSquare: {
    width: '100%',
    height: '100%',
  },
  iconPlaceholder: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
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
    elevation: 2, // Tạo bóng đổ nhẹ cho đồng bộ với Tướng
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  divider: {opacity: 0.15 },
});

export default SelectedItemsSection;