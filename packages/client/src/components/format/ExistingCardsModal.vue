<script setup lang="ts">
import { CARDS, type GenericSerializedBlueprint } from '@game/sdk';

const { isCardDisabled } = defineProps<{
  isCardDisabled: (card: GenericSerializedBlueprint) => boolean;
}>();
const emit = defineEmits<{ select: [GenericSerializedBlueprint] }>();

const isOpened = defineModel<boolean>('isOpened', { required: true });
const standardCards = computed(() => Object.values(CARDS));

const search = ref('');
const filteredCards = computed(() =>
  standardCards.value.filter(c =>
    c.name.toLowerCase().includes(search.value.toLocaleLowerCase())
  )
);

const existingCardsList = useVirtualList(filteredCards, { itemHeight: 82, overscan: 5 });
</script>

<template>
  <UiModal v-model:is-opened="isOpened" title="Select a card">
    <UiTextInput
      id="card-search"
      v-model="search"
      placeholder="Search for a card"
      left-icon="material-symbols:search"
      class="mb-4"
    />
    <div class="overflow-hidden">
      <div
        class="existing-cards fancy-scrollbar"
        v-bind="existingCardsList.containerProps"
      >
        <ul v-bind="existingCardsList.wrapperProps.value">
          <li v-for="card in existingCardsList.list.value" :key="card.index">
            <UiButton
              type="button"
              class="ghost-button"
              :disabled="isCardDisabled(card.data)"
              @click="
                () => {
                  emit('select', card.data);
                  isOpened = false;
                }
              "
            >
              <CardSprite :sprite-id="card.data.spriteId" class="sprite" />
              {{ card.data.name }}
            </UiButton>
          </li>
        </ul>
      </div>
    </div>
    <footer class="flex justify-end">
      <UiButton class="error-button" @click="isOpened = false">Cancel</UiButton>
    </footer>
  </UiModal>
</template>

<style scoped lang="postcss">
.existing-cards {
  height: 60dvh;
}

.sprite {
  aspect-ratio: 1;
  width: 64px;
}
</style>
