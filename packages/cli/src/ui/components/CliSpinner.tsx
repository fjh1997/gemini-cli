/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import Spinner from 'ink-spinner';
import { type ComponentProps, useEffect, useState } from 'react';
import { Text } from 'ink';
import { debugState } from '../debug.js';
import { useSettings } from '../contexts/SettingsContext.js';

export interface CustomSpinnerDefinition {
  interval: number;
  frames: string[];
}

export type SpinnerProps = ComponentProps<typeof Spinner> & {
  spinner?: CustomSpinnerDefinition;
};

const CustomSpinner = ({ spinner }: { spinner: CustomSpinnerDefinition }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((previousFrame) => {
        const isLastFrame = previousFrame === spinner.frames.length - 1;
        return isLastFrame ? 0 : previousFrame + 1;
      });
    }, spinner.interval);

    return () => {
      clearInterval(timer);
    };
  }, [spinner]);

  return <Text>{spinner.frames[frame]}</Text>;
};

export const CliSpinner = (props: SpinnerProps) => {
  const settings = useSettings();
  const shouldShow = settings.merged.ui?.showSpinner !== false;

  useEffect(() => {
    if (shouldShow) {
      debugState.debugNumAnimatedComponents++;
      return () => {
        debugState.debugNumAnimatedComponents--;
      };
    }
    return undefined;
  }, [shouldShow]);

  if (!shouldShow) {
    return null;
  }

  if (props.spinner) {
    return <CustomSpinner spinner={props.spinner} />;
  }

  return <Spinner {...props} />;
};
