import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon, { IconType } from '@shared-components/icon/Icon';
import Text from '@shared-components/text-wrapper/TextWrapper';
import UnitHexagonItem from '@screens/home/components/unit-hexagon-item/UnitHexagonItem';
import { translations } from '../../../shared/localization';

export interface SelectedHeroesSectionProps {
  selectedUnitApiNames: string[];
  localUnitsMap: any[];
  onToggleUnit: (apiName: string) => void;
}

const SelectedHeroesSection: React.FC<SelectedHeroesSectionProps> = ({
  selectedUnitApiNames,
  localUnitsMap,
  onToggleUnit,
}) => {
  const { colors } = useTheme();

  if (selectedUnitApiNames.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8, marginBottom: 6 }]}>
        {translations.selectHeroes}
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 8, gap: 8, paddingTop: 4, paddingBottom: 4 }}
      >
        {selectedUnitApiNames.map((apiName) => (
          <RNBounceable 
            key={apiName} 
            onPress={() => onToggleUnit(apiName)}
            style={{ overflow: 'visible' }} // Đảm bảo RNBounceable không cắt element con
          >
            <View style={{ overflow: 'visible' }}>
              <UnitHexagonItem
                unit={localUnitsMap.find((u: any) => u.apiName === apiName) || { apiName }}
                size={48}
                shape="square"
              />
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
    elevation: 2, // Thêm elevation/shadow nhẹ để badge nổi bật hơn (tùy chọn)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  divider: { opacity: 0.15 },
});

export default SelectedHeroesSection;