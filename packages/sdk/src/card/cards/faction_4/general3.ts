import { defineSerializedBlueprint } from '../../card-blueprint';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f4General3 = defineSerializedBlueprint({
  id: 'f4_general3',
  name: 'Maevh Skinsolder',
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F4,
  spriteId: 'f4_general3',
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
    walk: 'singe2.m4a',
    attack: 'sfx_voidhunter_attack_swing.m4a',
    dealDamage: 'sfx_f4_general_attack_impact.m4a',
    takeDamage: 'sfx_f4_general_hit.m4a',
    death: 'sfx_f1_elyxstormblade_death.m4a'
  }
});
