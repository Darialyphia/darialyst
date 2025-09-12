import { defineSerializedBlueprint } from '../../type-helpers';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f5General3 = defineSerializedBlueprint({
  id: 'f5_general3',
  name: 'Ragnora the Relentless',
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F5,
  spriteId: 'f5_general3',
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
    walk: 'sfx_dreamgazer_death.m4a',
    attack: 'sfx_neutral_spiritscribe_attack_swing.m4a',
    dealDamage: 'sfx_f5_kolossus_attack_impact.m4a',
    takeDamage: 'sfx_neutral_silitharveteran_hit.m4a',
    death: 'sfx_neutral_silitharveteran_death.m4a'
  }
});
