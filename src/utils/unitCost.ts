/**
 * Get unit border color based on cost
 * @param cost - Unit cost (1-6)
 * @param fallbackColor - Fallback color when cost is invalid or undefined
 * @returns Color hex string
 */
export const getUnitCostBorderColor = (
  cost: number | undefined | null,
  fallbackColor: string = '#94a3b8',
): string => {
  if (!cost || cost === null || cost === undefined) {
    return fallbackColor;
  }

  switch (cost) {
    case 1:
      return '#c0c0c0'; // Xám/Trắng
    case 2:
      return '#4ade80'; // Xanh lá
    case 3:
      return '#60a5fa'; // Xanh dương
    case 4:
      return '#a78bfa'; // Tím
    case 5:
      return '#ffd700'; // Vàng (Huyền thoại)
    case 6:
      return '#ff6b35'; // Đỏ/Cam
    default:
      return fallbackColor;
  }
};

