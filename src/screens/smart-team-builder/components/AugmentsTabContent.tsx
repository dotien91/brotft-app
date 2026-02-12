import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';

const AugmentsTabContent: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.placeholder, { color: colors.placeholder }]}>Augments — coming soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  placeholder: {
    fontSize: 15,
  },
});

export default AugmentsTabContent;
