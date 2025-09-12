import { defineSerializedBlueprint } from '../../type-helpers';
import { RARITIES, CARD_KINDS, FACTION_IDS } from '../../card-enums';

export const f5General2 = defineSerializedBlueprint({
  id: 'f5_general2',
  name: 'Starhorn the Seeker',
  rarity: RARITIES.BASIC,
  collectable: true,
  faction: FACTION_IDS.F5,
  spriteId: 'f5_general2',
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
    attack: 'sfx_f1_silverguardsquire_attack_swing.m4a',
    dealDamage: 'sfx_f5_kolossus_attack_impact.m4a',
    takeDamage: 'sfx_neutral_silitharveteran_hit.m4a',
    death: 'sfx_neutral_silitharveteran_death.m4a'
  }
});
