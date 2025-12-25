import React, {useState, useMemo, useEffect} from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {StyleSheet, ViewStyle, TextStyle, ImageStyle} from 'react-native';
import {useTftUnitsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {ITftUnit} from '@services/models/tft-unit';
import {getUnitAvatarUrl} from '../../../../utils/metatft';
import UnitCost from '@shared-components/unit-cost/UnitCost';

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

  // Normalize apiName to championKey format (lowercase, remove prefixes)
  const normalizeToChampionKey = (apiName: string): string => {
    // Remove common prefixes like "TFT15_", "TFT_", etc.
    let normalized = apiName.replace(/^TFT\d*_?/i, '');
    // Convert to lowercase
    normalized = normalized.toLowerCase();
    console.log('🔄 Normalize:', {apiName, normalized});
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

  const renderUnitItem = ({item}: {item: ITftUnit}) => {
    const championKey = normalizeToChampionKey(item.apiName);
    const isSelected = selectedUnits.includes(championKey);
    const avatarUrl = getUnitAvatarUrl(item.apiName, 64) || item.icon || '';

    return (
      <RNBounceable
        onPress={() => toggleUnit(item.apiName)}
        style={[
          styles.unitItem,
          isSelected && styles.unitItemSelected,
        ]}>
        <View style={styles.unitItemContent}>
          <View style={styles.unitAvatarContainer}>
            {avatarUrl ? (
              <Image
                source={{uri: avatarUrl}}
                style={styles.unitAvatar}
              />
            ) : (
              <View style={[styles.unitAvatar, styles.unitAvatarPlaceholder]} />
            )}
            {item.cost && (
              <View style={styles.costBadge}>
                <UnitCost cost={item.cost} size={16} />
              </View>
            )}
          </View>
          <Text
            style={[
              styles.unitName,
              isSelected && styles.unitNameSelected,
            ]}
            numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        {isSelected && (
          <Icon
            name="checkmark-circle"
            type={IconType.Ionicons}
            color={colors.primary}
            size={24}
          />
        )}
      </RNBounceable>
    );
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
              placeholder="Search units..."
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
                {selectedUnits.length} unit{selectedUnits.length > 1 ? 's' : ''} selected
              </Text>
              <TouchableOpacity onPress={handleClear}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Units list */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text color={colors.placeholder}>Loading units...</Text>
            </View>
          ) : (
            <FlatList
              data={units || []}
              renderItem={renderUnitItem}
              keyExtractor={item => String(item.id)}
              contentContainerStyle={styles.unitsList}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text color={colors.placeholder}>
                    {searchQuery ? 'No units found' : 'No units available'}
                  </Text>
                </View>
              }
            />
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
    unitItem: ViewStyle;
    unitItemSelected: ViewStyle;
    unitItemContent: ViewStyle;
    unitAvatarContainer: ViewStyle;
    unitAvatar: ImageStyle;
    unitAvatarPlaceholder: ViewStyle;
    costBadge: ViewStyle;
    unitName: TextStyle;
    unitNameSelected: TextStyle;
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
      paddingHorizontal: 12,
      paddingTop: 8,
    },
    unitItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      margin: 4,
      borderRadius: 12,
      backgroundColor: colors.background,
      borderWidth: 2,
      borderColor: colors.border,
    },
    unitItemSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '15',
    },
    unitItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    unitAvatarContainer: {
      position: 'relative',
      marginRight: 12,
    },
    unitAvatar: {
      width: 48,
      height: 48,
      borderRadius: 8,
    },
    unitAvatarPlaceholder: {
      backgroundColor: colors.border,
    },
    costBadge: {
      position: 'absolute',
      bottom: -4,
      right: -4,
    },
    unitName: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    unitNameSelected: {
      color: colors.primary,
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

