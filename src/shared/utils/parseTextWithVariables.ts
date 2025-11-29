import {ITftUnit} from '@services/models/tft-unit';

/**
 * Parse text with variables and icons
 * Replaces @VariableName@ patterns with actual values
 * Handles %i:iconName% patterns for icon rendering
 * Processes calculations from ability data
 */
export const parseTextWithVariables = (
  text: string | null | undefined,
  variables: any[] | undefined,
  unit: ITftUnit | null | undefined
): string | null => {
  if (!text || !unit) return null;
  
  let parsed = String(text);
  
  // Replace &nbsp; with space first
  parsed = parsed.replace(/&nbsp;/g, ' ');
  // Replace <br> with newline
  parsed = parsed.replace(/<br\s*\/?>/gi, '\n');
  
  // Parse @ variables from ability.variables and calculations
  const varsToUse = variables || unit.ability?.variables;
  const calculations = unit.ability?.calculations;
  
  // Create a map of variable names to values (from both variables and calculations)
  const variableMap: Record<string, any> = {};
  
  // Add variables from ability.variables
  if (varsToUse && Array.isArray(varsToUse) && varsToUse.length > 0) {
    varsToUse.forEach((variable) => {
      if (variable.name) {
        variableMap[variable.name] = variable.value;
      }
    });
  }
  
  // Add calculations (parse complex calculation structure)
  if (calculations && typeof calculations === 'object') {
    if (__DEV__) {
      console.log('[parseTextWithVariables] Processing calculations:', calculations);
    }
    
    Object.keys(calculations).forEach((key) => {
      const calcValue = calculations[key];
      
      if (__DEV__) {
        console.log(`[parseTextWithVariables] Processing calculation key: ${key}`, calcValue);
      }
      
      // If calculation is an array, try to extract values
      if (Array.isArray(calcValue)) {
        // Helper to get stat value by name (case-insensitive)
        const getStatValue = (statName: string): any => {
          if (!unit?.stats) return null;
          
          const stats = unit.stats;
          const statNameLower = statName.toLowerCase();
          
          // Map common stat names
          const statMap: Record<string, keyof typeof stats> = {
            'shield': 'hp', // Shield might be based on HP
            'attackspeed': 'attackSpeed',
            'attack_speed': 'attackSpeed',
            'hp': 'hp',
            'health': 'hp',
            'damage': 'damage',
            'armor': 'armor',
            'magicresist': 'magicResist',
            'magic_resist': 'magicResist',
            'mana': 'mana',
            'range': 'range',
          };
          
          const mappedKey = statMap[statNameLower];
          if (mappedKey && stats[mappedKey] !== undefined && stats[mappedKey] !== null) {
            return stats[mappedKey];
          }
          
          // Try direct access (case-insensitive)
          const statsAny = stats as any;
          for (const statKey in statsAny) {
            if (statKey.toLowerCase() === statNameLower) {
              return statsAny[statKey];
            }
          }
          
          return null;
        };
        
        // Helper to find variable value by name (flexible matching)
        const findVariableByName = (searchName: string): any => {
          const searchLower = searchName.toLowerCase();
          
          // Try to find in variables first (search all variables, not just those in variableMap)
          if (varsToUse && Array.isArray(varsToUse)) {
            // Strategy 1: Exact match
            let found = varsToUse.find((v: any) => {
              const name = String(v?.name || '').toLowerCase();
              return name === searchLower;
            });
            if (found && found.value !== undefined && found.value !== null) {
              return found.value;
            }
            
            // Strategy 2: Case-insensitive partial match
            found = varsToUse.find((v: any) => {
              const name = String(v?.name || '').toLowerCase();
              return name.includes(searchLower) || searchLower.includes(name);
            });
            if (found && found.value !== undefined && found.value !== null) {
              return found.value;
            }
            
            // Strategy 3: Try common variations based on search name
            const variations: string[] = [];
            if (searchLower.includes('shield')) {
              variations.push('shield', 'ap', 'scaleap', 'abilitypower', 'ability_power');
            } else if (searchLower.includes('attackspeed') || searchLower.includes('attack_speed')) {
              variations.push('attackspeed', 'attack_speed', 'as', 'ap', 'scaleap', 'abilitypower', 'ability_power');
            } else if (searchLower.includes('ap') || searchLower.includes('ability')) {
              variations.push('ap', 'abilitypower', 'ability_power', 'scaleap');
            } else {
              // For other names, try the name itself and common prefixes/suffixes
              variations.push(searchLower);
              if (!searchLower.startsWith('scale')) {
                variations.push(`scale${searchLower}`);
              }
              if (!searchLower.endsWith('damage')) {
                variations.push(`${searchLower}damage`, `damage${searchLower}`);
              }
            }
            
            for (const variation of variations) {
              found = varsToUse.find((v: any) => {
                const name = String(v?.name || '').toLowerCase();
                return name === variation || 
                       name.includes(variation) || 
                       variation.includes(name) ||
                       (name.replace(/[^a-z0-9]/g, '') === variation.replace(/[^a-z0-9]/g, ''));
              });
              if (found && found.value !== undefined && found.value !== null) {
                return found.value;
              }
            }
          }
          
          // Try to find in variableMap (already processed)
          for (const mapKey in variableMap) {
            const keyLower = mapKey.toLowerCase();
            if (keyLower === searchLower || 
                keyLower.includes(searchLower) || 
                searchLower.includes(keyLower) ||
                keyLower.replace(/[^a-z0-9]/g, '') === searchLower.replace(/[^a-z0-9]/g, '')) {
              return variableMap[mapKey];
            }
          }
          
          return null;
        };
        
        // Helper to get AP value (from variables, calculations, or stats)
        const getAPValue = (): any => {
          return findVariableByName('ap') || 
                 findVariableByName('abilitypower') || 
                 findVariableByName('scaleap') ||
                 findVariableByName('ability_power');
        };
        
        // Helper to get stat value by mStat index
        const getStatByIndex = (mStat: number): any => {
          if (!unit?.stats) return null;
          
          // Common mStat mappings (based on League of Legends stat indices)
          // 0 = Health, 1 = Resource, 2 = Attack Speed, 3 = Armor, 4 = Magic Resist, 
          // 5 = Move Speed, 6 = Attack Damage, 7 = Ability Power, etc.
          const statMap: Record<number, keyof typeof unit.stats> = {
            0: 'hp',
            1: 'mana',
            2: 'attackSpeed',
            3: 'armor',
            4: 'magicResist',
            6: 'damage',
            7: 'damage', // AP might be stored as damage or separate
            12: 'hp', // PercentHealthHeal might use HP
          };
          
          const statKey = statMap[mStat];
          if (statKey && unit.stats[statKey] !== undefined && unit.stats[statKey] !== null) {
            return unit.stats[statKey];
          }
          
          return null;
        };
        
        // Process calculation array
        const calculatedResults: any[] = [];
        
        calcValue.forEach((calcItem: any) => {
          // Handle SumOfSubPartsCalculationPart - sum multiple parts
          if (calcItem.type === 'SumOfSubPartsCalculationPart' && calcItem.parts && Array.isArray(calcItem.parts)) {
            const partResults: any[] = [];
            
            calcItem.parts.forEach((part: any) => {
              let partValue: any = null;
              
              // Handle StatByNamedDataValueCalculationPart
              if (part.type === 'StatByNamedDataValueCalculationPart' && part.mStat !== undefined) {
                partValue = getStatByIndex(part.mStat);
                if (part.name && partValue !== null) {
                  // Store the value with the name for later use
                  variableMap[part.name] = partValue;
                }
              }
              // Handle SubPartScaledProportionalToStat
              else if (part.type === 'SubPartScaledProportionalToStat' && part.part) {
                const partName = part.part?.name;
                if (partName) {
                  let baseValue: any = null;
                  
                  // Try to find base value
                  if (variableMap[partName]) {
                    baseValue = variableMap[partName];
                  } else {
                    baseValue = findVariableByName(partName);
                  }
                  
                  if (!baseValue) {
                    baseValue = getStatValue(partName);
                  }
                  
                  if (baseValue !== null && baseValue !== undefined) {
                    const mRatio = part.mRatio || 1;
                    if (Array.isArray(baseValue)) {
                      partValue = baseValue.map((v: any) => {
                        const num = typeof v === 'number' ? v : parseFloat(String(v)) || 0;
                        return num * mRatio;
                      });
                    } else {
                      const num = typeof baseValue === 'number' ? baseValue : parseFloat(String(baseValue)) || 0;
                      partValue = num * mRatio;
                    }
                  }
                }
              }
              
              if (partValue !== null && partValue !== undefined) {
                partResults.push(partValue);
              }
            });
            
            // Sum all part results
            if (partResults.length > 0) {
              if (partResults.every(v => Array.isArray(v))) {
                const maxLength = Math.max(...partResults.map((arr: any) => arr.length));
                const summed = Array.from({length: maxLength}, (_, idx) => {
                  return partResults.reduce((sum: number, arr: any) => {
                    const val = arr[idx];
                    return sum + (typeof val === 'number' ? val : parseFloat(String(val)) || 0);
                  }, 0);
                });
                calculatedResults.push(summed);
              } else {
                const sum = partResults.reduce((acc: number, val: any) => {
                  const num = typeof val === 'number' ? val : parseFloat(String(val)) || 0;
                  return acc + num;
                }, 0);
                calculatedResults.push(sum);
              }
            }
          }
          // If calcItem has a direct value
          else if (calcItem.value !== undefined) {
            calculatedResults.push(calcItem.value);
          } else if (calcItem.mRatio !== undefined && calcItem.part) {
            const partName = calcItem.part?.name;
            if (partName) {
              // Get base value from part
              let baseValue: any = null;
              
              // Try multiple strategies to find base value
              const partNameLower = partName.toLowerCase();
              
              // Strategy 1: Try to find in variableMap (already processed variables)
              if (variableMap[partName]) {
                baseValue = variableMap[partName];
              } 
              // Strategy 2: Try to find variable by name (flexible matching)
              else if (!baseValue) {
                baseValue = findVariableByName(partName);
              }
              
              // Strategy 3: Try common part name variations
              if (!baseValue) {
                // For ADDamage, try to find AD or damage
                if (partNameLower.includes('addamage') || partNameLower.includes('ad')) {
                  baseValue = findVariableByName('ad') || 
                             findVariableByName('damage') || 
                             findVariableByName('scalead') ||
                             getStatValue('damage');
                }
                // For APHeal, try to find AP
                else if (partNameLower.includes('apheal') || partNameLower.includes('ap')) {
                  baseValue = getAPValue() || findVariableByName('apheal');
                }
                // For Shield and AttackSpeed, try AP-based calculation
                else if (partNameLower === 'shield' || partNameLower === 'attackspeed' || partNameLower === 'attack_speed') {
                  const apValue = getAPValue();
                  if (apValue) {
                    baseValue = apValue;
                  }
                }
              }
              
              // Strategy 4: Try to get from stats (including mStat if available)
              if (!baseValue && calcItem.mStat !== undefined) {
                baseValue = getStatByIndex(calcItem.mStat);
              }
              
              if (!baseValue) {
                baseValue = getStatValue(partName);
              }
              
              // Strategy 5: Try to find in calculations (might be pre-calculated)
              if (!baseValue && calculations) {
                for (const calcKey in calculations) {
                  const calcKeyLower = calcKey.toLowerCase();
                  if (calcKeyLower === partNameLower || 
                      calcKeyLower.includes(partNameLower) || 
                      partNameLower.includes(calcKeyLower)) {
                    const calcVal = calculations[calcKey];
                    if (typeof calcVal === 'number' || Array.isArray(calcVal)) {
                      baseValue = calcVal;
                      break;
                    }
                  }
                }
              }
              
              if (baseValue !== null && baseValue !== undefined) {
                const mRatio = calcItem.mRatio || 1;
                let calculatedValue: any;
                
                if (Array.isArray(baseValue)) {
                  calculatedValue = baseValue.map((v: any) => {
                    const num = typeof v === 'number' ? v : parseFloat(String(v)) || 0;
                    return num * mRatio;
                  });
                } else {
                  const num = typeof baseValue === 'number' ? baseValue : parseFloat(String(baseValue)) || 0;
                  calculatedValue = num * mRatio;
                }
                
                // Handle displayAsPercent
                if (calcItem.displayAsPercent && calculatedValue) {
                  if (Array.isArray(calculatedValue)) {
                    calculatedValue = calculatedValue.map((v: any) => v * 100);
                  } else {
                    calculatedValue = calculatedValue * 100;
                  }
                }
                
                calculatedResults.push(calculatedValue);
                
                if (__DEV__) {
                  console.log(`[parseTextWithVariables] Calculated value for ${key} (part: ${partName}, baseValue:`, baseValue, `, mRatio:`, mRatio, `, displayAsPercent:`, calcItem.displayAsPercent, `, result:`, calculatedValue, `)`);
                }
              } else {
                if (__DEV__) {
                  console.log(`[parseTextWithVariables] Could not find baseValue for part: ${partName}`, {
                    partName,
                    variableMapKeys: Object.keys(variableMap),
                    varsToUseNames: varsToUse?.map((v: any) => ({name: v.name, value: v.value})),
                    calculationsKeys: Object.keys(calculations || {}),
                    unitStats: unit?.stats,
                  });
                }
              }
            }
          }
        });
        
        // Combine results if multiple
        if (calculatedResults.length > 0) {
          if (__DEV__) {
            console.log(`[parseTextWithVariables] Combined results for ${key}:`, calculatedResults);
          }
          if (calculatedResults.every(v => Array.isArray(v))) {
            // Sum arrays element-wise
            const maxLength = Math.max(...calculatedResults.map((arr: any) => arr.length));
            const combined = Array.from({length: maxLength}, (_, idx) => {
              return calculatedResults.reduce((sum: number, arr: any) => {
                const val = arr[idx];
                return sum + (typeof val === 'number' ? val : parseFloat(String(val)) || 0);
              }, 0);
            });
            variableMap[key] = combined;
          } else if (calculatedResults.length === 1) {
            variableMap[key] = calculatedResults[0];
          } else {
            // Sum all results
            const sum = calculatedResults.reduce((acc: number, val: any) => {
              const num = typeof val === 'number' ? val : parseFloat(String(val)) || 0;
              return acc + num;
            }, 0);
            variableMap[key] = sum;
          }
          
          if (__DEV__) {
            console.log(`[parseTextWithVariables] Final value for ${key} in variableMap:`, variableMap[key]);
          }
        } else {
          // If no calculated results, try to use the calculation structure as fallback
          // This might contain pre-calculated values
          variableMap[key] = calcValue;
          if (__DEV__) {
            console.log(`[parseTextWithVariables] No calculated results for ${key}, using calcValue as fallback:`, calcValue);
          }
        }
      } else {
        // If calculation is not an array, use it directly
        variableMap[key] = calcValue;
        if (__DEV__) {
          console.log(`[parseTextWithVariables] Non-array calculation for ${key}, using directly:`, calcValue);
        }
      }
    });
    
    if (__DEV__) {
      console.log('[parseTextWithVariables] Final variableMap after calculations:', variableMap);
    }
  }
  
  if (Object.keys(variableMap).length > 0) {
    
    // Helper function to format a value (handles arrays and single values)
    const formatValue = (val: any): string => {
      if (val === undefined || val === null) return '';
      
      // Handle arrays (stage values: [1⭐, 2⭐, 3⭐])
      if (Array.isArray(val)) {
        if (val.length === 0) return '';
        
        // Check if all values are the same
        const uniqueValues = [...new Set(val)];
        if (uniqueValues.length === 1) {
          // If all values are the same, show only one value
          const singleValue = uniqueValues[0];
          if (typeof singleValue === 'number') {
            if (singleValue < 1 && singleValue > 0) {
              return `${Math.round(singleValue * 100)}%`;
            } else if (singleValue >= 1) {
              return String(Math.round(singleValue));
            }
            return String(singleValue);
          }
          return String(singleValue);
        } else {
          // Format each value and join with "/"
          const formattedValues = val.map((v: any) => {
            if (typeof v === 'number') {
              if (v < 1 && v > 0) {
                return `${Math.round(v * 100)}%`;
              } else if (v >= 1) {
                return String(Math.round(v));
              }
              return String(v);
            }
            return String(v);
          });
          return formattedValues.join('/');
        }
      }
      
      // Handle single number
      if (typeof val === 'number') {
        if (val < 1 && val > 0) {
          return `${Math.round(val * 100)}%`;
        } else if (val >= 1) {
          return String(Math.round(val));
        }
        return String(val);
      }
      
      return String(val);
    };
    
    // Helper function to find variable value by name (with various matching strategies)
    const findVariableValue = (key: string): any => {
      // Try direct match
      if (variableMap[key]) {
        return variableMap[key];
      }
      
      // Pattern 1: @ModifiedXXX@ -> look for XXX in variables
      if (key.startsWith('Modified')) {
        const baseKey = key.replace('Modified', '');
        if (variableMap[baseKey]) {
          return variableMap[baseKey];
        }
      }
      
      // Pattern 2: @TFTUnitProperty:KEY@ -> look for KEY in variables
      if (key.startsWith('TFTUnitProperty:')) {
        const baseKey = key.replace('TFTUnitProperty:', '');
        if (variableMap[baseKey]) {
          return variableMap[baseKey];
        }
      }
      
      // Pattern 3: For %i:scaleAD%, %i:scaleAP%, %i:scaleHealth% -> try to find in variables
      // First try to find in variables directly
      if (varsToUse && Array.isArray(varsToUse)) {
        const keyLower = key.toLowerCase();
        
        // Try exact match
        let found = varsToUse.find((v: any) => {
          const name = String(v?.name || '').toLowerCase();
          return name === keyLower;
        });
        if (found && found.value !== undefined && found.value !== null) {
          return found.value;
        }
        
        // Try removing "scale" prefix: scaleAD -> AD, scaleAP -> AP, scaleHealth -> Health
        if (keyLower.startsWith('scale')) {
          const withoutScale = keyLower.replace(/^scale/, '');
          found = varsToUse.find((v: any) => {
            const name = String(v?.name || '').toLowerCase();
            return name === withoutScale || 
                   name.includes(withoutScale) || 
                   withoutScale.includes(name) ||
                   name === `${withoutScale}damage` ||
                   name === `damage${withoutScale}` ||
                   name === `${withoutScale}heal` ||
                   name === `heal${withoutScale}`;
          });
          if (found && found.value !== undefined && found.value !== null) {
            return found.value;
          }
        }
        
        // Try common stat names
        if (keyLower.includes('ad') || keyLower === 'scalead') {
          found = varsToUse.find((v: any) => {
            const name = String(v?.name || '').toLowerCase();
            return name.includes('ad') && (name.includes('damage') || name === 'ad' || name === 'addamage');
          });
          if (found && found.value !== undefined && found.value !== null) {
            return found.value;
          }
        }
        
        if (keyLower.includes('ap') || keyLower === 'scaleap') {
          found = varsToUse.find((v: any) => {
            const name = String(v?.name || '').toLowerCase();
            return name.includes('ap') || name.includes('abilitypower') || name === 'apheal';
          });
          if (found && found.value !== undefined && found.value !== null) {
            return found.value;
          }
        }
        
        if (keyLower.includes('health') || keyLower === 'scalehealth') {
          found = varsToUse.find((v: any) => {
            const name = String(v?.name || '').toLowerCase();
            return name.includes('health') || name.includes('hp') || name === 'health';
          });
          if (found && found.value !== undefined && found.value !== null) {
            return found.value;
          }
        }
      }
      
      // Pattern 4: Try to find in variableMap
      const keys = Object.keys(variableMap);
      const keyLower = key.toLowerCase();
      
      // Try exact case insensitive match
      const exactMatch = keys.find(k => k.toLowerCase() === keyLower);
      if (exactMatch) {
        return variableMap[exactMatch];
      }
      
      // Try removing "scale" prefix: scaleAD -> AD, scaleAP -> AP
      if (keyLower.startsWith('scale')) {
        const withoutScale = keyLower.replace(/^scale/, '');
        const matchWithoutScale = keys.find(k => {
          const kLower = k.toLowerCase();
          return kLower === withoutScale || 
                 kLower.includes(withoutScale) || 
                 withoutScale.includes(kLower) ||
                 kLower === `${withoutScale}damage` ||
                 kLower === `damage${withoutScale}`;
        });
        if (matchWithoutScale) {
          return variableMap[matchWithoutScale];
        }
      }
      
      // Try adding "Damage" suffix: scaleAD -> ADDamage, scaleAP -> APDamage
      if (keyLower.includes('ad') || keyLower.includes('ap')) {
        const adMatch = keys.find(k => {
          const kLower = k.toLowerCase();
          return (keyLower.includes('ad') && (kLower.includes('addamage') || kLower === 'ad' || kLower.includes('ad') && kLower.includes('damage'))) ||
                 (keyLower.includes('ap') && (kLower.includes('apdamage') || kLower === 'ap' || kLower.includes('ap') && kLower.includes('damage')));
        });
        if (adMatch) {
          return variableMap[adMatch];
        }
      }
      
      // Pattern 5: Try partial match
      const normalizedKey = keyLower.replace(/^(modified|tftunitproperty:|scale)/i, '');
      const partialMatch = keys.find(k => {
        const normalizedK = k.toLowerCase();
        return normalizedK === normalizedKey || 
               normalizedK.includes(normalizedKey) || 
               normalizedKey.includes(normalizedK) ||
               (normalizedKey.includes('ad') && normalizedK.includes('ad')) ||
               (normalizedKey.includes('ap') && normalizedK.includes('ap'));
      });
      if (partialMatch) {
        return variableMap[partialMatch];
      }
      
      return null;
    };
    
    // Parse %i:variableName% patterns (e.g., %i:scaleAD%, %i:scaleAP%)
    // First, handle adjacent patterns like (%i:scaleAD%%i:scaleAP%) that should be added together
    const adjacentPercentPattern = /\(?%i:([^%]+)%(%i:([^%]+)%)\)?/g;
    const adjacentMatches: Array<{match: string; index: number; firstKey: string; secondKey: string; firstIcon: string; secondIcon: string}> = [];
    let adjacentMatch;
    
    while ((adjacentMatch = adjacentPercentPattern.exec(parsed)) !== null) {
      const firstKey = adjacentMatch[1]; // e.g., "scaleAD"
      const secondKey = adjacentMatch[3]; // e.g., "scaleAP"
      const fullMatch = adjacentMatch[0];
      
      // Extract icon type from key (AD or AP)
      const firstIcon = firstKey.toUpperCase().includes('AD') ? 'AD' : firstKey.toUpperCase().includes('AP') ? 'AP' : '';
      const secondIcon = secondKey.toUpperCase().includes('AD') ? 'AD' : secondKey.toUpperCase().includes('AP') ? 'AP' : '';
      
      // Get both values
      const firstValue = findVariableValue(firstKey);
      const secondValue = findVariableValue(secondKey);
      
      // Always try to add if both values are found
      if (firstValue !== null && secondValue !== null && firstIcon && secondIcon) {
        adjacentMatches.push({
          match: fullMatch,
          index: adjacentMatch.index,
          firstKey,
          secondKey,
          firstIcon,
          secondIcon,
        });
      }
    }
    
    // Replace adjacent patterns from end to start to preserve indices
    adjacentMatches.reverse().forEach(({match, index, firstKey, secondKey, firstIcon, secondIcon}) => {
      const firstValue = findVariableValue(firstKey);
      const secondValue = findVariableValue(secondKey);
      
      if (firstValue !== null && secondValue !== null) {
        // Add arrays element-wise or add numbers
        let sumValue: any;
        if (Array.isArray(firstValue) && Array.isArray(secondValue)) {
          const maxLength = Math.max(firstValue.length, secondValue.length);
          sumValue = Array.from({length: maxLength}, (_, i) => {
            const val1 = firstValue[i] || 0;
            const val2 = secondValue[i] || 0;
            return (typeof val1 === 'number' ? val1 : 0) + (typeof val2 === 'number' ? val2 : 0);
          });
        } else if (typeof firstValue === 'number' && typeof secondValue === 'number') {
          sumValue = firstValue + secondValue;
        } else {
          sumValue = firstValue;
        }
        
        // Format the sum value
        const formattedSum = formatValue(sumValue);
        if (formattedSum) {
          // Replace with formatted value + icon patterns (without parentheses)
          const replacement = `${formattedSum} %i:${firstIcon}% %i:${secondIcon}%`;
          parsed = parsed.substring(0, index) + replacement + parsed.substring(index + match.length);
        }
      }
    });
    
    // Parse single %i:...% patterns (not adjacent)
    // These are just icon indicators, keep them as-is for AbilityDescription to parse
    // But we can normalize them (e.g., %i:scaleAD% -> %i:AD%) for consistency
    const singleIconPattern = /%i:([^%]+)%/g;
    const singleIconMatches = [...parsed.matchAll(singleIconPattern)];
    
    // Process from end to start
    const singleIconMatchesArray = Array.from(singleIconMatches).reverse();
    
    singleIconMatchesArray.forEach((match) => {
      const fullMatch = match[0];
      const iconKey = match[1]; // e.g., "scaleAD", "scaleAP", "scaleHealth"
      const matchIndex = match.index || 0;
      
      // Determine icon type from key and normalize
      let iconType = '';
      const keyUpper = iconKey.toUpperCase();
      if (keyUpper.includes('AD') || keyUpper.includes('DAMAGE')) {
        iconType = 'AD';
      } else if (keyUpper.includes('AP') || keyUpper.includes('ABILITY')) {
        iconType = 'AP';
      } else if (keyUpper.includes('HEALTH') || keyUpper.includes('HP')) {
        iconType = 'HP';
      } else if (keyUpper.includes('ARMOR') || keyUpper === 'AR') {
        iconType = 'AR';
      } else if (keyUpper.includes('MAGIC') || keyUpper === 'MR') {
        iconType = 'MR';
      } else if (keyUpper.includes('ATTACKSPEED') || keyUpper === 'AS') {
        iconType = 'AS';
      } else if (keyUpper.includes('MANA')) {
        iconType = 'MANA';
      } else if (keyUpper.includes('CRIT')) {
        iconType = 'CRIT';
      } else if (['AD', 'AP', 'HP', 'AR', 'MR', 'AS', 'MANA', 'CRIT'].includes(keyUpper)) {
        iconType = keyUpper;
      }
      
      // Normalize the pattern to %i:ICONTYPE% for consistency
      // But only if we can determine the icon type
      if (iconType) {
        const normalizedPattern = `%i:${iconType}%`;
        // Only replace if it's different (to avoid infinite loops)
        if (fullMatch !== normalizedPattern) {
          parsed = parsed.substring(0, matchIndex) + normalizedPattern + parsed.substring(matchIndex + fullMatch.length);
        }
      }
      // If we can't determine icon type, keep the original pattern
      // AbilityDescription will try to parse it
    });
    
    // Find all @...@ patterns (including patterns with operations like *100)
    const variablePattern = /@([^@]+)@/g;
    const matches = [...parsed.matchAll(variablePattern)];
    
    // Process matches from end to start to preserve indices
    const matchesArray = Array.from(matches).reverse();
    
    matchesArray.forEach((match) => {
      const fullMatch = match[0];
      const variableKey = match[1];
      const matchIndex = match.index || 0;
      
      // Parse operations in pattern (e.g., "PercentHealthHeal*100")
      let operation: string | null = null;
      let operationValue: number | null = null;
      let actualKey = variableKey;
      
      // Check for multiplication: VariableName*Number
      const multiplyMatch = variableKey.match(/^([^*]+)\*(\d+(?:\.\d+)?)$/);
      if (multiplyMatch) {
        actualKey = multiplyMatch[1];
        operation = 'multiply';
        operationValue = parseFloat(multiplyMatch[2]);
      }
      
      // Check for division: VariableName/Number
      const divideMatch = variableKey.match(/^([^/]+)\/(\d+(?:\.\d+)?)$/);
      if (divideMatch) {
        actualKey = divideMatch[1];
        operation = 'divide';
        operationValue = parseFloat(divideMatch[2]);
      }
      
      // Find the variable value
      let value = findVariableValue(actualKey);
      
      // Apply operation if needed
      if (value !== null && value !== undefined && operation && operationValue !== null) {
        if (operation === 'multiply') {
          if (Array.isArray(value)) {
            value = value.map((v: any) => {
              const num = typeof v === 'number' ? v : parseFloat(String(v)) || 0;
              return num * operationValue!;
            });
          } else {
            const num = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
            value = num * operationValue;
          }
        } else if (operation === 'divide') {
          if (Array.isArray(value)) {
            value = value.map((v: any) => {
              const num = typeof v === 'number' ? v : parseFloat(String(v)) || 0;
              return num / operationValue!;
            });
          } else {
            const num = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
            value = num / operationValue;
          }
        }
      }
      
      // Format the value
      const formattedValue = formatValue(value);
      
      // Replace the pattern
      if (formattedValue) {
        parsed = parsed.substring(0, matchIndex) + formattedValue + parsed.substring(matchIndex + fullMatch.length);
      }
    });
  }
  
  // Remove HTML tags after parsing
  parsed = parsed.replace(/<[^>]*>/g, '');
  
  // Clean up whitespace
  parsed = parsed.trim();
  parsed = parsed.replace(/\s+/g, ' ');
  parsed = parsed.replace(/\n\s*\n/g, '\n');
  
  return parsed || null;
};

