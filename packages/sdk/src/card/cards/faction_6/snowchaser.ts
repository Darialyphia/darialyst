import { defineSerializedBlueprint } from '../../type-helpers';

export const f6Snowchaser = defineSerializedBlueprint({
  id: 'f6_snowchaser',
  name: 'Snowchaser',
  collectable: true,
  keywords: ['infiltrate', 'dying_wish'],
  relatedBlueprintIds: [],
  tags: ['vespyr'],
  kind: 'MINION',
  rarity: 'rare',
  effects: [
    {
      text: '@Infiltrate@: @Dying Wish@: Put a @Snowchaser@ in your hand.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'infiltrate',
            params: {
              effect: {
                executionContext: 'trigger_while_on_board',
                actions: [
                  {
                    type: 'generate_card',
                    params: {
                      filter: { candidates: [], random: false },
                      execute: 'now',
                      ephemeral: false,
                      location: 'hand',
                      player: { candidates: [[{ type: 'ally_player' }]], random: false },
                      blueprint: {
                        candidates: [
                          [{ type: 'static', params: { blueprints: ['f6_snowchaser'] } }]
                        ]
                      }
                    }
                  }
                ],
                triggers: [
                  {
                    type: 'on_before_unit_destroyed',
                    params: {
                      unit: {
                        candidates: [[{ type: 'is_self', params: { not: false } }]],
                        random: false
                      },
                      frequency: { type: 'always' }
                    }
                  }
                ]
              },
              filter: { candidates: [], random: false },
              execute: 'now'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  sounds: {},
  spriteId: 'f6_snowchaser',
  cost: 1,
  attack: 2,
  maxHp: 1,
  faction: 'f6'
});
