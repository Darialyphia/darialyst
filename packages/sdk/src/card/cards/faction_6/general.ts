import { defineSerializedBlueprint } from '../../type-helpers';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f6General = defineSerializedBlueprint({
  id: 'f6_general',
  name: 'Faie Bloodwing',
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F6,
  spriteId: 'f6_general',
  kind: CARD_KINDS.GENERAL,
  cost: 0,
  attack: 2,
  maxHp: 25,
  tags: [],
  keywords: [],
  relatedBlueprintIds: [],
  effects: [],
  sounds: {
    play: 'sfx_unit_deploy.m4a',
    walk: 'singe2.m4a',
    attack: 'sfx_neutral_valehunter_attack_swing.m4a',
    dealDamage: 'sfx_neutral_gambitgirl_attack_impact.m4a',
    takeDamage: 'sfx_neutral_gambitgirl_hit.m4a',
    death: 'sfx_neutral_gambitgirl_death.m4a'
  }
});
