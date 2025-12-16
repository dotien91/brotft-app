import React, {useMemo} from 'react';
import {View, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getTraitIconUrl} from '../../../../utils/metatft';
import createStyles from './TraitHeader.style';

interface TraitHeaderProps {
  trait: {
    name?: string;
    enName?: string | null;
    apiName?: string;
    icon?: string | null;
  };
  localizedName?: string | null;
  localizedIcon?: string | null;
}

const TraitHeader: React.FC<TraitHeaderProps> = ({
  trait,
  localizedName,
  localizedIcon,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderApiNameBadge = () => {
    if (!trait?.apiName) return null;
    return (
      <View style={[styles.badge, styles.badgeSecondary]}>
        <Icon
          name="code"
          type={IconType.Ionicons}
          color={colors.text}
          size={16}
        />
        <Text style={styles.badgeTextSecondary}>{trait.apiName}</Text>
      </View>
    );
  };

  return (
    <>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={[styles.typeIndicator, {backgroundColor: colors.primary + '15'}]}>
          {localizedIcon || trait.icon || trait.apiName ? (
            <Image
              source={{
                uri: (localizedIcon || trait.icon)?.startsWith('http')
                  ? (localizedIcon || trait.icon) || ''
                  : getTraitIconUrl(trait.apiName || trait.name, 64),
              }}
              style={styles.traitIcon}
              resizeMode="contain"
            />
          ) : (
            <Icon
              name="shield"
              type={IconType.Ionicons}
              color={colors.primary}
              size={32}
            />
          )}
        </View>
      </View>

      {/* Name and Badges */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>
          {localizedName || trait.name}
        </Text>
        {trait.enName && trait.enName !== (localizedName || trait.name) && (
          <Text style={styles.enName}>
            {trait.enName}
          </Text>
        )}
        <View style={styles.badgesRow}>
          {renderApiNameBadge()}
        </View>
      </View>
    </>
  );
};

export default TraitHeader;

