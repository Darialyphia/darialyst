import type { Nullable } from '@game/shared';
import type { SerializedAction } from '../action/action';

export type ScoredAction = {
  action: SerializedAction;
  score: number;
};

export type AIAgent = {
  getNextAction(): Promise<Nullable<ScoredAction>>;
};

export const getHighestScoredAction = (actions: ScoredAction[]) => {
  let result = actions[0];

  actions.forEach(action => {
    if (action.score >= result.score) result = action;
  });

  return result;
};
