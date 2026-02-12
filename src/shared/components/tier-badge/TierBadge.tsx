import React, { useMemo } from 'react';
import { StyleSheet, View, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';

type TierBadgeProps = {
  tier?: string | null;
  isOp?: boolean;
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

// --- CẤU HÌNH MÀU SẮC (CYBERPUNK PURPLE) ---
const OP_BG = '#18181b';      // Nền đen sâu (Zinc 900) - Tôn màu neon cực tốt
const OP_ACCENT = '#d946ef';  // Tím Neon rực rỡ (Fuchsia 500)

const TIER_COLORS: Record<string, string> = {
  OP: OP_BG, // Placeholder, logic xử lý bên dưới
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
  const { colors } = theme;

  const { label, backgroundColor } = useMemo(() => {
    if (isOp) return { label: 'OP', backgroundColor: OP_BG };

    const raw = (tier ?? '').trim();
    if (!raw) return { label: '', backgroundColor: colors.primary };

    const normalized = raw.toUpperCase();
    if (normalized === 'OP') return { label: 'OP', backgroundColor: OP_BG };

    const bg = TIER_COLORS[normalized] || colors.primary;
    return { label: normalized, backgroundColor: bg };
  }, [tier, isOp, colors.primary]);

  if (!label) return null;

  const isOP = label === 'OP';
  
  const borderRadius = Math.round(size * 0.25);
  // Tier OP font nhỏ hơn xíu để vừa vặn trong khung
  const fontSize = isOP ? Math.round(size * 0.35) : Math.round(size * 0.4);

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
        // Áp dụng viền Neon Tím nếu là OP
        isOP && styles.opNeonBorder,
        style,
      ]}>
      <Text
        allowFontScaling={false}
        style={[
          styles.text,
          {
            fontSize,
            // Nếu là OP: Chữ màu Tím Neon
            // Tier thường: Chữ đen
            color: isOP ? OP_ACCENT : '#1A1A1A', 
            fontWeight: isOP ? '900' : '800',
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  // Style "Cyberpunk Purple"
  opNeonBorder: {
    borderWidth: 1.5,          // Viền mảnh, sắc nét
    borderColor: OP_ACCENT,    // Viền màu tím neon
    
    // Hiệu ứng phát sáng (Neon Glow)
    shadowColor: OP_ACCENT,    // Bóng cũng màu tím
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,        // Độ sáng của bóng
    shadowRadius: 6,           // Độ lan tỏa của bóng
    elevation: 6,              // Android Elevation
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

export default React.memo(TierBadge);