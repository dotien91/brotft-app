import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  teamCard: ViewStyle;
  teamHeader: ViewStyle;
  rankBadge: ViewStyle;
  rankText: TextStyle;
  teamNameContainer: ViewStyle;
  teamName: TextStyle;
  planAndDifficultyRow: ViewStyle;
  planBadge: ViewStyle;
  planText: TextStyle;
  difficultyBadge: ViewStyle;
  difficultyText: TextStyle;
  championsRow: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    teamCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 12, // Tăng padding một chút cho thoáng
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    teamHeader: {
      flexDirection: 'row',
      alignItems: 'center', // Canh giữa theo chiều dọc
      marginBottom: 12,
      justifyContent: 'space-between',
    },
    // --- Rank Badge (Left) ---
    rankBadge: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12, // Tạo khoảng cách với tên team
    },
    rankText: {
      fontSize: 16,
      fontWeight: '800',
      color: '#000', // Rank color background sáng nên text màu đen
    },
    // --- Name Container (Middle) ---
    teamNameContainer: {
      flex: 1, // Chiếm hết khoảng trống ở giữa
      justifyContent: 'center',
    },
    teamName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    // --- Info Badges ---
    planAndDifficultyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    planBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 4,
    },
    planText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#fff',
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
    },
    difficultyText: {
      fontSize: 10,
      fontWeight: '600',
    },
    championsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 4,
    },
  });
};