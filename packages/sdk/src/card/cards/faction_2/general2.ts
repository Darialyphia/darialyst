import { defineSerializedBlueprint } from '../../type-helpers';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f2General2 = defineSerializedBlueprint({
  id: 'f2_general2',
  name: 'Reva Eventide',
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F2,
  spriteId: 'f2_general2',
  kind: CARD_KINDS.GENERAL,
  cost: 0,
  attack: 2,
  maxHp: 25,
  tags: [],
  keywords: [],
  relatedBlueprintIds: [],
  effects: [],
  sounds: {
    play: 'sfx_unit_deploy_1.m4a',
    walk: 'sfx_neutral_ladylocke_attack_impact.m4a',
    attack: 'sfx_f2general_attack_swing.m4a',
    dealDamage: 'sfx_f2general_attack_impact_2.m4a',
    takeDamage: 'sfx_f2general_hit_2.m4a',
    death: 'sfx_f2general_death.m4a'
  }
});
