# Redstone Academy

A browser-only, 2D educational Minecraft Redstone simulator. It combines a small circuit sandbox with thirty guided lessons and live, unit-test-like success criteria. The goal is to expose hidden logical state—not reproduce Minecraft block for block.

## Run locally

```bash
npm install
npm run dev
npm run build
npm test
```

## Architecture

```text
React UI → typed Board model → framework-independent Engine
                                  ├─ immediate settle queue
                                  └─ tick-based scheduled events
```

`src/engine` has no React, DOM, or rendering knowledge. It deterministically derives component state from a board and actions. The React layer handles editing, selection, persistence, keyboard controls, lessons, and display. Component state is represented by a discriminated union, while cells separately reserve `baseBlock` and `component` layers for future fidelity. Behavior is settled with a guarded iteration limit; buttons and repeaters use an ordered simulation-tick event queue rather than wall-clock timers.

## Simulation concepts

- Signals are clamped integers from **0–15**. A source emits 15 and each dust tile transmits one less. Multiple inputs resolve to the strongest.
- Repeaters accept only from the side opposite their arrow, output only along the arrow, regenerate to 15, and apply a 1–4 tick delay.
- A torch's simplified input is the adjacent cell directly behind its arrow. An unpowered input makes it emit 15; a powered input turns it off.
- Solid blocks use an explicit educational rule: any neighboring valid output powers the block, and a powered block emits 15 to neighbors. This intentionally omits strong/weak power distinctions.
- Lamps and pistons respond to adjacent valid power. Pistons visualize extension but do not move blocks.
- Every lesson includes a viewable example solution. Lesson validators inspect the same board state independently, like small unit tests.

## Known simplifications

This simulator models logical behavior for learning and does not guarantee Java or Bedrock compatibility. It is a flat four-neighbor network: there is no vertical wiring, quasi-connectivity, update-order exploitation, block pushing, sticky behavior, entities, or edition-specific behavior. Dust connectivity is derived from compatible adjacent cells. Torch placement and solid-block power use deliberately explicit, simplified rules.

## Controls and persistence

Click a tool then an empty cell to place it. Click a lever/button to interact; click other components to inspect. Use **R** to rotate, **Delete** to remove, **Space** to play/pause, and **Ctrl/Cmd+Z** or **Ctrl/Cmd+Y** for undo/redo. Lesson progress, the current lesson, sandbox board, and display preferences are stored locally in the browser.

## Testing

`npm test` runs Vitest unit coverage for dust decay/strongest input, repeater direction/regeneration/delay, lever toggling, torch inversion, lamp propagation, tick-based button expiry, and lesson validators. `npm run build` runs strict TypeScript checking before bundling.
