<script setup lang="ts">
import { type GameSessionConfig } from '@game/sdk';

const form = defineModel<{
  name: string;
  description: string;
  config: GameSessionConfig;
}>('config', { required: true });

const roundNumberField = ($event: FocusEvent) => {
  const target = $event.target as HTMLInputElement;
  target.value = `${parseInt(target.value)}`;
};

if (!form.value.config.tags) {
  form.value.config.tags = [];
}

function createRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
</script>

<template>
  <div>
    <Label for="name">Name</Label>
    <UiTextInput id="name" v-model="form.name" />
  </div>
  <div>
    <Label for="description">Description</Label>
    <textarea id="description" v-model="form.description" spellcheck="false" />
  </div>

  <fieldset>
    <legend>Deck</legend>
    <label for="deck_size">Deck size</label>
    <UiTextInput
      id="deck_size"
      v-model.number="form.config.MAX_DECK_SIZE"
      type="number"
      step="1"
      @blur="roundNumberField"
    />
    <label for="deck_size">Max card copies</label>
    <UiTextInput
      id="deck_size"
      v-model.number="form.config.MAX_COPIES_PER_CARD"
      type="number"
      step="1"
      @blur="roundNumberField"
    />
  </fieldset>

  <fieldset>
    <legend>Cards</legend>

    <label for="max_hand_size">Max hand size</label>
    <UiTextInput
      id="max_hand_size"
      v-model.number="form.config.MAX_HAND_SIZE"
      type="number"
      step="1"
      @blur="roundNumberField"
    />

    <label for="draw_per_turn">Card draw per turn</label>
    <UiTextInput
      id="max_draw_per_turn"
      v-model.number="form.config.CARD_DRAW_PER_TURN"
      type="number"
      step="1"
      @blur="roundNumberField"
    />

    <label for="replaces">Replaces per turn</label>
    <UiTextInput
      id="replaces"
      v-model.number="form.config.MAX_REPLACES_PER_TURN"
      type="number"
      step="1"
      @blur="roundNumberField"
    />

    <label for="p1-starting_hand_size">Player 1 starting hand size</label>
    <UiTextInput
      id="p1-starting_hand_size"
      v-model.number="form.config.PLAYER_1_STARTING_HAND_SIZE"
      type="number"
      step="1"
      @blur="roundNumberField"
    />

    <label for="p2-starting_hand_size">Player 2 starting hand size</label>
    <UiTextInput
      id="p2-starting_hand_size"
      v-model.number="form.config.PLAYER_2_STARTING_HAND_SIZE"
      type="number"
      step="1"
      @blur="roundNumberField"
    />

    <label for="draw_time">Player draw at the end of their turn</label>
    <UiSwitch id="draw_turn" v-model:checked="form.config.DRAW_AT_END_OF_TURN" />
    <p>If unchecked, players draw at the start of the turn instead.</p>
  </fieldset>

  <fieldset>
    <legend>Gold</legend>

    <label for="max_gold">Max gold</label>
    <UiTextInput
      id="max_gold"
      v-model.number="form.config.MAX_GOLD"
      type="number"
      step="1"
      @blur="roundNumberField"
    />

    <label for="refill_mana">Refill player gold at the start of their turn</label>
    <UiSwitch id="refill_mana" v-model:checked="form.config.REFILL_GOLD_EVERY_TURN" />

    <label for="gold_per_turn">Gold gained per turn</label>
    <UiTextInput
      id="gold_per_turn"
      v-model.number="form.config.GOLD_PER_TURN"
      type="number"
      step="1"
      @blur="roundNumberField"
    />
    <p>This has no effect when "Refill player gold" is enabled.</p>

    <label for="max_gold_increase">Max gold increase per turn</label>
    <UiTextInput
      id="max_gold_increase"
      v-model.number="form.config.MAX_GOLD_INCREASE_PER_TURN"
      type="number"
      step="1"
      @blur="roundNumberField"
    />

    <label for="p1_gold">Player 1 starting gold</label>
    <UiTextInput
      id="p1_gold"
      v-model.number="form.config.PLAYER_1_STARTING_GOLD"
      type="number"
      step="1"
      @blur="roundNumberField"
    />

    <label for="p1_gold">Player 2 starting gold</label>
    <UiTextInput
      id="p1_gold"
      v-model.number="form.config.PLAYER_2_STARTING_GOLD"
      type="number"
      step="1"
      @blur="roundNumberField"
    />
  </fieldset>

  <fieldset>
    <legend>Units</legend>
    <label for="can_move_after_attacking">Units can move after attacking</label>
    <UiSwitch
      id="can_move_after_attacking"
      v-model:checked="form.config.CAN_MOVE_AFTER_ATTACK"
    />

    <label for="can_walk_through_allies">Units can move through allies</label>
    <UiSwitch
      id="can_walk_through_allies"
      v-model:checked="form.config.CAN_WALK_THROUGH_ALLIES"
    />

    <label for="unlimited_retal">Units always counterattack</label>
    <UiSwitch id="unlimited_retal" v-model:checked="form.config.UNLIMITED_RETALIATION" />
    <p>Otherwise, they counterattack at most once per turn.</p>

    <label for="unit_speed">Base unit speed</label>
    <UiTextInput
      id="satarting_hand_size"
      v-model.number="form.config.UNIT_DEFAULT_SPEED"
      type="number"
      step="1"
      @blur="roundNumberField"
    />
  </fieldset>

  <fieldset>
    <legend>Artifacts</legend>
    <label for="unit_speed">Artifact_durability</label>
    <UiTextInput
      id="satarting_hand_size"
      v-model.number="form.config.ARTIFACT_DURABILITY"
      type="number"
      step="1"
      @blur="roundNumberField"
    />
  </fieldset>

  <fieldset class="tags mb-8">
    <legend>Tags</legend>
    <p>Define custom tags that can be used on cards in this format.</p>
    <p v-if="!form.config.tags?.length" class="block mt-3 italic">
      You haven't added any custom tag yet
    </p>
    <UiButton
      class="primary-button"
      left-icon="material-symbols:add"
      @click="
        form.config.tags!.push({ id: createRandomString(8), name: '', aliases: [] })
      "
    >
      New Tag
    </UiButton>
    <ul class="mt-4">
      <li
        v-for="(tag, index) in form.config.tags!"
        :key="tag.id"
        class="flex flex-col gap-2 mb-2"
      >
        <UiTextInput
          :id="`tag-${tag.id}-name`"
          v-model="tag.name"
          placeholder="Tag Name"
        />
        <UiTextInput
          :id="`tag-${tag.id}-aliases`"
          placeholder="Aliases"
          :model-value="tag.aliases.join(',')"
          @update:model-value="
            e => {
              tag.aliases = (e as string).split(',').map(s => s.trim());
            }
          "
        />
        <p>
          A comma separated list of aliases (for exemple: Frozen instead of Freeze). These
          will be used to to automaticallyt highlight the tags in the card description
        </p>
        <UiButton
          variant="danger"
          size="small"
          @click="form.config.tags!.splice(index, 1)"
        >
          Remove
        </UiButton>
        <p class="c-red-6">
          If you remove a tag, make sure you are not using in some card effects since they
          will not work anymore
        </p>
      </li>
    </ul>
  </fieldset>
</template>

<style scoped lang="postcss">
@layer components {
  textarea {
    resize: none;

    width: 100%;

    background-color: var(--surface-1);
    border: solid 1px var(--border-dimmed);
    border-radius: var(--radius-1);
  }

  fieldset:not(.tags) {
    position: relative;

    display: grid;
    grid-template-columns: 7fr 4fr;
    column-gap: var(--size-2);

    margin-top: var(--size-5);
    &::after {
      content: '';

      position: absolute;
      top: calc(-1 * var(--size-8));
      left: 50%;
      transform: translateX(-50%);

      width: var(--size-12);
      height: 3px;

      background: linear-gradient(to right, var(--border), var(--primary), var(--border));
    }

    legend {
      grid-column: 1 / -1;
    }

    label {
      display: flex;
      gap: var(--size-3);
      align-items: center;
      & + *:not(p) {
        margin-bottom: var(--size-3);
      }
    }

    p {
      margin-top: calc(-1 * var(--size-2));
      font-size: var(--font-size-0);
      color: var(--orange-5);
    }
  }

  div > label,
  legend {
    display: block;
    font-size: var(--font-size-4);
    font-weight: var(--font-weight-5);
  }

  p {
    grid-column: 1 / -1;
  }

  .tags {
    p {
      font-size: var(--font-size-0);
      color: var(--orange-5);
    }
  }
}
</style>
