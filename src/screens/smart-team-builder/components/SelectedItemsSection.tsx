import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon, { IconType } from '@shared-components/icon/Icon';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GuideItemItem from '@screens/guide/tabs/components/GuideItemItem';
import { translations } from '../../../shared/localization';

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
        {selectedItemIds.map((itemId) => (
          <RNBounceable 
            key={itemId} 
            onPress={() => onToggleItem(itemId)}
            style={{ overflow: 'visible' }}
          >
            {/* Wrapper ngoài để visible cho badge thò ra */}
            <View style={styles.itemWrapper}>
              {/* Box trong để hidden bo góc hình item */}
              <View style={styles.itemBox}>
                <View pointerEvents="none" style={{ flex: 1 }}>
                  <GuideItemItem
                    data={localItemsMap.find((i: any) => i.id === itemId || i.apiName === itemId) || { id: itemId }}
                    onPress={() => {}}
                  />
                </View>
              </View>
              
              {/* Badge nằm ngoài itemBox nên không bị hidden cắt mất */}
              <View style={[styles.removeBadge, { backgroundColor: colors.danger }]}>
                <Icon name="close" type={IconType.Ionicons} size={10} color="#fff" />
              </View>
            </View>
          </RNBounceable>
        ))}
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
    flex: 1, 
    borderRadius: 6, 
    overflow: 'hidden', // Quan trọng: Cắt phần thừa của hình item để bo góc
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
  divider: { height: 8, opacity: 0.15 },
});

export default SelectedItemsSection;