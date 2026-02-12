import React, {useMemo} from 'react';
import {StyleSheet, View, type TextStyle, type ViewStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';

type TierBadgeProps = {
  tier?: string | null;
  isOp?: boolean;
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const OP_PURPLE = '#a855f7';

const TIER_COLORS: Record<string, string> = {
  OP: '#ff4757',
  S: '#ff7e83',
  A: '#ffbf7f',
  B: '#ffdf80',
  C: '#feff7f',
  D: '#bffe7f',
};

const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  isOp = false,
  size = 40,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  const {colors} = theme;

  const {label, backgroundColor} = useMemo(() => {
    if (isOp) {
      return {label: 'Op', backgroundColor: OP_PURPLE};
    }

    const raw = (tier ?? '').trim();
    if (!raw) return {label: '', backgroundColor: colors.primary};

    const normalized = raw.toUpperCase();
    const bg = TIER_COLORS[normalized] || colors.primary;
    return {label: normalized, backgroundColor: bg};
  }, [tier, isOp, colors.primary]);

  if (!label) return null;

  const borderRadius = Math.round(size * 0.25);
  const fontSize = Math.round(size * 0.4);

  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}>
      <Text
        style={[
          styles.text,
          {
            fontSize,
          },
          textStyle,
        ]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },
});

export default TierBadge;
