import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';

export const TAB_IDS = ['Units', 'Items', 'Augments'] as const;
export type TabId = (typeof TAB_IDS)[number];

interface TabFilterProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TabFilter: React.FC<TabFilterProps> = ({ activeTab, onTabChange }) => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      {TAB_IDS.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => onTabChange(tab)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.tabText,
                isActive ? [styles.tabTextActive, { color: colors.text }] : { color: colors.placeholder },
              ]}>
              {tab}
            </Text>
            {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingTop: 12,
    borderBottomWidth: 1,
  },
  tabItem: {
    paddingBottom: 10,
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 20,
    height: 3,
    borderRadius: 2,
  },
});

export default TabFilter;
