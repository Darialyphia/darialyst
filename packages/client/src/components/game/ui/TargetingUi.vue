<script setup lang="ts">
import { match } from 'ts-pattern';

const { ui, dispatch } = useGame();

const canSkip = computed(() => {
  const card = ui.selectedCard.value;
  if (!card) return false;
  console.log(ui.cardTargets.value.length, card.targets);
  return ui.cardTargets.value.length <= (card.targets?.minTargetCount ?? 0);
});

const cancel = () => {
  match(ui.targetingMode.value)
    .with(TARGETING_MODES.TARGETING, () => {
      ui.unselectCard();
    })
    .otherwise(() => void 0);
};

const commitPlay = () => {
  if (ui.selectedCard.value!.meta.cardChoiceType) {
    ui.switchTargetingMode(TARGETING_MODES.CARD_CHOICE);
  } else {
    dispatch('playCard', {
      cardIndex: ui.selectedCardIndex.value!,
      position: ui.summonTarget.value ?? { x: 0, y: 0, z: 0 },
      targets: ui.cardTargets.value,
      choice: ui.cardChoice.value ?? 0
    });
    ui.unselectCard();
  }
};

watchEffect(() => {
  match(ui.targetingMode.value)
    .with(
      TARGETING_MODES.NONE,
      TARGETING_MODES.BASIC,
      TARGETING_MODES.SUMMON,
      TARGETING_MODES.CARD_CHOICE,
      () => undefined
    )
    .with(TARGETING_MODES.TARGETING, () => {
      const card = ui.selectedCard.value;
      if (!card) return false;
      if (ui.cardTargets.value.length === card.targets?.maxTargetCount) {
        commitPlay();
      }
    })
    .exhaustive();
});
</script>

<template>
  <div
    v-if="
      ui.targetingMode.value === TARGETING_MODES.TARGETING &&
      ((ui.selectedCard.value?.targets?.maxTargetCount ?? 0) > 1 ||
        ui.selectedCard.value?.targets?.minTargetCount === 0)
    "
    class="targeting-ui"
  >
    <UiButton class="error-button" is-cta @click="cancel">Cancel</UiButton>
    <UiButton v-if="canSkip" is-cta class="primary-button" @click="commitPlay">
      Skip
    </UiButton>
  </div>
</template>

<style scoped lang="postcss">
.targeting-ui {
  position: absolute;
  bottom: calc(var(--size-12) + 3rem);
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 0;
  align-items: center;

  @screen lt-lg {
    bottom: var(--size-8);
  }
}

button {
  --ui-button-size: var(--font-size-3);

  box-shadow: 0 5px 0.25rem hsl(var(--gray-11-hsl) / 0.6);

  &:first-of-type {
    border-top-left-radius: var(--radius-4);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:last-of-type {
    border-top-left-radius: 0;
    border-bottom-right-radius: var(--radius-4);
    border-bottom-left-radius: 0;
  }
}
</style>
