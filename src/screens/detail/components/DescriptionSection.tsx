import React, {useMemo, useState, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Translator from 'react-native-translator';
import Text from '@shared-components/text-wrapper/TextWrapper';
import useStore from '@services/zustand/store';
import createStyles from './DescriptionSection.style';

interface DescriptionSectionProps {
  description?: string;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({description}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);

  const [displayedText, setDisplayedText] = useState<string | undefined>(
    language === 'en' ? description : ''
  );
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!description) return;

    if (!language || language === 'en') {
      setDisplayedText(description);
      setIsTranslating(false);
    } else {
      setIsTranslating(true);
      setDisplayedText(''); 
    }
  }, [description, language]);

  if (!description) return null;

  const shouldTranslate = language && language !== 'en';

  return (
    <View style={styles.container}>
      {shouldTranslate && (
        <Translator
          from="en"
          to={language}
          value={description}
          onTranslated={(result) => {
            setDisplayedText(result);
            setIsTranslating(false);
          }}
          onError={(error) => {
            console.warn('Translate error:', error);
            setDisplayedText(description);
            setIsTranslating(false);
          }}
        />
      )}

      {isTranslating ? (
        // --- SỬA Ở ĐÂY: Căn giữa loading ---
        <View style={{ 
            padding: 20, // Tăng padding để thoáng hơn
            justifyContent: 'center', // Căn giữa dọc
            alignItems: 'center',     // Căn giữa ngang
            width: '100%'             // Chiếm hết chiều rộng để căn chuẩn
        }}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : (
        <Text style={styles.text}>
          {displayedText || description}
        </Text>
      )}
    </View>
  );
};

export default React.memo(DescriptionSection);