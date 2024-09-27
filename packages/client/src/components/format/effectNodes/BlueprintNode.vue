<script setup lang="ts">
import { CardNode, UnitNode } from '#components';
import { CARDS, type Filter } from '@game/sdk';
import type { BlueprintCondition } from '@game/sdk/src/card/conditions/blueprint-conditions';
import { match } from 'ts-pattern';

const groups = defineModel<Filter<BlueprintCondition>>({ required: true });

const format = useFormat();

const allCards = computed(() => ({ ...format.value.cards, ...CARDS }));
const blueprintOptions = computed(() =>
  Object.entries(allCards.value)
    .map(([key, value]) => ({
      label: value.name,
      value: key
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
);

type Params = Component | null | { [key: string]: Params };

type BlueprintDictionary = {
  [Key in BlueprintCondition['type']]: {
    label: string;
    params: Record<keyof (BlueprintCondition & { type: Key })['params'], Params>;
  };
};

const blueprintDict: BlueprintDictionary = {
  static: { label: 'specific card', params: { blueprints: null } },
  from_card: { label: 'same as another card', params: { card: CardNode } },
  from_unit: { label: 'same as another unit', params: { unit: UnitNode } }
};

const typeOptions = computed(
  () =>
    Object.entries(blueprintDict).map(([id, { label }]) => ({
      label,
      value: id
    })) as Array<{ label: string; value: BlueprintCondition['type'] }>
);

const getParams = (groupIndex: number, conditionIndex: number) =>
  blueprintDict[groups.value.candidates[groupIndex][conditionIndex].type]!
    .params as Record<string, Params>;
</script>

<template>
  <ConditionsNode v-slot="{ conditionIndex, groupIndex }" v-model="groups" hide-random>
    <div>
      <UiSelect
        class="w-full mb-2"
        :model-value="groups.candidates[groupIndex][conditionIndex]['type']"
        :multiple="false"
        :options="typeOptions"
        @update:model-value="
          type => {
            if (!type) return;
            const condition = groups.candidates[groupIndex][conditionIndex];

            condition.type = type;

            match(condition)
              .with({ type: 'static' }, condition => {
                condition.params = {
                  blueprints: []
                };
              })
              .with({ type: 'from_card' }, condition => {
                condition.params = {
                  card: { candidates: [] }
                };
              })
              .with({ type: 'from_unit' }, condition => {
                condition.params = {
                  unit: { candidates: [] }
                };
              })
              .exhaustive();
          }
        "
      />

      <div
        v-for="(param, key) in getParams(groupIndex, conditionIndex)"
        :key="key"
        class="flex gap-2"
      >
        <template v-if="key === 'blueprints'">
          <UiCombobox
            v-model="(groups.candidates[groupIndex][conditionIndex] as any).params[key]"
            :options="blueprintOptions"
            multiple
            placeholder="Select a card"
          />
          <div v-auto-animate class="flex gap-2 wrap mt-3">
            <div
              v-for="(id, index) in (groups.candidates[groupIndex][conditionIndex] as any)
                .params[key]"
              :key="id"
              class="choice"
            >
              {{ allCards[id].name }}

              <UiIconButton
                name="mdi:close"
                type="button"
                @click="
                  (groups.candidates[groupIndex][conditionIndex] as any).params[
                    key
                  ].splice(index, 1)
                "
              />
            </div>
          </div>
        </template>

        <template v-else>
          <component
            :is="param"
            v-if="(groups.candidates[groupIndex][conditionIndex] as any).params[key]"
            v-model="(groups.candidates[groupIndex][conditionIndex] as any).params[key]"
          />
        </template>
      </div>
    </div>
  </ConditionsNode>
</template>

<style scoped lang="postcss">
.choice {
  --ui-button-bg: transparent;
  --ui-button-hover-bg: hsl(var(--color-error-hover-hsl) / 0.2);
  --ui-button-color: var(--error);

  display: flex;
  gap: var(--size-2);
  align-items: center;

  padding: var(--size-1) var(--size-1) var(--size-1) var(--size-3);

  color: var(--text-on-primary);

  background-color: var(--primary);
  border-radius: var(--radius-pill);
}
</style>
