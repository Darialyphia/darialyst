import { defineSerializedBlueprint } from '../../card-blueprint';

export const f3AncestralVessel = defineSerializedBlueprint({
  id: 'f3_ancestral_vessel',
  name: 'Ancestral Vessel',
  collectable: true,
  keywords: ['dying_wish'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'common',
  effects: [
    {
      text: '@Dying Wish@: Summon a @Wind Dervish@ on this space.',
      config: {
        executionContext: 'trigger_while_on_board',
        actions: [
          {
            type: 'summon_unit',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              blueprint: {
                candidates: [
                  [{ type: 'static', params: { blueprints: ['f3_wind_dervish'] } }]
                ]
              },
              player: { candidates: [[{ type: 'ally_player' }]], random: false },
              position: {
                candidates: [
                  [
                    {
                      type: 'has_unit',
                      params: {
                        unit: {
                          candidates: [[{ type: 'is_self', params: { not: false } }]],
                          random: false
                        }
                      }
                    }
                  ]
                ],
                random: false
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
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  sounds: {},
  spriteId: 'f3_ancestral_vessel',
  cost: 2,
  attack: 2,
  maxHp: 2,
  faction: 'f3'
});
