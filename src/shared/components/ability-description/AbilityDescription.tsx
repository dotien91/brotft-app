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
  iconType?: 'AD' | 'AP';
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
    
    // Pattern for %i:scaleAD% or %i:scaleAP% or %i:AD% or %i:AP%
    // Also handle patterns like %i:scaleAD%%i:scaleAP% (adjacent)
    // Match: %i:scaleAD%, %i:AD%, %i:scaleAP%, %i:AP%
    const iconPattern = /%i:(scale)?(AD|AP)%/gi;
    let match;
    const matches: Array<{index: number; length: number; iconType: 'AD' | 'AP'}> = [];
    
    // Collect all matches first
    while ((match = iconPattern.exec(desc)) !== null) {
      const iconType = match[2].toUpperCase() as 'AD' | 'AP';
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
                    name={part.iconType} 
                    size={14}
                    color={part.iconType === 'AD' ? '#BD7E4C' : '#9BFFF7'}
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

