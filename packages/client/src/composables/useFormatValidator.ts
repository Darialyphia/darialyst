import type { GameSessionConfig, GenericSerializedBlueprint } from '@game/sdk';
import { isDefined } from '@game/shared';

export const useFormatValidator = () => {
  const isCardValid = (card: GenericSerializedBlueprint) => {
    return (
      isDefined(card.spriteId) &&
      isDefined(card.name) &&
      isDefined(card.rarity) &&
      isDefined(card.kind) &&
      isDefined(card.cost)
    );
  };

  return {
    isCardValid,
    isFormatValid: (format: {
      name: string;
      description: string;
      config: GameSessionConfig;
      cards: Record<string, GenericSerializedBlueprint>;
    }) => Object.values(format.cards).every(isCardValid)
  };
};
