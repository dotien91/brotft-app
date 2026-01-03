import React, {useMemo, useState} from 'react';
import {View, ScrollView, TextInput, Alert, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import createStyles from './FeedbackScreen.style';
import BackButton from '@shared-components/back-button/BackButton';
import Text from '@shared-components/text-wrapper/TextWrapper';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {submitFeedback, type IFeedbackRequest} from '@services/api/feedback';

const FeedbackScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter your feedback content');
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
        'Thank you for your feedback!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setContent('');
              setEmail('');
            },
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || error?.message || 'Failed to submit feedback. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <BackButton />
          <Text h3 bold color={colors.text} style={styles.headerTitle}>
            Feedback
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Content Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Your Feedback *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Please describe your feedback, suggestion, or report a bug..."
              placeholderTextColor={colors.placeholder}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Email Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>
              We'll use this to follow up on your feedback if needed
            </Text>
          </View>

          {/* Submit Button */}
          <RNBounceable
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            )}
          </RNBounceable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default FeedbackScreen;

