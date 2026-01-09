import React, {useMemo, useEffect, useState} from 'react';
import {View, ScrollView, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import createStyles from './PopularItemsSection.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTftItemByApiName} from '@services/api/hooks/listQueryHooks';
import {getItemIconImageSource} from '../../../utils/item-images';
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

  const imageSource = useMemo(() => {
    if (!itemApiName) return {local: null, uri: ''};
    return getItemIconImageSource(null, itemApiName, 48);
  }, [itemApiName]);
  // Only use local image, no URL fallback
  const itemIcon = imageSource.local;

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
              <Image
                source={itemIcon}
                style={styles.itemIcon}
                resizeMode="contain"
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
          {itemIcon ? (
            <Image
              source={itemIcon}
              style={styles.itemIcon}
              resizeMode="contain"
            />
          ) : null}
        </View>
        
        {/* Components below main item */}
        {components.length > 0 && (
          <View style={styles.componentsRow}>
            {components.slice(0, 2).map((component: string, compIdx: number) => (
              <View key={compIdx} style={[styles.componentItem, {backgroundColor: colors.card}]}>
                <Image
                  source={{uri: getComponentImageUrl(component)}}
                  style={styles.componentIcon}
                  resizeMode="contain"
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
