import { defineSerializedBlueprint } from '../../type-helpers';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f3General2 = defineSerializedBlueprint({
  id: 'f3_general2',
  name: 'Scioness Sajj',
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F3,
  spriteId: 'f3_general2',
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
    walk: 'sfx_neutral_ladylocke_attack_impact.m4a',
    attack: 'sfx_neutral_stormatha_attack_swing.m4a',
    takeDamage: 'sfx_neutral_stormatha_attack_impact.m4a',
    dealDamage: 'sfx_f2general_hit_3.m4a',
    death: 'sfx_f2_mage4winds_death.m4a'
  }
});
