import { defineSerializedBlueprint } from '../../card-blueprint';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f1General2 = defineSerializedBlueprint({
  id: 'f1_general2',
  name: "Zir'an Sunforge",
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F1,
  spriteId: 'f1_general2',
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
    walk: 'singe2.m4a',
    attack: 'sfx_neutral_gambitgirl_attack_swing.m4a',
    takeDamage: 'sfx_f1_elyxstormblade_hit.m4a',
    dealDamage: 'sfx_neutral_jaxtruesight_death.m4a',
    death: 'sfx_neutral_pandora_death.m4a'
  }
});
