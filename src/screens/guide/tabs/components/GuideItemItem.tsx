import React, {useMemo, useEffect, useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import type {ITftItem} from '@services/models/tft-item';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './GuideItemItem.style';
import useStore from '@services/zustand/store';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import {getItemIconImageSource} from '../../../../utils/item-images';
import {translations} from '../../../../shared/localization';

interface GuideItemItemProps {
  data: ITftItem;
  onPress: () => void;
}

const GuideItemItem: React.FC<GuideItemItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const language = useStore((state) => state.language);
  const [localizedName, setLocalizedName] = useState<string | null>(null);
  const [localizedComposition, setLocalizedComposition] = useState<string[] | null>(null);

  const {name, icon, composition} = data;

  // Get localized name from storage
  useEffect(() => {
    if (!data || !language) {
      setLocalizedName(null);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const itemsKey = `data_items_${locale}`;
      const itemsDataString = LocalStorage.getString(itemsKey);
      
      if (!itemsDataString) {
        setLocalizedName(null);
        return;
      }

      const itemsData = JSON.parse(itemsDataString);
      let localizedItem: any = null;

      // Handle both array and object formats
      if (Array.isArray(itemsData)) {
        // If it's an array, find the item
        localizedItem = itemsData.find((localItem: any) => {
          // Try to match by apiName first
          if (data.apiName && localItem.apiName === data.apiName) {
            return true;
          }
          // Fallback to name matching (case insensitive)
          if (data.name && localItem.name) {
            return data.name.toLowerCase() === localItem.name.toLowerCase();
          }
          // Try enName matching
          if (data.enName && localItem.enName) {
            return data.enName.toLowerCase() === localItem.enName.toLowerCase();
          }
          return false;
        });
      } else if (typeof itemsData === 'object' && itemsData !== null) {
        // If it's an object, try to find by apiName as key first
        if (data.apiName && itemsData[data.apiName]) {
          localizedItem = itemsData[data.apiName];
        } else {
          // Otherwise, search through object values
          const itemsArray = Object.values(itemsData) as any[];
          localizedItem = itemsArray.find((localItem: any) => {
            // Try to match by apiName first
            if (data.apiName && localItem.apiName === data.apiName) {
              return true;
            }
            // Fallback to name matching (case insensitive)
            if (data.name && localItem.name) {
              return data.name.toLowerCase() === localItem.name.toLowerCase();
            }
            // Try enName matching
            if (data.enName && localItem.enName) {
              return data.enName.toLowerCase() === localItem.enName.toLowerCase();
            }
            return false;
          });
        }
      }

      if (localizedItem) {
        setLocalizedName(localizedItem.name || null);
        setLocalizedComposition(
          localizedItem.composition && Array.isArray(localizedItem.composition)
            ? localizedItem.composition
            : null
        );
      } else {
        setLocalizedName(null);
        setLocalizedComposition(null);
      }
    } catch (error) {
      console.error('Error loading localized name:', error);
      setLocalizedName(null);
      setLocalizedComposition(null);
    }
  }, [data, language]);

  const displayComponents = localizedComposition ?? composition ?? [];

  // Get item image source (local only)
  const imageSource = getItemIconImageSource(icon, data.apiName, 48);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Item Icon */}
      <View style={styles.iconContainer}>
        {imageSource.local ? (
          <Image
            source={imageSource.local}
            style={styles.icon}
            resizeMode="cover"
            onError={() => {
              try {
                // await deleteTftItem(String(data.id));
              } catch (error) {
                console.error(`[GuideItemItem] Error deleting item ${data.id}:`, error);
              }
            }}
          />
        ) : null}
      </View>

      {/* Item Name + Công thức ghép */}
      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={1}>
          {localizedName || name || '---'}
        </Text>
        {displayComponents.length >= 1 && (
          <View style={styles.recipeSection}>
            <View style={styles.recipeRow}>
              {displayComponents.slice(0, 2).map((componentApiName, index) => {
                const compSource = getItemIconImageSource(null, componentApiName, 24);
                return (
                  <React.Fragment key={`${componentApiName}-${index}`}>
                    <View style={styles.componentIconWrap}>
                      {compSource.local ? (
                        <Image
                          source={compSource.local}
                          style={styles.componentIcon}
                          resizeMode="cover"
                        />
                      ) : null}
                    </View>
                    {index === 0 && displayComponents.length > 1 && (
                      <Text style={styles.recipePlus}>+</Text>
                    )}
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(GuideItemItem, (prevProps, nextProps) => {
  // Only re-render if data.id changes, ignore onPress changes
  return prevProps.data?.id === nextProps.data?.id;
});

