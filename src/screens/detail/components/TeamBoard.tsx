import React, { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import UnitHexagonItem from '../../home/components/unit-hexagon-item/UnitHexagonItem';
import Hexagon from './Hexagon';

interface TeamBoardProps {
  units: any[];
  boardSize: { rows: number; cols: number };
  colors: any;
  styles: any;
}

const TeamBoard: React.FC<TeamBoardProps> = ({ units, boardSize, colors, styles }) => {
  const { width: windowWidth } = useWindowDimensions();

  // 1. Tính toán Metrics đồng bộ với Hexagon.tsx
  const gridMetrics = useMemo(() => {
    const horizontalPadding = 32;
    const availableWidth = windowWidth - horizontalPadding;
    const size = Math.max(Math.min(availableWidth / 7.5, 70), 45);

    const hexHeight = size * 1.1; // Khớp với tỷ lệ 1.1 ở Hexagon.tsx

    return {
      hexSize: size,
      // ĐÚNG: Offset hàng lẻ là 1/2 chiều rộng
      rowOffset: size, 
      // ĐÚNG: Margin âm để hàng dưới lồng vào hàng trên (khoảng 20-22% chiều cao)
      rowNegativeMargin: -hexHeight * 0.22, 
    };
  }, [windowWidth]);

  const { hexSize, rowOffset, rowNegativeMargin } = gridMetrics;

  const boardRows = useMemo(() => {
    const rows = boardSize.rows || 4;
    const cols = boardSize.cols || 7;
    return Array.from({ length: rows }).map((_, rowIndex) =>
      Array.from({ length: cols }).map((_, colIndex) => {
        const apiRow = rowIndex + 1;
        const apiCol = colIndex + 1;
        return units.find(u => u.position.row === apiRow && u.position.col === apiCol) || null;
      })
    );
  }, [units, boardSize]);

  return (
    <View style={styles.boardWrapper}>
      <View style={styles.board}>
        {boardRows.map((row, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            style={[
              styles.boardRow,
              {
                // Sửa: Dịch chuyển nửa ô để tạo kẽ hở cho hàng trên
                paddingLeft: rowIndex % 2 !== 0 ? rowOffset : 0,
                // Sửa: Dùng margin âm đã tính toán để các ô khít dọc
                marginBottom: rowNegativeMargin,
                // Quan trọng: Hàng trên đè hàng dưới để Items/Badge không bị che
                zIndex: 10 - rowIndex, 
              }
            ]}>
            {row.map((unit, colIndex) => (
              <View
                key={`cell-${rowIndex}-${colIndex}`}
                style={[styles.hexCellContainer, { width: hexSize }]}>
                {unit ? (
                  <UnitHexagonItem unit={unit} size={hexSize} />
                ) : (
                  <Hexagon
                    size={hexSize}
                    borderWidth={4}
                    borderColor={colors.borderColor}
                  />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default React.memo(TeamBoard);