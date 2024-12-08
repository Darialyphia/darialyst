<script setup lang="ts">
import { Entity, type EntityId } from '@game/sdk';
import { GAME_PHASES } from '@game/sdk/src/game-session';
import { Container } from 'pixi.js';
import { PTransition } from 'vue3-pixi';

const { entityId } = defineProps<{ entityId: EntityId }>();

const { camera, fx, ui, session } = useGame();
const entity = useEntity(entityId);

const shouldFlip = ref(false);
const scaleX = computed(() => {
  let value = entity.value.player.isPlayer1 ? 1 : -1;
  if (camera.angle.value === 90 || camera.angle.value === 180) {
    value *= -1;
  }

  if (shouldFlip.value) value *= -1;
  return value;
});

const checkFlip = (attacker: Entity, target: Entity) => {
  if (attacker.player.isPlayer1) {
    if (target.position.x === entity.value.position.x) {
      return attacker.position.y < target.position.y;
    }
    return attacker.position.x > target.position.x;
  } else {
    if (target.position.x === entity.value.position.x) {
      return attacker.position.y > target.position.y;
    }
    return attacker.position.x < target.position.x;
  }
};

const sounds = {
  play: useSoundEffect(computed(() => entity.value.card.blueprint.sounds?.play)),
  walk: useSoundEffect(computed(() => entity.value.card.blueprint.sounds?.walk)),
  attack: useSoundEffect(computed(() => entity.value.card.blueprint.sounds?.attack)),
  // prettier-ignore
  dealDamage: useSoundEffect(computed(() => entity.value.card.blueprint.sounds?.dealDamage)),
  // prettier-ignore
  takeDamage: useSoundEffect(computed(() => entity.value.card.blueprint.sounds?.takeDamage)),
  death: useSoundEffect(computed(() => entity.value.card.blueprint.sounds?.death))
};
watch(
  () => entity.value?.card.blueprintId,
  () => {
    nextTick(() => {
      if (session.phase === GAME_PHASES.BATTLE) {
        sounds.play.value?.play();
      }
    });
  },
  { immediate: true }
);

useSessionEvent('entity:before_attack', ([{ entity: attacker, target }]) => {
  if (!attacker.equals(entity.value)) return;
  sounds.attack.value?.play();
  shouldFlip.value = checkFlip(attacker, target);
});
useSessionEvent('entity:before_deal_damage', ([event]) => {
  if (!event.entity.equals(entity.value)) return;
  sounds.dealDamage.value?.play();
});
useSessionEvent('entity:before_take_damage', ([event]) => {
  if (!event.entity.equals(entity.value)) return;
  sounds.takeDamage.value?.play();
});
useSessionEvent('entity:before_move', ([event]) => {
  if (!event.entity.equals(entity.value)) return;
  sounds.walk.value?.play();
});
useSessionEvent('entity:before_retaliate', ([{ entity: attacker, target }]) => {
  if (!attacker.equals(entity.value)) return;
  sounds.attack.value?.play();
  shouldFlip.value = checkFlip(attacker, target);
});
useSessionEvent('entity:after_attack', () => {
  shouldFlip.value = false;
});
useSessionEvent('entity:after_retaliate', () => {
  shouldFlip.value = false;
});
useSessionEvent('scheduler:flushed', () => {
  shouldFlip.value = false;
});
useSessionEvent('entity:before_destroy', ([event]) => {
  if (!event.equals(entity.value)) return;
  sounds.death.value?.play();
  return new Promise(resolve => {
    gsap.to(alpha, {
      value: 0,
      duration: 1,
      ease: Power1.easeOut,
      onComplete: resolve
    });
  });
});

const isHovered = computed(() => ui.hoveredEntity.value?.equals(entity.value));

const areStatsDisplayed = ref(false);
const alpha = ref(1);

const onEnter = (container: Container) => {
  container.y = -40;
  container.alpha = 0;

  gsap.to(container, {
    y: 0,
    duration: 1,
    ease: Bounce.easeOut,
    onStart() {
      container.alpha = 1;
    },
    onComplete() {
      areStatsDisplayed.value = true;
    }
  });
};
</script>

<template>
  <EntityPositioner :entity-id="entityId">
    <container
      :ref="
        (container: any) => {
          if (!container?.parent) return;

          fx.registerEntityRootContainer(entity.id, container.parent);
        }
      "
      :alpha="alpha"
      :sortable-children="true"
    >
      <EntityShadow :entity-id="entityId" :scale-x="scaleX" />
      <EntityOrientationIndicator :entity-id="entityId" />

      <PTransition appear @enter="onEnter">
        <EntitySprite :entity-id="entityId" :scale-x="scaleX" />
      </PTransition>

      <EntitySimulationResult :entity-id="entityId" />
      <EntityVFX :entity-id="entityId" />

      <EntityStats v-if="areStatsDisplayed" :entity-id="entityId" />
    </container>
  </EntityPositioner>
  <EntitySpawnIndicator v-if="isHovered" :entity-id="entityId" />
</template>
