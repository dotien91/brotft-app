import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import AbilityDescription from '../ability-description/AbilityDescription';
import { ITftUnit } from '@services/models/tft-unit';

// ==========================================
// 1. CONSTANTS & MAPPINGS
// ==========================================

const STAT_INDEX_MAP: Record<number, string> = {
  0: 'hp', 1: 'mana', 2: 'attackSpeed', 3: 'armor', 4: 'magicResist',
  5: 'initialMana', 6: 'damage', 7: 'abilityPower', 11: 'crit', 12: 'hp',
  31: 'hp' // Một số case đặc biệt Blitzcrank dùng index lạ, map về HP hoặc stat phù hợp
};

const ICON_MAP: Record<string, string> = {
  // Basic Stats
  'scaleAD': 'AD', 'AD': 'AD', 'damage': 'AD', 'physicalDamage': 'AD', 'ad': 'AD',
  'scaleAP': 'AP', 'AP': 'AP', 'abilityPower': 'AP', 'magicDamage': 'AP', 'ap': 'AP',
  'scaleHealth': 'HP', 'health': 'HP', 'HP': 'HP', 'maxHealth': 'HP', 'hp': 'HP',
  'scaleArmor': 'AR', 'armor': 'AR', 'Armor': 'AR', 'AR': 'AR', 'ar': 'AR',
  'scaleMR': 'MR', 'magicResist': 'MR', 'MR': 'MR', 'mr': 'MR',
  'scaleAS': 'AS', 'attackSpeed': 'AS', 'AS': 'AS', 'as': 'AS',
  'scaleMana': 'MANA', 'mana': 'MANA',
  'scaleRange': 'HEX', // Icon tầm đánh

  // Special Stats (Set 9.5 / Set 10 Mechanics)
  'scaleSouls': 'SOULS', // Senna, Thresh
  'scaleAdaptiveForce': 'ADAPTIVE', // Ryze
  'scaleGold': 'GOLD',
  'scaleLevel': 'STAR', 
  'TFTBaseAD': 'AD', // Jhin case
};

// ==========================================
// 2. MATH HELPERS (XỬ LÝ MẢNG 3 SAO)
// ==========================================

/** Chuyển đổi input thành mảng 3 phần tử để tính toán đồng bộ */
const toArray = (val: number | number[]): number[] => {
  if (Array.isArray(val)) {
    // Nếu mảng rỗng hoặc thiếu, fill cho đủ 3
    if (val.length === 0) return [0, 0, 0];
    if (val.length === 1) return [val[0], val[0], val[0]];
    return val; // Giả sử đã đủ 3
  }
  return [val, val, val];
};

const addValues = (a: number | number[], b: number | number[]): number[] => {
  const arrA = toArray(a);
  const arrB = toArray(b);
  return arrA.map((v, i) => v + (arrB[i] || 0));
};

const multiplyValues = (a: number | number[], b: number | number[]): number[] => {
  const arrA = toArray(a);
  const arrB = toArray(b);
  return arrA.map((v, i) => v * (arrB[i] || 0));
};

const powerValues = (base: number | number[], exponent: number | number[]): number[] => {
  const arrBase = toArray(base);
  const arrExp = toArray(exponent);
  return arrBase.map((v, i) => Math.pow(v, arrExp[i] || 1));
};

// ==========================================
// 3. LOGIC ENGINE
// ==========================================

const getUnitStatArray = (unit: ITftUnit, mStat?: number): number[] => {
  // Mặc định AP (7) là 100
  if ((mStat === 7 || mStat === undefined) && (!unit.stats || unit.stats['abilityPower'] === undefined)) {
    return [100, 100, 100];
  }
  
  if (mStat === undefined || !unit.stats) return [0, 0, 0];

  const statKey = STAT_INDEX_MAP[mStat];
  // @ts-ignore
  let baseVal = Number(unit.stats[statKey]) || 0;

  // Xử lý đặc biệt cho Tốc đánh (Rumble dùng mStat 4 cho AS ở một số patch cũ, hoặc mStat 2)
  if (mStat === 2 || (statKey === 'attackSpeed')) {
     // Tốc đánh trong stats thường là 0.x, nhưng trong công thức scale thường dùng % (vd 50% = 50) hoặc giữ nguyên tùy context.
     // Tuy nhiên, hàm getUnitStatArray chủ yếu dùng cho scaleAD/HP.
     // Với AS, ta cứ trả về base.
     return [baseVal, baseVal, baseVal];
  }

  // Logic Scaling theo cấp sao (HP, AD)
  if (statKey === 'hp') {
    return [Math.floor(baseVal), Math.floor(baseVal * 1.8), Math.floor(baseVal * 3.24)];
  }
  if (statKey === 'damage') { // AD
    return [Math.floor(baseVal), Math.floor(baseVal * 1.5), Math.floor(baseVal * 2.25)];
  }

  return [baseVal, baseVal, baseVal];
};

/**
 * Hàm chính xử lý tính toán đệ quy
 */
const resolveVariable = (key: string, unit: ITftUnit, visited: Set<string> = new Set()): number | number[] => {
  if (!key || visited.has(key)) return 0;
  
  // Bỏ qua các key dạng hash nội bộ {abcdef} nếu không map được
  if (key.startsWith('{') && key.endsWith('}')) {
     // Thử tìm trong variables xem có key này không (đôi khi data JSON dump ra có)
     // Nếu không, return 0 để an toàn
  }

  visited.add(key);

  const calcs = unit.ability?.calculations || {};
  const vars = unit.ability?.variables || [];

  // 1. Tìm trong Calculations
  if (calcs[key]) {
    const rules = Array.isArray(calcs[key]) ? calcs[key] : [calcs[key]];
    let total: number[] = [0, 0, 0];
    
    // Với SumOfSubParts, các phần tử trong mảng gốc thường là cộng dồn
    // Tuy nhiên nếu type khác, thường chỉ có 1 phần tử.
    // Logic an toàn: Duyệt hết và cộng lại (nếu là object đơn thì loop 1 lần)
    rules.forEach((rule: any) => {
      // Nếu rule là "SumOfSubPartsCalculationPart" -> process nó sẽ trả về tổng
      // Nếu rule là "SubPartScaled..." -> process trả về giá trị scale
      // Ta cộng dồn tất cả lại
      const val = processCalculationPart(rule, unit, visited);
      total = addValues(total, val);
    });
    return total;
  }

  // 2. Tìm trong Variables
  // Clean key: Bỏ 'Modified', bỏ prefix Property
  const cleanKey = key.replace(/^Modified/, '').replace(/^TFTUnitProperty\.:/, '');
  
  // @ts-ignore
  if (Array.isArray(vars)) {
    const v = vars.find((i: any) => i.name === key || i.name === cleanKey);
    if (v) return v.value;
  } else if (vars[key] || vars[cleanKey]) {
      return vars[key] || vars[cleanKey];
  }

  return 0;
};

const processCalculationPart = (part: any, unit: ITftUnit, visited: Set<string>): number | number[] => {
  if (!part) return 0;

  // --- CÁC PHÉP TOÁN CƠ BẢN ---

  // 1. Cộng (Sum)
  if (part.type === 'SumOfSubPartsCalculationPart' && part.parts) {
    let sum: number[] = [0, 0, 0];
    part.parts.forEach((p: any) => sum = addValues(sum, processCalculationPart(p, unit, visited)));
    return sum;
  }

  // 2. Nhân (Product) - Dùng cho Rumble, Viego, Ryze
  if (part.type === 'ProductOfSubPartsCalculationPart') {
    const val1 = processCalculationPart(part.part1, unit, visited);
    const val2 = processCalculationPart(part.part2, unit, visited);
    return multiplyValues(val1, val2);
  }
  
  // 3. Lũy thừa (Exponent) - Dùng cho Rumble (1/x = x^-1)
  if (part.type === 'ExponentSubPartsCalculationPart') {
     const base = processCalculationPart(part.part1, unit, visited);
     const exponent = processCalculationPart(part.part2, unit, visited);
     return powerValues(base, exponent);
  }

  // --- CÁC LOẠI LẤY GIÁ TRỊ ---

  // 4. Scaling cơ bản (Base * Ratio * Stat)
  if (part.type === 'SubPartScaledProportionalToStat') {
    const base = part.part ? processCalculationPart(part.part, unit, visited) : 0;
    const statIdx = part.mStat !== undefined ? part.mStat : 7; // Default AP
    const statArr = getUnitStatArray(unit, statIdx);
    const ratio = part.mRatio !== undefined ? part.mRatio : 1;
    return multiplyValues(base, multiplyValues(statArr, ratio));
  }

  // 5. Stat * Part (ChoGath Damage)
  if (part.type === 'StatBySubPartCalculationPart') {
     const partVal = part.part ? processCalculationPart(part.part, unit, visited) : 0;
     const statArr = getUnitStatArray(unit, part.mStat);
     return multiplyValues(partVal, statArr);
  }
  
  // 6. Stat * Biến (Braum Damage)
  if (part.type === 'StatByNamedDataValueCalculationPart') {
     const varVal = resolveVariable(part.name, unit, visited);
     const statArr = getUnitStatArray(unit, part.mStat || 7);
     return multiplyValues(varVal, statArr);
  }

  // 7. Stat * Hệ số cứng (Rumble AS)
  if (part.type === 'StatByCoefficientCalculationPart') {
    const statArr = getUnitStatArray(unit, part.mStat);
    const coeff = part.mCoefficient || 1;
    return multiplyValues(statArr, coeff);
  }

  // 8. Tham chiếu biến (Named)
  if (part.type === 'NamedDataValueCalculationPart' || part.__type === 'NamedDataValueCalculationPart') {
      // Check if mDataValue exists (Hash key format) or name
      const key = part.name || part.mDataValue;
      return resolveVariable(key, unit, visited);
  }

  // 9. Số cứng (Number)
  if (part.type === 'NumberCalculationPart' || part.__type === 'NumberCalculationPart') {
      return part.mNumber !== undefined ? part.mNumber : 0;
  }
  
  // 10. Stat Efficiency (Braum DR) - (Stat * Factor) / 100 ?
  // Thường là: Stat * (Factor / 100) để ra %, nhưng context Riot có thể khác.
  // Giả sử: Trả về (Stat * Factor) / 100
  if (part.type === 'StatEfficiencyPerHundred') {
      const statArr = getUnitStatArray(unit, part.mStat || 7); // Mặc định AP nếu thiếu
      const factor = part.mBonusStatForEfficiency || 100;
      // Nếu factor là 100 (thường thấy), thì return Stat. 
      // Nếu displayAsPercent = true, nó sẽ được format sau.
      // Logic đúng thường là: Val = Stat * (Factor / 100) -> VD: 100 AP * (100/100) = 1.
      return multiplyValues(statArr, factor / 100); 
  }
  
  // 11. Buff Counter (Ryze, Viego - Adaptive Force)
  if (part.type === 'BuffCounterByCoefficientCalculationPart') {
      // Đây là logic ingame đếm số stack buff. Static data không biết được.
      // Trả về 0 hoặc 1 giá trị mặc định (ví dụ 0 để không bị lỗi hiển thị quá lớn)
      return 0; 
  }

  return 0;
};

// ==========================================
// 4. FORMATTING & PARSING
// ==========================================

const formatValue = (val: number | number[], multiplier: number = 1): string => {
  const process = (n: number) => {
    const res = n * multiplier;
    // Làm tròn: Nếu số quá lớn (>100) làm tròn đơn vị, nhỏ thì lấy 2 số thập phân
    if (Math.abs(res) > 100) return Math.round(res);
    return Math.round(res * 100) / 100;
  };

  if (Array.isArray(val)) {
    const arr = val.map(process);
    // Nếu 3 cấp sao giống nhau -> Hiện 1 số
    if (arr.every(v => v === arr[0])) return String(arr[0]);
    return arr.join('/');
  }
  return String(process(val));
};

const parseTemplateString = (text: string, unit: ITftUnit): string => {
  let parsed = text
    .replace(/&nbsp;/g, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '');

  // 1. Parse Variables: @VarName@ hoặc @VarName*100@
  parsed = parsed.replace(/@([\w\.:{}]+)(?:[\*]([\d\.]+))?@/g, (_, key, multi) => {
    const val = resolveVariable(key, unit);
    return formatValue(val, multi ? parseFloat(multi) : 1);
  });

  // 2. Parse Icons: %i:IconName%
  parsed = parsed.replace(/%i:([\w]+)%/g, (match, key) => {
    // Check Map chính xác
    if (ICON_MAP[key]) return `%i:${ICON_MAP[key]}%`;
    
    // Check Case-Insensitive
    const lowerKey = key.toLowerCase();
    const mapKey = Object.keys(ICON_MAP).find(k => k.toLowerCase() === lowerKey);
    if (mapKey) return `%i:${ICON_MAP[mapKey]}%`;

    // Fallback thủ công
    if (lowerKey.includes('health') || lowerKey.includes('hp')) return '%i:HP%';
    if (lowerKey.includes('damage') || lowerKey.includes('ad')) return '%i:AD%';
    if (lowerKey.includes('ability') || lowerKey.includes('ap')) return '%i:AP%';

    // TRẢ VỀ GỐC nếu không biết (để hệ thống hiển thị tự lo hoặc hiện text gốc)
    return match; 
  });

  return parsed;
};

// ==========================================
// 5. COMPONENT
// ==========================================

interface TooltipElementsProps {
  tooltipElements: any[];
  unit: ITftUnit;
  styles?: {
    abilityVariables?: any;
    variableItem?: any;
    variableValue?: any;
  };
}

const TooltipElements: React.FC<TooltipElementsProps> = ({ 
  tooltipElements, 
  unit, 
  styles: customStyles 
}) => {
  
  const elementsToRender = useMemo(() => {
    if (!tooltipElements || !Array.isArray(tooltipElements)) return [];

    return tooltipElements.map(el => {
      // 1. Template String
      if (el.name && String(el.name).includes('@')) {
        return parseTemplateString(el.name, unit);
      }

      // 2. Fallback (Dạng cũ hoặc không có biến)
      if (el.name && !String(el.name).includes('@')) {
        let val: number | number[] = 0;

        // Ưu tiên 1: Tìm theo nameOverride (Key trong calculations)
        if (el.nameOverride) {
          val = resolveVariable(el.nameOverride, unit);
        }
        
        // Ưu tiên 2: Tìm theo Type (Key trong variables)
        const isZero = (v: any) => v === 0 || (Array.isArray(v) && v.every((x: number) => x === 0));
        if (isZero(val) && el.type) {
           val = resolveVariable(el.type, unit);
        }

        // Nếu tìm thấy giá trị -> Ghép chuỗi "Tên: Giá trị"
        if (!isZero(val)) {
          const multiplier = el.multiplier || 1;
          const suffix = multiplier === 100 ? '%' : '';
          return `${el.name}: ${formatValue(val, multiplier)}${suffix}`;
        }
      }

      // 3. Text tĩnh
      return el.name;
    });
  }, [tooltipElements, unit]);

  if (!elementsToRender || elementsToRender.length === 0) return null;

  return (
    <View style={[defaultStyles.abilityVariables, customStyles?.abilityVariables]}>
      {elementsToRender.map((text, idx) => (
        <View key={idx} style={[defaultStyles.variableItem, customStyles?.variableItem]}>
          <AbilityDescription 
            description={text} 
            textStyle={customStyles?.variableValue || defaultStyles.variableValue}
          />
        </View>
      ))}
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  abilityVariables: {
    marginTop: 8,
    gap: 4,
  },
  variableItem: {
    marginBottom: 2,
  },
  variableValue: {
    fontSize: 14,
    color: '#E0E0E0', 
    lineHeight: 20,
  },
});

export default TooltipElements;