import {ITftUnit} from '@services/models/tft-unit';
import {parseTextWithVariables} from './parseTextWithVariables';

/**
 * Parse tooltip element text with variables and icons
 * Specifically designed for tooltip elements which may have:
 * - multiplier (for percentage display)
 * - type-specific handling
 * - nameOverride for variable lookup
 */
export const parseTooltipElementText = (
  element: any,
  unit: ITftUnit | null | undefined
): string | null => {
  if (!element || !unit) return null;
  
  // Get the text to parse
  const elementName = element.name || element.text || element.value || element.values || '';
  if (!elementName) return null;
  
  // Handle special case: if element doesn't have @ variables, use direct value lookup
  if (!String(elementName).includes('@')) {
    const nameKey = element.nameOverride || element.type;
    if (nameKey && unit.ability?.calculations) {
      // Try to find value in calculations
      const calcValue = unit.ability.calculations[nameKey];
      if (calcValue !== undefined) {
        const multiplier = element.multiplier || 1;
        const suffix = multiplier === 100 ? '%' : '';
        
        // Format the value
        let formattedValue = '';
        if (Array.isArray(calcValue)) {
          const processed = calcValue.map((v: any) => {
            const num = typeof v === 'number' ? v : parseFloat(String(v)) || 0;
            return Math.round(num * multiplier);
          });
          
          // Check if all values are the same
          if (processed[0] === processed[1] && processed[1] === processed[2]) {
            formattedValue = `${processed[0]}${suffix}`;
          } else {
            formattedValue = `${processed.join('/')}${suffix}`;
          }
        } else {
          const num = typeof calcValue === 'number' ? calcValue : parseFloat(String(calcValue)) || 0;
          formattedValue = `${Math.round(num * multiplier)}${suffix}`;
        }
        
        return `${elementName} ${formattedValue}`;
      }
    }
    
    // If no calculation found, just return the name
    return String(elementName);
  }
  
  // Use the general parseTextWithVariables for complex parsing
  return parseTextWithVariables(
    typeof elementName === 'string' ? elementName : String(elementName),
    unit.ability?.variables,
    unit
  );
};

