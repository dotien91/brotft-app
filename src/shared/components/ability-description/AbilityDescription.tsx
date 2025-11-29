import React from 'react';
import {View, Text as RNText, StyleSheet} from 'react-native';
import StatIcon from '../stat-icons/StatIcon';

interface AbilityDescriptionProps {
  description: string;
  style?: any;
  textStyle?: any;
}

interface TextPart {
  type: 'text' | 'icon';
  content: string;
  iconType?: 'AD' | 'AP' | 'HP' | 'AR' | 'MR' | 'AS' | 'MANA' | 'CRIT' | string;
}

const AbilityDescription: React.FC<AbilityDescriptionProps> = ({
  description,
  style,
  textStyle,
}) => {
  // Parse description and extract icon patterns
  const parseDescription = (desc: string): TextPart[] => {
    if (!desc) return [];
    
    const parts: TextPart[] = [];
    let currentIndex = 0;
    
    // Pattern for %i:scaleAD%, %i:scaleAP%, %i:AD%, %i:AP%, %i:HP%, %i:scaleHealth%, etc.
    // Match: %i:anything%
    const iconPattern = /%i:([^%]+)%/gi;
    let match;
    const matches: Array<{index: number; length: number; iconType: string}> = [];
    
    // Helper to determine icon type from key
    const getIconType = (key: string): string => {
      const keyUpper = key.toUpperCase();
      if (keyUpper.includes('AD') || keyUpper.includes('DAMAGE')) {
        return 'AD';
      } else if (keyUpper.includes('AP') || keyUpper.includes('ABILITY')) {
        return 'AP';
      } else if (keyUpper.includes('HEALTH') || keyUpper.includes('HP')) {
        return 'HP';
      } else if (keyUpper.includes('ARMOR') || keyUpper === 'AR') {
        return 'AR';
      } else if (keyUpper.includes('MAGIC') || keyUpper === 'MR') {
        return 'MR';
      } else if (keyUpper.includes('ATTACKSPEED') || keyUpper === 'AS') {
        return 'AS';
      } else if (keyUpper.includes('MANA')) {
        return 'MANA';
      } else if (keyUpper.includes('CRIT')) {
        return 'CRIT';
      }
      // If key is already a valid icon type, return it
      if (['AD', 'AP', 'HP', 'AR', 'MR', 'AS', 'MANA', 'CRIT'].includes(keyUpper)) {
        return keyUpper;
      }
      // Default: try to extract from key (e.g., "scaleAD" -> "AD")
      const match = keyUpper.match(/(AD|AP|HP|AR|MR|AS|MANA|CRIT)/);
      return match ? match[1] : keyUpper;
    };
    
    // Collect all matches first
    while ((match = iconPattern.exec(desc)) !== null) {
      const iconKey = match[1]; // e.g., "scaleAD", "AD", "scaleHealth", "HP"
      const iconType = getIconType(iconKey);
      matches.push({
        index: match.index,
        length: match[0].length,
        iconType,
      });
    }
    
    // Process matches and build parts
    matches.forEach((iconMatch) => {
      // Add text before the match
      if (iconMatch.index > currentIndex) {
        const textBefore = desc.substring(currentIndex, iconMatch.index);
        if (textBefore.trim()) {
          parts.push({type: 'text', content: textBefore});
        }
      }
      
      // Add icon
      parts.push({type: 'icon', iconType: iconMatch.iconType, content: ''});
      
      currentIndex = iconMatch.index + iconMatch.length;
    });
    
    // Add remaining text
    if (currentIndex < desc.length) {
      const remainingText = desc.substring(currentIndex);
      if (remainingText.trim()) {
        parts.push({type: 'text', content: remainingText});
      }
    }
    
    // If no matches, return the whole text as one part
    if (parts.length === 0) {
      parts.push({type: 'text', content: desc});
    }
    
    return parts;
  };

  const parts = parseDescription(description);

  if (parts.length === 0) {
    return null;
  }

  return (
    <RNText style={[textStyle, style]}>
      {parts.map((part, index) => {
        if (part.type === 'icon') {
          return (
            <RNText key={index}>
              <View style={styles.iconWrapper}>
                {part.iconType && (
                  <StatIcon 
                    name={part.iconType as any} 
                    size={14}
                    color={
                      part.iconType === 'AD' ? '#BD7E4C' : 
                      part.iconType === 'AP' ? '#9BFFF7' :
                      part.iconType === 'HP' ? '#4ade80' :
                      part.iconType === 'AR' ? '#fb7185' :
                      part.iconType === 'MR' ? '#ec4899' :
                      part.iconType === 'AS' ? '#fbbf24' :
                      part.iconType === 'MANA' ? '#60a5fa' :
                      part.iconType === 'CRIT' ? '#facc15' :
                      '#9BFFF7'
                    }
                  />
                )}
              </View>
            </RNText>
          );
        }
        return <RNText key={index}>{part.content}</RNText>;
      })}
    </RNText>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AbilityDescription;

