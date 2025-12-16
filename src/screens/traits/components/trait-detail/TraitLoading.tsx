import React, {useMemo} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useTheme} from '@react-navigation/native';
import createStyles from './TraitLoading.style';

const TraitLoading: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default TraitLoading;

