"use client";

import { useMutation } from "@tanstack/react-query";

import {
  FeedbackError,
  submitFeedback,
  type FeedbackInput,
} from "@/services/feedback";

/**
 * Owns a feedback submission: pending state, success state and a readable
 * failure message. `isPending` is what keeps the submit button from firing
 * twice.
 */
export function useFeedbackSubmission() {
  const mutation = useMutation<void, unknown, FeedbackInput>({
    mutationKey: ["feedback"],
    mutationFn: submitFeedback,
  });

  const errorMessage = mutation.error
    ? mutation.error instanceof FeedbackError
      ? mutation.error.message
      : "Something went wrong while sending that. Please try again."
    : null;

  return {
    submit: mutation.mutate,
    reset: mutation.reset,
    isSubmitting: mutation.isPending,
    isSubmitted: mutation.isSuccess,
    errorMessage,
  };
}
