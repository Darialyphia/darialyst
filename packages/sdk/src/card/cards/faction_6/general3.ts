import { defineSerializedBlueprint } from '../../type-helpers';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f6General3 = defineSerializedBlueprint({
  id: 'f6_general3',
  name: 'Ilena Cryobyte',
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F6,
  spriteId: 'f6_general3',
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
    attack: 'sfx_neutral_sunelemental_attack_swing.m4a',
    dealDamage: 'sfx_neutral_ladylocke_attack_swing.m4a',
    takeDamage: 'sfx_neutral_sunelemental_hit.m4a',
    death: 'sfx_neutral_gambitgirl_death.m4a'
  }
});
