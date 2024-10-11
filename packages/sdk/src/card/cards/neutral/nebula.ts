import { defineSerializedBlueprint } from '../../card-blueprint';

export const neutralNebula = defineSerializedBlueprint({
  id: 'neutral_nebula',
  name: 'Nebula',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: ['golem'],
  kind: 'MINION',
  rarity: 'rare',
  effects: [
    {
      text: '@Airdrop@.',
      config: {
        executionContext: 'while_in_hand',
        actions: [
          {
            type: 'airdrop',
            params: { execute: 'now', filter: { candidates: [], random: false } }
          }
        ]
      },
      vfx: { tracks: [] }
    },
    {
      text: 'This has @Rush@ if you control another @Golem@.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'rush',
            params: {
              execute: 'now',
              filter: {
                candidates: [
                  [
                    {
                      type: 'unit_state',
                      params: {
                        unit: {
                          candidates: [
                            [
                              { type: 'is_ally', params: { not: false } },
                              { type: 'is_self', params: { not: true } }
                            ]
                          ],
                          random: false
                        },
                        mode: 'some',
                        tag: 'golem'
                      }
                    }
                  ]
                ],
                random: false
              }
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
  spriteId: 'neutral_diamondgolem',
  cost: 7,
  attack: 4,
  maxHp: 8,
  faction: null
});
