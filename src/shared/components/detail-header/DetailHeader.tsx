import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import BackButton from '@shared-components/back-button/BackButton';
import createStyles from './DetailHeader.style';

interface DetailHeaderProps {
  children?: React.ReactNode;
}

const DetailHeader: React.FC<DetailHeaderProps> = ({children}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <BackButton />
      {children}
    </View>
  );
};

export default DetailHeader;

