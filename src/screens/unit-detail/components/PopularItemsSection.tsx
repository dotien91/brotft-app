import React, {useMemo, useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from '@react-navigation/native';
import createStyles from './PopularItemsSection.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTftItemByApiName} from '@services/api/hooks/listQueryHooks';
import {getItemIconUrlFromPath} from '../../../utils/metatft';
import {translations} from '../../../shared/localization';
import * as NavigationService from 'react-navigation-helpers';
import {SCREENS} from '@shared-constants';
import useStore, {StoreState} from '@services/zustand/store';

interface PopularItemsSectionProps {
  popularItems: string[];
}

const PopularItemsSection: React.FC<PopularItemsSectionProps> = ({
  popularItems,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state: StoreState) => state.language);

  // Update translations when language changes
  useEffect(() => {
    if (language && translations.getLanguage() !== language) {
      translations.setLanguage(language);
    }
  }, [language]);

  if (!popularItems || popularItems.length === 0) {
    return null;
  }

  const handleItemPress = (itemId?: string) => {
    if (itemId) {
      NavigationService.push(SCREENS.ITEM_DETAIL, {itemId: String(itemId)});
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 bold color={colors.text} style={styles.sectionTitle}>
        {translations.popularItems || 'Popular Items'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.itemsContainer}>
        {popularItems.map((itemApiName, index) => {
          return (
            <PopularItemCard
              key={`popular-item-${itemApiName}-${index}`}
              itemApiName={itemApiName}
              onPress={handleItemPress}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

interface PopularItemCardProps {
  itemApiName: string;
  onPress: (itemId?: string) => void;
}

const PopularItemCard: React.FC<PopularItemCardProps> = ({
  itemApiName,
  onPress,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    data: item,
    isLoading,
  } = useTftItemByApiName(itemApiName);

  const itemIcon = useMemo(() => {
    if (!itemApiName) return '';
    return getItemIconUrlFromPath(null, itemApiName);
  }, [itemApiName]);

  // Get components from item
  const components = useMemo(() => {
    return item?.composition || [];
  }, [item?.composition]);

  // Get component image URL
  const getComponentImageUrl = (component: string) => {
    return `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/${component}.png`;
  };

  if (isLoading || !item) {
    // Show placeholder while loading
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemColumn}>
          <View style={[styles.itemIconContainer, {backgroundColor: colors.card}]}>
            {itemIcon ? (
              <FastImage
                source={{uri: itemIcon, priority: FastImage.priority.normal}}
                style={styles.itemIcon}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.itemCard}>
      <RNBounceable
        style={styles.itemColumn}
        onPress={() => onPress(item?.id)}>
        {/* Main item */}
        <View style={[styles.itemIconContainer, {backgroundColor: colors.card}]}>
          <FastImage
            source={{uri: itemIcon, priority: FastImage.priority.normal}}
            style={styles.itemIcon}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        
        {/* Components below main item */}
        {components.length > 0 && (
          <View style={styles.componentsRow}>
            {components.slice(0, 2).map((component: string, compIdx: number) => (
              <View key={compIdx} style={[styles.componentItem, {backgroundColor: colors.card}]}>
                <FastImage
                  source={{uri: getComponentImageUrl(component), priority: FastImage.priority.normal}}
                  style={styles.componentIcon}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </View>
            ))}
          </View>
        )}
      </RNBounceable>
    </View>
  );
};

export default PopularItemsSection;
