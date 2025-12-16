import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {translations} from '../../../../shared/localization';
import {parseTraitDescription} from '../../../../utils/traitParser';
import createStyles from './TraitDescription.style';

interface TraitDescriptionProps {
  description?: string | null;
  effects?: any[] | null;
}

const TraitDescription: React.FC<TraitDescriptionProps> = ({
  description,
  effects,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!description) return null;

  // Parse description if effects are available
  const parsedDescription = effects
    ? parseTraitDescription(description, effects)
    : description;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {translations.description}
      </Text>
      <Text style={styles.description}>
        {parsedDescription}
      </Text>
    </View>
  );
};

export default TraitDescription;

