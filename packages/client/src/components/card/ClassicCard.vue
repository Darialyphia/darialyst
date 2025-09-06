<script setup lang="ts">
import type { CardBlueprint } from '@game/sdk/src/card/card-blueprint';
import { CARD_KINDS, RARITIES } from '@game/sdk';
import { domToPng } from 'modern-screenshot';
import type { CardBlueprintId } from '@game/sdk/src/card/card';
import type { Prettify } from '@game/shared';
import { match } from 'ts-pattern';

type ICard = Prettify<
  {
    blueprintId: CardBlueprintId;
    pedestalId?: string;
    cardbackId?: string;
    hp?: CardBlueprint['maxHp'];
    spriteId?: CardBlueprint['spriteId'];
  } & Pick<
    CardBlueprint,
    | 'name'
    | 'description'
    | 'cost'
    | 'kind'
    | 'rarity'
    | 'faction'
    | 'keywords'
    | 'tags'
    | 'attack'
    | 'speed'
  >
>;

const { card } = defineProps<{ card: ICard; hasModal?: boolean }>();

const frameBg = computed(() => {
  return `url('/assets/ui/classic_${isUnit.value ? 'unit' : card.kind.toLowerCase()}.png')`;
});

const factionsBg = computed(
  () => `url(/assets/ui/classic_${card.faction?.id ?? 'neutral'}.png)`
);

const rarityBg = computed(() => {
  if (card.kind === CARD_KINDS.GENERAL) {
    return null;
  }
  if (card.rarity === RARITIES.BASIC || card.rarity === RARITIES.TOKEN) {
    return `url('/assets/ui/classic_card_common.png')`;
  }
  return `url('/assets/ui/classic_card_${card.rarity}.png')`;
});

const animation = computed(() => {
  return match(card.kind)
    .with(CARD_KINDS.GENERAL, CARD_KINDS.MINION, () => 'breathing' as const)
    .with(CARD_KINDS.SPELL, CARD_KINDS.ARTIFACT, () => 'default' as const)
    .exhaustive();
});

const isUnit = computed(
  () => card.kind === CARD_KINDS.GENERAL || card.kind === CARD_KINDS.MINION
);

const cardEl = ref(null as HTMLElement | null);
const screenshot = async () => {
  const png = await domToPng(cardEl.value!, {
    backgroundColor: 'transparent'
  });
  const a = document.createElement('a');
  a.href = png;
  a.download = `${card.name.toLowerCase().replaceAll(' ', '_')}.png`;
  a.click();
};
</script>

<template>
  <div class="classic-card">
    <div ref="cardEl" class="screenshot-container">
      <div class="frame" :class="card.kind.toLocaleLowerCase()">
        <div class="mana">{{ card.cost }}</div>
        <div class="faction" />
        <div v-if="rarityBg" class="rarity" />
        <CardSprite
          v-if="card.spriteId"
          class="sprite"
          :sprite-id="card.spriteId"
          :animation="animation"
          :is-hovered="false"
        />
        <div v-if="card.attack" class="atk">{{ card.attack }}</div>
        <div v-if="card.hp" class="hp">{{ card.hp }}</div>

        <div class="caption">
          <div class="name">{{ card.name }}</div>
          <div class="kind">
            {{ card.tags?.[0]?.name ?? card.kind }}
          </div>
        </div>

        <div class="description">
          <TextWithKeywords :text="card.description" />
        </div>
      </div>
    </div>
    <UiButton @click="screenshot">Download card</UiButton>
  </div>
</template>

<style scoped lang="postcss">
.screenshot-container {
  padding: 16px 20px;
}
.frame {
  position: relative;
  width: 226px;
  height: 296px;
  background: v-bind(frameBg) no-repeat center;
}

.mana {
  display: grid;
  place-content: center;

  width: 57px;
  height: 63px;

  font-size: var(--font-size-3);
  font-weight: var(--font-weight-5);
  color: black;

  background: url('/assets/ui/classic_mana.png') no-repeat center;

  position: absolute;
  top: -1.2rem;
  left: -1.5rem;
}

.faction {
  width: 30px;
  height: 30px;
  background: v-bind(factionsBg) no-repeat center;
  background-size: cover;
  position: absolute;
  top: 15px;
  right: 15px;
}

.sprite {
  position: absolute;
  left: 50%;
  top: 145px;
  transform: translateX(-50%);
  scale: 2;

  :is(.artifact, .spell) & {
    top: 115px;
  }
}

.rarity {
  position: absolute;
  left: 50%;
  top: 155px;
  transform: translateX(-50%);
  background: v-bind(rarityBg) no-repeat center;
  width: 44px;
  height: 44px;
}

.atk {
  display: grid;
  place-content: center;

  width: 57px;
  height: 63px;

  font-size: var(--font-size-4);

  position: absolute;
  top: 145px;
  left: 23px;
}

.hp {
  display: grid;
  place-content: center;

  width: 57px;
  height: 63px;

  font-size: var(--font-size-4);

  position: absolute;
  top: 145px;
  right: 26px;
}

.caption {
  position: absolute;
  top: 118px;
  width: 100%;
  text-align: center;
  padding: 0 var(--size-2);
  box-sizing: border-box;

  .name {
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-4);
    color: white;
    line-height: 1;
  }

  .kind {
    font-size: var(--font-size-00);
    color: #90cacf;
    text-transform: capitalize;
  }
}

.description {
  position: absolute;
  top: 205px;
  width: 100%;
  padding: 0 var(--size-3);
  box-sizing: border-box;

  font-size: var(--font-size-00);
  color: #bbf7f7;
  text-align: center;
}

:deep(.token-keyword) {
  color: #bbf7f7;
  font-weight: var(--font-weight-5);
}
</style>
