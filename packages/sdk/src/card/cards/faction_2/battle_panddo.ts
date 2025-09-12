import { defineSerializedBlueprint } from '../../type-helpers';

export const f2BattlePanddo = defineSerializedBlueprint({
  id: 'f2_battle_panddo',
  name: 'Battle Panddo',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'epic',
  effects: [
    {
      text: 'Whenever this minion takes damage, deal 1 damage to all enemies.',
      config: {
        executionContext: 'trigger_while_on_board',
        actions: [
          {
            type: 'deal_damage',
            params: {
              amount: { type: 'fixed', params: { value: 1 } },
              targets: {
                candidates: [[{ type: 'is_enemy', params: { not: false } }]],
                random: false
              },
              execute: 'now',
              filter: { candidates: [], random: false }
            }
          }
        ],
        triggers: [
          {
            type: 'on_after_unit_take_damage',
            params: {
              target: {
                candidates: [[{ type: 'is_self', params: { not: false } }]],
                random: false
              },
              unit: { candidates: [], random: false },
              card: { candidates: [], random: false },
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
  spriteId: 'f2_pandabear02',
  cost: 3,
  attack: 2,
  maxHp: 4,
  faction: 'f2'
});
