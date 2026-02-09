import React, {useMemo, useEffect, useState, useRef} from 'react';
import {View, ScrollView, Modal, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from '@shared-components/icon/Icon';
import createStyles from './ProfileScreen.style';
import Text from '@shared-components/text-wrapper/TextWrapper';
import useStore, {StoreState} from '@services/zustand/store';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as NavigationService from 'react-navigation-helpers';
import {translations} from '../../shared/localization';
import {queryClient} from '@services/api/react-query';
import {checkAndFetchDataByLocale} from '@services/api/data';
import ScreenHeader from '@shared-components/screen-header/ScreenHeader';
import {SCREENS} from '@shared-constants';
import LocalStorage from '@services/local-storage';

interface ProfileScreenProps {}

const languages = [
  {code: 'en', label: 'English', flag: '🇬🇧'},
  {code: 'vi', label: 'Vietnamese', flag: '🇻🇳'},
  {code: 'zh-CN', label: 'Chinese', flag: '🇨🇳'},
  {code: 'ja-JP', label: 'Japanese', flag: '🇯🇵'},
  {code: 'es-ES', label: 'Spanish', flag: '🇪🇸'},
];

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const language = useStore((state: StoreState) => state.language);
  const setLanguage = useStore((state: StoreState) => state.setLanguage);

  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const languageOptionRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] = useState({top: 0, left: 0, width: 0});
  const isChangingLanguageRef = useRef(false);

  // Update translations when language changes
  useEffect(() => {
    if (language && translations.getLanguage() !== language) {
      translations.setLanguage(language);
    }
  }, [language]);

  const handleLanguageChange = async (lang: string) => {
    if (lang === language) {
      setIsLanguageDropdownOpen(false);
      return;
    }
    if (isChangingLanguageRef.current) return;
    isChangingLanguageRef.current = true;
    setIsLanguageDropdownOpen(false);

    setLanguage(lang);
    translations.setLanguage(lang);

    const LANGUAGE_FIRST_LAUNCH_KEY = 'language_first_launch_set';
    LocalStorage.set(LANGUAGE_FIRST_LAUNCH_KEY, true);

    try {
      await checkAndFetchDataByLocale(lang);
      await queryClient.invalidateQueries();
    } catch (error) {
      // Don't block UI if API calls fail
    } finally {
      isChangingLanguageRef.current = false;
    }
  };

  const getCurrentLanguageLabel = () => {
    const currentLang = languages.find(lang => lang.code === language);
    if (currentLang) {
      if (currentLang.code === 'en') return `${currentLang.flag} ${translations.english}`;
      if (currentLang.code === 'vi') return `${currentLang.flag} ${translations.vietnamese}`;
      if (currentLang.code === 'zh-CN') return `${currentLang.flag} ${translations.chinese}`;
    }
    return `${languages[0].flag} ${translations.english}`;
  };

  const getLanguageLabel = (code: string) => {
    const lang = languages.find(l => l.code === code);
    if (!lang) return '';
    if (code === 'en') return `${lang.flag} ${translations.english}`;
    if (code === 'vi') return `${lang.flag} ${translations.vietnamese}`;
    if (code === 'zh-CN') return `${lang.flag} ${translations.chinese}`;
    return `${lang.flag} ${lang.label}`;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <ScreenHeader title={translations.settings} />

          {/* Appearance Section - Tạm ẩn */}
          {/* <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon
                name="color-palette"
                type={IconType.Ionicons}
                color={colors.primary}
                size={24}
              />
              <Text h3 color={colors.text} style={styles.sectionTitle}>
                {translations.appearance}
              </Text>
            </View>
            
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleThemeToggle}>
              <View style={styles.optionContent}>
                <View style={styles.optionLeft}>
                  <Icon
                    name={isDarkMode ? 'moon' : 'sunny'}
                    type={IconType.Ionicons}
                    color={colors.text}
                    size={20}
                  />
                  <Text color={colors.text} style={styles.optionText}>
                    {isDarkMode ? translations.darkMode : translations.lightMode}
                  </Text>
                </View>
                <View style={[styles.toggle, isDarkMode && styles.toggleActive]}>
                  <View style={[styles.toggleThumb, isDarkMode && styles.toggleThumbActive]} />
                </View>
              </View>
            </TouchableOpacity>
          </View> */}

          {/* Language Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon
                name="language"
                type={IconType.Ionicons}
                color={colors.primary}
                size={24}
              />
              <Text h3 color={colors.text} style={styles.sectionTitle}>
                {translations.language}
              </Text>
            </View>

            {/* Language Dropdown */}
            <View ref={languageOptionRef}>
            <RNBounceable
              style={styles.optionItem}
                onPress={() => {
                  languageOptionRef.current?.measure((x, y, width, height, pageX, pageY) => {
                    setDropdownPosition({
                      top: pageY + height,
                      left: pageX,
                      width: width,
                    });
                    setIsLanguageDropdownOpen(true);
                  });
                }}>
              <View style={styles.optionContent}>
                <Text color={colors.text} style={styles.optionText}>
                  {getCurrentLanguageLabel()}
                </Text>
                <Icon
                  name="chevron-down"
                  type={IconType.Ionicons}
                  color={colors.placeholder}
                  size={20}
                />
              </View>
            </RNBounceable>
            </View>

            {/* Language Dropdown Modal */}
            <Modal
              visible={isLanguageDropdownOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setIsLanguageDropdownOpen(false)}>
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setIsLanguageDropdownOpen(false)}>
                <View
                  style={[
                    styles.dropdownContainer,
                    {
                      position: 'absolute',
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      width: dropdownPosition.width || 300,
                    },
                  ]}
                  onStartShouldSetResponder={() => true}
                  onTouchEnd={(e) => e.stopPropagation()}>
                  {languages.map((lang) => (
                    <RNBounceable
                      key={lang.code}
                      style={[
                        styles.dropdownItem,
                        language === lang.code && styles.dropdownItemActive,
                      ]}
                      onPress={() => handleLanguageChange(lang.code)}>
                      <View style={styles.dropdownItemContent}>
                        <Text
                          color={language === lang.code ? colors.primary : colors.text}
                          style={styles.dropdownItemText}>
                          {getLanguageLabel(lang.code)}
                        </Text>
                        {language === lang.code && (
                          <Icon
                            name="checkmark-circle"
                            type={IconType.Ionicons}
                            color={colors.green}
                            size={24}
                          />
                        )}
                      </View>
                    </RNBounceable>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
          </View>

          {/* Legal Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon
                name="document-text"
                type={IconType.Ionicons}
                color={colors.primary}
                size={24}
              />
              <Text h3 color={colors.text} style={styles.sectionTitle}>
                {translations.legal}
              </Text>
            </View>

            <RNBounceable
              style={styles.optionItem}
              onPress={() => NavigationService.push(SCREENS.PRIVACY)}>
              <View style={styles.optionContent}>
                <View style={styles.optionLeft}>
                  <Icon
                    name="shield-checkmark"
                    type={IconType.Ionicons}
                    color={colors.text}
                    size={20}
                  />
                  <Text color={colors.text} style={styles.optionText}>
                    {translations.privacyPolicy}
                  </Text>
                </View>
                <Icon
                  name="chevron-forward"
                  type={IconType.Ionicons}
                  color={colors.placeholder}
                  size={20}
                />
              </View>
            </RNBounceable>

            <RNBounceable
              style={styles.optionItem}
              onPress={() => NavigationService.push(SCREENS.TERMS)}>
              <View style={styles.optionContent}>
                <View style={styles.optionLeft}>
                  <Icon
                    name="document-text"
                    type={IconType.Ionicons}
                    color={colors.text}
                    size={20}
                  />
                  <Text color={colors.text} style={styles.optionText}>
                    {translations.termsOfService}
                  </Text>
                </View>
                <Icon
                  name="chevron-forward"
                  type={IconType.Ionicons}
                  color={colors.placeholder}
                  size={20}
                />
              </View>
            </RNBounceable>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon
                name="chatbubble-ellipses"
                type={IconType.Ionicons}
                color={colors.primary}
                size={24}
              />
              <Text h3 color={colors.text} style={styles.sectionTitle}>
                {translations.support}
              </Text>
            </View>

            <RNBounceable
              style={styles.optionItem}
              onPress={() => NavigationService.push(SCREENS.FEEDBACK)}>
              <View style={styles.optionContent}>
                <View style={styles.optionLeft}>
                  <Icon
                    name="chatbubble-ellipses"
                    type={IconType.Ionicons}
                    color={colors.text}
                    size={20}
                  />
                  <Text color={colors.text} style={styles.optionText}>
                    {translations.sendFeedback}
                  </Text>
                </View>
                <Icon
                  name="chevron-forward"
                  type={IconType.Ionicons}
                  color={colors.placeholder}
                  size={20}
                />
              </View>
            </RNBounceable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
