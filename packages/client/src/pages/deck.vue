<script setup lang="ts">
import { api } from '@game/api';
import type { Id } from '@game/api/src/convex/_generated/dataModel';
import type { GameFormatDto } from '@game/api/src/convex/formats/format.mapper';
import { CARDS, defaultConfig } from '@game/sdk';
import { parseSerializeBlueprint } from '@game/sdk/src/card/card-parser';
import { isDefined } from '@game/shared';

definePageMeta({
  name: 'LoadoutPreview'
});

const { data: formats } = useConvexAuthedQuery(api.formats.all, {});

const selectedFormatId = ref<Id<'formats'> | undefined>();

const standardFormat: Pick<GameFormatDto, 'config' | 'cards'> = {
  config: defaultConfig,
  cards: CARDS
};

const selectedFormat = computed(() => {
  if (!formats.value) return standardFormat;
  return (
    formats.value.find(format => format._id === selectedFormatId.value) ?? standardFormat
  );
});

const loadoutName = ref('');
const cards = ref<Array<{ id: string; pedestalId: string }>>([]);

const allCards = computed(() => {
  const result = Object.values({ ...CARDS, ...selectedFormat.value.cards })
    .filter(c => c.collectable)
    .map(card => {
      // in case the card has not been touched by a custm format, parse it against the standard format to have more chance to hit the cache
      const format = selectedFormat.value.cards[card.id]
        ? selectedFormat.value
        : undefined;
      return {
        cardId: card.id,
        card: parseSerializeBlueprint(card, format),
        pedestalId: 'pedestal-default',
        cardBackId: 'default'
      };
    });

  return result;
});

const initFromCode = (code: string) => {
  const [name, cardsBase64, formatId] = decodeURIComponent(code).split('|') as [
    string,
    string,
    Id<'formats'>
  ];
  console.log(code);

  const decodedCards = JSON.parse(atob(cardsBase64)) as string[];
  selectedFormatId.value = formatId;
  loadoutName.value = name;
  cards.value = decodedCards
    .map(id => allCards.value.find(card => card.cardId === id))
    .filter(isDefined)
    .map(card => {
      return {
        id: card.cardId,
        pedestalId: card.pedestalId
      };
    });
};

const route = useRoute();
until(selectedFormat)
  .toBeTruthy()
  .then(() => {
    initFromCode(route.query.code as string);
  });

const assets = useAssetsProvider();
assets.load();

const isReady = ref(false);
until(assets.loaded)
  .toBe(true)
  .then(() => {
    isReady.value = true;
  });
</script>

<template>
  <ClientOnly>
    <div class="page-loader" v-if="!cards.length">
      <UiLoader />
    </div>
    <LoadoutDetails v-else-if="isReady" :loadout="{ name: loadoutName, cards }" />

    <template #fallback>
      <div class="page-loader">
        <UiLoader />
      </div>
    </template>
  </ClientOnly>
</template>

<style scoped lang="postcss">
.page-loader {
  display: grid;
  place-content: center;
  height: 50vh;
}
</style>
