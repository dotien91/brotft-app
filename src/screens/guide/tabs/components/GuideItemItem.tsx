import React, {useMemo, useEffect, useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import type {ITftItem} from '@services/models/tft-item';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './GuideItemItem.style';
import useStore from '@services/zustand/store';
import {getCachedItems} from '@services/api/data';
import {getItemIconImageSource} from '../../../../utils/item-images';

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

  const {name, icon, composition, apiName} = data;

  // --- LOGIC MỚI: Truy vấn O(1) từ Object Map ---
  useEffect(() => {
    console.log('GuideItemItem: useEffect', apiName, name, language);
    // Safety check: Cần ít nhất apiName hoặc name để làm key tra cứu
    if ((!apiName && !name) || !language) {
      setLocalizedName(null);
      setLocalizedComposition(null);
      return;
    }

    try {
      const itemsMap = getCachedItems(language);
      console.log('itemsMap', itemsMap);
      if (Object.keys(itemsMap).length === 0) {
        setLocalizedName(null);
        setLocalizedComposition(null);
        return;
      }
      const localizedItem = itemsMap[apiName] || (name ? itemsMap[name] : null);
console.log('localizedItem', localizedItem);
      if (localizedItem) {
        setLocalizedName(localizedItem.name || null);
        setLocalizedComposition(
          Array.isArray(localizedItem.composition) ? localizedItem.composition : null
        );
      } else {
        // Không tìm thấy trong map -> reset về null
        setLocalizedName(null);
        setLocalizedComposition(null);
      }
    } catch (error) {
      console.warn('[GuideItemItem] Error parsing localized data:', error);
      setLocalizedName(null);
      setLocalizedComposition(null);
    }
  }, [apiName, name, language]);

  const displayComponents = localizedComposition ?? composition ?? [];

  // Get item image source (local only logic)
  const imageSource = getItemIconImageSource(icon, apiName, 48);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Item Icon */}
      <View style={styles.iconContainer}>
        {imageSource.local ? (
          <Image
            source={imageSource.local}
            style={styles.icon}
            resizeMode="cover"
            // onError handler cũ có thể giữ hoặc bỏ tùy logic deleteTftItem của bạn
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
  // So sánh apiName/name thay vì id để ổn định hơn
  return (
    prevProps.data?.apiName === nextProps.data?.apiName &&
    prevProps.data?.name === nextProps.data?.name
  );
});