"use client";

import { useCallback, useRef } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { toApiErrorPayload, type ApiErrorPayload } from "@/lib/api-error";
import { runRecovery, type RecoveryRun } from "@/services/schema-healer";

/**
 * Owns a single recovery run: upload, cancellation, error normalisation and
 * the resulting report + dataset.
 */
export interface UseRecoveryRun {
  start: (file: File) => void;
  cancel: () => void;
  reset: () => void;
  run: RecoveryRun | undefined;
  error: ApiErrorPayload | null;
  isRunning: boolean;
  isSuccess: boolean;
  mutation: UseMutationResult<RecoveryRun, unknown, File>;
}

export function useRecoveryRun(): UseRecoveryRun {
  const controllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation<RecoveryRun, unknown, File>({
    mutationKey: ["schema-recovery"],
    mutationFn: async (file: File) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      return runRecovery(file, controller.signal);
    },
  });

  const { mutate, reset: resetMutation } = mutation;

  const start = useCallback(
    (file: File) => {
      mutate(file);
    },
    [mutate],
  );

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    resetMutation();
  }, [resetMutation]);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    resetMutation();
  }, [resetMutation]);

  return {
    start,
    cancel,
    reset,
    run: mutation.data,
    error: mutation.error ? toApiErrorPayload(mutation.error) : null,
    isRunning: mutation.isPending,
    isSuccess: mutation.isSuccess,
    mutation,
  };
}
