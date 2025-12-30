import React, {useState, useMemo, useEffect} from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {useTftUnitsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {ITftUnit} from '@services/models/tft-unit';
import UnitAvatar from '@shared-components/unit-avatar';
import {translations} from '../../../../shared/localization';

interface UnitFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (selectedUnits: string[]) => void;
  selectedUnits: string[];
}

const UnitFilterModal: React.FC<UnitFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  selectedUnits: initialSelectedUnits,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnits, setSelectedUnits] = useState<string[]>(initialSelectedUnits);
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Calculate hexSize based on screen width to show 5 units per row
  // Formula: (screenWidth - paddingHorizontal - gap * 4) / 5
  // With 5 items, there are 4 gaps between them
  // Note: gap in flexWrap handles spacing, so we don't need to account for marginRight separately
  const screenWidth = Dimensions.get('window').width;
  const paddingHorizontal = 16 * 2; // padding left + right from sectionContent
  const gap = 8; // gap between items in sectionContent
  const hexSize = useMemo(() => {
    // screenWidth = paddingHorizontal + (5 * hexSize) + (4 * gap)
    // hexSize = (screenWidth - paddingHorizontal - 4 * gap) / 5
    return Math.floor((screenWidth - paddingHorizontal - gap * 6) / 5);
  }, [screenWidth]);

  // Reset selected units when modal opens/closes
  useEffect(() => {
    if (visible) {
      setSelectedUnits(initialSelectedUnits);
      setSearchQuery('');
    }
  }, [visible, initialSelectedUnits]);

  // Fetch units with search
  const filters = useMemo(() => {
    if (!searchQuery.trim()) return undefined;
    return {name: searchQuery.trim()};
  }, [searchQuery]);

  const {data: units, isLoading} = useTftUnitsWithPagination(100, filters);

  // Group units by tier
  const unitsByTier = useMemo(() => {
    if (!units || units.length === 0) return [];
    
    // Group by tier
    const grouped: {[key: string]: ITftUnit[]} = {};
    units.forEach(unit => {
      const tier = unit.tier || translations.noTier || 'No Tier';
      if (!grouped[tier]) {
        grouped[tier] = [];
      }
      grouped[tier].push(unit);
    });

    // Tier order: S, A, B, C, D, then others
    const tierOrder: {[key: string]: number} = {
      'S': 1,
      'A': 2,
      'B': 3,
      'C': 4,
      'D': 5,
    };

    // Convert to sections array, sorted by tier order
    const sections = Object.keys(grouped)
      .sort((a, b) => {
        const orderA = tierOrder[a.toUpperCase()] || 999;
        const orderB = tierOrder[b.toUpperCase()] || 999;
        return orderA - orderB;
      })
      .map(tier => ({
        title: `Tier ${tier}`,
        data: grouped[tier],
        tier,
      }));

    return sections;
  }, [units]);

  // Normalize apiName to championKey format (lowercase, remove prefixes)
  const normalizeToChampionKey = (apiName: string): string => {
    // Remove common prefixes like "TFT15_", "TFT_", etc.
    let normalized = apiName.replace(/^TFT\d*_?/i, '');
    // Convert to lowercase
    normalized = normalized.toLowerCase();
    return normalized;
  };

  const toggleUnit = (apiName: string) => {
    const championKey = normalizeToChampionKey(apiName);
    setSelectedUnits(prev =>
      prev.includes(championKey)
        ? prev.filter(u => u !== championKey)
        : [...prev, championKey],
    );
  };

  const handleApply = () => {
    onApply(selectedUnits);
    onClose();
  };

  const handleClear = () => {
    setSelectedUnits([]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter by Units</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon
                name="close"
                type={IconType.Ionicons}
                color={colors.text}
                size={24}
              />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Icon
              name="search"
              type={IconType.Ionicons}
              color={colors.placeholder}
              size={20}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={translations.searchUnitsPlaceholder || "Search units..."}
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}>
                <Icon
                  name="close-circle"
                  type={IconType.Ionicons}
                  color={colors.placeholder}
                  size={20}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Selected count */}
          {selectedUnits.length > 0 && (
            <View style={styles.selectedCountContainer}>
              <Text style={styles.selectedCountText}>
                {selectedUnits.length} {translations.unitsSelected || 'units selected'}
              </Text>
              <TouchableOpacity onPress={handleClear}>
                <Text style={styles.clearText}>{translations.clear || 'Clear'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Units list */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text color={colors.placeholder}>{translations.loadingUnits || 'Loading units...'}</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.unitsList}
              showsVerticalScrollIndicator={false}>
              {unitsByTier.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text color={colors.placeholder}>
                    {searchQuery ? (translations.noUnitsFoundWithFilters || 'No units found') : (translations.noUnitsAvailable || 'No units available')}
                  </Text>
                </View>
              ) : (
                unitsByTier.map((section, index) => {
                  const getTierColor = (tier: string): string => {
                    switch (tier.toUpperCase()) {
                      case 'S':
                        return '#ff7e83';
                      case 'A':
                        return '#ffbf7f';
                      case 'B':
                        return '#ffdf80';
                      case 'C':
                        return '#feff7f';
                      case 'D':
                        return '#bffe7f';
                      default:
                        return colors.primary;
                    }
                  };

                  return (
                    <View key={section.tier || index} style={styles.sectionContainer}>
                      <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderTitle}>Tier</Text>
                        {section.tier && (
                          <View style={[styles.tierBadge, {backgroundColor: getTierColor(section.tier)}]}>
                            <Text style={styles.tierBadgeText}>{section.tier}</Text>
                          </View>
                        )}
                      </View>
                    <View style={styles.sectionContent}>
                      {section.data.map((item) => {
                        const championKey = normalizeToChampionKey(item.apiName);
                        const isSelected = selectedUnits.includes(championKey);

                        return (
                          <RNBounceable
                            key={String(item.id)}
                            onPress={() => toggleUnit(item.apiName)}
                            style={styles.unitItemHorizontal}>
                            <View style={styles.unitAvatarContainer}>
                              <UnitAvatar apiName={item.apiName} hexSize={hexSize} />
                              {isSelected && (
                                <View style={styles.selectedCheckmark}>
                                  <Icon
                                    name="checkmark-circle"
                                    type={IconType.Ionicons}
                                    color={colors.primary}
                                    size={24}
                                  />
                                </View>
                              )}
                            </View>
                          </RNBounceable>
                        );
                      })}
                    </View>
                  </View>
                  );
                })
              )}
            </ScrollView>
          )}

          {/* Footer buttons */}
          <View style={styles.footer}>
            <RNBounceable
              onPress={onClose}
              style={[styles.footerButton, styles.cancelButton]}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </RNBounceable>
            <RNBounceable
              onPress={handleApply}
              style={[
                styles.footerButton,
                styles.applyButton,
                selectedUnits.length === 0 && styles.applyButtonDisabled,
              ]}
              disabled={selectedUnits.length === 0}>
              <Text
                style={[
                  styles.applyButtonText,
                  selectedUnits.length === 0 && styles.applyButtonTextDisabled,
                ]}>
                Apply ({selectedUnits.length})
              </Text>
            </RNBounceable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create<{
    modalOverlay: ViewStyle;
    modalContainer: ViewStyle;
    modalHeader: ViewStyle;
    modalTitle: TextStyle;
    closeButton: ViewStyle;
    searchContainer: ViewStyle;
    searchIcon: ViewStyle;
    searchInput: TextStyle;
    clearSearchButton: ViewStyle;
    selectedCountContainer: ViewStyle;
    selectedCountText: TextStyle;
    clearText: TextStyle;
    unitsList: ViewStyle;
    sectionContainer: ViewStyle;
    sectionHeader: ViewStyle;
    sectionHeaderTitle: TextStyle;
    sectionHeaderText: TextStyle;
    tierBadge: ViewStyle;
    tierBadgeText: TextStyle;
    sectionContent: ViewStyle;
    unitItem: ViewStyle;
    unitItemSelected: ViewStyle;
    unitItemHorizontal: ViewStyle;
    unitAvatarContainer: ViewStyle;
    selectedCheckmark: ViewStyle;
    loadingContainer: ViewStyle;
    emptyContainer: ViewStyle;
    footer: ViewStyle;
    footerButton: ViewStyle;
    cancelButton: ViewStyle;
    cancelButtonText: TextStyle;
    applyButton: ViewStyle;
    applyButtonDisabled: ViewStyle;
    applyButtonText: TextStyle;
    applyButtonTextDisabled: TextStyle;
  }>({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '90%',
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
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.background,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    clearSearchButton: {
      marginLeft: 8,
      padding: 4,
    },
    selectedCountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    selectedCountText: {
      fontSize: 14,
      color: colors.text,
    },
    clearText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
    unitsList: {
      paddingTop: 0,
      paddingBottom: 16,
    },
    sectionContainer: {
      marginBottom: 16,
    },
    sectionHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    sectionHeaderTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sectionHeaderText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    tierBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    tierBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#000000',
      letterSpacing: 0.5,
    },
    sectionContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    unitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    unitItemSelected: {
      backgroundColor: colors.primary + '15',
      borderBottomColor: colors.primary,
    },
    unitItemHorizontal: {
      // No margin - gap in sectionContent handles spacing
    },
    unitAvatarContainer: {
      position: 'relative',
    },
    selectedCheckmark: {
      position: 'absolute',
      top: -8,
      right: -8,
      zIndex: 10,
      backgroundColor: colors.card,
      borderRadius: 12,
    },
    loadingContainer: {
      padding: 32,
      alignItems: 'center',
    },
    emptyContainer: {
      padding: 32,
      alignItems: 'center',
    },
    footer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 12,
    },
    footerButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    applyButton: {
      backgroundColor: colors.primary,
    },
    applyButtonDisabled: {
      backgroundColor: colors.border,
      opacity: 0.5,
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    applyButtonTextDisabled: {
      color: colors.placeholder,
    },
  });

export default UnitFilterModal;

