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
  const language = useStore((state) => state.language); // Ví dụ: 'vi', 'ko', 'ja'...

  // Khởi tạo state
  const [displayedText, setDisplayedText] = useState<string | undefined>(description);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const translateText = async () => {
      // 1. Validate
      if (!description) {
        setDisplayedText('');
        return;
      }

      console.log('DEBUG: Start translate', { language, description });

      // 2. Kiểm tra ngôn ngữ
      // Lưu ý: Đảm bảo 'language' trong store là mã chuẩn (vi, ja, ko, fr...)
      if (!language || language === 'en') {
        if (isMounted) {
            setDisplayedText(description);
            setIsTranslating(false);
        }
        return;
      }

      // 3. Bắt đầu dịch
      if (isMounted) setIsTranslating(true);

      try {
        // --- SỬA LỖI Ở ĐÂY ---
        // Cần thêm tham số thứ 3 là ngôn ngữ nguồn ('en')
        // Cấu trúc thường là: translate(text, targetLanguage, sourceLanguage)
        const result = await Translator.translate(description, language, 'en');
        
        console.log('DEBUG: Translated result:', result);

        if (isMounted) {
          // Nếu kết quả trả về rỗng hoặc undefined thì giữ nguyên gốc
          setDisplayedText(result || description);
        }
      } catch (error) {
        console.warn('Translation Error Details:', error);
        // Fallback về text gốc
        if (isMounted) setDisplayedText(description);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    translateText();

    return () => {
      isMounted = false;
    };
  }, [description, language]); // Chạy lại khi language hoặc description đổi

  if (!description) return null;

  return (
    <View style={styles.container}>
      {isTranslating ? (
         <View>
            {/* Hiển thị text gốc mờ đi trong lúc chờ */}
            <Text style={[styles.text, { opacity: 0.3 }]}>{description}</Text>
            <ActivityIndicator 
                size="small" 
                color={theme.colors.primary} 
                style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} 
            />
         </View>
      ) : (
        <Text style={styles.text}>
          {displayedText}
        </Text>
      )}
    </View>
  );
};

export default React.memo(DescriptionSection);