<script setup lang="ts">
import { CardNode, PlayerNode, UnitNode } from '#components';
import type { Amount, UnitConditionExtras } from '@game/sdk';
import { match } from 'ts-pattern';
type GenericAmount = Amount<{ unit: UnitConditionExtras['type'] }>;
const amount = defineModel<GenericAmount>({
  required: true
});

const amountDict: Record<
  GenericAmount['type'],
  { label: string; params: Record<string, Component | null> }
> = {
  fixed: { label: 'Fixed amount', params: { value: null } },
  cards_in_hands: {
    label: 'Equals to cards in hand',
    params: { player: PlayerNode, add: null, scale: null }
  },
  cost: {
    label: 'Equals to gold cost of a unit',
    params: { unit: UnitNode, add: null, scale: null }
  },
  attack: {
    label: 'Equals to the attack of a unit',
    params: { unit: UnitNode, add: null, scale: null }
  },
  highest_attack: {
    label: 'Equals to the highest attack among units',
    params: { unit: UnitNode, add: null, scale: null }
  },
  lowest_attack: {
    label: 'Equals to the lowest attack among units',
    params: { unit: UnitNode, add: null, scale: null }
  },
  hp: {
    label: 'Equals to the health of a unit',
    params: { unit: UnitNode, add: null, scale: null }
  },
  highest_hp: {
    label: 'Equals to the highest health among units',
    params: { unit: UnitNode, add: null, scale: null }
  },
  lowest_hp: {
    label: 'Equals to the lowest health among units',
    params: { unit: UnitNode, add: null, scale: null }
  },
  maxHp: {
    label: 'Equals to the maxHp of a unit',
    params: { unit: UnitNode, add: null, scale: null }
  },
  card_played_since_last_turn: {
    label: 'Number of cards played this turn',
    params: { card: CardNode, add: null, scale: null }
  },
  equiped_artifact_count: {
    label: 'Equals to the amount of equiped artifacts',
    params: { player: PlayerNode, add: null, scale: null }
  },
  destroyed_units: {
    label: 'The amount of units destroyed by this effect.',
    params: {
      add: null,
      scale: null
    }
  },
  missing_cards_in_hand: {
    label: 'The amount of cards needed to have a full hand.',
    params: {
      add: null,
      scale: null
    }
  },
  count_of_units: {
    label: 'Equals to the number of units on the board',
    params: { unit: UnitNode, add: null, scale: null }
  }
};

const amountOptions = computed(
  () =>
    Object.entries(amountDict).map(([id, { label }]) => ({
      label,
      value: id
    })) as Array<{ label: string; value: GenericAmount['type'] }>
);

const params = computed(() => amountDict[amount.value.type]?.params ?? []);
const id = useId();
</script>

<template>
  <div class="flex-1">
    <UiSelect
      :model-value="amount.type"
      class="mb-3 w-full"
      :options="amountOptions"
      :multiple="false"
      @update:model-value="
        type => {
          if (!type) return;
          amount.type = type;

          match(amount)
            .with({ type: 'fixed' }, amount => {
              amount.params = {
                value: 0
              };
            })
            .with(
              {
                type: 'cards_in_hands'
              },
              amount => {
                amount.params = {
                  player: { candidates: [], random: false }
                };
              }
            )
            .with(
              { type: 'cost' },
              { type: 'maxHp' },
              { type: 'attack' },
              { type: 'lowest_attack' },
              { type: 'highest_attack' },
              { type: 'hp' },
              { type: 'lowest_hp' },
              { type: 'highest_hp' },
              { type: 'count_of_units' },
              amount => {
                amount.params = {
                  unit: { candidates: [], random: false }
                };
              }
            )
            .with({ type: 'card_played_since_last_turn' }, amount => {
              amount.params = {
                card: { candidates: [], random: false }
              };
            })
            .with({ type: 'equiped_artifact_count' }, amount => {
              amount.params = {
                player: { candidates: [[{ type: 'ally_player' }]] }
              };
            })
            .with(
              { type: 'destroyed_units' },
              { type: 'missing_cards_in_hand' },
              amount => {
                amount.params = {};
              }
            );
        }
      "
    />

    <div v-for="(param, key) in params" :key="key" class="flex gap-2">
      <span class="capitalize min-w-11">{{ key }}</span>
      <UiTextInput
        v-if="key === 'value' || key === 'scale' || key === 'add'"
        :id
        v-model="(amount.params as any)[key]"
        class="mb-3 flex-1"
        type="number"
        step="1"
      />
      <template v-else>
        <component
          :is="param"
          v-if="(amount.params as any)[key]"
          v-model="(amount.params as any)[key]"
        />
      </template>
    </div>
  </div>
</template>
