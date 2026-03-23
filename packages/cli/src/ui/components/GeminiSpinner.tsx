/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Text, useIsScreenReaderEnabled } from 'ink';
import { CliSpinner } from './CliSpinner.js';
import type { SpinnerName } from 'cli-spinners';
import { Colors } from '../colors.js';
import tinygradient from 'tinygradient';
import type { GEMINI_SPINNER } from './BrailleAnimation.js';
import { BrailleAnimation } from './BrailleAnimation.js';

const COLOR_CYCLE_DURATION_MS = 4000;

interface GeminiSpinnerProps {
  spinnerType?: SpinnerName | typeof GEMINI_SPINNER | 'dynamic';
  altText?: string;
}

export const GeminiSpinner: React.FC<GeminiSpinnerProps> = ({
  spinnerType = 'dynamic',
  altText,
}) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const [time, setTime] = useState(0);

  const googleGradient = useMemo(() => {
    const brandColors = [
      Colors.AccentPurple,
      Colors.AccentBlue,
      Colors.AccentCyan,
      Colors.AccentGreen,
      Colors.AccentYellow,
      Colors.AccentRed,
    ];
    return tinygradient([...brandColors, brandColors[0]]);
  }, []);

  useEffect(() => {
    if (isScreenReaderEnabled) {
      return;
    }

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 30);
    }, 30); // ~33fps for smooth color transitions

    return () => clearInterval(interval);
  }, [isScreenReaderEnabled]);

  const progress = (time % COLOR_CYCLE_DURATION_MS) / COLOR_CYCLE_DURATION_MS;
  const currentColor = googleGradient.rgbAt(progress).toHexString();

  const renderSpinner = () => {
    if (spinnerType === 'dynamic') {
      return <BrailleAnimation variant="Composite" />;
    }

    return typeof spinnerType === 'string' ? (
      <CliSpinner type={spinnerType} />
    ) : (
      <CliSpinner spinner={spinnerType} />
    );
  };

  return isScreenReaderEnabled ? (
    <Text>{altText}</Text>
  ) : (
    <Text color={currentColor}>{renderSpinner()}</Text>
  );
};
