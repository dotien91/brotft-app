import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {translations} from '../../../../shared/localization';
import createStyles from './TraitDescription.style';

interface TraitDescriptionProps {
  description?: string | null;
}

const TraitDescription: React.FC<TraitDescriptionProps> = ({description}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!description) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {translations.description}
      </Text>
      <Text style={styles.description}>
        {description}
      </Text>
    </View>
  );
};

export default TraitDescription;

