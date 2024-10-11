import { defineSerializedBlueprint } from '../../card-blueprint';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f1General3 = defineSerializedBlueprint({
  id: 'f1_general3',
  name: 'Brome Warcrest',
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F1,
  spriteId: 'f1_general3',
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
    walk: 'sfx_unit_run_charge_4.m4a',
    attack: 'sfx_f2_chakriavatar_attack_swing.m4a',
    takeDamage: 'sfx_f1_general_hit.m4a',
    dealDamage: 'sfx_f6_draugarlord_attack_impact_.m4a',
    death: 'sfx_f1general_death.m4a'
  }
});
