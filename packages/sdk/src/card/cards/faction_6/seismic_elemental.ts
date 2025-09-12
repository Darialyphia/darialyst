import { defineSerializedBlueprint } from '../../type-helpers';

export const f6SeismicElemental = defineSerializedBlueprint({
  id: 'f6_seismic_elemental',
  name: 'Seismic Elemental',
  collectable: false,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'token',
  effects: [],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  sounds: {},
  attack: 5,
  maxHp: 5,
  spriteId: 'f6_seismicelemental',
  cost: 4,
  faction: 'f6'
});
