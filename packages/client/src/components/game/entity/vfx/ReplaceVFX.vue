<script setup lang="ts">
import { CARD_KINDS, type EntityId } from '@game/sdk';
import { type Nullable } from '@game/shared';
import { TextStyle, type FrameObject } from 'pixi.js';
import { PTransition, EasePresets } from 'vue3-pixi';
import { CELL_HEIGHT } from '@/utils/constants';

const { entityId } = defineProps<{ entityId: EntityId }>();

const { assets } = useGame();
const entity = useEntity(entityId);

const activePlayer = useGameSelector(session => session.playerSystem.activePlayer);

const isDisplayed = ref(false);
useSessionEvent('card:replaced', async ([card]) => {
  if (!entity.value.isGeneral) return;
  if (!entity.value.player.equals(activePlayer.value)) return;

  isDisplayed.value = true;
  setTimeout(() => {
    isDisplayed.value = false;
  }, 1500);
});

const textStyle = new TextStyle({
  fontSize: 30,
  fill: 'white',
  fontWeight: 'bolder',
  stroke: 'black',
  strokeThickness: 2
});
</script>

<template>
  <PTransition
    appear
    :duration="{ enter: 300, leave: 200 }"
    :before-enter="{ alpha: 0, y: 0 }"
    :enter="{ alpha: 1, y: -CELL_HEIGHT * 0.5, ease: EasePresets.easeOutCubic }"
    :leave="{ scale: 0, y: -CELL_HEIGHT, alpha: 0, ease: EasePresets.easeOutCubic }"
  >
    <pixi-text v-if="isDisplayed" :style="textStyle" :x="-17" :scale="0.25">
      REPLACE
    </pixi-text>
  </PTransition>
</template>
