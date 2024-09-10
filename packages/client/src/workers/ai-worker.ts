/// <reference lib="webworker" />

import type { GameFormatDto } from '@game/api/src/convex/formats/format.mapper';
import { GameAI, ServerSession, type SerializedGameState } from '@game/sdk';
import type { SerializedAction } from '@game/sdk/src/action/action';
import { match } from 'ts-pattern';

type AIWorkerEvent =
  | {
      type: 'init';
      payload: {
        state: SerializedGameState;
        seed: string;
        format: GameFormatDto;
      };
    }
  | { type: 'compute'; payload: { action: SerializedAction } };

let ai: GameAI;
self.addEventListener('message', ({ data }) => {
  const options = data as AIWorkerEvent;

  match(options)
    .with({ type: 'init' }, ({ payload }) => {
      ai = new GameAI(
        ServerSession.create(payload.state, {
          seed: payload.seed,
          format: payload.format
        }),
        'p2'
      );
    })
    .with({ type: 'compute' }, async ({ payload }) => {
      const nextAction = await ai.onUpdate(payload.action);

      self.postMessage(nextAction);
    })
    .exhaustive();
});
