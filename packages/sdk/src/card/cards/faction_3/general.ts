import { defineSerializedBlueprint } from '../../type-helpers';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f3General = defineSerializedBlueprint({
  id: 'f3_general',
  name: 'Zirix Starstrider',
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F3,
  spriteId: 'f3_general',
  kind: CARD_KINDS.GENERAL,
  cost: 0,
  attack: 2,
  maxHp: 25,
  tags: [],
  keywords: [],
  relatedBlueprintIds: [],
  effects: [],
  sounds: {
    play: 'sfx_spell_ghostlightning.m4a',
    walk: 'singe2.m4a',
    attack: 'sfx_f3_general_attack_swing.m4a',
    takeDamage: 'sfx_f3_general_attack_impact.m4a',
    dealDamage: 'sfx_f3_general_hit.m4a',
    death: 'sfx_neutral_swordmechaz0r_death.m4a'
  }
});
