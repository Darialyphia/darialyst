<script setup lang="ts">
import { api } from '@game/api';

definePageMeta({
  name: 'Lobbies',
  pageTransition: {
    name: 'lobbies',
    mode: 'out-in'
  }
});

const { data: lobbies, isLoading } = useConvexAuthedQuery(api.lobbies.all, {});
const { data: me } = useConvexAuthedQuery(api.users.me, {});
</script>

<template>
  <div class="page container">
    <header>
      <div class="flex">
        <NuxtLink :to="{ name: 'ClientHome' }" custom v-slot="{ href, navigate }">
          <UiIconButton
            name="material-symbols:home"
            class="ghost-button"
            :href
            @click="navigate"
          />
        </NuxtLink>
        <BackButton class="inline-flex" :to="{ name: 'SelectGameMode' }" />
      </div>
      <h1 class="text-5">Casual Mode</h1>
    </header>

    <div class="grid">
      <section class="fancy-surface">
        <h2>Lobbies</h2>
        <UiLoader v-if="isLoading" />
        <div v-else-if="!lobbies.length">There are no lobbies available right now.</div>
        <ul v-else>
          <li
            v-for="lobby in lobbies"
            :key="lobby._id"
            class="flex justify-between items-center"
          >
            <div>
              <div class="font-semibold">
                <Icon v-if="lobby.needsPassword" name="material-symbols:lock" />
                {{ lobby.name }}
              </div>
              <div class="c-text-3">{{ lobby.format.name }}</div>
            </div>
            <div>{{ lobby.status }}</div>

            <div>
              <Icon name="mdi:user" class="text-3 c-primary" />
              {{ lobby.usersCount }}
            </div>
            <NuxtLink
              v-slot="{ href, navigate }"
              :to="{ name: 'Lobby', params: { id: lobby._id } }"
              custom
            >
              <LinkSounds>
                <UiButton
                  :disabled="me.currentLobby && me.currentLobby !== lobby._id"
                  class="primary-button"
                  left-icon="fluent-emoji-high-contrast:crossed-swords"
                  :href="
                    me.currentLobby && me.currentLobby !== lobby._id ? undefined : href
                  "
                  @click="navigate"
                >
                  Join
                </UiButton>
              </LinkSounds>
            </NuxtLink>
          </li>
        </ul>
      </section>
      <aside class="fancy-surface">
        <h2>Create a new lobby</h2>

        <LobbyForm />
      </aside>
    </div>
  </div>
</template>

<style lang="postcss">
.lobbies-enter-active,
.lobbies-leave-active {
  transition: all 0.4s;
}

.lobbies-enter-from,
.lobbies-leave-to {
  transform: translateY(-1.5rem);
  opacity: 0;
}
</style>

<style scoped lang="postcss">
.page {
  display: grid;
  grid-template-rows: auto 1fr;

  height: 100dvh;
  padding-top: var(--size-2);
  padding-inline: var(--size-5);

  @screen lg {
    padding-block: var(--size-10) var(--size-8);
  }

  > header {
    padding-block: var(--size-6);
    text-shadow: black 0px 4px 1px;
  }
}

h2 {
  font-size: var(--font-size-4);
}
.grid {
  display: grid;
  grid-template-columns: 1fr var(--size-14);
  gap: var(--size-3);
}

aside {
  padding-inline: var(--size-3);
}

li {
  margin-block: var(--size-4);
  padding: var(--size-4);
  border: solid var(--border-size-1) var(--border-dimmed);
}
</style>
