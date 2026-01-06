import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import BackButton from '@shared-components/back-button/BackButton';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './ScreenHeaderWithBack.style';

interface ScreenHeaderWithBackProps {
  title: string;
}

const ScreenHeaderWithBack: React.FC<ScreenHeaderWithBackProps> = ({title}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      <BackButton />
      <Text h3 bold style={styles.headerTitle}>
        {title}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );
};

export default ScreenHeaderWithBack;
