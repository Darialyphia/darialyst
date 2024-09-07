import type { Values } from '@game/shared';
import { Howl } from 'howler';

export const BGMS = {
  MENU: '/assets/sfx/bgm_menu',
  BATTLE: '/assets/sfx/bgm_battle',
  BATTLE2: '/assets/sfx/bgm_battle2',
  BATTLE3: '/assets/sfx/bgm_battle3',
  BATTLE4: '/assets/sfx/bgm_battle4',
  BATTLE5: '/assets/sfx/bgm_battle5',
  BATTLE_LOADER: '/assets/sfx/loader1',
  BATTLE_LOADER2: '/assets/sfx/loader2'
} as const;
export type Bgm = Values<typeof BGMS>;

export type BGMContext = {
  current: Ref<Howl>;
  next(bgm: Bgm, opts?: { loop: boolean; fade: boolean }): void;
  stop(): void;
};

const BGM_INJECTION_KEY = Symbol('bgm') as InjectionKey<BGMContext>;

const FADE_DURATION = 1500;
const SCALE_FACTOR = 0.5;

const supportsOgg = () => {
  return document.createElement('audio').canPlayType('audio/ogg');
};
export const useBgmProvider = () => {
  const extension = supportsOgg() ? '.ogg' : '.mp3';
  const { settings: userSettings } = useUserSettings();
  const route = useRoute();
  const current = ref<Bgm>((route.meta.bgm as Bgm) ?? BGMS.MENU);
  const volume = computed(() => {
    return (userSettings.value.sound.musicVolume[0] / 100) * SCALE_FACTOR;
  });
  let hasInteracted = false;

  const howl = ref(
    new Howl({
      src: `${current.value}${extension}`,
      volume: 0,
      loop: true,
      onload() {
        if (!hasInteracted) return;
        howl.value.play();
        howl.value.fade(0, volume.value, FADE_DURATION);
      }
    })
  ) as Ref<Howl>;

  document.addEventListener('pointerdown', () => {
    if (!hasInteracted) {
      howl.value.play();
      howl.value.fade(0, volume.value, FADE_DURATION);
      hasInteracted = true;
    }
  });

  watch(volume, newVolume => {
    howl.value.volume(newVolume);
  });

  const api = {
    current: howl,
    next(bgm: Bgm, options = { loop: true, fade: true }) {
      if (!Object.values(BGMS).includes(bgm)) {
        console.warn(`Invalid BGM. Allowed values are ${Object.values(BGMS).join(', ')}`);
        return;
      }
      if (bgm === current.value) return;

      current.value = bgm;
      if (options.fade) {
        howl.value.fade(howl.value.volume(), 0, FADE_DURATION);
        const howl2 = new Howl({
          src: `${current.value}${extension}`,
          volume: 0,
          loop: options.loop,
          onload() {
            howl2.play();
            howl2.fade(0, volume.value, FADE_DURATION);
          },
          onfade() {
            howl.value = howl2;
          }
        });
      } else {
        howl.value.stop();
        const newHowl = new Howl({
          src: `${current.value}${extension}`,
          volume: volume.value,
          loop: options.loop,
          onload() {
            newHowl.play();
          }
        });
        howl.value = newHowl;
      }
    },
    stop() {
      howl.value.stop();
    }
  };

  provide(BGM_INJECTION_KEY, api);

  const unsub = useRouter().afterEach(to => {
    if (to.meta.bgm === null) return;
    api.next((to.meta.bgm ?? BGMS.MENU) as Bgm);
  });

  onUnmounted(() => {
    howl.value.unload();
    unsub();
  });

  return api;
};

export const useBgm = () => useSafeInject(BGM_INJECTION_KEY);
