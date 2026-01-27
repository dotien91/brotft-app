import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from '@shared-components/icon/Icon';
import Text from '@shared-components/text-wrapper/TextWrapper';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {StyleSheet, ViewStyle, TextStyle} from 'react-native';

interface FilterOption {
  label: string;
  value: string | number | boolean;
  icon?: React.ReactNode; // Optional custom icon/content
}

interface FilterSection {
  title: string;
  type: 'single' | 'multiple' | 'toggle';
  options: FilterOption[];
  selected?: string | number | boolean | (string | number | boolean)[];
  onSelect: (value: string | number | boolean) => void;
  compact?: boolean; // If true, display options in a row with flexWrap (2-3 items per row)
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  sections: FilterSection[];
  hasActiveFilters: boolean;
  onClearAll: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  sections,
  hasActiveFilters,
  onClearAll,
}) => {
  const theme = useTheme();
  const {colors} = theme;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '80%',
      paddingBottom: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    modalContent: {
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    optionsContainer: {
      flexDirection: 'column',
    },
    optionsContainerCompact: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -4,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 6,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    optionItemCompact: {
      flex: 0,
      minWidth: '30%',
      maxWidth: '48%',
      marginBottom: 8,
      marginHorizontal: 4,
      paddingVertical: 8,
      paddingHorizontal: 10,
      justifyContent: 'center',
    },
    optionItemWithIcon: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    optionItemActive: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    optionText: {
      fontSize: 14,
      color: colors.text,
    },
    optionTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 8,
    },
    optionContentVertical: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
    },
    optionIconContainer: {
      marginRight: 0,
      marginBottom: 0,
    },
    optionTextCentered: {
      textAlign: 'center',
      fontSize: 12,
    },
    optionCheckmarkOverlay: {
      position: 'absolute',
      top: 4,
      right: 4,
    },
    modalFooter: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingTop: 12,
      gap: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    clearButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    applyButton: {
      backgroundColor: colors.primary,
    },
    footerButtonText: {
      fontSize: 15,
      fontWeight: '600',
    },
    clearButtonText: {
      color: colors.text,
    },
    applyButtonText: {
      color: colors.white,
    },
  });

  const isSelected = (section: FilterSection, value: string | number | boolean): boolean => {
    if (section.type === 'multiple') {
      const selected = section.selected as (string | number | boolean)[];
      return selected?.includes(value) || false;
    }
    return section.selected === value;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <View
          style={styles.modalContainer}
          onStartShouldSetResponder={() => true}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon
                name="close"
                type={IconType.Ionicons}
                color={colors.text}
                size={20}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {sections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={section.compact ? styles.optionsContainerCompact : styles.optionsContainer}>
                  {section.options.map((option, optionIndex) => {
                    const selected = isSelected(section, option.value);
                    
                    if (section.type === 'toggle') {
                      return (
                        <View
                          key={optionIndex}
                          style={[
                            styles.optionItem,
                            section.compact && styles.optionItemCompact,
                            selected && styles.optionItemActive,
                          ]}>
                          <Text
                            style={[
                              styles.optionText,
                              selected && styles.optionTextActive,
                            ]}>
                            {option.label}
                          </Text>
                          <Switch
                            value={selected}
                            onValueChange={() => section.onSelect(option.value)}
                            trackColor={{
                              false: colors.border,
                              true: colors.primary + '40',
                            }}
                            thumbColor={selected ? colors.primary : colors.placeholder}
                          />
                        </View>
                      );
                    }

                    return (
                      <RNBounceable
                        key={optionIndex}
                        onPress={() => section.onSelect(option.value)}
                        style={[
                          styles.optionItem,
                          section.compact && styles.optionItemCompact,
                          option.icon && styles.optionItemWithIcon,
                          selected && styles.optionItemActive,
                        ]}>
                        <View style={[
                          styles.optionContent,
                          option.icon && styles.optionContentVertical,
                        ]}>
                          {option.icon && (
                            <View style={styles.optionIconContainer}>
                              {option.icon}
                            </View>
                          )}
                          <Text
                            style={[
                              styles.optionText,
                              selected && styles.optionTextActive,
                              option.icon && styles.optionTextCentered,
                            ]}
                            numberOfLines={1}>
                            {option.label}
                          </Text>
                        </View>
                        {selected && !option.icon && (
                          <Icon
                            name="checkmark-circle"
                            type={IconType.Ionicons}
                            color={colors.primary}
                            size={section.compact ? 18 : 20}
                          />
                        )}
                        {selected && option.icon && (
                          <View style={styles.optionCheckmarkOverlay}>
                            <Icon
                              name="checkmark-circle"
                              type={IconType.Ionicons}
                              color={colors.primary}
                              size={20}
                            />
                          </View>
                        )}
                      </RNBounceable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={onClearAll}
                style={[styles.footerButton, styles.clearButton]}>
                <Text style={[styles.footerButtonText, styles.clearButtonText]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onApply}
              style={[styles.footerButton, styles.applyButton]}>
              <Text style={[styles.footerButtonText, styles.applyButtonText]}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FilterModal;

