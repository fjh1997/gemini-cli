/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderWithProviders } from '../../test-utils/render.js';
import { BrailleAnimation } from './BrailleAnimation.js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from 'react';

describe('BrailleAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should grow from length 1 to 5 and match verification frames', async () => {
    const { lastFrameRaw, waitUntilReady } = renderWithProviders(
      <BrailleAnimation interval={100} variant="Long" />,
    );
    await waitUntilReady();

    const verificationFrames = [
      '⢎⠁', // 0
      '⠎⠑', // 1
      '⠊⠱', // 2
      '⠈⡱', // 3
      '⢀⡱', // 4
      '⢄⡰', // 5
      '⢆⡠', // 6
      '⢎⡀', // 7
    ];

    // After growth (which takes 2 cycles in our current 'Long' implementation),
    // it should match the sequence.
    // Cycle 0: len 1
    // Cycle 1: len 3
    // Cycle 2: len 5 (Ticks 16+)

    await act(async () => {
      vi.advanceTimersByTime(1600); // 16 ticks * 100ms
    });

    // Find alignment
    let startIdx = -1;
    for (let attempt = 0; attempt < 8; attempt++) {
      const current = lastFrameRaw();
      startIdx = verificationFrames.findIndex((f) => current.includes(f));
      if (startIdx !== -1) break;

      await act(async () => {
        vi.advanceTimersByTime(100);
      });
    }

    expect(startIdx).not.toBe(-1);

    // Verify the sequence
    for (let i = 0; i < 8; i++) {
      const idx = (startIdx + i) % 8;
      expect(lastFrameRaw()).toContain(verificationFrames[idx]);
      await act(async () => {
        vi.advanceTimersByTime(100);
      });
    }
  });

  it('should support "Composite" variant with dynamic lengths', async () => {
    const { lastFrameRaw, waitUntilReady } = renderWithProviders(
      <BrailleAnimation interval={100} variant="Composite" />,
    );
    await waitUntilReady();

    // Just verify it renders something
    expect(lastFrameRaw()).toBeTruthy();
  });
});
