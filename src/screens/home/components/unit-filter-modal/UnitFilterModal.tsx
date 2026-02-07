import React, {useState, useMemo, useEffect, useCallback, useRef} from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  StyleSheet,
  Animated,
  FlatList, // <--- Import FlatList
  ListRenderItem,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from '@shared-components/icon/Icon';
import Text from '@shared-components/text-wrapper/TextWrapper';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTftUnitsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {ITftUnit} from '@services/models/tft-unit';
import UnitAvatar from '@shared-components/unit-avatar';
import {translations} from '../../../../shared/localization';

// --- CONSTANTS ---

const TIER_ORDER: Record<string, number> = {
  S: 1, A: 2, B: 3, C: 4, D: 5,
};

const getTierColor = (tier: string, primaryColor: string): string => {
  switch (tier.toUpperCase()) {
    case 'S': return '#ff7e83';
    case 'A': return '#ffbf7f';
    case 'B': return '#ffdf80';
    case 'C': return '#feff7f';
    case 'D': return '#bffe7f';
    default: return primaryColor;
  }
};

const normalizeToChampionKey = (apiName: string): string => {
  return apiName.replace(/^TFT\d*_?/i, '').toLowerCase();
};

// --- TYPES ---

interface TierSection {
  tier: string;
  data: ITftUnit[];
}

// --- SUB-COMPONENTS ---

const UnitListSkeleton = ({ hexSize, colors }: { hexSize: number; colors: any }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={{ paddingBottom: 16 }}>
      {[1, 2, 3].map((sectionKey) => (
        <View key={sectionKey} style={{ marginBottom: 16 }}>
          {/* Header Skeleton */}
          <View style={{ 
            paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border,
            flexDirection: 'row', alignItems: 'center', gap: 8 
          }}>
             <Animated.View style={{ width: 40, height: 16, backgroundColor: colors.border, borderRadius: 4, opacity }} />
             <Animated.View style={{ width: 20, height: 20, backgroundColor: colors.border, borderRadius: 6, opacity }} />
          </View>
          {/* Grid Skeleton */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[1, 2, 3, 4, 5, 6, 7].map((itemKey) => (
              <Animated.View
                key={itemKey}
                style={{ width: hexSize, height: hexSize, borderRadius: hexSize / 2, backgroundColor: colors.border, opacity }}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

interface UnitItemProps {
  item: ITftUnit;
  isSelected: boolean;
  hexSize: number;
  primaryColor: string;
  onToggle: (apiName: string) => void;
  colors: any;
}

const UnitItem = React.memo(({ item, isSelected, hexSize, primaryColor, onToggle, colors }: UnitItemProps) => {
  return (
    <RNBounceable onPress={() => onToggle(item.apiName)}>
      <View style={styles.unitAvatarContainer}>
        <UnitAvatar apiName={item.apiName} hexSize={hexSize} />
        {isSelected && (
          <View style={[styles.selectedCheckmark, { backgroundColor: colors.card }]}>
            <Icon name="checkmark-circle" type={IconType.Ionicons} color={primaryColor} size={24} />
          </View>
        )}
      </View>
    </RNBounceable>
  );
}, (prev, next) => prev.isSelected === next.isSelected && prev.hexSize === next.hexSize && prev.item.apiName === next.item.apiName);

// --- MAIN COMPONENT ---

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
  const {width: screenWidth} = useWindowDimensions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnits, setSelectedUnits] = useState<string[]>(initialSelectedUnits);

  const hexSize = useMemo(() => {
    const paddingHorizontal = 32; 
    const gap = 8;
    return Math.floor((screenWidth - paddingHorizontal - gap * 6) / 5);
  }, [screenWidth]);

  useEffect(() => {
    if (visible) {
      setSelectedUnits(initialSelectedUnits);
      setSearchQuery('');
    }
  }, [visible, initialSelectedUnits]);

  const {data: allUnits, isLoading} = useTftUnitsWithPagination(200);

  // --- OPTIMIZED DATA PROCESSING (Single Pass) ---
  const unitsByTier = useMemo(() => {
    if (!allUnits || allUnits.length === 0) return [];

    const query = searchQuery.trim().toLowerCase();
    const groups: Record<string, ITftUnit[]> = {};
    const noTierLabel = (translations.noTier || 'No Tier').toUpperCase();

    // Loop 1 lần duy nhất
    for (const unit of allUnits) {
      if (query) {
        const name = unit.name?.toLowerCase() || '';
        const charName = unit.characterName?.toLowerCase() || '';
        if (!name.includes(query) && !charName.includes(query)) continue;
      }

      const rawTier = unit.tier || translations.noTier || 'No Tier';
      const tierKey = rawTier.toUpperCase();

      if (tierKey === noTierLabel || TIER_ORDER[tierKey] === undefined) continue;

      if (!groups[tierKey]) groups[tierKey] = [];
      groups[tierKey].push(unit);
    }

    const sortedTiers = Object.keys(TIER_ORDER).sort((a, b) => TIER_ORDER[a] - TIER_ORDER[b]);

    return sortedTiers
      .filter(tierKey => groups[tierKey] && groups[tierKey].length > 0)
      .map(tierKey => ({
        tier: tierKey,
        data: groups[tierKey],
      }));
  }, [allUnits, searchQuery]);

  // --- HANDLERS ---
  const toggleUnit = useCallback((apiName: string) => {
    const championKey = normalizeToChampionKey(apiName);
    setSelectedUnits(prev => {
      const isSelected = prev.includes(championKey);
      if (isSelected) return prev.filter(u => u !== championKey);
      return [...prev, championKey];
    });
  }, []);

  const handleApply = useCallback(() => {
    onApply(selectedUnits);
    onClose();
  }, [selectedUnits, onApply, onClose]);

  const handleClear = useCallback(() => setSelectedUnits([]), []);
  const handleClearSearch = useCallback(() => setSearchQuery(''), []);

  // --- FLATLIST RENDER ITEM ---
  const renderTierSection: ListRenderItem<TierSection> = useCallback(({ item: section }) => {
    return (
      <View style={dynamicStyles.sectionContainer}>
        <View style={dynamicStyles.sectionHeader}>
          <Text style={dynamicStyles.sectionHeaderTitle}>{translations.tier}</Text>
          {section.tier && (
            <View style={[dynamicStyles.tierBadge, {backgroundColor: getTierColor(section.tier, colors.primary)}]}>
              <Text style={dynamicStyles.tierBadgeText}>{section.tier}</Text>
            </View>
          )}
        </View>
        <View style={dynamicStyles.sectionContent}>
          {section.data.map((unit) => {
            const championKey = normalizeToChampionKey(unit.apiName);
            return (
              <UnitItem
                key={unit.id || unit.apiName}
                item={unit}
                isSelected={selectedUnits.includes(championKey)}
                hexSize={hexSize}
                primaryColor={colors.primary}
                onToggle={toggleUnit}
                colors={colors}
              />
            );
          })}
        </View>
      </View>
    );
  }, [colors, hexSize, selectedUnits, toggleUnit]); // Deps quan trọng để re-render khi selection thay đổi

  const dynamicStyles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={dynamicStyles.modalOverlay}>
        <View style={dynamicStyles.modalContainer}>
          {/* Header */}
          <View style={dynamicStyles.modalHeader}>
            <Text style={dynamicStyles.modalTitle}>{translations.filterByUnits}</Text>
            <TouchableOpacity onPress={onClose} style={dynamicStyles.closeButton} hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Icon name="close" type={IconType.Ionicons} color={colors.text} size={24} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={dynamicStyles.searchContainer}>
            <Icon name="search" type={IconType.Ionicons} color={colors.placeholder} size={20} style={dynamicStyles.searchIcon} />
            <TextInput
              style={dynamicStyles.searchInput}
              placeholder={translations.searchUnitsPlaceholder}
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={dynamicStyles.clearSearchButton}>
                <Icon name="close-circle" type={IconType.Ionicons} color={colors.placeholder} size={20} />
              </TouchableOpacity>
            )}
          </View>

          {/* Selected count */}
          {selectedUnits.length > 0 && (
            <View style={dynamicStyles.selectedCountContainer}>
              <Text style={dynamicStyles.selectedCountText}>
                {selectedUnits.length} {translations.unitsSelected}
              </Text>
              <TouchableOpacity onPress={handleClear}>
                <Text style={dynamicStyles.clearText}>{translations.clear}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* CONTENT: FLATLIST */}
          {(isLoading || unitsByTier.length === 0) ? (
             <UnitListSkeleton hexSize={hexSize} colors={colors} />
          ) : (
            <FlatList
              data={unitsByTier}
              keyExtractor={(item) => item.tier}
              renderItem={renderTierSection}
              contentContainerStyle={dynamicStyles.unitsList}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              initialNumToRender={1} // Render 3 tier đầu tiên trước
              maxToRenderPerBatch={2}
              windowSize={5}
            />
          )}

          {/* Footer */}
          <View style={dynamicStyles.footer}>
            <RNBounceable onPress={onClose} style={[dynamicStyles.footerButton, dynamicStyles.cancelButton]}>
              <Text style={dynamicStyles.cancelButtonText}>{translations.cancel}</Text>
            </RNBounceable>
            <RNBounceable
              onPress={handleApply}
              style={[
                dynamicStyles.footerButton,
                dynamicStyles.applyButton,
                selectedUnits.length === 0 && dynamicStyles.applyButtonDisabled,
              ]}
              disabled={selectedUnits.length === 0}>
              <Text style={[
                dynamicStyles.applyButtonText,
                selectedUnits.length === 0 && dynamicStyles.applyButtonTextDisabled,
              ]}>
                {translations.apply} ({selectedUnits.length})
              </Text>
            </RNBounceable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  unitAvatarContainer: {
    position: 'relative',
  },
  selectedCheckmark: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
    borderRadius: 12,
  },
});

const createStyles = (colors: any) =>
  StyleSheet.create({
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
      padding: 0,
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