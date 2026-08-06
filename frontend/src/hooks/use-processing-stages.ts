"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Drives the processing view.
 *
 * The API answers with a single response and no progress updates, so these
 * steps mirror the real sequence and advance on estimated timings. Two rules
 * keep the display honest:
 *
 *   - the sequence never runs past the final step on its own, it waits there
 *     while the request is still in flight,
 *   - steps are only marked complete once the response has actually arrived.
 */

export const PROCESSING_STAGES = [
  {
    id: "validating",
    label: "Reading the file",
    detail: "Finding the header row and working out the separator",
    weight: 900,
  },
  {
    id: "rule",
    label: "Matching known names",
    detail: "Checking column names against the built-in list",
    weight: 1200,
  },
  {
    id: "fuzzy",
    label: "Finding close matches",
    detail: "Comparing what is left against your field list",
    weight: 1400,
  },
  {
    id: "semantic",
    label: "Asking the AI model",
    detail: "Resolving names the earlier steps could not place",
    weight: 3200,
  },
  {
    id: "dataset",
    label: "Rebuilding the file",
    detail: "Applying the recovered names to every row",
    weight: 1200,
  },
  {
    id: "verification",
    label: "Running checks",
    detail: "Looking for missing, unmatched and duplicated columns",
    weight: 1100,
  },
  {
    id: "report",
    label: "Preparing the report",
    detail: "Summarising what changed and what needs review",
    weight: 900,
  },
] as const;

export type ProcessingStageId = (typeof PROCESSING_STAGES)[number]["id"];

export type StageState = "waiting" | "active" | "complete";

export interface UseProcessingStages {
  /** Index of the stage currently being visualised. */
  activeIndex: number;
  states: StageState[];
  /** Between 0 and 1, used for the overall progress rail. */
  progress: number;
}

export function useProcessingStages(
  isRunning: boolean,
  isComplete: boolean,
): UseProcessingStages {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    // Every transition happens in a timer callback, so the effect body itself
    // never schedules a synchronous re-render.
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;

    for (let index = 0; index < PROCESSING_STAGES.length - 1; index += 1) {
      elapsed += PROCESSING_STAGES[index].weight;
      timers.push(setTimeout(() => setStageIndex(index + 1), elapsed));
    }

    return () => {
      timers.forEach(clearTimeout);
      setStageIndex(0);
    };
  }, [isRunning]);

  const activeIndex = isRunning || isComplete ? stageIndex : 0;

  const states = useMemo<StageState[]>(() => {
    return PROCESSING_STAGES.map((_, index) => {
      if (isComplete) return "complete";
      if (index < activeIndex) return "complete";
      if (index === activeIndex) return "active";
      return "waiting";
    });
  }, [activeIndex, isComplete]);

  const progress = isComplete
    ? 1
    : (activeIndex + 0.5) / PROCESSING_STAGES.length;

  return { activeIndex, states, progress };
}
