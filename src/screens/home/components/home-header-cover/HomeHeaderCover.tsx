import React, {useMemo} from 'react';
import {View, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {translations} from '../../../../shared/localization';
import createStyles from '../../HomeScreen.style';

const HomeHeaderCover: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('@assets/images/home-cover.jpg')}
        style={styles.headerImage}
        resizeMode="cover"
      />
      <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
        <Text style={styles.welcomeText}>{translations.welcomeToChessBuddy}</Text>
      </View>
    </View>
  );
};

HomeHeaderCover.displayName = 'HomeHeaderCover';

export default HomeHeaderCover;

