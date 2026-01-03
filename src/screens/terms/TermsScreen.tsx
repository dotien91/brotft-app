import React, {useMemo} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import createStyles from './TermsScreen.style';
import BackButton from '@shared-components/back-button/BackButton';
import Text from '@shared-components/text-wrapper/TextWrapper';
import useStore, {StoreState} from '@services/zustand/store';
import {translations} from '../../shared/localization';

const TERMS_URL = 'https://web.apporastudio.com/tos';

const TermsScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isDarkMode = useStore((state: StoreState) => state.isDarkMode);

  // Inject CSS for dark mode support
  const injectedJavaScript = useMemo(() => {
    if (isDarkMode) {
      return `
        (function() {
          function injectDarkMode() {
            const existingStyle = document.getElementById('dark-mode-override');
            if (existingStyle) {
              existingStyle.remove();
            }
            
            const style = document.createElement('style');
            style.id = 'dark-mode-override';
            style.innerHTML = \`
              body {
                background-color: ${colors.background} !important;
                color: ${colors.text} !important;
              }
              * {
                background-color: transparent !important;
              }
              p, div, span, h1, h2, h3, h4, h5, h6, li, td, th {
                color: ${colors.text} !important;
              }
            \`;
            document.head.appendChild(style);
          }
          
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectDarkMode);
          } else {
            injectDarkMode();
          }
        })();
        true;
      `;
    }
    return '';
  }, [isDarkMode, colors.background, colors.text]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <BackButton />
          <Text h3 bold color={colors.text} style={styles.headerTitle}>
            {translations.termsOfService}
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <WebView
          source={{uri: TERMS_URL}}
          style={styles.webView}
          startInLoadingState
          injectedJavaScript={injectedJavaScript}
          injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          onError={(syntheticEvent) => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default TermsScreen;

