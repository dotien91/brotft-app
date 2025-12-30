import React, {useMemo} from 'react';
import {View, Image, ScrollView, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './ChampionDetailScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useChampionById} from '@services/api/hooks/listQueryHooks';
import {SCREENS, API_BASE_URL} from '@shared-constants';
import type {ITrait} from '@services/models/trait';
import Hexagon from '@screens/detail/components/Hexagon';
import BackButton from '@shared-components/back-button/BackButton';
import {translations} from '../../shared/localization';

interface ChampionDetailScreenProps {
  route?: {
    params?: {
      championId?: string;
    };
  };
}

const ChampionDetailScreen: React.FC<ChampionDetailScreenProps> = ({route: routeProp}) => {
  const theme = useTheme();
  const route = useRoute();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const championId =
    (routeProp?.params?.championId ||
      (route?.params as any)?.championId) as string;

  const {
    data: champion,
    isLoading,
    isError,
    error,
    refetch,
  } = useChampionById(championId || '');


  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.loadingText}>
        Loading champion...
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Icon
        name="alert-circle"
        type={IconType.Ionicons}
        color={colors.danger}
        size={48}
      />
      <Text h4 color={colors.danger} style={styles.errorText}>
        {translations.errorLoadingChampion}
      </Text>
      <Text color={colors.placeholder} style={styles.errorDescription}>
        {error?.message || translations.somethingWentWrong}
      </Text>
      <RNBounceable style={styles.retryButton} onPress={() => refetch()}>
        <Text color={colors.white} bold>
          {translations.retry}
        </Text>
      </RNBounceable>
    </View>
  );

  const renderTraits = () => {
    const displayTraits = champion?.traitDetails && champion.traitDetails.length > 0
      ? champion.traitDetails
      : champion?.traits || [];
    
    if (!displayTraits || displayTraits.length === 0) return null;

    const isTraitObject = (trait: string | ITrait): trait is ITrait => {
      return typeof trait === 'object' && trait !== null && 'name' in trait;
    };

    const handleTraitPress = (trait: string | ITrait) => {
      if (isTraitObject(trait)) {
        NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId: trait.id});
      }
    };

    const getTraitName = (trait: string | ITrait): string => {
      if (typeof trait === 'string') return trait;
      if (isTraitObject(trait)) return trait.name;
      return String(trait);
    };

    return displayTraits.map((trait, index) => {
      const isTraitDetail = champion?.traitDetails && champion.traitDetails.length > 0;
      const traitObj = isTraitDetail ? (trait as ITrait) : null;
      const traitName = traitObj 
        ? traitObj.name 
        : getTraitName(trait as string | ITrait);

      return (
        <RNBounceable
          key={traitObj ? traitObj.id : index}
          onPress={() => handleTraitPress(trait as string | ITrait)}
          disabled={!traitObj}
          style={styles.traitBadge}>
          <Icon
            name="shield"
            type={IconType.Ionicons}
            color={colors.primary}
            size={16}
          />
          <Text style={styles.traitText}>{traitName}</Text>
        </RNBounceable>
      );
    });
  };

  const renderContent = () => {
    if (isLoading && !champion) {
      return renderLoading();
    }

    if (isError || !champion) {
      return renderError();
    }

    // Get champion image URL from metatft.com
    const getChampionImageUrl = () => {
      // Try API image first
      if (champion.image?.path) {
        if (champion.image.path.startsWith('http')) {
          return champion.image.path;
        }
        if (champion.image.path.startsWith('/')) {
          return `${API_BASE_URL}${champion.image.path}`;
        }
      }
      
      // Try imageUrl
      if (champion.imageUrl) {
        return champion.imageUrl;
      }
      
      // Use metatft.com for avatar (48x48)
      const championKey = champion.key || champion.name?.toLowerCase() || '';
      const formattedKey = championKey.startsWith('tft') ? championKey : `tft15_${championKey.toLowerCase()}`;
      return `https://cdn.metatft.com/cdn-cgi/image/width=48,height=48,format=auto/https://cdn.metatft.com/file/metatft/champions/${formattedKey}.png`;
    };

    const imageUri = getChampionImageUrl();
    
    // Get splash art for background from metatft.com (256x152)
    const getSplashArt = () => {
      const championKey = champion.key || champion.name?.toLowerCase() || '';
      const formattedKey = championKey.startsWith('tft') ? championKey : `tft15_${championKey.toLowerCase()}`;
      return `https://cdn.metatft.com/cdn-cgi/image/width=256,height=152,format=auto/https://cdn.metatft.com/file/metatft/championsplashes/${formattedKey}.png`;
    };
    
    const splashUri = getSplashArt();

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Hero Section with overlay */}
        <View style={styles.heroSection}>
          <Image
            source={{uri: splashUri}}
            style={styles.heroImage}
            resizeMode="cover"
            defaultSource={require('@assets/splash/splash.png')}
          />
          <View style={styles.heroOverlay} />
          
          {/* Champion info overlay */}
          <View style={styles.heroContent}>
            <View style={styles.championHeader}>
              <View style={styles.championAvatarContainer}>
                <Hexagon 
                  size={70} 
                  backgroundColor="#252836" 
                  borderColor="#3a3d4a" 
                  borderWidth={2}
                  imageUri={imageUri}
                />
              </View>
              <View style={styles.championInfo}>
                <Text h1 bold color={colors.text} style={styles.championName}>
                  {champion.name}
                </Text>
                <View style={styles.traitsRow}>
                  {renderTraits()}
                </View>
                <View style={styles.costBadgeContainer}>
                  <Icon
                    name="diamond"
                    type={IconType.FontAwesome}
                    color={colors.primary}
                    size={16}
                  />
                  <Text style={styles.costBadgeText}>{champion.cost ?? '---'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Thứ hạng Tier</Text>
              <Text style={styles.statValue}>
                {(champion as any)?.tierRank ? `#${(champion as any).tierRank}` : '---'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Hạng 1</Text>
              <Text style={styles.statValue}>
                {(champion as any)?.firstPlaceRate != null ? `${(champion as any).firstPlaceRate}%` : '---'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Tỉ lệ Top 4</Text>
              <Text style={styles.statValue}>
                {(champion as any)?.top4Rate != null ? `${(champion as any).top4Rate}%` : '---'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Thứ hạng Trung bình</Text>
              <Text style={styles.statValue}>
                {(champion as any)?.averageRank != null ? (champion as any).averageRank.toLocaleString() : '---'}
              </Text>
            </View>
          </View>
        </View>

        {/* Champion Stats */}
        <View style={styles.championStatsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statItemHeader}>
                <Icon name="heart" type={IconType.Ionicons} color="#4ade80" size={16} />
                <Text style={styles.statItemLabel}>Máu</Text>
              </View>
              <Text style={styles.statItemValue}>
                {champion.health ? `${champion.health} / ${Math.floor(champion.health * 1.8)} / ${Math.floor(champion.health * 3.24)}` : '---'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statItemHeader}>
                <Icon name="flash" type={IconType.Ionicons} color="#fbbf24" size={16} />
                <Text style={styles.statItemLabel}>Tốc Độ Đánh</Text>
              </View>
              <Text style={styles.statItemValue}>{champion.attackSpeed ?? '---'}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statItemHeader}>
                <Icon name="fitness" type={IconType.Ionicons} color="#fb923c" size={16} />
                <Text style={styles.statItemLabel}>Sức Mạnh Công Kích</Text>
              </View>
              <Text style={styles.statItemValue}>
                {champion.attackDamage ? `${champion.attackDamage} / ${Math.floor(champion.attackDamage * 1.5)} / ${Math.floor(champion.attackDamage * 2.25)}` : '---'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statItemHeader}>
                <Icon name="shield" type={IconType.Ionicons} color="#fb7185" size={16} />
                <Text style={styles.statItemLabel}>Giáp</Text>
              </View>
              <Text style={styles.statItemValue}>{champion.armor ?? '---'}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statItemHeader}>
                <Icon name="sparkles" type={IconType.Ionicons} color="#c084fc" size={16} />
                <Text style={styles.statItemLabel}>DPS</Text>
              </View>
              <Text style={styles.statItemValue}>
                {champion.attackDamage ? `${Math.floor(champion.attackDamage * 0.75)} / ${Math.floor(champion.attackDamage * 1.13)} / ${Math.floor(champion.attackDamage * 1.69)}` : '---'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statItemHeader}>
                <Icon name="color-wand" type={IconType.Ionicons} color="#ec4899" size={16} />
                <Text style={styles.statItemLabel}>Kháng Phép</Text>
              </View>
              <Text style={styles.statItemValue}>{champion.magicResist ?? '---'}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statItemHeader}>
                <Icon name="radio-button-on" type={IconType.Ionicons} color="#60a5fa" size={16} />
                <Text style={styles.statItemLabel}>Tầm Đánh</Text>
              </View>
              <Text style={styles.statItemValue}>{champion.attackRange ? '■'.repeat(champion.attackRange) : '---'}</Text>
            </View>
          </View>
        </View>

        {/* Ability Section */}
        <View style={styles.abilitySection}>
          <Text h3 bold color={colors.text} style={styles.sectionTitle}>
            Kỹ Năng
          </Text>
          
          {champion.abilityName && (
            <View style={styles.abilityCard}>
              <View style={styles.abilityHeader}>
                <View style={styles.abilityIconContainer}>
                  {imageUri && (
                    <Image
                      source={{uri: imageUri}}
                      style={styles.abilityIcon}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <View style={styles.abilityInfo}>
                  <Text style={styles.abilityName}>{champion.abilityName}</Text>
                  <View style={styles.abilityMeta}>
                    <Icon name="water" type={IconType.Ionicons} color="#60a5fa" size={14} />
                    <Text style={styles.abilityMetaText}>
                      {champion.startingMana != null && champion.maxMana != null 
                        ? `${champion.startingMana} / ${champion.maxMana}` 
                        : '---'}
                    </Text>
                  </View>
                </View>
              </View>
              
              {champion.abilityDescription && (
                <Text style={styles.abilityDescription}>
                  {champion.abilityDescription}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Augments Section */}
        <View style={styles.augmentsSection}>
          <Text h3 bold color={colors.text} style={styles.sectionTitle}>
            {translations.suggestedItems}
          </Text>
          
          <View style={styles.augmentCard}>
            <View style={styles.augmentHeader}>
              <View style={styles.augmentIconContainer}>
                <Image
                  source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_GuinsoosRageblade.png'}}
                  style={styles.augmentIcon}
                />
                <View style={styles.augmentItemBadges}>
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_RecurveBow.png'}}
                    style={styles.augmentItemBadge}
                  />
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_NeedlesslyLargeRod.png'}}
                    style={styles.augmentItemBadge}
                  />
                </View>
              </View>
              <View style={styles.augmentInfo}>
                <Text style={styles.augmentName}>Vỡ Cực Kiếm</Text>
                <View style={styles.augmentStats}>
                  <View style={styles.augmentStat}>
                    <Icon name="fitness" type={IconType.Ionicons} color="#fb923c" size={14} />
                    <Text style={styles.augmentStatText}>+35%</Text>
                  </View>
                  <View style={styles.augmentStat}>
                    <Icon name="flash" type={IconType.Ionicons} color="#f87171" size={14} />
                    <Text style={styles.augmentStatText}>+35%</Text>
                  </View>
                </View>
                <Text style={styles.augmentDescription}>
                  Kỹ năng có thể gây chí mạng.
                </Text>
                <Text style={styles.augmentNote}>
                  Nếu kỹ năng của tướng sở hữu đã có thể chí mạng, nhận 10% Sát Thương Chí Mạng.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.augmentCard}>
            <View style={styles.augmentHeader}>
              <View style={styles.augmentIconContainer}>
                <Image
                  source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_IonicSpark.png'}}
                  style={styles.augmentIcon}
                />
                <View style={styles.augmentItemBadges}>
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_NeedlesslyLargeRod.png'}}
                    style={styles.augmentItemBadge}
                  />
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_NegatronCloak.png'}}
                    style={styles.augmentItemBadge}
                  />
                </View>
              </View>
              <View style={styles.augmentInfo}>
                <Text style={styles.augmentName}>Ngọn Giáo Shojin</Text>
                <View style={styles.augmentStats}>
                  <View style={styles.augmentStat}>
                    <Icon name="fitness" type={IconType.Ionicons} color="#fb923c" size={14} />
                    <Text style={styles.augmentStatText}>+15%</Text>
                  </View>
                  <View style={styles.augmentStat}>
                    <Icon name="water" type={IconType.Ionicons} color="#60a5fa" size={14} />
                    <Text style={styles.augmentStatText}>+10</Text>
                  </View>
                </View>
                <Text style={styles.augmentDescription}>
                  Các đòn đánh giúp hồi lại 5 Năng Lượng.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.augmentCard}>
            <View style={styles.augmentHeader}>
              <View style={styles.augmentIconContainer}>
                <Image
                  source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_StatikkShiv.png'}}
                  style={styles.augmentIcon}
                />
                <View style={styles.augmentItemBadges}>
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_RecurveBow.png'}}
                    style={styles.augmentItemBadge}
                  />
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_TearOfTheGoddess.png'}}
                    style={styles.augmentItemBadge}
                  />
                </View>
              </View>
              <View style={styles.augmentInfo}>
                <Text style={styles.augmentName}>Diệt Không Lồ</Text>
                <View style={styles.augmentStats}>
                  <View style={styles.augmentStat}>
                    <Icon name="fitness" type={IconType.Ionicons} color="#fb923c" size={14} />
                    <Text style={styles.augmentStatText}>+20%</Text>
                  </View>
                  <View style={styles.augmentStat}>
                    <Icon name="water" type={IconType.Ionicons} color="#60a5fa" size={14} />
                    <Text style={styles.augmentStatText}>+20</Text>
                  </View>
                  <View style={styles.augmentStat}>
                    <Icon name="flash" type={IconType.Ionicons} color="#fbbf24" size={14} />
                    <Text style={styles.augmentStatText}>+15%</Text>
                  </View>
                </View>
                <Text style={styles.augmentDescription}>
                  Nhận thêm 15% Khuếch Đại Sát Thương trước Tướng Bộ Đơn.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.augmentCard}>
            <View style={styles.augmentHeader}>
              <View style={styles.augmentIconContainer}>
                <Image
                  source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_Bloodthirster.png'}}
                  style={styles.augmentIcon}
                />
                <View style={styles.augmentItemBadges}>
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_BFSword.png'}}
                    style={styles.augmentItemBadge}
                  />
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_BFSword.png'}}
                    style={styles.augmentItemBadge}
                  />
                </View>
              </View>
              <View style={styles.augmentInfo}>
                <Text style={styles.augmentName}>Kiếm Từ Thần</Text>
                <View style={styles.augmentStats}>
                  <View style={styles.augmentStat}>
                    <Icon name="fitness" type={IconType.Ionicons} color="#fb923c" size={14} />
                    <Text style={styles.augmentStatText}>+55%</Text>
                  </View>
                </View>
                <Text style={styles.augmentDescription}>
                  Đem tới sự yên bình vĩnh hằng cho người mang - và cả những kẻ phải đối đầu với nó.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.augmentCard}>
            <View style={styles.augmentHeader}>
              <View style={styles.augmentIconContainer}>
                <Image
                  source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_GuinsoosRageblade.png'}}
                  style={styles.augmentIcon}
                />
                <View style={styles.augmentItemBadges}>
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_RecurveBow.png'}}
                    style={styles.augmentItemBadge}
                  />
                  <Image
                    source={{uri: 'https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_NeedlesslyLargeRod.png'}}
                    style={styles.augmentItemBadge}
                  />
                </View>
              </View>
              <View style={styles.augmentInfo}>
                <Text style={styles.augmentName}>Cuồng Đao Guinsoo</Text>
                <View style={styles.augmentStats}>
                  <View style={styles.augmentStat}>
                    <Icon name="water" type={IconType.Ionicons} color="#60a5fa" size={14} />
                    <Text style={styles.augmentStatText}>+10</Text>
                  </View>
                  <View style={styles.augmentStat}>
                    <Icon name="flash" type={IconType.Ionicons} color="#fbbf24" size={14} />
                    <Text style={styles.augmentStatText}>+10%</Text>
                  </View>
                </View>
                <Text style={styles.augmentDescription}>
                  Nhận 7% Tốc Độ Đánh cộng dồn mỗi giây.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <View style={styles.header}>
          <BackButton />
        </View>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
};

export default ChampionDetailScreen;
