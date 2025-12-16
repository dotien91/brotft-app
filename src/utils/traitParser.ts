/**
 * Utility functions for parsing TFT trait descriptions
 */

interface TraitEffect {
  minUnits?: number;
  maxUnits?: number;
  variables?: Record<string, any>;
  variable_matches?: Array<{
    match?: string;
    value?: any;
    [key: string]: any;
  }>;
  variableMatches?: Array<{
    match?: string;
    value?: any;
    [key: string]: any;
  }>;
}

/**
 * Parse trait description template and replace variables with actual values
 */
export const parseTraitDescription = (
  desc: string | null | undefined,
  effects: TraitEffect[] | null | undefined,
): string => {
  if (!desc || !effects || effects.length === 0) return '';

  // 1. Tách Header và Row Templates
  // Regex này tìm nội dung trong thẻ <row> hoặc <expandRow>
  const rowRegex = /<(?:row|expandRow)>(.*?)<\/(?:row|expandRow)>/gs;

  // Lấy danh sách các mẫu câu trong thẻ row
  const rowTemplates: string[] = [];
  let match;
  // Reset regex lastIndex để đảm bảo match từ đầu
  rowRegex.lastIndex = 0;
  while ((match = rowRegex.exec(desc)) !== null) {
    rowTemplates.push(match[1]);
  }

  // Lấy Header bằng cách xóa hết các thẻ row khỏi chuỗi gốc
  let headerTemplate = desc.replace(rowRegex, '').trim();

  const result: string[] = [];

  // 2. Xử lý Header (Dùng effect đầu tiên để điền số liệu mặc định)
  if (headerTemplate) {
    const headerText = processTemplate(headerTemplate, effects[0]);
    if (headerText) {
      result.push(cleanText(headerText));
      result.push(''); // Dòng trống ngăn cách
    }
  }

  // 3. Xử lý từng Tier (Effect)
  effects.forEach(effect => {
    // Dùng Set thay vì Array để tự động loại bỏ trùng lặp
    const uniqueLines = new Set<string>();

    rowTemplates.forEach(template => {
      // Thử điền dữ liệu của effect hiện tại vào template
      const resolvedText = processTemplate(template, effect);

      // Nếu hợp lệ (không chứa biến null) thì thêm vào Set
      if (resolvedText !== null) {
        // Clean text ngay lập tức để so sánh chuỗi sạch
        uniqueLines.add(cleanText(resolvedText));
      }
    });

    // Chuyển Set về Array để xử lý tiếp
    const tierLines = Array.from(uniqueLines);

    // Nếu Tier này có dòng nào hiển thị được thì thêm vào kết quả
    if (tierLines.length > 0) {
      // Join các dòng lại
      result.push(tierLines.join('\n'));
    }
  });

  return result.join('\n');
};

/**
 * Điền giá trị biến vào template.
 * Trả về null nếu template chứa biến có giá trị null (không kích hoạt ở mốc này).
 */
const processTemplate = (
  template: string,
  effect: TraitEffect,
): string | null => {
  // Regex tìm @Variable@ hoặc @Variable*100@
  const varRegex = /@([a-zA-Z0-9_]+)(\*100)?@/g;

  let isValid = true;

  const processed = template.replace(varRegex, (match, varName, multiplier) => {
    // Xử lý biến đặc biệt MinUnits
    if (varName === 'MinUnits') {
      return String(effect.minUnits || 0);
    }

    // Tìm biến trong variable_matches hoặc variableMatches (cả hai format đều được hỗ trợ)
    const variableMatches = effect.variable_matches || effect.variableMatches;
    const matchData = variableMatches
      ? variableMatches.find(v => v.match === varName)
      : null;

    // Nếu không tìm thấy trong matches, thử tìm trong variables thô (fallback)
    let value = matchData
      ? matchData.value
      : effect.variables?.[varName];

    // Nếu giá trị là null -> Dòng này không dành cho effect hiện tại
    if (value === null || value === undefined) {
      isValid = false;
      return 'NULL';
    }

    // Xử lý phép nhân *100 (cho phần trăm)
    if (multiplier) {
      value = Number(value) * 100;
      // Sửa logic làm tròn một chút để tránh lỗi 30.00000004
      value = Math.round(value * 100) / 100;
    }

    return String(value);
  });

  return isValid ? processed : null;
};

/**
 * Làm sạch các thẻ HTML và Icon rác
 */
const cleanText = (text: string): string => {
  return text
    .replace(/<br\s*\/?>/gi, '\n') // Thay thẻ br thành xuống dòng
    .replace(/<[^>]+>/g, '') // Xóa các thẻ XML/HTML còn lại
    .replace(/&nbsp;/g, ' ') // Xóa &nbsp; bị lỗi
    .replace(/%i:[^%]+%/g, '') // Xóa icon dạng %i:scaleHealth%
    .replace(/\s+/g, ' ') // Xóa khoảng trắng thừa
    .trim();
};

