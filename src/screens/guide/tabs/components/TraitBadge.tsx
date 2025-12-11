import React from 'react';
import {View, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getTraitIconUrl} from '../../../../utils/metatft';
import {SCREENS} from '@shared-constants';
import createStyles from './GuideUnitItem.style';

interface TraitBadgeProps {
  trait: string | {
    name: string;
    apiName?: string;
    id?: string;
  };
  index: number;
}

const TraitBadge: React.FC<TraitBadgeProps> = ({trait, index}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const handleTraitPress = () => {
    const traitObj = typeof trait === 'string' ? null : trait;
    if (traitObj?.id) {
      NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId: traitObj.id});
    }
  };

  const traitName = typeof trait === 'string' ? trait : trait.name;
  const traitApiName = typeof trait === 'string' ? trait : trait.apiName;
  const traitIconUrl = getTraitIconUrl(traitApiName || traitName);

  const traitObj = typeof trait === 'string' ? null : trait;
  const hasId = traitObj?.id !== undefined;

  return (
    <RNBounceable
      key={traitName || index}
      style={styles.traitItem}
      onPress={handleTraitPress}
      disabled={!hasId}>
      {traitIconUrl ? (
        <Image
          source={{uri: traitIconUrl}}
          style={styles.traitIcon}
          resizeMode="contain"
        />
      ) : null}
      <Text style={styles.traitText} numberOfLines={1}>
        {traitName}
      </Text>
    </RNBounceable>
  );
};

export default TraitBadge;

