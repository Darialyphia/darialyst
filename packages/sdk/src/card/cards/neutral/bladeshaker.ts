import { defineSerializedBlueprint } from '../../type-helpers';

export const neutralBladeshaker = defineSerializedBlueprint({
  id: 'neutral_bladeshaker',
  name: 'Bladeshaker',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'epic',
  effects: [
    {
      text: 'Gains +1/+1 whenever an artifact equiped to your general loses durability',
      config: {
        executionContext: 'trigger_while_on_board',
        actions: [
          {
            type: 'change_stats',
            params: {
              mode: 'give',
              stackable: true,
              attack: {
                amount: { type: 'fixed', params: { value: 1 } },
                activeWhen: { candidates: [], random: false }
              },
              hp: {
                amount: { type: 'fixed', params: { value: 1 } },
                activeWhen: { candidates: [], random: false }
              },
              speed: {
                amount: { type: 'fixed', params: { value: 0 } },
                activeWhen: { candidates: [], random: false }
              },
              targets: {
                candidates: [[{ type: 'is_self', params: { not: false } }]],
                random: false
              },
              filter: { candidates: [], random: false },
              duration: 'always',
              execute: 'now'
            }
          }
        ],
        triggers: [
          {
            type: 'on_after_artifact_lose_durability',
            params: {
              card: {
                candidates: [
                  [
                    {
                      type: 'from_player',
                      params: {
                        player: { candidates: [[{ type: 'ally_player' }]], random: false }
                      }
                    }
                  ]
                ],
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
  spriteId: 'neutral_xyle02',
  cost: 3,
  attack: 2,
  maxHp: 3,
  faction: null
});
