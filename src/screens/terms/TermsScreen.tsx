import React, {useMemo} from 'react';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import createStyles from './TermsScreen.style';
import ScreenHeaderWithBack from '@shared-components/screen-header-with-back/ScreenHeaderWithBack';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {translations} from '../../shared/localization';

const TERMS_CONTENT = `TERMS OF SERVICE

Last Updated: January 03, 2026

1. Acceptance of Terms

By downloading, installing, or using TFTBuddy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.

2. Legal Disclaimer (Riot Games)

TFTBuddy is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends or Teamfight Tactics.

League of Legends, Teamfight Tactics, and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
© Riot Games, Inc. All rights reserved.

3. License and Acceptable Use

We grant you a limited, non-exclusive, non-transferable, and revocable license to use TFTBuddy for personal and non-commercial purposes.

You agree not to:

• Copy, modify, or reverse engineer the app.
• Use the app for unlawful purposes.
• Attempt to interfere with or bypass security or technical safeguards.
• Use automated systems to access or scrape the app's content.

4. Intellectual Property

All original content, features, and functionality of TFTBuddy (excluding third-party content and Riot Games' assets) are the exclusive property of TFTBuddy and its licensors.

Third-party trademarks and assets remain the property of their respective owners.

5. Data Accuracy Disclaimer

TFTBuddy provides game-related data such as statistics, tier lists, and guides for informational purposes only. While we strive for accuracy, we do not guarantee that the information is complete, accurate, or up to date.

6. Limitation of Liability

TFTBuddy is provided on an "AS IS" and "AS AVAILABLE" basis. To the fullest extent permitted by law, TFTBuddy and its developers shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use the app.

7. Termination

We reserve the right to suspend or terminate access to TFTBuddy at any time, without prior notice, if you violate these Terms or misuse the application.

8. Changes to These Terms

We may update these Terms of Service from time to time. Continued use of the app after changes are posted constitutes your acceptance of the revised terms.

9. Governing Law

These Terms shall be governed and construed in accordance with the laws of Viet Nam, without regard to conflict of law principles.

10. Contact Us

If you have any questions about these Terms of Service, please contact us at:

📧 apporastudio@gmail.com`;

const TermsScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeaderWithBack title={translations.termsOfService} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.content} color={colors.text}>
          {TERMS_CONTENT}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;

