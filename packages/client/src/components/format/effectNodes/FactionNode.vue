<script setup lang="ts">
import { type Faction, FACTIONS } from '@game/sdk';
import type { FactionId } from '@game/sdk/src/card/card-enums';

const factionIds = defineModel<Array<FactionId | null>>({ required: true });

const options = computed(() => {
  const factions: Array<{ label: string; value: FactionId | 'neutral' }> = Object.values(
    FACTIONS
  )
    .map(value => ({
      label: value.name,
      value: value.id as FactionId
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  factions.push({ value: 'neutral', label: 'Neutral' });

  return factions;
});
</script>

<template>
  <div class="grid grid-cols-3 gap-x-4 gap-y-2">
    <div v-for="faction in Object.values(FACTIONS)" :key="faction.id">
      <UiSwitch
        :checked="factionIds.includes(faction.id as FactionId)"
        @update:checked="
          $event => {
            if ($event) factionIds.push(faction.id as FactionId);
            else factionIds.splice(factionIds.indexOf(faction.id as FactionId), 1);
          }
        "
      />
      {{ faction.name }}
    </div>
    <div>
      <UiSwitch
        :checked="factionIds.includes(null)"
        @update:checked="
          $event => {
            if ($event) factionIds.push(null);
            else factionIds.splice(factionIds.indexOf(null), 1);
          }
        "
      />
      Neutral
    </div>
  </div>
</template>
