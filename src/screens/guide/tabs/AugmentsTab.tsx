import React, {useMemo} from 'react';
import {View, ScrollView} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './TabContent.style';

const AugmentsTab: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.centerContainer}>
        <Text h3 color={colors.text} style={styles.comingSoonTitle}>
          Thức tỉnh Guide
        </Text>
        <Text color={colors.placeholder} style={styles.centerText}>
          Coming soon...
        </Text>
      </View>
    </ScrollView>
  );
};

export default AugmentsTab;

