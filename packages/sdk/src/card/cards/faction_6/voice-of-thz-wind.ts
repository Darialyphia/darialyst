import { defineSerializedBlueprint } from '../../type-helpers';

export const f6VoiceOfTheWind = defineSerializedBlueprint({
  id: 'f6_voice_of_the_wind',
  name: 'Voice of the Wind',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'legendary',
  effects: [
    {
      text: 'When you play a minion, summon a @Winter Maerid@ on a random nearby space.',
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
                  [{ type: 'static', params: { blueprints: ['f6_winter_maerid'] } }]
                ]
              },
              player: { candidates: [[{ type: 'ally_player' }]], random: false },
              position: {
                candidates: [
                  [
                    {
                      type: 'is_nearby',
                      params: {
                        unit: {
                          candidates: [[{ type: 'is_self', params: { not: false } }]],
                          random: true
                        },
                        cell: { candidates: [], random: false }
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
            type: 'on_after_card_played',
            params: {
              card: { candidates: [[{ type: 'minion', params: {} }]], random: false },
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
  spriteId: 'f6_voiceofthewind',
  cost: 4,
  attack: 5,
  maxHp: 4,
  faction: 'f6'
});
