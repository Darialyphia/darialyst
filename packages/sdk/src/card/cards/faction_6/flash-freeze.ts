import { defineSerializedBlueprint } from '../../type-helpers';

export const f6FlashFreeze = defineSerializedBlueprint({
  id: 'f6_flash_freeeze',
  name: 'Flash freeze',
  collectable: true,
  keywords: ['frozen'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'common',
  effects: [
    {
      text: 'Deal 1 damage to a unit and @Freeze@ it until your next turn.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'deal_damage',
            params: {
              amount: { type: 'fixed', params: { value: 1 } },
              targets: {
                candidates: [
                  [{ type: 'is_manual_target', params: { not: false, index: 0 } }]
                ],
                random: false
              },
              execute: 'now',
              filter: { candidates: [], random: false }
            }
          },
          {
            type: 'freeze',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              target: {
                candidates: [
                  [{ type: 'is_manual_target', params: { not: false, index: 0 } }]
                ],
                random: false
              },
              duration: 'start_of_next_turn'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  spriteId: 'icon_f6_flashfreeze',
  cost: 0,
  faction: 'f6'
});
