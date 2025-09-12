import { defineSerializedBlueprint } from '../../type-helpers';
import { defineCardEffect } from '../../card-effect';

export const neutralGolemMetallurgist = defineSerializedBlueprint({
  id: 'neutral_golem_metallurgist',
  name: 'Golem Metallurgist',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: ['golem'],
  kind: 'MINION',
  rarity: 'rare',
  effects: [
    defineCardEffect({
      text: 'Your other golems cost 1 less to play.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'change_card_cost',
            params: {
              filter: { candidates: [], random: false },
              activeWhen: { candidates: [], random: false },
              execute: 'now',
              amount: { type: 'fixed', params: { value: -1 } },
              card: {
                candidates: [[{ type: 'has_tag', params: { tag: 'golem' } }]],
                random: false
              },
              player: { candidates: [[{ type: 'ally_player' }]], random: false },
              occurences_count: 0,
              duration: 'always'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    })
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  sounds: {},
  cost: 2,
  attack: 2,
  maxHp: 3,
  faction: null,
  spriteId: 'neutral_golem_steel'
});
