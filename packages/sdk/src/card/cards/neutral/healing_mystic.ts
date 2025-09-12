import { KEYWORDS } from '../../../utils/keywords';
import { defineSerializedBlueprint } from '../../type-helpers';
import { defineCardEffect } from '../../card-effect';
import { manualTarget } from '../../helpers/targeting';

export const neutralHealingMystic = defineSerializedBlueprint({
  id: 'neutral_healing_mystic',
  collectable: true,
  name: 'Healing Mystic',
  cost: 2,
  attack: 2,
  maxHp: 3,
  faction: null,
  keywords: [KEYWORDS.OPENING_GAMBIT.id],
  kind: 'MINION',
  rarity: 'common',
  relatedBlueprintIds: [],
  spriteId: 'neutral_healing_mystic',
  tags: [],
  sounds: {
    play: 'sfx_unit_deploy_3.m4a',
    walk: 'singe2.m4a',
    attack: 'sfx_f6_voiceofthewind_attack_swing.m4a',
    dealDamage: 'sfx_neutral_spelljammer_attack_impact.m4a',
    takeDamage: 'sfx_neutral_spelljammer_hit.m4a',
    death: 'sfx_neutral_spelljammer_death.m4a'
  },
  targets: {
    min: 0,
    targets: [
      [
        [
          {
            type: 'has_unit',
            params: { unit: { candidates: [[{ type: 'any_unit' }]], random: false } }
          }
        ]
      ]
    ]
  },
  effects: [
    defineCardEffect({
      text: '@Opening Gambit@: Heal another unit for 2.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'heal',
            params: {
              filter: { candidates: [[{ type: 'played_from_hand', params: {} }]] },
              targets: manualTarget(0),
              amount: { type: 'fixed', params: { value: 2 } }
            }
          }
        ]
      }
    })
  ]
});
