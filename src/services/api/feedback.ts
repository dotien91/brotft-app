import axiosInstance from './axios';

export interface IFeedbackRequest {
  content: string;
  email?: string;
}

export interface IFeedbackResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Submit feedback
 * @param feedback - Feedback data
 */
export const submitFeedback = async (
  feedback: IFeedbackRequest,
): Promise<IFeedbackResponse> => {
  try {
    const response = await axiosInstance.post<IFeedbackResponse>(
      '/feedbacks',
      feedback,
    );
    return response.data;
  } catch (error: any) {
    console.error('Feedback submission failed:', error?.message);
    throw error;
  }
};

