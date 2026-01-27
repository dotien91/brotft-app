import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, { IconType } from '../../../../shared/components/icon/Icon';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {translations} from '../../../../shared/localization';
import createStyles from './TraitError.style';

interface TraitErrorProps {
  error?: Error | null;
  onRetry?: () => void;
}

const TraitError: React.FC<TraitErrorProps> = ({error, onRetry}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Icon
        name="alert-circle"
        type={IconType.Ionicons}
        color={colors.danger}
        size={48}
      />
      <Text style={styles.errorText}>
        {translations.errorLoadingTrait}
      </Text>
      <Text style={styles.errorDescription}>
        {error?.message || translations.somethingWentWrong}
      </Text>
      {onRetry && (
        <RNBounceable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>
            {translations.retry}
          </Text>
        </RNBounceable>
      )}
    </View>
  );
};

export default TraitError;

