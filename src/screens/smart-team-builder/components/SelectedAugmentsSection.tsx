import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon, { IconType } from '@shared-components/icon/Icon';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GuideAugmentItem from '@screens/guide/tabs/components/GuideAugmentItem';
import { translations } from '../../../shared/localization';

export interface SelectedAugmentsSectionProps {
  selectedAugmentApiNames: string[];
  localAugmentsMap: any[];
  onToggleAugment: (apiName: string) => void;
}

const SelectedAugmentsSection: React.FC<SelectedAugmentsSectionProps> = ({
  selectedAugmentApiNames,
  localAugmentsMap,
  onToggleAugment,
}) => {
  const { colors } = useTheme();

  if (selectedAugmentApiNames.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8, marginBottom: 6 }]}>
        {translations.selectedAugments}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8, gap: 12, paddingTop: 4, paddingBottom: 4 }}
      >
        {selectedAugmentApiNames.map((apiName) => (
          <RNBounceable
            key={apiName}
            onPress={() => onToggleAugment(apiName)}
            style={{ overflow: 'visible' }}
          >
            <View style={styles.itemWrapper}>
              <View style={styles.itemBox}>
                <View pointerEvents="none" style={styles.innerItem}>
                  <GuideAugmentItem
                    data={localAugmentsMap.find((a: any) => a.apiName === apiName) || { apiName }}
                    onPress={() => {}}
                    isCompact={true}
                  />
                </View>
              </View>
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
  sectionContainer: { paddingBottom: 4 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold' },
  itemWrapper: {
    width: 48,
    height: 48,
    position: 'relative',
    overflow: 'visible',
  },
  itemBox: {
    flex: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  innerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  divider: { height: 8, opacity: 0.15 },
});

export default SelectedAugmentsSection;
