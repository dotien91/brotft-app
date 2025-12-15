import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './ScreenHeader.style';

interface ScreenHeaderProps {
  title: string;
  style?: ViewStyle;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({title, style}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = createStyles(theme);

  return (
    <View style={[styles.header, style]}>
      <Text h2 bold color={colors.text} style={styles.headerTitle}>
        {title}
      </Text>
    </View>
  );
};

export default ScreenHeader;

