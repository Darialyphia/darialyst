<script setup lang="ts">
import {
  CARD_KINDS,
  CARDS,
  RARITIES,
  type GameSessionConfig,
  type GenericSerializedBlueprint
} from '@game/sdk';
import type { Nullable } from '@game/shared';
import { nanoid } from 'nanoid';

const format = defineModel<{
  cards: Record<string, GenericSerializedBlueprint>;
  config: GameSessionConfig;
}>('format', { required: true });

const customCards = computed(() =>
  Object.values(format.value.cards).filter(card => !CARDS[card.id])
);
console.log(customCards.value);
const editedCards = computed(() =>
  Object.values(format.value.cards).filter(card => !!CARDS[card.id])
);
const isEdited = (card: GenericSerializedBlueprint) =>
  editedCards.value.some(c => c.id === card.id);

const isCardsModalOpened = ref(false);
const selectedCardId = ref<Nullable<string>>(null);
const selectedCard = computed(() => {
  if (!selectedCardId.value) return null;
  return format.value.cards[selectedCardId.value];
});
const addCard = (card: GenericSerializedBlueprint) => {
  format.value.cards[card.id] = JSON.parse(JSON.stringify(card));
  if (!format.value.cards[card.id].sounds) {
    format.value.cards[card.id].sounds = {};
  }
  selectedCardId.value = card.id;
};

const validator = useFormatValidator();
const isCreateCardPopoverOened = ref(false);
const isDuplicateCardModalOpened = ref(false);
</script>

<template>
  <div class="format-cards">
    <section class="sidebar fancy-scrollbar">
      <h3>Custom Cards</h3>
      <p>These are your brand new cards.</p>
      <p v-if="!customCards.length" class="my-2 italic">
        This format doesn't have any custom card
      </p>
      <ul v-else class="card-list fancy-scrollbar">
        <li v-for="card in customCards" :key="card.id" class="flex gap-3">
          <UiButton
            type="button"
            class="ghost-button"
            :class="[
              card.id === selectedCardId && 'selected',
              !validator.isCardValid(card) && 'invalid'
            ]"
            @click="selectedCardId = card.id"
          >
            <CardSprite :sprite-id="card.spriteId" class="sprite" />
            {{ card.name }}
          </UiButton>
          <UiIconButton
            name="material-symbols:delete-outline"
            class="ghost-error-button shrink-0"
            @click="delete format.cards[card.id]"
          />
        </li>
      </ul>
      <div class="flex items-center gap-2">
        <PopoverRoot v-model:open="isCreateCardPopoverOened">
          <InteractableSounds>
            <PopoverTrigger as-child>
              <UiButton
                type="button"
                class="primary-button"
                is-inline
                left-icon="material-symbols:add"
                right-icon="tdesign:caret-down"
                @click="isCreateCardPopoverOened = true"
              >
                Make New Card
              </UiButton>
            </PopoverTrigger>
          </InteractableSounds>

          <PopoverAnchor />

          <PopoverPortal>
            <PopoverContent as-child :collision-padding="20" :align-offset="20">
              <div class="flex flex-col primary-button">
                <UiButton
                  class="rounded-0 w-full"
                  @click="
                    () => {
                      isCreateCardPopoverOened = false;
                      const id = nanoid(6);
                      format.cards[id] = {
                        id,
                        name: '',
                        collectable: true,
                        keywords: [],
                        relatedBlueprintIds: [],
                        tags: [],
                        kind: CARD_KINDS.MINION,
                        rarity: RARITIES.COMMON,
                        effects: [],
                        targets: { min: 0, targets: [] },
                        cellHighlights: [],
                        sounds: {}
                      } as any;
                      selectedCardId = id;
                    }
                  "
                >
                  Empty card
                </UiButton>
                <UiButton
                  class="rounded-0 w-full"
                  @click="
                    () => {
                      isCreateCardPopoverOened = false;
                      isDuplicateCardModalOpened = true;
                    }
                  "
                >
                  From existing card
                </UiButton>
              </div>
            </PopoverContent>
          </PopoverPortal>
        </PopoverRoot>
        <ExistingCardsModal
          v-model:isOpened="isDuplicateCardModalOpened"
          :is-card-disabled="card => isEdited(card)"
          @select="
            card => {
              const clone = JSON.parse(JSON.stringify(card));
              clone.id = nanoid(6);
              clone.sounds ??= {};
              clone.name += ' (copy)';
              format.cards[clone.id] = clone;
              selectedCardId = clone.id;
            }
          "
        />
      </div>

      <h3 class="mt-4">Edited Cards</h3>
      <p>These are altered version of standard cards</p>
      <p v-if="!editedCards.length" class="my-2 italic">
        This format doesn't have any edited card
      </p>

      <ul v-else class="card-list fancy-scrollbar">
        <li v-for="card in editedCards" :key="card.id" class="flex gap-2">
          <UiButton
            class="ghost-button"
            :class="[
              card.id === selectedCardId && 'selected',
              !validator.isCardValid(card) && 'invalid'
            ]"
            @click="selectedCardId = card.id"
          >
            <CardSprite :sprite-id="card.spriteId" class="sprite" />
            {{ card.name }}
          </UiButton>

          <UiIconButton
            name="material-symbols:delete-outline"
            class="ghost-error-button shrink-0"
            @click="delete format.cards[card.id]"
          />
        </li>
      </ul>
      <UiButton
        type="button"
        class="primary-button"
        is-inline
        left-icon="material-symbols:add"
        @click="isCardsModalOpened = true"
      >
        Edit Card
      </UiButton>

      <ExistingCardsModal
        v-model:isOpened="isCardsModalOpened"
        :is-card-disabled="card => isEdited(card)"
        @select="addCard"
      />
    </section>

    <section>
      <p v-if="!selectedCard">Select a card on the left panel</p>

      <CardBuilder
        v-else
        v-model:card="selectedCard"
        :format="format"
        :is-custom-card="!isEdited(selectedCard)"
      />
    </section>
  </div>
</template>

<style scoped lang="postcss">
.format-cards {
  display: grid;
  grid-template-columns: var(--size-xs) 1fr;
  gap: var(--size-6);
  height: 100%;
}

h3 {
  font-size: var(--font-size-3);
  font-weight: var(--font-weight-5);
}

section {
  overflow: hidden;
  height: 100%;
  padding-inline: var(--size-2);
}

.sidebar {
  overflow-y: auto;
  padding-bottom: var(--size-11);
}

.card-list {
  display: grid;
  gap: var(--size-2);
  padding: var(--size-2);

  .selected {
    --ui-button-border-color: var(--border);
    --ui-button-border-size: var(--border-size-1);
    --ui-button-bg: hsl(0 0 100% / 0.05);
  }

  .invalid {
    --ui-button-border-color: var(--red-6);
    --ui-button-border-size: var(--border-size-1);
    --ui-button-bg: hsl(var(--red-3-hsl) / 0.05);
  }
}

.sprite {
  aspect-ratio: 1;
  width: 64px;
}
</style>
