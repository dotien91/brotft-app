import React, {useMemo, useState} from 'react';
import {View, ScrollView, TextInput, Alert, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import createStyles from './FeedbackScreen.style';
import ScreenHeaderWithBack from '@shared-components/screen-header-with-back/ScreenHeaderWithBack';
import Text from '@shared-components/text-wrapper/TextWrapper';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {submitFeedback, type IFeedbackRequest} from '@services/api/feedback';
import {translations} from '../../shared/localization';

const FeedbackScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({});

    if (!content.trim()) {
      setErrors({content: translations.feedbackError});
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: IFeedbackRequest = {
        content: content.trim(),
        email: email.trim() || undefined,
      };

      await submitFeedback(feedbackData);
      
      Alert.alert(
        'Success',
        translations.feedbackSuccess,
        [
          {
            text: translations.ok,
            onPress: () => {
              // Reset form
              setContent('');
              setEmail('');
              setErrors({});
            },
          },
        ],
      );
    } catch (error: any) {
      // Handle validation errors (422)
      if (error?.response?.status === 422 && error?.response?.data?.errors) {
        const validationErrors: Record<string, string> = {};
        const apiErrors = error.response.data.errors;
        
        // Map API errors to form fields
        Object.keys(apiErrors).forEach((field) => {
          const errorMessage = Array.isArray(apiErrors[field]) 
            ? apiErrors[field][0] 
            : apiErrors[field];
          validationErrors[field] = errorMessage;
        });
        
        setErrors(validationErrors);
      } else {
        // Handle other errors
        Alert.alert(
          'Error',
          error?.response?.data?.message || error?.message || translations.feedbackSubmitError,
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeaderWithBack title={translations.feedback} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Content Input */}
          <View style={styles.section}>
            <Text style={styles.label}>{translations.yourFeedback} *</Text>
            <TextInput
              style={[
                styles.textArea,
                errors.content && styles.inputError,
              ]}
              placeholder={translations.feedbackPlaceholder}
              placeholderTextColor={colors.placeholder}
              value={content}
              onChangeText={(text) => {
                setContent(text);
                if (errors.content) {
                  setErrors(prev => ({...prev, content: ''}));
                }
              }}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {errors.content && (
              <Text style={styles.errorText}>{errors.content}</Text>
            )}
          </View>

          {/* Email Input */}
          <View style={styles.section}>
            <Text style={styles.label}>{translations.emailOptional}</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder={translations.emailPlaceholder}
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors(prev => ({...prev, email: ''}));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : (
              <Text style={styles.hint}>
                {translations.feedbackHint}
              </Text>
            )}
          </View>

          {/* Submit Button */}
          <RNBounceable
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>{translations.submitFeedback}</Text>
            )}
          </RNBounceable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default FeedbackScreen;

