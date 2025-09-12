import { defineSerializedBlueprint } from '../../type-helpers';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f4General2 = defineSerializedBlueprint({
  id: 'f4_general2',
  name: 'Cassyva Soulreaper',
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F4,
  spriteId: 'f4_general2',
  kind: CARD_KINDS.GENERAL,
  cost: 0,
  attack: 2,
  maxHp: 25,
  tags: [],
  keywords: [],
  relatedBlueprintIds: [],
  effects: [],
  sounds: {
    play: 'sfx_spell_fractalreplication.m4a',
    walk: 'sfx_neutral_ladylocke_attack_impact.m4a',
    attack: 'sfx_neutral_prophetofthewhite_attack_swing.m4a',
    dealDamage: 'sfx_f4_blacksolus_attack_impact.m4a',
    takeDamage: 'sfx_f4_blacksolus_hit.m4a',
    death: 'sfx_f1_elyxstormblade_death.m4a'
  }
});
