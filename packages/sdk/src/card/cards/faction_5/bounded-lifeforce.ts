import { defineSerializedBlueprint } from '../../type-helpers';

export const f5BoundedLifeforce = defineSerializedBlueprint({
  id: 'f5_bounded_lifeforce',
  name: 'Bounded Lifeforce',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'legendary',
  effects: [
    {
      text: 'Make your general 10/10.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'change_stats',
            params: {
              mode: 'set',
              stackable: true,
              attack: {
                amount: { type: 'fixed', params: { value: 10 } },
                activeWhen: { candidates: [], random: false }
              },
              hp: {
                amount: { type: 'fixed', params: { value: 10 } },
                activeWhen: { candidates: [], random: false }
              },
              targets: {
                candidates: [
                  [
                    { type: 'is_general', params: { not: false } },
                    { type: 'is_ally', params: { not: false } }
                  ]
                ],
                random: false
              },
              filter: { candidates: [], random: false },
              duration: 'always',
              execute: 'now'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 1, targets: [[[{ type: 'any_cell' }]]] },
  cellHighlights: [],
  spriteId: 'icon_f5_boundedlifeforce',
  cost: 7,
  faction: 'f5'
});
