<script setup lang="ts">
import type { CardBlueprint } from '@game/sdk';
import type { CardBlueprintId } from '@game/sdk/src/card/card';
import type { Point3D } from '@game/shared';
import { match } from 'ts-pattern';

const { ui, dispatch, session } = useGame();
const isOpened = computed(() => {
  return ui.targetingMode.value === TARGETING_MODES.CARD_CHOICE;
});

type CardChoice =
  | {
      type: 'adapt';
      blueprintId: CardBlueprintId;
      description: string;
    }
  | { type: 'discover'; blueprint: CardBlueprint };

const cardChoices = computed(() => {
  if (!ui.selectedCard.value) return null;

  const type: 'adapt' | 'discover' | undefined =
    ui.selectedCard.value.meta.cardChoiceType;
  if (!type) return null;
  if (type === 'adapt') {
    return ui.selectedCard.value.meta.cardChoices.map((c: any) => ({
      ...c,
      type: 'adapt'
    })) as CardChoice[];
  } else if (type === 'discover') {
    return ui.selectedCard.value.meta.cardChoices.map((c: any) => ({
      blueprint: c,
      type: 'discover'
    })) as CardChoice[];
  }
});

const blueprints = computed(() => {
  if (!cardChoices.value) return [];
  return cardChoices.value.map(choice => {
    return match(choice)
      .with({ type: 'adapt' }, choice => {
        const blueprint = session.cardBlueprints[choice.blueprintId];
        return {
          ...blueprint,
          description: choice.description
        };
      })
      .with({ type: 'discover' }, choice => choice.blueprint)
      .exhaustive();
  });
});

const canCancel = computed(
  () => ui.selectedCard.value?.meta.cardChoiceType !== 'discover'
);
const cancel = () => {
  if (!canCancel.value) return;
  ui.unselectCard();
  ui.cardChoice.value = null;
};
</script>

<template>
  <UiModal
    :closable="false"
    :is-opened="isOpened"
    title="Choose one"
    :style="{ '--ui-modal-size': 'var(--size-lg)' }"
  >
    <div v-if="blueprints" class="cards" :style="{ '--cols': cardChoices?.length }">
      <Card
        v-for="(blueprint, index) in blueprints"
        :key="index"
        class="card"
        :card="{
          blueprintId: blueprint.id,
          name: blueprint.name,
          description: blueprint.description,
          kind: blueprint.kind,
          spriteId: blueprint.spriteId,
          rarity: blueprint.rarity,
          attack: blueprint.attack,
          hp: blueprint.maxHp,
          speed: blueprint.speed,
          cost: blueprint.cost,
          pedestalId: 'pedestal-default',
          faction: blueprint.faction,
          tags: blueprint.tags ?? []
        }"
        @click="
          () => {
            ui.cardChoice.value = index;
            if (!ui.selectedCard.value) return;

            dispatch('playCard', {
              cardIndex: ui.selectedCardIndex.value!,
              position: ui.summonTarget.value ?? { x: 0, y: 0, z: 0 },
              targets: ui.cardTargets.value,
              choice: ui.cardChoice.value ?? 0
            });
            ui.unselectCard();
          }
        "
      />
    </div>

    <footer class="mt-4 flex justify-center">
      <UiButton class="error-button" v-if="canCancel" @click="cancel">Cancel</UiButton>
    </footer>
  </UiModal>
</template>

<style scoped lang="postcss">
.card {
  cursor: pointer;
  transition: filter 0.3s;
  &:hover {
    filter: drop-shadow(4px 4px 0 var(--cyan-5)) drop-shadow(-4px -4px 0 var(--orange-5));
  }
}

.cards {
  display: grid;
  grid-template-columns: repeat(var(--cols), 1fr);
}
</style>
