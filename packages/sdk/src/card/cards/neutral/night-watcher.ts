import { defineSerializedBlueprint } from '../../card-blueprint';

export const neutralNightWatcher = defineSerializedBlueprint({
  id: 'IXe2St',
  name: 'Night Watcher',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'epic',
  effects: [
    {
      text: "The first time an enemy unit moves nearby this every turn, it can't attack until the end of the turn.",
      config: {
        executionContext: 'trigger_while_on_board',
        actions: [
          {
            type: 'change_can_attack',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              activeWhen: { candidates: [], random: false },
              unit: {
                candidates: [[{ type: 'moved_unit', params: { not: false } }]],
                random: false
              },
              target: { candidates: [[{ type: 'any_unit' }]], random: false },
              duration: 'end_of_turn'
            }
          }
        ],
        triggers: [
          {
            type: 'on_after_unit_move',
            params: {
              unit: {
                candidates: [
                  [
                    { type: 'is_enemy', params: { not: false } },
                    {
                      type: 'is_nearby',
                      params: {
                        unit: {
                          candidates: [[{ type: 'is_self', params: { not: false } }]],
                          random: false
                        },
                        cell: { candidates: [], random: false },
                        not: false
                      }
                    }
                  ]
                ],
                random: false
              },
              frequency: { type: 'n_per_turn', params: { count: 1 } }
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
  spriteId: 'neutral_nightwatcher',
  cost: 4,
  attack: 3,
  maxHp: 6,
  faction: null
});
