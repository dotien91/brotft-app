/**
 * Phân tích và thay thế các biến placeholder trong chuỗi mô tả (desc)
 * bằng các giá trị từ effects và variable_matches.
 *
 * Hỗ trợ 2 loại placeholder:
 * 1. Biến đơn: @Variable@ (ví dụ: @MaxRange@)
 * 2. Biến nhân (Multiplier): @Variable*100@ (ví dụ: @ReducedHealth*100@)
 *
 * @param desc - Chuỗi mô tả có chứa các biến placeholder.
 * @param effects - Đối tượng chứa các giá trị biến đơn.
 * @param variableMatches - Mảng chứa các đối tượng khớp biến, bao gồm hash, match, và value.
 * @returns Chuỗi mô tả đã được thay thế.
 */
export interface IVariableMatch {
  match?: string;
  type?: string;
  multiplier?: string | number | null;
  full_match?: string;
  hash?: string;
  value?: string | number;
  [key: string]: any;
}

export const parseAugmentDescription = (
  desc?: string | null,
  effects?: Record<string, any>,
  variableMatches?: IVariableMatch[],
): string => {
  if (!desc) return '';

  // ---------------------------------------------------------
  // BƯỚC 1: TẠO KHO DỮ LIỆU (LOOKUP MAP)
  // Gom tất cả giá trị từ 'effects' và 'variable_matches' vào một Map duy nhất.
  // Key sẽ được lưu dưới dạng chữ thường (lowercase) để dễ tìm kiếm.
  // ---------------------------------------------------------
  const valuesMap = new Map<string, any>();

  // 1.1. Nạp dữ liệu thô từ 'effects' trước
  // Ví dụ: effects: { "Health": 500, "{a1b2c3d4}": 20 }
  if (effects && typeof effects === 'object') {
    for (const [key, val] of Object.entries(effects)) {
      if (val !== null && val !== undefined) {
        valuesMap.set(key.toLowerCase(), val);
      }
    }
  }

  // 1.2. Nạp và liên kết dữ liệu từ 'variable_matches'
  // Đây là bước quan trọng để xử lý các biến có value = null nhưng có hash.
  if (variableMatches && Array.isArray(variableMatches)) {
    variableMatches.forEach(vm => {
      if (!vm.match) return;

      const varName = vm.match.toLowerCase();
      let finalValue = vm.value;

      // LOGIC "CỨU CÁNH": Nếu value bị null, dùng hash để tìm ngược lại trong effects
      if ((finalValue === null || finalValue === undefined) && vm.hash) {
        const hashKey = vm.hash.toLowerCase();
        if (valuesMap.has(hashKey)) {
          finalValue = valuesMap.get(hashKey);
        }
      }

      // Lưu vào Map nếu tìm được giá trị hợp lệ
      if (finalValue !== null && finalValue !== undefined) {
        valuesMap.set(varName, finalValue);
      }
    });
  }

  // ---------------------------------------------------------
  // BƯỚC 2: LÀM SẠCH CHUỖI MÔ TẢ (DESCRIPTION CLEANING)
  // ---------------------------------------------------------
  let parsedDesc = desc;

  // Thay thế thẻ <br> bằng xuống dòng
  parsedDesc = parsedDesc.replace(/<br\s*\/?>/gi, '\n');

  // Xóa sạch các thẻ XML/HTML rác (ví dụ: <rules>, <tftitemrules>, <li>...)
  parsedDesc = parsedDesc.replace(/<[^>]+>/g, '');

  // Xóa các icon scaling thừa thãi (ví dụ: %i:scaleAD%, %i:scaleHP%)
  parsedDesc = parsedDesc.replace(/%i:[a-zA-Z0-9]+%/g, '');

  // ---------------------------------------------------------
  // BƯỚC 3: PARSE BIẾN BẰNG REGEX (CORE LOGIC)
  // Regex này bắt tất cả nội dung nằm giữa 2 dấu @ (@...@)
  // ---------------------------------------------------------
  const variablePattern = /@(.+?)@/g;

  parsedDesc = parsedDesc.replace(variablePattern, (originalString, content) => {
    // 'content' là phần nằm giữa 2 dấu @. Ví dụ: "Health", "Damage*100", "TFTUnitProperty..."

    const lowerContent = content.toLowerCase();

    // A. XỬ LÝ BIẾN HỆ THỐNG (DYNAMIC)
    // Những biến này chỉ có giá trị khi đang chơi game, không có trong JSON tĩnh.
    // Ví dụ: @TFTUnitProperty.item:TFT_Augment_CallToChaos@
    if (lowerContent.includes('tftunitproperty') || content.includes(':')) {
      return 'X';
    }

    // B. XỬ LÝ PHÉP TOÁN (MATH PARSING)
    // Tách tên biến và hệ số nhân. Ví dụ: "Damage*100" -> name="damage", multiplier=100
    let varName = content;
    let multiplier = 1;

    if (content.includes('*')) {
      const parts = content.split('*');
      varName = parts[0]; // Lấy phần tên trước dấu *
      const parsedMult = parseFloat(parts[1]); // Lấy phần số sau dấu *
      if (!isNaN(parsedMult)) {
        multiplier = parsedMult;
      }
    }

    // C. TÌM KIẾM VÀ TÍNH TOÁN
    const lookupKey = varName.toLowerCase();

    if (valuesMap.has(lookupKey)) {
      let value = valuesMap.get(lookupKey);

      // Nhân hệ số (nếu có)
      value = value * multiplier;

      // Làm tròn số thực để tránh lỗi hiển thị (ví dụ: 0.30000001 -> 0.3)
      // parseFloat + toFixed(2) sẽ giữ tối đa 2 số lẻ và cắt bỏ số 0 thừa.
      // Ví dụ: 10.00 -> 10; 10.50 -> 10.5; 10.123 -> 10.12
      return String(parseFloat(value.toFixed(2)));
    }

    // D. TRƯỜNG HỢP KHÔNG TÌM THẤY DỮ LIỆU
    // Trả về X thay vì để nguyên tên biến để người dùng biết là biến này giá trị động
    return 'X';
  });

  return parsedDesc;
};

