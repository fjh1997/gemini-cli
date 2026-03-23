/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Text, useIsScreenReaderEnabled } from 'ink';
import type { SpinnerName } from 'cli-spinners';
import { useStreamingContext } from '../contexts/StreamingContext.js';
import { StreamingState } from '../types.js';
import {
  SCREEN_READER_LOADING,
  SCREEN_READER_RESPONDING,
} from '../textConstants.js';
import { theme } from '../semantic-colors.js';
import { GeminiSpinner } from './GeminiSpinner.js';
interface GeminiRespondingSpinnerProps {
  /**
   * Optional string or component to display when not in Responding state.
   * If not provided and not Responding, renders null.
   */
  nonRespondingDisplay?: React.ReactNode;
  spinnerType?: SpinnerName | 'dynamic';
}

export const GeminiRespondingSpinner: React.FC<
  GeminiRespondingSpinnerProps
> = ({ nonRespondingDisplay, spinnerType = 'dynamic' }) => {
  const streamingState = useStreamingContext();
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  if (streamingState === StreamingState.Responding) {
    return (
      <GeminiSpinner
        spinnerType={spinnerType}
        altText={SCREEN_READER_RESPONDING}
      />
    );
  }

  if (nonRespondingDisplay) {
    if (isScreenReaderEnabled) {
      return <Text>{SCREEN_READER_LOADING}</Text>;
    }

    return typeof nonRespondingDisplay === 'string' ? (
      <Text color={theme.text.primary}>{nonRespondingDisplay}</Text>
    ) : (
      <>{nonRespondingDisplay}</>
    );
  }

  return null;
};
