import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6FenrirWarmaster = defineSerializedBlueprint({
  id: 'VFQEKd',
  name: 'Fenrir Warmaster',
  collectable: true,
  keywords: ['dying_wish'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'common',
  effects: [
    {
      text: '@Dying Wish@: Summon a @Ghost Wolf@ on this space.',
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
                  [{ type: 'static', params: { blueprints: ['f6_ghost_wolf'] } }]
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
  cost: 3,
  attack: 3,
  maxHp: 3,
  faction: 'f6',
  spriteId: 'f6_fenrirwarmaster'
});
