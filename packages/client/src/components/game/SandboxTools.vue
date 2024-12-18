<script setup lang="ts">
import { ClientSession, type GameSession, type ServerSession } from '@game/sdk';

const { clientSession, serverSession } = defineProps<{
  serverSession: ServerSession;
  clientSession: ClientSession;
}>();

const performAction = async (cb: (session: GameSession) => Promise<void>) => {
  await cb(serverSession);
  // eslint-disable-next-line vue/no-mutating-props
  clientSession.rngSystem.values = serverSession.rngSystem.serialize().values;
  await cb(clientSession);
  clientSession.emit('scheduler:flushed');
};
</script>

<template>
  <div class="sandbox-tools">
    <PopoverRoot>
      <PopoverTrigger>Sandbox Tools</PopoverTrigger>
      <PopoverAnchor />
      <PopoverPortal>
        <PopoverContent class="fancy-surface p-2">
          <UiButton class="ghost-button" @click="console.log(serverSession)">
            Debug server session
          </UiButton>
          <UiButton
            class="ghost-button"
            @click="
              performAction(async session => {
                await session.playerSystem.activePlayer.draw(1);
              })
            "
          >
            Draw card
          </UiButton>
          <UiButton
            class="ghost-button"
            @click="
              performAction(async session => {
                await session.playerSystem.activePlayer.draw(
                  clientSession.config.MAX_HAND_SIZE
                );
              })
            "
          >
            Fill hand
          </UiButton>
          <UiButton
            class="ghost-button"
            @click="
              performAction(async session => {
                const player = session.playerSystem.activePlayer;
                const count = player.hand.length;
                player.hand.forEach(card => {
                  player.deck.addToBottom(card);
                });
                player.hand = [];
                player.deck.shuffle();
                await player.draw(count);
                console.log('cards drawn', player.hand.length);
              })
            "
          >
            Replace hand
          </UiButton>
          <UiButton
            class="ghost-button"
            @click="
              performAction(async session => {
                await session.playerSystem.activePlayer.giveGold(
                  clientSession.config.MAX_GOLD
                );
              })
            "
          >
            Max out gold
          </UiButton>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </div>
</template>

<style scoped lang="postcss">
.sandbox-tools {
  position: absolute;
  top: var(--size-5);
  left: var(--size-15);

  font-family: monospace;
  color: white;

  @screen lt-lg {
    display: none;
  }
}
</style>
