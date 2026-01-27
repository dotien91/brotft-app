import React, {useMemo, useState, useEffect} from 'react';
import {View, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import Hexagon from './Hexagon';
import UnitCostBadge from './UnitCostBadge';
import {getTraitIconUrl} from '../../../utils/metatft';
import getUnitAvatar from '../../../utils/unit-avatar';
import {getItemIconImageSource} from '../../../utils/item-images';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import useStore from '@services/zustand/store';
import {SCREENS} from '@shared-constants';
import {translations} from '../../../shared/localization';
import {getTftItemByApiName} from '@services/api/tft-items';
import createStyles from '../DetailScreen.style';

type TeamUnitItem = {
  id?: string;
  name?: string;
  icon: string;
  iconSource?: any; // Local image source (require())
  apiName?: string;
};

type TeamUnit = {
  id: string;
  name: string;
  cost: number;
  star?: number;
  carry?: boolean;
  need3Star?: boolean;
  needUnlock?: boolean;
  position: {
    row: number;
    col: number;
  };
  image: string;
  items?: TeamUnitItem[];
  championKey?: string;
};

type TeamCarry = {
  championId: string;
  championName: string;
  role: string;
  image: string;
  items: TeamUnitItem[];
};

type TeamComposition = {
  id: string;
  name: string;
  plan: string;
  difficulty: string;
  tier?: string;
  metaDescription: string;
  isLateGame: boolean;
  boardSize: {
    rows: number;
    cols: number;
  };
  units: TeamUnit[];
  carryItems: TeamCarry[];
  augments?: Array<{
    name: string;
    tier: number;
  }>;
  notes: string[];
};

interface CarryUnitsSectionProps {
  team: TeamComposition;
  getUnitCostBorderColor: (cost?: number) => string;
}

// ItemsGrid component (moved from DetailScreen)
const ItemsGrid: React.FC<{items: TeamUnitItem[]}> = ({items}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [itemsDetails, setItemsDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchItemsDetails = async () => {
      const details = await Promise.all(
        items.map(item => {
          // Get local image source for item
          const imageSource = getItemIconImageSource(null, item.apiName, 48);
          if (imageSource.local && !item.iconSource) {
            item.iconSource = imageSource.local;
          }
          
          return item.apiName
            ? getTftItemByApiName(item.apiName)
                .then((data: any) => ({item, data}))
                .catch(() => ({item, data: null}))
            : Promise.resolve({item, data: null});
        })
      );
      setItemsDetails(details);
    };
    fetchItemsDetails();
  }, [items]);

  const handleItemPress = (item: TeamUnitItem, itemDetail: any) => {
    console.log("object1111", item, itemDetail);
    // Try to get itemId from itemDetail.data first, then from item.id
    const itemId = item?.apiName
    if (itemId) {
      NavigationService.push(SCREENS.ITEM_DETAIL, {apiName: String(itemId)});
    }
  };

  return (
    <View style={styles.itemsGrid}>
      {items.slice(0, 3).map((item, idx) => {
        const itemDetail = itemsDetails[idx];
        const components = itemDetail?.data?.composition || [];
        
        return (
          <View key={idx} style={styles.itemsGridColumn}>
            {/* Main item */}
              <RNBounceable 
              onPress={() => handleItemPress(item, itemDetail)}
              style={styles.itemsGridMainItem}>
              <Image 
                source={item.iconSource || null} 
                style={styles.itemsGridMainItemIcon} 
                resizeMode="contain" 
              />
            </RNBounceable>
            {/* Components below main item */}
            {components.length > 0 && (
              <View style={styles.itemsGridComponentsRow}>
                {components.slice(0, 2).map((component: string, compIdx: number) => (
                  <View key={compIdx} style={styles.itemsGridComponentItem}>
                    <Image
                      source={{
                        uri: `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/${component}.png`,
                      }}
                      style={styles.itemsGridComponentIcon}
                      resizeMode="contain"
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const CarryUnitsSection: React.FC<CarryUnitsSectionProps> = ({team, getUnitCostBorderColor}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);

  // Filter units that have items
  const unitsWithItems = useMemo(() => {
    if (!team || !team.units) return [];
    
    return team.units.filter(unit => unit.items && unit.items.length > 0);
  }, [team]);

  // Get traits for each unit from LocalStorage
  const getUnitTraits = (unit: TeamUnit): Array<{name: string; apiName?: string}> => {
    const championKey = unit.championKey;
    const unitName = unit.name;
    
    if (!championKey || !language) {
      return [];
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const unitsKey = `data_units_${locale}`;
      const unitsDataString = LocalStorage.getString(unitsKey);
      
      if (!unitsDataString) {
        return [];
      }

      const unitsData = JSON.parse(unitsDataString);
      let localizedUnit: any = null;

      // Handle both array and object formats
      if (Array.isArray(unitsData)) {
        localizedUnit = unitsData.find((localUnit: any) => {
          if (championKey && localUnit.apiName === championKey) {
            return true;
          }
          if (unitName && localUnit.name) {
            return unitName.toLowerCase() === localUnit.name.toLowerCase();
          }
          return false;
        });
      } else if (typeof unitsData === 'object' && unitsData !== null) {
        if (championKey && unitsData[championKey]) {
          localizedUnit = unitsData[championKey];
        } else {
          const unitsArray = Object.values(unitsData) as any[];
          localizedUnit = unitsArray.find((localUnit: any) => {
            if (championKey && localUnit.apiName === championKey) {
              return true;
            }
            if (unitName && localUnit.name) {
              return unitName.toLowerCase() === localUnit.name.toLowerCase();
            }
            return false;
          });
        }
      }

      if (localizedUnit && localizedUnit.traits) {
        const traits = Array.isArray(localizedUnit.traits) ? localizedUnit.traits : [];
        
        // Get trait details from local storage to get apiName
        const traitsKey = `data_traits_${locale}`;
        const traitsDataString = LocalStorage.getString(traitsKey);
        let traitsData: any = null;
        if (traitsDataString) {
          traitsData = JSON.parse(traitsDataString);
        }

        return traits.map((traitName: string) => {
          let traitDetail: any = null;
          
          // Find trait detail from local storage
          if (traitsData) {
            if (Array.isArray(traitsData)) {
              traitDetail = traitsData.find((trait: any) => 
                trait.name === traitName || trait.apiName === traitName
              );
            } else if (typeof traitsData === 'object' && traitsData !== null) {
              traitDetail = Object.values(traitsData).find((trait: any) => 
                trait.name === traitName || trait.apiName === traitName
              );
            }
          }

          return {
            name: traitName,
            apiName: traitDetail?.apiName || traitName,
          };
        });
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  if (unitsWithItems.length === 0) {
    return null;
  }
console.log("unitsWithItems", unitsWithItems);
  return (
    <View style={styles.carryCard}>
      <Text style={styles.sectionLabel}>{translations.carryUnitsSection}</Text>
      {unitsWithItems.map((unit, unitIndex) => {
        const unitTraits = getUnitTraits(unit);
        const isLast = unitIndex === unitsWithItems.length - 1;
        const handleUnitPress = () => {
          if (unit.championKey) {
            NavigationService.push(SCREENS.UNIT_DETAIL, {unitApiName: unit.championKey});
          } else if (unit.id) {
            NavigationService.push(SCREENS.UNIT_DETAIL, {unitId: unit.id});
          }
        };

        const unitName = unit.name;
        const unitCost = unit.cost;

        // Get local image source for unit
        const championKey = 'championKey' in unit ? unit.championKey : ('championId' in unit ? unit.championId : null);
        const championKeyString = championKey ? String(championKey) : '';
        const avatar = getUnitAvatar(championKeyString, 64);
        const unitImageUri = avatar.local ? undefined : avatar.uri;

        return (
          <RNBounceable 
            key={'id' in unit ? unit.id : unitIndex} 
            style={[styles.carryRowNew, isLast && styles.carryRowLast]}
            onPress={handleUnitPress}>
            {/* Left: Champion hexagon */}
            <View style={styles.carryChampionLeft}>
              <View style={styles.carryHexagonWrapper}>
                <View style={styles.carryHexagonBorder}>
                  <Hexagon
                    size={52}
                    backgroundColor="transparent"
                    borderColor={getUnitCostBorderColor(unitCost)}
                    borderWidth={1}
                  />
                </View>
                <View style={styles.carryHexagonInner}>
                  <Hexagon
                    size={48}
                    backgroundColor={colors.card}
                    borderColor={getUnitCostBorderColor(unitCost)}
                    borderWidth={2}
                    imageUri={unitImageUri}
                    imageSource={avatar.local}
                  />
                </View>
                {/* Champion name at bottom absolute */}
                <View style={styles.carryNameBelowContainer}>
                  <Text style={styles.carryNameBelow} numberOfLines={1}>{unitName}</Text>
                </View>
              </View>
              {/* Cost badge */}
              {!!unitCost && <UnitCostBadge cost={unitCost} />}
            </View>
            
            {/* Right: Traits and items */}
            <View style={styles.carryInfoRight}>
              {/* Traits */}
              {unitTraits.length > 0 && (
                <View style={styles.traitsRow}>
                  {unitTraits.slice(0, 2).map((trait, idx) => {
                    const traitIconUrl = getTraitIconUrl(trait.apiName || trait.name);
                    return (
                      <View key={idx} style={styles.traitBadge}>
                        {traitIconUrl ? (
                          <Image
                            source={{uri: traitIconUrl}}
                            style={styles.traitIcon}
                            resizeMode="contain"
                          />
                        ) : null}
                        <Text style={styles.traitText}>{trait.name}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
              
              {/* Items grid */}
              {unit.items && unit.items.length > 0 && (
                <ItemsGrid items={unit.items} />
              )}
            </View>
          </RNBounceable>
        );
      })}
    </View>
  );
};

export default CarryUnitsSection;

